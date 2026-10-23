import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

// CI 的 browser job 跑在 Playwright 官方镜像里，镜像里预装的浏览器与 @playwright/test 版本绑定
describe("CI Playwright image", () => {
  it("matches the installed @playwright/test version", () => {
    const workflow = readFileSync(".github/workflows/ci.yml", "utf8");
    const { version } = JSON.parse(
      readFileSync("node_modules/@playwright/test/package.json", "utf8"),
    ) as { version: string };
    const images = [...workflow.matchAll(/mcr\.microsoft\.com\/playwright:v([\d.]+)-/g)];
    expect(images.length).toBeGreaterThan(0);
    for (const [, tag] of images) expect(tag).toBe(version);
  });
});
