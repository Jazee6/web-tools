import { expect, type Page, test } from "@playwright/test";

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
