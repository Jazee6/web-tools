import { localizePath } from "@/lib/i18n/locales";
import { publishedLocales, type Statuses } from "@/lib/seo/indexing";

// 按页开启跨源隔离（ADR-0008）：runtime.crossOriginIsolated 的 Tool 页在每个已发布 Locale 下、
// 连同它的 Variant（/{tool}/*）加上 COOP/COEP。用 credentialless 而不是 require-corp，
// 跨源的 no-cors 资源不带凭据即可加载，不要求对方返回 CORP 头。
export const isolationHeaders = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "credentialless",
} as const;

// 隔离页创建的 Dedicated Worker 由脚本自身的响应头决定 COEP，缺少时浏览器拦截（ERR_BLOCKED_BY_RESPONSE），
// 拿到 COEP 的 Worker 才能用 SharedArrayBuffer 开多线程。Worker 分块和其他构建产物都在 /_astro/ 下，
// 文件名不能用多个通配符区分，所以整个目录都加；COEP 对非文档、非 Worker 资源没有影响。
export const workerScriptPaths = ["/_astro/*"];

export const isolatedPaths = (toolId: string, statuses: Statuses): string[] =>
  publishedLocales(statuses).flatMap((locale) => {
    const path = localizePath(locale, `/${toolId}`);
    return [path, `${path}/*`];
  });

// Cloudflare 静态资源 _headers 格式
export const renderHeaderRules = (paths: string[], headers: Record<string, string>): string =>
  paths
    .map(
      (path) =>
        `\n${path}\n${Object.entries(headers)
          .map(([name, value]) => `  ${name}: ${value}\n`)
          .join("")}`,
    )
    .join("");
