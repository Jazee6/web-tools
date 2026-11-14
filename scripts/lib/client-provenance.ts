// 构建期记录真实输出 chunk 的模块（含 Worker），不向客户端注入代码。
import { appendFileSync, mkdirSync } from "node:fs";

import type { Plugin } from "vite";

export const clientProvenance = (worker = false): Plugin => ({
  name: "client-license-provenance",
  generateBundle(options, bundle) {
    // SSR 产物不进入浏览器，只记录客户端输出目录（dist/client，或 --outDir 指定目录下的 client）；
    // Worker 的输出同样在 client 目录下。
    if (!worker && !/\/client\/?$/.test(options.dir?.replaceAll("\\", "/") ?? "")) return;
    mkdirSync(".astro", { recursive: true });
    for (const output of Object.values(bundle)) {
      if (output.type !== "chunk") continue;
      const modules = Object.entries(output.modules)
        .filter(([, info]) => info.renderedLength > 0)
        .map(([id]) => id.replace(/^\0/, "").split("?")[0]!);
      appendFileSync(
        ".astro/client-modules.jsonl",
        `${JSON.stringify({ chunk: output.fileName, modules })}\n`,
      );
    }
  },
});
