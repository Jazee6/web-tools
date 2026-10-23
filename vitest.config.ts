import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
          exclude: ["src/**/*.browser.test.ts"],
        },
      },
      // WASM / WebCodecs / WebGPU 路径在真实浏览器里测（architecture §18）
      {
        extends: true,
        optimizeDeps: {
          exclude: [
            "@jsquash/jpeg",
            "@jsquash/webp",
            "@jsquash/avif",
            "@jsquash/oxipng",
            "@embedpdf/pdfium",
          ],
        },
        worker: { format: "es" },
        test: {
          name: "browser",
          include: ["src/**/*.browser.test.ts"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }, { browser: "firefox" }, { browser: "webkit" }],
          },
        },
      },
      {
        extends: true,
        plugins: [
          cloudflareTest({
            // Worker 入口是 Astro 构建产物，测试直接调用 src/lib 下的路由逻辑（handleToolApi、handleMcp），
            // 绑定在这里按 wrangler.jsonc 声明；限流阈值调低，便于测试 429。
            miniflare: {
              compatibilityDate: "2026-10-12",
              compatibilityFlags: ["global_fetch_strictly_public", "nodejs_als"],
              bindings: { TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA" },
              ratelimits: {
                TOOL_RATE_LIMITER: { namespace_id: "1001", simple: { limit: 3, period: 60 } },
                TARGET_RATE_LIMITER: { namespace_id: "1002", simple: { limit: 30, period: 60 } },
                MCP_RATE_LIMITER: { namespace_id: "1003", simple: { limit: 3, period: 60 } },
              },
            },
          }),
        ],
        test: {
          name: "workers",
          include: ["test/workers/**/*.test.ts"],
        },
      },
    ],
  },
});
