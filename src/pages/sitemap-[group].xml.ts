import type { APIRoute, GetStaticPaths } from "astro";

import { getCatalog } from "@/lib/catalog";
import { renderSitemap } from "@/lib/seo/sitemap";
import { sitemapGroups } from "@/lib/sitemaps";

export const getStaticPaths = (async () =>
  sitemapGroups(await getCatalog()).map((group) => ({
    params: { group: group.name },
    props: { group },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(renderSitemap(props.group.urls), { headers: { "Content-Type": "application/xml" } });
