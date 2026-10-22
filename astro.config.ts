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
    plugins: [
      tailwindcss(),
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        emitTsDeclarations: true,
        // globalVariable 只适用于预渲染；出现 SSR 路由（M2）时需改为按请求隔离的方案。
        strategy: ["url", "globalVariable", "baseLocale"],
      }),
    ],
  },
});
