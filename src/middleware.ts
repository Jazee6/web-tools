import { AsyncLocalStorage } from "node:async_hooks";

import { defineMiddleware } from "astro:middleware";

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

export const onRequest = defineMiddleware((context, next) => {
  const locale = assertIsLocale(context.currentLocale ?? baseLocale);
  return storage.run({ locale, origin: context.url.origin, messageCalls: new Set() }, next);
});
