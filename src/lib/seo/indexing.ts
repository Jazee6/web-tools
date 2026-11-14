import { defaultLocale, hreflang, type Locale, localizePath, locales } from "@/lib/i18n/locales";

export type ReviewStatus = "draft" | "reviewed";

// 一个页面（Tool / Category / Variant）各 Locale 的内容状态；缺失 = 该 Locale 没有内容
export type Statuses = Partial<Record<Locale, ReviewStatus>>;

// 唯一的可索引判定（ADR-0007）：自身 Reviewed 且 en 也 Reviewed。
// robots、hreflang、sitemap、llms.txt 都只经由这里判断。
export const isIndexable = (statuses: Statuses, locale: Locale): boolean =>
  statuses[locale] === "reviewed" && statuses[defaultLocale] === "reviewed";

export const publishedLocales = (statuses: Statuses): Locale[] =>
  locales.filter((locale) => statuses[locale] !== undefined);

export interface Alternate {
  hreflang: string;
  path: string;
}

// hreflang 只在可索引版本之间互指，x-default 指向 en；当前页不可索引时不输出任何 hreflang。
export const alternates = (statuses: Statuses, locale: Locale, path: string): Alternate[] => {
  if (!isIndexable(statuses, locale)) return [];
  const links = locales
    .filter((other) => isIndexable(statuses, other))
    .map((other) => ({ hreflang: hreflang[other], path: localizePath(other, path) }));
  return [...links, { hreflang: "x-default", path: localizePath(defaultLocale, path) }];
};

export interface Redirect {
  from: string;
  to: string;
}

// .md 副本只为可索引页面生成（ADR-0019）：Draft 页面没有副本，链接退回 HTML 页面
export const markdownHref = (statuses: Statuses, locale: Locale, path: string): string =>
  isIndexable(statuses, locale) ? `${localizePath(locale, path)}.md` : localizePath(locale, path);

// 缺失翻译不发布，302 到英文版（ADR-0007）；en 有 .md 副本时，.md 同样跳转。
export const missingTranslationRedirects = (statuses: Statuses, path: string): Redirect[] =>
  locales
    .filter((locale) => locale !== defaultLocale && statuses[locale] === undefined)
    .flatMap((locale) => [
      { from: localizePath(locale, path), to: path },
      ...(isIndexable(statuses, defaultLocale)
        ? [{ from: localizePath(locale, `${path}.md`), to: `${path}.md` }]
        : []),
    ]);

export const renderRedirects = (redirects: Redirect[]): string =>
  redirects.map(({ from, to }) => `${from} ${to} 302\n`).join("");
