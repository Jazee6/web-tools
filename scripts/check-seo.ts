/// <reference types="bun" />
// 对构建产物做 SEO 校验（architecture §18）：canonical、robots 与 sitemap 一致、hreflang 互指、
// JSON-LD 可解析、sitemap URL 都对应真实文件、OG 图与 .md 副本存在、Tool id 与 Category id 不冲突。
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { site } from "../src/lib/site";
import { canonicalPath } from "../src/lib/url";
import { loadTools } from "./lib/content";

export interface PageInfo {
  // 对外路径：/、/zh、/zh/json-formatter
  path: string;
  lang?: string;
  canonical?: string;
  noindex: boolean;
  hreflang: { lang: string; href: string }[];
  jsonLd: string[];
  ogImage?: string;
  markdown?: string;
}

const absolute = (path: string) => new URL(path, site.url).href;
const pathOf = (url: string) => new URL(url, site.url).pathname;

export const parsePage = async (path: string, html: string): Promise<PageInfo> => {
  const page: PageInfo = { path, noindex: false, hreflang: [], jsonLd: [] };
  let jsonLd: string | undefined;
  await new HTMLRewriter()
    .on("html", { element: (el) => void (page.lang = el.getAttribute("lang") ?? undefined) })
    .on("link[rel=canonical]", {
      element: (el) => void (page.canonical = el.getAttribute("href")!),
    })
    .on("link[rel=alternate][hreflang]", {
      element: (el) =>
        void page.hreflang.push({
          lang: el.getAttribute("hreflang")!,
          href: el.getAttribute("href")!,
        }),
    })
    .on('link[rel=alternate][type="text/markdown"]', {
      element: (el) => void (page.markdown = el.getAttribute("href")!),
    })
    .on("meta[name=robots]", {
      element: (el) => void (page.noindex ||= /noindex/.test(el.getAttribute("content") ?? "")),
    })
    .on('meta[property="og:image"]', {
      element: (el) => void (page.ogImage = el.getAttribute("content")!),
    })
    .on('script[type="application/ld+json"]', {
      element: (el) => {
        jsonLd = "";
        el.onEndTag(() => void page.jsonLd.push(jsonLd!));
      },
      text: (chunk) => void (jsonLd += chunk.text),
    })
    .transform(new Response(html))
    .text();
  return page;
};

export interface SiteSnapshot {
  pages: PageInfo[];
  sitemapUrls: string[];
  files: Set<string>;
}

export const checkSeo = ({ pages, sitemapUrls, files }: SiteSnapshot): string[] => {
  const errors: string[] = [];
  const byPath = new Map(pages.map((page) => [page.path, page]));
  const inSitemap = new Set(sitemapUrls.map(pathOf));

  for (const url of sitemapUrls) {
    const page = byPath.get(pathOf(url));
    if (!page) errors.push(`sitemap 中的 ${url} 没有对应页面`);
    else if (page.noindex) errors.push(`sitemap 中的 ${url} 是 noindex 页面`);
  }

  for (const page of pages) {
    const where = page.path;
    if (page.canonical !== absolute(page.path)) {
      errors.push(`${where}：canonical ${page.canonical} 不是自引用`);
    }
    if (!page.lang) errors.push(`${where}：<html> 缺少 lang`);

    for (const raw of page.jsonLd) {
      try {
        const data = JSON.parse(raw) as { "@context"?: string; "@type"?: string };
        if (data["@context"] !== "https://schema.org" || !data["@type"]) {
          errors.push(`${where}：JSON-LD 缺少 @context 或 @type`);
        }
      } catch {
        errors.push(`${where}：JSON-LD 不是合法 JSON`);
      }
    }

    if (page.ogImage && !files.has(pathOf(page.ogImage))) {
      errors.push(`${where}：OG 图 ${page.ogImage} 不存在`);
    }
    if (page.markdown && !files.has(page.markdown)) {
      errors.push(`${where}：.md 副本 ${page.markdown} 不存在`);
    }

    if (page.noindex) {
      if (page.hreflang.length > 0) errors.push(`${where}：noindex 页面不能输出 hreflang`);
      if (inSitemap.has(page.path)) errors.push(`${where}：noindex 页面不能进入 sitemap`);
      continue;
    }

    if (!inSitemap.has(page.path)) errors.push(`${where}：可索引页面没有进入 sitemap`);
    if (page.hreflang.length === 0) continue;
    if (!page.hreflang.some((link) => pathOf(link.href) === page.path && link.lang === page.lang)) {
      errors.push(`${where}：hreflang 未包含自身`);
    }
    const xDefault = page.hreflang.filter((link) => link.lang === "x-default");
    if (xDefault.length !== 1) errors.push(`${where}：hreflang 需要且只能有一个 x-default`);
    for (const link of page.hreflang) {
      const target = byPath.get(pathOf(link.href));
      if (!target) {
        errors.push(`${where}：hreflang 指向不存在的 ${link.href}`);
      } else if (target.noindex) {
        errors.push(`${where}：hreflang 指向 noindex 页面 ${link.href}`);
      } else if (
        link.lang !== "x-default" &&
        !target.hreflang.some((back) => pathOf(back.href) === page.path)
      ) {
        errors.push(`${where}：hreflang 与 ${link.href} 没有互指`);
      }
    }
  }

  return errors;
};

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

export const snapshot = async (root: string): Promise<SiteSnapshot> => {
  const all = walk(root).map((path) => `/${relative(root, path)}`);
  const pages = await Promise.all(
    all
      .filter((path) => path.endsWith(".html"))
      .map((path) => parsePage(canonicalPath(path), readFileSync(join(root, path), "utf8"))),
  );
  const index = readFileSync(join(root, "sitemap-index.xml"), "utf8");
  const sitemapUrls = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].flatMap(([, url]) =>
    [...readFileSync(join(root, pathOf(url!)), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      ([, loc]) => loc!,
    ),
  );
  return { pages, sitemapUrls, files: new Set(all) };
};

if (import.meta.main) {
  const root = process.argv[2] ?? "dist/client";
  // 加载注册表即校验 Tool id 与 Category id / 保留路径不冲突
  await loadTools();
  const built = await snapshot(root);
  const errors = checkSeo(built);
  const indexable = built.pages.filter((page) => !page.noindex).length;
  console.log(
    `页面 ${built.pages.length} 个（可索引 ${indexable}，noindex ${built.pages.length - indexable}），sitemap URL ${built.sitemapUrls.length} 条`,
  );
  for (const error of errors) console.error(`✗ ${error}`);
  if (errors.length > 0) process.exit(1);
  console.log("✓ check:seo 通过");
}
