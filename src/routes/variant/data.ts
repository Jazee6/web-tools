import type { APIRoute, GetStaticPaths } from "astro";

import { getCatalog } from "@/lib/catalog";
import { locales } from "@/lib/i18n/locales";
import { variantPageData } from "@/lib/variant-page";
import type { VariantBundle } from "@/lib/variant-ssr";

// on-demand 模式的内容包：每个 Tool × Locale 一个 JSON（/variant-data/{locale}/{tool}.json），
// 构建时预渲染成静态资源，Worker 经 env.ASSETS 读取（ADR-0004）。只在 on-demand 模式下注入。
export const prerender = true;

export const getStaticPaths = (async () => {
  const catalog = await getCatalog();
  return catalog.tools.flatMap((tool) =>
    locales.flatMap((locale) => {
      const bundle: VariantBundle = Object.fromEntries(
        tool.variants
          .filter((node) => node.entries[locale])
          .map((node) => [node.variant.id, variantPageData(catalog, node, locale)]),
      );
      return Object.keys(bundle).length > 0
        ? [{ params: { locale, tool: tool.id }, props: { bundle } }]
        : [];
    }),
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => Response.json(props.bundle);
