import { fileURLToPath } from "node:url";

import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// 与 astro.config.ts 相同：用 ORT 的 extern-wasm 版，测试走和生产一样的 wasmBinary 加载路径
const ortWebGpu = fileURLToPath(
  new URL("node_modules/onnxruntime-web/dist/ort.webgpu.min.mjs", import.meta.url),
);

// 各自启动浏览器的测试文件：
// - 契约测试（每个 Worker Tool 的 examples）：WebKit 不会在同一个页面进程里释放已终止 Worker 的 WASM 内存，
//   和其他重引擎的测试放在一起会 Out of memory
const isolatedTests = ["src/tools/contract.browser.test.ts"];

const browserProject = (
  name: string,
  groupOrder: number,
  files: { include?: string[]; exclude?: string[] },
) => ({
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
  worker: { format: "es" as const },
  test: {
    name,
    // groupOrder 不同的 project 依次运行，同一时间只有一组浏览器
    sequence: { groupOrder },
    include: files.include ?? ["src/**/*.browser.test.ts"],
    exclude: files.exclude ?? [],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [
        { browser: "chromium" as const },
        { browser: "firefox" as const },
        { browser: "webkit" as const },
      ],
    },
  },
});

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: [{ find: /^onnxruntime-web\/webgpu$/, replacement: ortWebGpu }],
  },
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
      // WASM / WebCodecs / WebGPU 路径在真实浏览器里测（architecture §18）；isolatedTests 在另一个 project 里，用另一组浏览器
      browserProject("browser", 1, { exclude: isolatedTests }),
      browserProject("browser-isolated", 2, { include: isolatedTests }),
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
                EVENT_RATE_LIMITER: { namespace_id: "1004", simple: { limit: 3, period: 60 } },
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
