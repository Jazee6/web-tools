import type { Locale } from "@/lib/i18n/locales";

// OG 图由 scripts/postbuild.ts 在构建后用 takumi 生成，每个 Tool × Locale 一张
export const ogImagePath = (locale: Locale, toolId: string): string =>
  `/og/${locale}/${toolId}.png`;
