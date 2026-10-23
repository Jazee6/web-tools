import { fileURLToPath } from "node:url";

import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import type { AstroIntegration } from "astro";
import { defineConfig } from "astro/config";

import { defaultLocale, locales } from "./src/lib/i18n/locales";
import { site } from "./src/lib/site";
import { resolveVariantMode, variantRoutes } from "./src/lib/variant-mode";

// Variant 渲染模式（ADR-0004）：开关在 src/lib/variant-mode.ts，构建时可用 VARIANT_RENDER_MODE 覆盖。
// 两种模式各有一套路由入口，按模式注入；on-demand 模式多一个预渲染的内容包路由。
const variantMode = resolveVariantMode(process.env.VARIANT_RENDER_MODE);
const variantRoutesIntegration: AstroIntegration = {
  name: "variant-routes",
  hooks: {
    "astro:config:setup": ({ injectRoute }) => {
      const dir = `./src/routes/variant/${variantMode}`;
      injectRoute({ pattern: variantRoutes.page, entrypoint: `${dir}/page.astro` });
      injectRoute({ pattern: variantRoutes.markdown, entrypoint: `${dir}/markdown.ts` });
      if (variantMode === "on-demand") {
        injectRoute({ pattern: variantRoutes.data, entrypoint: "./src/routes/variant/data.ts" });
      }
    },
  },
};

const ortWebGpu = fileURLToPath(
  new URL("node_modules/onnxruntime-web/dist/ort.webgpu.min.mjs", import.meta.url),
);

export default defineConfig({
  site: site.url,
  // 扁平 URL 不带尾斜杠：/json-formatter → json-formatter.html（ADR-0013）
  trailingSlash: "never",
  build: { format: "file" },
  // 不用 Astro 图片变换与 session，避免自动挂 IMAGES / KV 绑定
  adapter: cloudflare({ imageService: "passthrough" }),
  session: false,
  integrations: [react(), variantRoutesIntegration],
  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    // 构建常量：Variant 渲染模式，以及作为 on-demand 缓存键的构建号（每次构建不同）
    define: {
      "import.meta.env.VARIANT_RENDER_MODE": JSON.stringify(variantMode),
      "import.meta.env.BUILD_ID": JSON.stringify(Date.now().toString(36)),
    },
    // Transformers.js 引入的 onnxruntime-web/webgpu 默认是内嵌 WASM 路径的 bundle 版，构建时会把 26.9 MB 的
    // .wasm 复制进产物（超过静态资源单文件上限）。改用 extern-wasm 版，.wasm 由 Speech to Text 的 core 从分片加载（ADR-0018）
    resolve: {
      alias: [{ find: /^onnxruntime-web\/webgpu$/, replacement: ortWebGpu }],
    },
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
