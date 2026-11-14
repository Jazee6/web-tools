// libheif-js 的 bundle 里有 esbuild 生成的 __require 垫片，引用了全局的 require（只在 Node 里存在）。
// Rolldown 看到 require 就给它注入自己的 __require 运行时；同一个 Worker 里 ORT 也要这个运行时，它就被提升进
// Worker 入口，按需 import() 的 libheif chunk 只能反过来从入口取。WebKit 遇到这种引用会把入口再实例化一次：
// exposeRun 注册两次，之后每个请求都跑两遍（2026-11-13 在 Background Remover 和 Image to Text 上实测）。
// 这里去掉垫片里对 require 的引用（浏览器里本来就走不到），libheif 的 chunk 就不再依赖入口。
import type { Plugin } from "vite";

const replacements = [
  ['typeof require!="undefined"?require:', ""],
  ['if(typeof require!="undefined")return require.apply(this,arguments);', ""],
] as const;

export const libheifWithoutRequire = (): Plugin => ({
  name: "libheif-without-require",
  transform(code, id) {
    if (!id.split("?")[0]!.endsWith("libheif-js/libheif-wasm/libheif-bundle.mjs")) return;
    let result = code;
    for (const [from, to] of replacements) {
      if (!result.includes(from))
        throw new Error(`libheif-bundle.mjs 里找不到 ${from}，请按新版本调整`);
      result = result.replaceAll(from, to);
    }
    // 报错文案里的 "Dynamic require of" 是字符串，不算引用
    if (/typeof require\b|\brequire\s*[.(]|[?:]require\b/.test(result)) {
      throw new Error("libheif-bundle.mjs 里仍有 require 引用");
    }
    return { code: result, map: null };
  },
});
