import { expect, type Page, test } from "@playwright/test";

import { loadTools } from "./load-tools";
import { runExample } from "./run-example";

// PWA（architecture §13）：用过一次的 Tool 断网后能打开并运行，隔离页离线时仍保留 COOP/COEP；
// 没访问过的页面显示对应 Locale 的离线页。其他用例默认禁用 SW（playwright.config.ts）。
test.use({ serviceWorkers: "allow" });

// Firefox 下 Playwright 的离线模拟不作用于 Service Worker 发出的请求（断网后 SW 仍能从网络取到页面），
// 这里的断言在 Firefox 上没有意义，改为在真实 Firefox 里手动确认
test.skip(({ browserName }) => browserName === "firefox", "离线模拟不作用于 SW 的请求");

const tools = await loadTools();

// 等 SW 接管页面，并把页面和已加载的 /_astro/ 资源都写进缓存。Worker 里的请求（WASM）不在页面的
// 资源时间线上，由断网后再跑一次 example 来验证
const waitUntilCached = async (page: Page) => {
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await expect
    .poll(
      () =>
        page.evaluate(async () => {
          const pages = await caches.open("pages");
          const assets = await caches.open("assets");
          const missing: string[] = [];
          if (!(await pages.match(location.href))) missing.push(location.href);
          for (const entry of performance.getEntriesByType("resource")) {
            const url = new URL(entry.name);
            if (url.origin !== location.origin || !url.pathname.startsWith("/_astro/")) continue;
            if (!(await assets.match(url.href, { ignoreVary: true }))) missing.push(url.href);
          }
          return missing;
        }),
      { timeout: 15_000 },
    )
    .toEqual([]);
};

// 浏览器里运行的 Worker Tool（Server-assisted Tool 离线本来就不能用）
for (const tool of tools.filter((candidate) => candidate.runtime.worker)) {
  test(`${tool.id} works offline after one use`, async ({ page, context, browserName }) => {
    // Speech to Text 第一次要下载约 110 MB 的模型
    test.setTimeout(180_000);
    const example = tool.examples[0];
    await page.goto(`/${tool.id}`);
    // 引擎 Worker 创建时继承页面的 SW；在 SW 接管之前创建的 Worker 里的请求（WASM）不会被缓存
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await runExample(page, tool, example);
    await waitUntilCached(page);

    await context.setOffline(true);
    // 关掉原页面、新开一页，而不是 reload：本机 Playwright WebKit 跑完 Speech to Text 后 reload 会崩溃
    // （不开 SW、不断网也一样）
    await page.close();
    const offline = await context.newPage();
    await offline.goto(`/${tool.id}`);
    await expect(offline.locator("h1")).toBeVisible();
    if (tool.runtime.crossOriginIsolated) {
      // 缓存的是原始响应，COOP/COEP 原样返回（WebKit 不支持 credentialless，本来就不隔离）
      expect(await offline.evaluate(() => crossOriginIsolated)).toBe(browserName !== "webkit");
    }
    await runExample(offline, tool, example);
  });
}

test("pages never visited show the offline page of their locale", async ({ page, context }) => {
  await page.goto("/zh/json-formatter");
  await waitUntilCached(page);

  await context.setOffline(true);
  await page.goto("/zh/merge-pdf");
  await expect(page.locator("[data-offline]")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
  await page.goto("/merge-pdf");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("[data-offline]")).toBeVisible();
});
