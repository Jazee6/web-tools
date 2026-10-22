import { expect, type Page, test } from "@playwright/test";
import * as v from "valibot";

import { hreflang, localizePath, locales } from "../src/lib/i18n/locales";
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
        await page.goto(`/${tool.id}`);
        // 等待 Tool island 水合完成
        await page.waitForSelector("[data-hydrated]");
        const input = v.parse(tool.input, example.input) as Record<string, unknown>;
        for (const spec of describeFields(tool.input)) {
          await fill(page, spec.name, spec.kind, input[spec.name]);
        }
        await page.locator('button[type="submit"]').click();
        for (const [name, value] of Object.entries(example.output)) {
          await expect(page.locator(`[data-output="${name}"] textarea`)).toHaveValue(String(value));
        }
      });
    });
  });
}

test("serves Markdown copies, llms.txt and the search index", async ({ request }) => {
  for (const path of ["/json-formatter.md", "/zh/json-formatter.md", "/llms.txt", "/search.json"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});
