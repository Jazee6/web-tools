import { expect, type Page, test } from "@playwright/test";
import * as v from "valibot";

import { hreflang, localizePath, locales } from "../src/lib/i18n/locales";
import { toolApiPath } from "../src/lib/tool-api";
import type { AnyTool } from "../src/lib/tool-contract/define-tool";
import { describeFields } from "../src/lib/tool-contract/fields";
import { loadTools } from "./load-tools";

// 冒烟测试由注册表和每个 Tool 的 examples 自动生成（architecture §18）
const tools = await loadTools();

const fill = async (page: Page, name: string, kind: string, value: unknown) => {
  const field = page.locator(`[data-field="${name}"]`);
  switch (kind) {
    case "boolean": {
      const control = field.getByRole("switch");
      if ((await control.getAttribute("aria-checked")) !== String(value)) await control.click();
      return;
    }
    case "select":
      await field.locator('[data-slot="select-trigger"]').click();
      await page.locator(`[data-option="${String(value)}"]`).click();
      return;
    default:
      await field.locator("textarea, input").fill(String(value));
  }
};

const expectOutput = async (page: Page, tool: AnyTool, output: Record<string, unknown>) => {
  for (const spec of describeFields(tool.output)) {
    const field = page.locator(`[data-output="${spec.name}"]`);
    const value = output[spec.name];
    if (spec.kind !== "table") {
      await expect(field.locator("textarea, input")).toHaveValue(String(value));
      continue;
    }
    const rows = value as Record<string, unknown>[];
    // 空表只有一行占位
    await expect(field.locator("tbody tr")).toHaveCount(Math.max(rows.length, 1));
    for (const [index, row] of rows.entries()) {
      await expect(field.locator("tbody tr").nth(index).locator("td")).toHaveText(
        spec.columns.map((column) => String(row[column])),
      );
    }
  }
};

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

    tool.examples.forEach((example, index) => {
      test(`example ${index} produces the expected output`, async ({ page }) => {
        await stubServer(page, tool, example.output);
        await page.goto(`/${tool.id}`);
        // 等待 Tool island 水合完成
        await page.waitForSelector("[data-hydrated]");
        const input = v.parse(tool.input, example.input) as Record<string, unknown>;
        for (const spec of describeFields(tool.input)) {
          await fill(page, spec.name, spec.kind, input[spec.name]);
        }
        await page.locator('button[type="submit"]').click();
        await expectOutput(page, tool, example.output);
      });
    });

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

test("serves Markdown copies, llms.txt and the search index", async ({ request }) => {
  for (const path of ["/json-formatter.md", "/zh/json-formatter.md", "/llms.txt", "/search.json"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});
