import { defineConfig, devices } from "@playwright/test";

// 设置 BASE_URL 时对已部署的版本（PR 预览）跑测试，否则本地构建后用 astro preview（workerd）。
const baseURL = process.env.BASE_URL ?? "http://localhost:4321";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  // page.route 拦不到经 Service Worker 处理的请求（Turnstile、/api/tools 的桩依赖它），
  // 默认禁用 SW，只在离线用例（e2e/offline.spec.ts）里开启
  use: { baseURL, serviceWorkers: "block" },
  // 三个引擎都跑：跨源隔离和多线程 WASM 的行为在引擎之间不同（WebKit 不支持 COEP: credentialless）
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        // --ignore-lock：避免 Astro 在 agent 环境下自动转为后台进程
        command: "bunx astro preview --ignore-lock",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
      },
});
