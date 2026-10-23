import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import { defaultLocale, locales } from "./src/lib/i18n/locales";
import { site } from "./src/lib/site";

export default defineConfig({
  site: site.url,
  // 扁平 URL 不带尾斜杠：/json-formatter → json-formatter.html（ADR-0013）
  trailingSlash: "never",
  build: { format: "file" },
  // 不用 Astro 图片变换与 session，避免自动挂 IMAGES / KV 绑定
  adapter: cloudflare({ imageService: "passthrough" }),
  session: false,
  integrations: [react()],
  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    // jSquash 和 PDFium 的 Emscripten 胶水代码用 import.meta.url 定位 .wasm，经依赖预构建后路径会失效
    optimizeDeps: {
      exclude: [
        "@jsquash/jpeg",
        "@jsquash/webp",
        "@jsquash/avif",
        "@jsquash/oxipng",
        "@embedpdf/pdfium",
      ],
    },
    // Tool 的 engine.worker.ts 里按格式动态加载编码器，需要 ES 模块格式的 Worker 才能分块
    worker: { format: "es" },
    plugins: [
      tailwindcss(),
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        emitTsDeclarations: true,
        // 服务端由 middleware 的 AsyncLocalStorage 决定 Locale，浏览器端从 URL 取。
        strategy: ["url", "baseLocale"],
      }),
    ],
  },
});
