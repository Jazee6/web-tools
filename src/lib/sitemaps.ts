// sitemap 按 Locale × Category 拆分（architecture §9），另有 pages 组放首页等独立页面。
// 只收录可索引页面；没有 URL 的分组不生成文件。
import { type Catalog, homeStatuses } from "@/lib/catalog";
import { type Locale, localizePath, locales } from "@/lib/i18n/locales";
import { isIndexable } from "@/lib/seo/indexing";
import type { SitemapUrl } from "@/lib/seo/sitemap";

export interface SitemapGroup {
  name: string;
  urls: SitemapUrl[];
}

export const sitemapGroups = (catalog: Catalog): SitemapGroup[] =>
  locales.flatMap((locale: Locale) => {
    const groups: SitemapGroup[] = [
      {
        name: `${locale}-pages`,
        urls: isIndexable(homeStatuses, locale) ? [{ path: localizePath(locale) }] : [],
      },
      ...catalog.categories.map((category) => ({
        name: `${locale}-${category.id}`,
        urls: [category, ...catalog.tools.filter((tool) => tool.tool.category === category.id)]
          .filter((node) => isIndexable(node.statuses, locale))
          .map((node) => ({
            path: localizePath(locale, node.path),
            lastmod: node.entries[locale]!.data.updated,
          })),
      })),
    ];
    return groups.filter((group) => group.urls.length > 0);
  });
