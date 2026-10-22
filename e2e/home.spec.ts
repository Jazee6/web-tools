import { expect, test } from "@playwright/test";

import { hreflang, localizePath, locales } from "../src/lib/i18n/locales";

for (const locale of locales) {
  test(`home page renders for ${locale}`, async ({ page }) => {
    const response = await page.goto(localizePath(locale));
    expect(response?.status()).toBe(200);
    // 扁平 URL 不带尾斜杠、不带 .html，且没有被重定向（ADR-0013）
    expect(new URL(page.url()).pathname).toBe(localizePath(locale));
    await expect(page.locator("html")).toHaveAttribute("lang", hreflang[locale]);
    await expect(page.locator("h1")).toBeVisible();
  });
}

test("⌘K search loads on demand and navigates to a tool", async ({ page }) => {
  await page.goto(localizePath("zh"));
  await page.locator("[data-search-index]").click();
  await page.getByRole("combobox").fill("json");
  await page.getByRole("option").first().click();
  await expect(page).toHaveURL(/\/zh\/json-formatter$/);
});
