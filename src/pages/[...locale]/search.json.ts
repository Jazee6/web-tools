import type { APIRoute, GetStaticPaths } from "astro";

import { getCatalog } from "@/lib/catalog";
import { defaultLocale, type Locale, localizePath, locales } from "@/lib/i18n/locales";
import type { SearchItem } from "@/lib/search";

// ⌘K 的构建期索引：该 Locale 下已发布的 Tool（含 Draft，站内搜索与可索引性无关）
export const getStaticPaths = (() =>
  locales.map((locale) => ({
    params: { locale: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const locale = props.locale as Locale;
  const catalog = await getCatalog();
  const items: SearchItem[] = catalog.tools.flatMap((node) => {
    const entry = node.entries[locale];
    if (!entry) return [];
    return [
      { name: entry.data.name, summary: entry.data.answer, path: localizePath(locale, node.path) },
    ];
  });
  return Response.json(items);
};
