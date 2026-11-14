import { expect, test } from "@playwright/test";

import { defaultLocale, hreflang, isLocale, localizePath, locales } from "../src/lib/i18n/locales";
import { fileTypesOf } from "../src/lib/tool-contract/fields";
import { acceptOf } from "../src/lib/tool-contract/file-type";
import { contentLocales, loadTools, loadVariants } from "./load-tools";
import { runExample } from "./run-example";

// Variant 冒烟测试由 Variant 注册表自动生成（architecture §18）
const tools = await loadTools();
const variants = await loadVariants(tools);

for (const variant of variants) {
  const tool = tools.find((candidate) => candidate.id === variant.tool)!;
  const path = `/${variant.tool}/${variant.id}`;
  const published = contentLocales(`src/tools/${variant.tool}/variants/${variant.id}`).filter(
    isLocale,
  );
  // 收窄后的文件选择器类型（ADR-0020）
  const accept = Object.entries(variant.accept ?? {}).map(([name, types]) => {
    const known = fileTypesOf(tool.input, name)!;
    const narrowed = Object.fromEntries((types as string[]).map((type) => [type, known[type]!]));
    return { name, accept: acceptOf(narrowed), extensions: Object.values(narrowed).flat() };
  });

  test.describe(`${variant.tool}/${variant.id}`, () => {
    for (const locale of published) {
      test(`renders in ${locale} with the preset applied`, async ({ page }) => {
        const localized = localizePath(locale, path);
        const response = await page.goto(localized);
        expect(response?.status()).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("lang", hreflang[locale]);
        await page.waitForSelector("[data-hydrated]");
        // 面包屑：首页 › Category › Tool › Variant
        await expect(page.locator('[data-slot="breadcrumb-item"]')).toHaveCount(4);
        for (const [name, value] of Object.entries(variant.preset)) {
          await expect(page.locator(`[data-field="${name}"] input[name="${name}"]`)).toHaveValue(
            String(value),
          );
        }
        for (const field of accept) {
          await expect(
            page.locator(`[data-field="${field.name}"] input[type="file"]`),
          ).toHaveAttribute("accept", field.accept.join(","));
        }
        // 独有数据表格：每行一条
        await expect(page.locator("main table tbody tr")).toHaveCount(variant.table.rows.length);
      });
    }

    // 缺失翻译不发布，302 到 en（ADR-0007）
    const missing = locales.find(
      (locale) => locale !== defaultLocale && !published.includes(locale),
    );
    if (missing) {
      test(`redirects ${missing} to en`, async ({ request }) => {
        const response = await request.get(localizePath(missing, path), { maxRedirects: 0 });
        expect(response.status()).toBe(302);
        expect(new URL(response.headers().location!, "http://x").pathname).toBe(path);
      });
    }

    test("is linked from its Tool page", async ({ page }) => {
      await page.goto(`/${variant.tool}`);
      await expect(page.locator(`main a[href="${path}"]`)).toHaveCount(1);
    });

    // 用来源格式和预设都匹配的 example 跑一次（没有匹配的 example 就跳过）
    const example = tool.examples.find(
      (candidate) =>
        Object.entries(variant.preset).every(
          ([name, value]) => (candidate.input as Record<string, unknown>)[name] === value,
        ) &&
        accept.every((field) =>
          [candidate.files?.[field.name]]
            .flat()
            .every((file) =>
              field.extensions.some((extension) => String(file).endsWith(extension)),
            ),
        ),
    );
    if (example) {
      test("runs a matching example", async ({ page }) => {
        if (tool.runtime.worker) test.setTimeout(120_000);
        await page.goto(path);
        await runExample(page, tool, example);
      });
    }
  });
}
