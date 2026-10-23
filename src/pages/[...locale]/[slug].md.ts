import type { APIRoute, GetStaticPaths } from "astro";

import { categoryOf, getCatalog, publishedPages, toolsInCategory } from "@/lib/catalog";
import { defaultLocale, hreflang, type Locale, localizePath } from "@/lib/i18n/locales";
import { markdownHref } from "@/lib/seo/indexing";
import { renderCategoryMarkdown, renderToolMarkdown } from "@/lib/seo/markdown";
import { site } from "@/lib/site";
import { m } from "@/paraglide/messages";

// Tool / Category 页面的 .md 副本（architecture §10），只为可索引页面生成（ADR-0019）
export const getStaticPaths = (async () => {
  const catalog = await getCatalog();
  return [...catalog.tools, ...catalog.categories].flatMap((node) =>
    publishedPages(node)
      .filter((page) => page.indexable)
      .map((page) => ({
        params: { locale: page.locale === defaultLocale ? undefined : page.locale, slug: node.id },
        props: { node, locale: page.locale },
      })),
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const catalog = await getCatalog();
  const { node, locale } = props as Awaited<ReturnType<typeof getStaticPaths>>[number]["props"];
  const options = { locale: locale as Locale };
  const url = new URL(localizePath(locale, node.path), site.url).href;

  let body: string;
  if (node.kind === "tool") {
    const { data, body: content = "" } = node.entries[locale]!;
    const related = catalog.tools.filter(
      (other) =>
        other.id !== node.id &&
        other.tool.category === categoryOf(catalog, node).id &&
        other.entries[locale],
    );
    const updated = new Intl.DateTimeFormat(hreflang[locale], { dateStyle: "long" }).format(
      data.updated,
    );
    body = renderToolMarkdown({
      name: data.name,
      answer: data.answer,
      url,
      updated,
      headings: {
        steps: m.tool_steps({}, options),
        faq: m.tool_faq({}, options),
        related: m.tool_related({}, options),
        updated: m.page_updated({ date: updated }, options),
      },
      steps: data.steps,
      body: content,
      faq: data.faq,
      variants: {
        heading: m.tool_variants({}, options),
        links: node.variants
          .filter((variant) => variant.entries[locale])
          .map((variant) => ({
            name: variant.entries[locale]!.data.name,
            path: markdownHref(variant.statuses, locale, variant.path),
            summary: variant.entries[locale]!.data.answer,
          })),
      },
      related: related.map((other) => ({
        name: other.entries[locale]!.data.name,
        path: markdownHref(other.statuses, locale, other.path),
        summary: other.entries[locale]!.data.answer,
      })),
    });
  } else {
    const { data, body: content = "" } = node.entries[locale]!;
    body = renderCategoryMarkdown({
      name: data.name,
      intro: data.intro,
      url,
      body: content,
      toolsHeading: m.category_tools({}, options),
      tools: toolsInCategory(catalog, node.id, locale).map((tool) => ({
        name: tool.entries[locale]!.data.name,
        path: markdownHref(tool.statuses, locale, tool.path),
        summary: tool.entries[locale]!.data.answer,
      })),
    });
  }

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
};
