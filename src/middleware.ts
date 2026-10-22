import { defineMiddleware } from "astro:middleware";

import { assertIsLocale, baseLocale, setLocale } from "@/paraglide/runtime";

// 预渲染时为每个页面设置 Paraglide 的 Locale（SSG 不使用 paraglideMiddleware）。
// globalVariable 策略在 Worker 并发 SSR 时会串 Locale，M2 / M4 on-demand 前须改为按请求隔离（见 roadmap）。
export const onRequest = defineMiddleware((context, next) => {
  setLocale(assertIsLocale(context.currentLocale ?? baseLocale));
  return next();
});
