import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

import { expect, test } from "@playwright/test";

import { loadTools, loadVariants } from "./load-tools";

// 首屏 JS 预算（architecture §15）。口径：页面可交互之前加载的同源脚本，逐个 gzip 后求和。
// 不算第三方和边缘注入的脚本，也不算水合之后才加载的分块（idle 预取的 core、引擎、IndexedDB 封装等）。
// 字节数取自构建产物，不依赖本地服务器是否压缩。
const KB = 1000;
const TOOL_PAGE_BUDGET = 160 * KB;
const OTHER_PAGE_BUDGET = 10 * KB;

const gzippedSize = (path: string) =>
  gzipSync(readFileSync(`dist/client${decodeURI(path)}`)).length;

const tools = await loadTools();
const variants = await loadVariants(tools);

const toolPages = [
  ...tools.map((tool) => `/${tool.id}`),
  ...variants.map((variant) => `/${variant.tool}/${variant.id}`),
];

test.describe("first-load JS budget", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "同一份构建，只量一次");

  for (const path of toolPages) {
    test(`${path} ≤ ${TOOL_PAGE_BUDGET / KB} KB`, async ({ page }) => {
      // data-hydrated 出现的那一刻取快照：此时 idle 预取和水合后的动态 import 都还没开始
      await page.addInitScript(() => {
        new MutationObserver((_, observer) => {
          if (!document.querySelector("[data-hydrated]")) return;
          observer.disconnect();
          (window as { hydratedResources?: string[] }).hydratedResources = performance
            .getEntriesByType("resource")
            .map((entry) => entry.name);
        }).observe(document, {
          subtree: true,
          attributes: true,
          attributeFilter: ["data-hydrated"],
        });
      });
      await page.goto(path);
      await page.waitForFunction(() => "hydratedResources" in window);
      const resources = await page.evaluate(
        () => (window as unknown as { hydratedResources: string[] }).hydratedResources,
      );
      const origin = new URL(page.url()).origin;
      const scripts = resources
        .filter((url) => url.startsWith(`${origin}/`) && new URL(url).pathname.endsWith(".js"))
        .map((url) => new URL(url).pathname);
      const total = scripts.reduce((sum, script) => sum + gzippedSize(script), 0);
      console.log(`${path}: ${(total / KB).toFixed(1)} KB (${scripts.length} scripts)`);
      expect(total).toBeLessThanOrEqual(TOOL_PAGE_BUDGET);
    });
  }

  for (const path of ["/", "/zh", "/developer", "/image"]) {
    test(`${path} ≤ ${OTHER_PAGE_BUDGET / KB} KB`, async ({ page }) => {
      await page.goto(path, { waitUntil: "load" });
      const scripts = await page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .map((entry) => new URL(entry.name))
          .filter((url) => url.origin === location.origin && url.pathname.endsWith(".js"))
          .map((url) => url.pathname),
      );
      const total = scripts.reduce((sum, script) => sum + gzippedSize(script), 0);
      console.log(`${path}: ${(total / KB).toFixed(1)} KB (${scripts.length} scripts)`);
      expect(total).toBeLessThanOrEqual(OTHER_PAGE_BUDGET);
    });
  }
});
