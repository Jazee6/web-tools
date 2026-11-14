// Locale 的唯一事实源：路径代码即 Locale id，Astro i18n、Paraglide、messages 文件名都用它。
// project.inlang/settings.json 必须与这里一致（见 locales.test.ts）。
export const locales = ["en", "zh", "ja", "es", "pt", "de", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// 路径代码 → BCP 47 代码，用于 hreflang 和 <html lang>。
export const hreflang: Record<Locale, string> = {
  en: "en",
  zh: "zh-Hans",
  ja: "ja",
  es: "es",
  pt: "pt",
  de: "de",
  fr: "fr",
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (locales as readonly string[]).includes(value);

// en 无前缀，其余 Locale 用 /{locale} 前缀。path 以 "/" 开头。
export const localizePath = (locale: Locale, path = "/"): string => {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
};
