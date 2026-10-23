import type { APIRoute, GetStaticPaths } from "astro";

import { getCatalog, toolsInCategory } from "@/lib/catalog";
import { defaultLocale, type Locale, localizePath, locales } from "@/lib/i18n/locales";
import { isIndexable } from "@/lib/seo/indexing";
import { renderLlmsTxt } from "@/lib/seo/markdown";
import { m } from "@/paraglide/messages";

// 每个 Locale 一份 llms.txt，只列可索引的 Tool
export const getStaticPaths = (() =>
  locales.map((locale) => ({
    params: { locale: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const locale = props.locale as Locale;
  const catalog = await getCatalog();
  const body = renderLlmsTxt({
    name: m.site_name({}, { locale }),
    description: m.home_description({}, { locale }),
    sections: catalog.categories
      .filter((category) => category.entries[locale])
      .map((category) => ({
        name: category.entries[locale]!.data.name,
        tools: toolsInCategory(catalog, category.id, locale)
          .filter((tool) => isIndexable(tool.statuses, locale))
          .map((tool) => ({
            name: tool.entries[locale]!.data.name,
            path: `${localizePath(locale, tool.path)}.md`,
            summary: tool.entries[locale]!.data.answer,
          })),
      })),
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
