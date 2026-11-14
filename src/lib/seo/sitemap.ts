import { site } from "@/lib/site";

// 单个 sitemap 文件的 URL 上限（sitemaps.org）
export const SITEMAP_MAX_URLS = 50_000;

export interface SitemapUrl {
  path: string;
  lastmod?: Date;
}

const escapeXml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!,
  );

const loc = (path: string) => `<loc>${escapeXml(new URL(path, site.url).href)}</loc>`;

const day = (date: Date) => date.toISOString().slice(0, 10);

export const renderSitemap = (urls: SitemapUrl[]): string => {
  if (urls.length > SITEMAP_MAX_URLS) throw new Error(`sitemap 超过 ${SITEMAP_MAX_URLS} 条 URL`);
  const body = urls
    .map(
      (url) =>
        `<url>${loc(url.path)}${url.lastmod ? `<lastmod>${day(url.lastmod)}</lastmod>` : ""}</url>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>\n`;
};

export const renderSitemapIndex = (sitemaps: SitemapUrl[]): string => {
  const body = sitemaps
    .map(
      (url) =>
        `<sitemap>${loc(url.path)}${url.lastmod ? `<lastmod>${day(url.lastmod)}</lastmod>` : ""}</sitemap>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>\n`;
};
