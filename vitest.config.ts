import { cloudflareTest } from "@cloudflare/vitest-plugin";
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
        },
      },
      {
        extends: true,
        plugins: [
          cloudflareTest({
            // 暂无 Worker 路由；M2 起改为从 wrangler.jsonc 加载 Worker
            miniflare: {
              compatibilityDate: "2026-10-12",
              compatibilityFlags: ["global_fetch_strictly_public"],
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
