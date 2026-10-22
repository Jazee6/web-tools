import { defineConfig, devices } from "@playwright/test";

// 设置 BASE_URL 时对已部署的版本（PR 预览）跑测试，否则本地构建后用 astro preview（workerd）。
const baseURL = process.env.BASE_URL ?? "http://localhost:4321";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        // --ignore-lock：避免 Astro 在 agent 环境下自动转为后台进程
        command: "bunx astro preview --ignore-lock",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
      },
});
