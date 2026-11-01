// Lighthouse 预算门禁（architecture §15）：LCP、CLS、TBT，移动端配置，阈值和页面在 lighthouserc.json。
// 首屏 JS 体积不在这里断言，由 e2e/budget.spec.ts 按项目口径统计。
// 用 lhci 自带的静态服务器，因为它会 gzip，而 astro preview 不压缩，Lighthouse 会高估下载时间。
// Chrome 用 Playwright 装好的 Chromium，CI 镜像里已经预装。
import { chromium } from "@playwright/test";

const lhci = Bun.spawn(["bunx", "lhci", "autorun"], {
  env: { ...process.env, CHROME_PATH: chromium.executablePath() },
  stdout: "inherit",
  stderr: "inherit",
});
process.exit(await lhci.exited);
