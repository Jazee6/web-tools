import type { APIRoute, GetStaticPaths } from "astro";

import { getCatalog, publishedPages } from "@/lib/catalog";
import { defaultLocale } from "@/lib/i18n/locales";
import { renderVariantMarkdown } from "@/lib/variant-markdown";
import { variantPageData, type VariantPageData } from "@/lib/variant-page";

// Variant 页的 .md 副本（static 模式），只为可索引页面生成（ADR-0019）
export const getStaticPaths = (async () => {
  const catalog = await getCatalog();
  return catalog.variants.flatMap((node) =>
    publishedPages(node)
      .filter((page) => page.indexable)
      .map((page) => ({
        params: {
          locale: page.locale === defaultLocale ? undefined : page.locale,
          slug: node.variant.tool,
          variant: node.variant.id,
        },
        props: { data: variantPageData(catalog, node, page.locale) },
      })),
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const data = props.data as VariantPageData;
  return new Response(renderVariantMarkdown(data), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
