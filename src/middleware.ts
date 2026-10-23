import { AsyncLocalStorage } from "node:async_hooks";

import { defineMiddleware } from "astro:middleware";

import { variantRoutes } from "@/lib/variant-mode";
import { variantCacheKey } from "@/lib/variant-ssr";
import {
  assertIsLocale,
  baseLocale,
  type Locale,
  overwriteServerAsyncLocalStorage,
} from "@/paraglide/runtime";

// Paraglide 的 Locale 按请求隔离：getLocale() 优先读 AsyncLocalStorage 里的 store，
// Worker 并发处理不同 Locale 的 SSR 请求时互不影响（预渲染走同一路径）。
// 不用 paraglideMiddleware：它会去本地化 URL 并重定向，这些由 Astro i18n routing 负责。
const storage = new AsyncLocalStorage<{
  locale?: Locale;
  origin?: string;
  messageCalls?: Set<string>;
}>();
overwriteServerAsyncLocalStorage(storage);

// on-demand 模式下 SSR 的 Variant 页和 .md 副本写入 Cache API，缓存键带构建号（ADR-0004）
const cachedRoutes = new Set<string>([variantRoutes.page, variantRoutes.markdown]);

export const onRequest = defineMiddleware(async (context, next) => {
  const locale = assertIsLocale(context.currentLocale ?? baseLocale);
  const render = () =>
    storage.run({ locale, origin: context.url.origin, messageCalls: new Set() }, next);

  if (
    import.meta.env.VARIANT_RENDER_MODE !== "on-demand" ||
    context.isPrerendered ||
    context.request.method !== "GET" ||
    !cachedRoutes.has(context.routePattern)
  ) {
    return render();
  }

  const key = variantCacheKey(context.url, import.meta.env.BUILD_ID);
  const cached = await caches.default.match(key);
  if (cached) {
    const hit = new Response(cached.body, cached);
    hit.headers.set("X-Variant-Cache", "hit");
    return hit;
  }
  const response = await render();
  if (response.status === 200) {
    context.locals.cfContext.waitUntil(caches.default.put(key, response.clone()));
  }
  response.headers.set("X-Variant-Cache", "miss");
  return response;
});
