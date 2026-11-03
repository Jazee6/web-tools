import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { expect, type Locator, type Page, test } from "@playwright/test";

import { hreflang, localizePath, locales } from "../src/lib/i18n/locales";
import { site } from "../src/lib/site";
import { toolApiPath } from "../src/lib/tool-api";
import type { AnyTool } from "../src/lib/tool-contract/define-tool";
import { describeFields } from "../src/lib/tool-contract/fields";
import { loadTools } from "./load-tools";
import { expectOutput, runExample } from "./run-example";

// 冒烟测试由注册表和每个 Tool 的 examples 自动生成（architecture §18）
const tools = await loadTools();

// Server-assisted Tool：Turnstile 换成立即回调测试 token 的桩，/api/tools/{id} 返回示例输出，
// CI 不依赖外网和第三方站点
const stubServer = async (page: Page, tool: AnyTool, output: unknown) => {
  // 在浏览器里联网的客户端 Tool（DNS Lookup）：fixtures.ts 的 hosts 是它请求的第三方主机，
  // 用同一份假 fetch 应答，测试不依赖外网
  const fixturePath = resolve(`src/tools/${tool.id}/fixtures.ts`);
  if (tool.runtime.where === "client" && existsSync(fixturePath)) {
    const fixtures = (await import(fixturePath)) as {
      hosts: string[];
      fetch: (url: URL) => Promise<Response>;
    };
    for (const host of fixtures.hosts) {
      await page.route(`https://${host}/**`, async (route) => {
        const response = await fixtures.fetch(new URL(route.request().url()));
        await route.fulfill({
          status: response.status,
          headers: Object.fromEntries(response.headers),
          body: await response.text(),
        });
      });
    }
  }
  if (tool.runtime.where !== "server") return;
  await page.route("https://challenges.cloudflare.com/turnstile/**", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `window.turnstile = {
        render: (el, options) => { setTimeout(() => options.callback("XXXX.DUMMY.TOKEN.XXXX")); return "w"; },
        execute() {},
        remove() {},
      };`,
    }),
  );
  await page.route(`**${toolApiPath(tool.id)}`, (route) => {
    expect(route.request().headers()["x-turnstile-token"]).toBe("XXXX.DUMMY.TOKEN.XXXX");
    return route.fulfill({ json: { output } });
  });
};

for (const tool of tools) {
  test.describe(tool.id, () => {
    for (const locale of locales) {
      test(`renders in ${locale}`, async ({ page }) => {
        const path = localizePath(locale, `/${tool.id}`);
        const response = await page.goto(path);
        expect(response?.status()).toBe(200);
        expect(new URL(page.url()).pathname).toBe(path);
        await expect(page.locator("html")).toHaveAttribute("lang", hreflang[locale]);
        await expect(page.locator("h1")).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
      });
    }

    if (tool.runtime.requires?.includes("wasm")) {
      // 能力缺失时用 Empty 代替表单（architecture §13）
      test("shows an unsupported state without WebAssembly", async ({ page }) => {
        await page.addInitScript(() => {
          delete (globalThis as { WebAssembly?: unknown }).WebAssembly;
        });
        await page.goto(`/${tool.id}`);
        await expect(page.locator("[data-unsupported]")).toContainText("WebAssembly");
        await expect(page.locator('button[type="submit"]')).toHaveCount(0);
      });
    }

    if (tool.runtime.requires?.includes("webcodecs")) {
      test("shows an unsupported state without WebCodecs", async ({ page }) => {
        await page.addInitScript(() => {
          delete (globalThis as { VideoEncoder?: unknown }).VideoEncoder;
        });
        await page.goto(`/${tool.id}`);
        await expect(page.locator("[data-unsupported]")).toContainText("WebCodecs");
        await expect(page.locator('button[type="submit"]')).toHaveCount(0);
      });
    }

    if (tool.runtime.crossOriginIsolated) {
      // _headers 按页加了 COOP/COEP（ADR-0008）。WebKit 不支持 COEP: credentialless，页面不隔离，
      // 多线程 WASM 退回单线程，examples 在三个引擎上都要能跑通。
      test("is cross-origin isolated where COEP credentialless is supported", async ({
        page,
        browserName,
      }) => {
        for (const path of [`/${tool.id}`, localizePath("zh", `/${tool.id}`)]) {
          await page.goto(path);
          expect(await page.evaluate(() => crossOriginIsolated), path).toBe(
            browserName !== "webkit",
          );
        }
      });
    }

    tool.examples.forEach((example, index) => {
      test(`example ${index} produces the expected output`, async ({ page }) => {
        await stubServer(page, tool, example.output);
        await page.goto(`/${tool.id}`);
        // Worker Tool 可能要先下载 WASM 或模型（Speech to Text 约 110 MB）
        if (tool.runtime.worker) test.setTimeout(120_000);
        await runExample(page, tool, example);
      });
    });

    const filesField = describeFields(tool.input).find((spec) => spec.kind === "files");
    if (filesField) {
      // 多文件字段：分次添加会追加到列表末尾，可上移、移除，数量不足时行内报错
      test("orders and validates multi-file inputs", async ({ page }) => {
        const names = tool.examples
          .map((example) => [example.files![filesField.name]].flat())
          .find((list) => list.length >= 2)!;
        const paths = names.map((name) => `src/tools/${tool.id}/examples/${name}`);
        const minLength = (
          tool.input.entries[filesField.name] as { pipe: { type: string; requirement?: number }[] }
        ).pipe.find((item) => item.type === "min_length")?.requirement;
        await page.goto(`/${tool.id}`);
        await page.waitForSelector("[data-hydrated]");
        const field = page.locator(`[data-field="${filesField.name}"]`);
        const items = field.locator("li");
        const error = field.locator(`[data-slot="field-error"]`);
        if (minLength && minLength > 1) {
          await field.locator('input[type="file"]').setInputFiles(paths[0]!);
          await page.locator('button[type="submit"]').click();
          await expect(error).toHaveText(`Choose at least ${minLength} files.`);
        } else {
          await page.locator('button[type="submit"]').click();
          await expect(error).toHaveText("This field is required.");
          await field.locator('input[type="file"]').setInputFiles(paths[0]!);
        }
        await field.locator('input[type="file"]').setInputFiles(paths[1]!);
        await expect(items).toHaveCount(2);
        await expect(items.nth(1)).toContainText(names[1]!);
        await items.nth(1).getByRole("button", { name: "Move up" }).click();
        await expect(items.nth(0)).toContainText(names[1]!);
        await items.nth(0).getByRole("button", { name: "Remove" }).click();
        await expect(items).toHaveCount(1);
        await expect(items.nth(0)).toContainText(names[0]!);
      });
    }

    const pagesField = describeFields(tool.input).find((spec) => spec.kind === "pages");
    if (pagesField?.kind === "pages") {
      // 页面排列字段：选了 PDF 后在 Worker 里画缩略图，编辑器的按钮和文本框改的是同一个字符串
      test("edits the page arrangement with thumbnails", async ({ page }) => {
        const name = tool.examples.map((example) => example.files?.[pagesField.source])[0];
        await page.goto(`/${tool.id}`);
        await page.waitForSelector("[data-hydrated]");
        await page
          .locator(`[data-field="${pagesField.source}"] input[type="file"]`)
          .setInputFiles(`src/tools/${tool.id}/examples/${String(name)}`);
        const field = page.locator(`[data-field="${pagesField.name}"]`);
        const text = field.locator("input");
        const tiles = field.locator("[data-page-editor] li");
        await expect(tiles.last().locator("img")).toBeVisible({ timeout: 30_000 });
        const total = await tiles.count();
        expect(total).toBeGreaterThanOrEqual(3);
        const order = () => tiles.evaluateAll((items) => items.map((item) => item.dataset.page));

        await tiles
          .last()
          .getByRole("button", { name: `Move page ${total} earlier` })
          .click();
        await expect(text).toHaveValue(`1-${total - 2}, ${total}, ${total - 1}`);
        await tiles.first().getByRole("button", { name: "Rotate page 1 clockwise" }).click();
        await expect(tiles.first()).toContainText("90°");
        await tiles.nth(1).getByRole("button", { name: "Remove page 2" }).click();
        await expect(tiles).toHaveCount(total - 1);
        expect((await text.inputValue()).startsWith("1 r90, ")).toBe(true);

        // 直接输入时编辑器跟着变；写错的文本保留上一次的排列
        await text.fill("2, 1");
        await expect.poll(order).toEqual(["2", "1"]);
        await text.fill("2, x");
        await expect.poll(order).toEqual(["2", "1"]);

        await field.getByRole("button", { name: "Reset pages" }).click();
        await expect(text).toHaveValue("");
        await expect(tiles).toHaveCount(total);
      });
    }

    const cropField = describeFields(tool.input).find((spec) => spec.kind === "crop");
    if (cropField?.kind === "crop") {
      // 裁剪区域字段：拖动框和角改的是同一个 "x, y, width, height"，旋转、比例变化后回到居中区域
      test("edits the crop area by dragging", async ({ page }) => {
        const name = tool.examples.map((example) => example.files?.[cropField.source])[0];
        await page.goto(`/${tool.id}`);
        await page.waitForSelector("[data-hydrated]");
        await page
          .locator(`[data-field="${cropField.source}"] input[type="file"]`)
          .setInputFiles(`src/tools/${tool.id}/examples/${String(name)}`);
        const field = page.locator(`[data-field="${cropField.name}"]`);
        const text = field.locator("input");
        const editor = field.locator("[data-crop-editor]");
        const box = field.locator("[data-crop-box]");
        await expect(editor).toBeVisible({ timeout: 30_000 });
        // 样例是 320 × 240：没有区域时框是整张图
        await expect(field).toContainText("320 × 240 px");

        // page.mouse 用视口坐标，每次拖动前把编辑器滚进视口（点上面的下拉时页面会滚走）
        const drag = async (handle: Locator, dx: number, dy: number) => {
          await editor.scrollIntoViewIfNeeded();
          const bounds = (await handle.boundingBox())!;
          const x = bounds.x + bounds.width / 2;
          const y = bounds.y + bounds.height / 2;
          await page.mouse.move(x, y);
          await page.mouse.down();
          await page.mouse.move(x + dx / 2, y + dy / 2);
          await page.mouse.move(x + dx, y + dy);
          await page.mouse.up();
        };
        const frame = (await editor.boundingBox())!;
        const scale = frame.width / 320;
        await drag(field.locator('[data-crop-corner="right-bottom"]'), -160 * scale, -120 * scale);
        await expect(text).toHaveValue(/^0, 0, 1[56]\d, 1[12]\d$/);
        await drag(box, 80 * scale, 60 * scale);
        const [x, y] = (await text.inputValue()).split(", ").map(Number);
        expect(x).toBeGreaterThan(70);
        expect(y).toBeGreaterThan(50);

        // 方向键每次移动 1 像素
        await box.focus();
        await page.keyboard.press("ArrowLeft");
        expect((await text.inputValue()).split(", ").map(Number)[0]).toBe(x! - 1);

        // 直接输入时框跟着变
        await text.fill("10, 20, 100, 50");
        await expect(field).toContainText("100 × 50 px");

        // 选比例后回到居中区域，横竖切换按钮换成另一个方向
        await page.locator('[data-field="aspect"] [data-slot="select-trigger"]').click();
        await page.locator('[data-option="16:9"]:visible').click();
        await expect(text).toHaveValue("");
        await expect(field).toContainText("320 × 180 px");
        await field.getByRole("button", { name: "Switch to 9:16" }).click();
        await expect(field).toContainText("135 × 240 px");
        await drag(field.locator('[data-crop-corner="left-top"]'), 40 * scale, 0);
        // 锁定比例：宽高一起变
        const [, , width, height] = (await text.inputValue()).split(", ").map(Number);
        expect(Math.abs(width! / height! - 9 / 16)).toBeLessThan(0.02);

        // 旋转后尺寸互换、区域重置
        await page.locator('[data-field="rotate"] [data-slot="select-trigger"]').click();
        await page.locator('[data-option="90"]:visible').click();
        await expect(text).toHaveValue("");
        await expect(field).toContainText("180 × 320 px");
        await page.locator('[data-field="aspect"] [data-slot="select-trigger"]').click();
        await page.locator('[data-option="free"]:visible').click();
        await expect(field).toContainText("240 × 320 px");

        await text.fill("0, 0, 10, 10");
        await field.getByRole("button", { name: "Reset crop" }).click();
        await expect(text).toHaveValue("");
      });
    }

    if (tool.agent.webmcp) {
      // WebMCP 还在 origin trial，用桩对象验证注册的描述符和 execute 的返回
      test("registers a WebMCP tool that runs the first example", async ({ page }) => {
        const example = tool.examples[0];
        await stubServer(page, tool, example.output);
        await page.addInitScript(() => {
          const registered: unknown[] = [];
          Object.assign(window, { webmcpTools: registered });
          Object.defineProperty(document, "modelContext", {
            value: {
              registerTool: async (descriptor: unknown, options: { signal?: AbortSignal }) => {
                registered.push(descriptor);
                options.signal?.addEventListener("abort", () => {
                  registered.splice(registered.indexOf(descriptor), 1);
                });
              },
            },
          });
        });
        await page.goto(`/${tool.id}`);
        await page.waitForSelector("[data-hydrated]");
        // 适配层在探测到 modelContext 后才动态加载，注册略晚于水合
        await page.waitForFunction(
          () => (window as unknown as { webmcpTools: unknown[] }).webmcpTools.length > 0,
        );
        const result = await page.evaluate(async (input) => {
          const [descriptor] = (window as unknown as { webmcpTools: any[] }).webmcpTools;
          return {
            name: descriptor.name,
            schemaType: descriptor.inputSchema.type,
            output: JSON.parse(await descriptor.execute(input)),
            invalid: JSON.parse(await descriptor.execute({})),
          };
        }, example.input);
        expect(result.name).toBe(tool.id);
        expect(result.schemaType).toBe("object");
        expect(result.output).toEqual(example.output);
        expect(result.invalid.error.code).toBe("invalid_input");
        // 结果同步显示在页面表单上
        await expectOutput(page, tool, example.output);
      });
    }
  });
}

test("serves llms.txt and the search index", async ({ request }) => {
  for (const path of ["/llms.txt", "/search.json"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});

// 只有可索引页面有 .md 副本，副本用 Link 头声明 canonical 指向 HTML 页面（ADR-0019）
test("serves a Markdown copy exactly where the page links one", async ({ page, request }) => {
  for (const path of ["/json-formatter", "/zh/json-formatter", "/developer"]) {
    await page.goto(path);
    const link = page.locator('link[rel="alternate"][type="text/markdown"]');
    const response = await request.get(`${path}.md`, { maxRedirects: 0 });
    if ((await link.count()) === 0) {
      expect(response.status(), path).toBe(404);
      continue;
    }
    await expect(link).toHaveAttribute("href", `${path}.md`);
    expect(response.status(), path).toBe(200);
    expect(response.headers().link).toBe(`<${new URL(path, site.url).href}>; rel="canonical"`);
  }
});
