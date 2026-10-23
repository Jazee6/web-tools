// Service Worker 的请求分流（architecture §13 PWA）：纯函数，便于单元测试，src/sw.ts 按结果选缓存策略。
// 保守原则：只接管同源 GET；/api、/mcp、模型分片、跨源请求（Turnstile 等）和 Range 请求一律放行，
// 出问题时重新部署修好的 sw.js 就能恢复，不会把这些请求卡在旧缓存上。
import { defaultLocale, isLocale, localizePath, locales } from "@/lib/i18n/locales";

// 访问过的页面和其他不带哈希的同源文件（.md、search.json、OG 图、manifest、图标）
export const PAGES_CACHE = "pages";
// /_astro/ 下带哈希的构建产物，内容永不变。不随部署清理：已打开的旧页面还可能按需加载旧分块
export const ASSETS_CACHE = "assets";
// 模型由 lib/runtime/model-files.ts 自己拼回并存进 "models" 缓存，SW 不碰

// 页面中的路径，按 Locale 放在 /offline、/{locale}/offline（noindex，不进 sitemap）
export const OFFLINE_SLUG = "offline";
export const offlinePages = locales.map((locale) => localizePath(locale, `/${OFFLINE_SLUG}`));

// 离线时，未缓存的页面按路径里的 Locale 显示对应的离线页
export const offlinePageFor = (pathname: string): string => {
  const prefix = pathname.split("/")[1];
  return localizePath(isLocale(prefix) ? prefix : defaultLocale, `/${OFFLINE_SLUG}`);
};

export type Strategy = "page" | "asset" | "network-first";

export interface RouteInput {
  url: URL;
  method: string;
  mode: RequestMode;
  range: boolean;
}

const passThrough = [/^\/api\//, /^\/mcp(\/|$)/, /^\/models\//, /^\/sw\.js$/];

// undefined 表示不调用 respondWith，请求照常走网络
export const strategyFor = (
  { url, method, mode, range }: RouteInput,
  origin: string,
): Strategy | undefined => {
  if (method !== "GET" || range || url.origin !== origin) return undefined;
  if (passThrough.some((pattern) => pattern.test(url.pathname))) return undefined;
  if (mode === "navigate") return "page";
  if (url.pathname.startsWith("/_astro/")) return "asset";
  return "network-first";
};

// 只缓存同源的完整 200 响应；跳转（含 _redirects 的 302）和错误页都不缓存
export const isCacheable = (response: Response): boolean =>
  response.status === 200 && response.type === "basic" && !response.redirected;
