import type { APIRoute } from "astro";

import { getCatalog } from "@/lib/catalog";
import { renderSitemapIndex } from "@/lib/seo/sitemap";
import { sitemapGroups } from "@/lib/sitemaps";

export const GET: APIRoute = async () => {
  const groups = sitemapGroups(await getCatalog());
  const body = renderSitemapIndex(
    groups.map((group) => {
      const dates = group.urls.flatMap((url) => (url.lastmod ? [url.lastmod.getTime()] : []));
      return {
        path: `/sitemap-${group.name}.xml`,
        lastmod: dates.length > 0 ? new Date(Math.max(...dates)) : undefined,
      };
    }),
  );
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
