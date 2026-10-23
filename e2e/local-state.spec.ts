import { expect, type Page, test } from "@playwright/test";

// 本地状态（architecture §13）：偏好参数、⌘K 里的收藏与最近使用、页脚的"清除本地数据"

const compress = async (page: Page, quality: number) => {
  await page.goto("/image-compressor");
  await page.waitForSelector("[data-hydrated]");
  await page
    .locator('[data-field="file"] input[type="file"]')
    .setInputFiles("src/tools/image-compressor/examples/photo.jpg");
  await page.locator('[data-field="quality"] input').fill(String(quality));
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('[data-output="file"] a[download]')).toBeVisible({ timeout: 30_000 });
};

const openSearch = async (page: Page) => {
  await page.locator("[data-search-index]").click();
  await expect(page.getByRole("combobox")).toBeVisible();
};

test("a tool remembers its last-used options", async ({ page }) => {
  await compress(page, 60);
  await page.reload();
  await page.waitForSelector("[data-hydrated]");
  await expect(page.locator('[data-field="quality"] input')).toHaveValue("60");
});

test("⌘K lists recently used and favorite tools", async ({ page }) => {
  await compress(page, 75);

  await page.goto("/json-formatter");
  await openSearch(page);
  await expect(page.locator('[data-group="recents"]')).toContainText("Image Compressor");
  await page.locator("[data-favorite-toggle]").click();
  await expect(page.locator('[data-group="favorites"]')).toContainText("JSON Formatter");
  await expect(page.locator("[data-favorite-toggle]")).toContainText("Remove");
  // 输入搜索词时只显示搜索结果
  await page.getByRole("combobox").fill("json");
  await expect(page.locator('[data-group="favorites"]')).toHaveCount(0);

  // 每行的星标按钮：在首页从"全部工具"收藏，再从收藏分组里取消
  await page.goto("/");
  await openSearch(page);
  await page.locator('[data-favorite="image-compressor"]').last().click();
  await expect(page.locator('[data-group="favorites"]')).toContainText("Image Compressor");
  await expect(page).toHaveURL(/\/$/);
  await page.locator('[data-group="favorites"] [data-favorite="json-formatter"]').click();
  await expect(page.locator('[data-group="favorites"]')).not.toContainText("JSON Formatter");
  await page.locator('[data-group="favorites"] [data-favorite="image-compressor"]').click();
  await expect(page.locator('[data-group="favorites"]')).toHaveCount(0);
});

test("clearing local data removes favorites, recents and options", async ({ page }) => {
  await compress(page, 60);
  await openSearch(page);
  await page.locator("[data-favorite-toggle]").click();
  await expect(page.locator('[data-group="favorites"]')).toBeVisible();
  await page.keyboard.press("Escape");

  await page.locator("[data-clear-data]").click();
  await page.getByRole("button", { name: "Clear data" }).click();
  await page.waitForEvent("load");
  await page.waitForSelector("[data-hydrated]");

  await expect(page.locator('[data-field="quality"] input')).toHaveValue("75");
  await openSearch(page);
  await expect(page.locator('[data-group="recents"]')).toHaveCount(0);
  await expect(page.locator('[data-group="favorites"]')).toHaveCount(0);
});
