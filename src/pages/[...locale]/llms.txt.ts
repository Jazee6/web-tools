import type { APIRoute, GetStaticPaths } from "astro";

import { getCatalog, toolsInCategory } from "@/lib/catalog";
import { defaultLocale, type Locale, localizePath, locales } from "@/lib/i18n/locales";
import { isIndexable } from "@/lib/seo/indexing";
import { renderLlmsTxt } from "@/lib/seo/markdown";
import { m } from "@/paraglide/messages";

// 每个 Locale 一份 llms.txt，只列可索引的 Tool 和 Variant
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
        // Variant 紧跟在所属 Tool 之后
        tools: toolsInCategory(catalog, category.id, locale)
          .flatMap((tool) => [tool, ...tool.variants])
          .filter((node) => isIndexable(node.statuses, locale))
          .map((node) => ({
            name: node.entries[locale]!.data.name,
            path: `${localizePath(locale, node.path)}.md`,
            summary: node.entries[locale]!.data.answer,
          })),
      })),
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
