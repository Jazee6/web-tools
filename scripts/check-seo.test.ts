import { describe, expect, it } from "vitest";

import { checkSeo, type PageInfo } from "./check-seo";

const url = (path: string) => `https://tools.jaze.top${path}`;

const page = (path: string, lang: string, overrides: Partial<PageInfo> = {}): PageInfo => ({
  path,
  lang,
  canonical: url(path),
  noindex: false,
  hreflang: [],
  jsonLd: ['{"@context":"https://schema.org","@type":"WebApplication"}'],
  ...overrides,
});

const reviewedPair = () => {
  const hreflang = [
    { lang: "en", href: url("/json-formatter") },
    { lang: "zh-Hans", href: url("/zh/json-formatter") },
    { lang: "x-default", href: url("/json-formatter") },
  ];
  return [
    page("/json-formatter", "en", { hreflang }),
    page("/zh/json-formatter", "zh-Hans", { hreflang }),
  ];
};

describe("checkSeo", () => {
  it("accepts reviewed pages that are reciprocal and in the sitemap", () => {
    expect(
      checkSeo({
        pages: reviewedPair(),
        sitemapUrls: [url("/json-formatter"), url("/zh/json-formatter")],
        files: new Set(),
      }),
    ).toEqual([]);
  });

  it("accepts draft pages that are noindex, without hreflang and outside the sitemap", () => {
    expect(
      checkSeo({
        pages: [page("/json-formatter", "en", { noindex: true })],
        sitemapUrls: [],
        files: new Set(),
      }),
    ).toEqual([]);
  });

  it("rejects a draft page in the sitemap or with hreflang", () => {
    const errors = checkSeo({
      pages: [
        page("/json-formatter", "en", {
          noindex: true,
          hreflang: [{ lang: "en", href: url("/json-formatter") }],
        }),
      ],
      sitemapUrls: [url("/json-formatter")],
      files: new Set(),
    });
    expect(errors).toEqual(
      expect.arrayContaining([
        "sitemap 中的 https://tools.jaze.top/json-formatter 是 noindex 页面",
        "/json-formatter：noindex 页面不能输出 hreflang",
        "/json-formatter：noindex 页面不能进入 sitemap",
      ]),
    );
  });

  it("rejects indexable pages missing from the sitemap", () => {
    expect(checkSeo({ pages: [page("/", "en")], sitemapUrls: [], files: new Set() })).toContain(
      "/：可索引页面没有进入 sitemap",
    );
  });

  it("rejects hreflang pointing at noindex or non-reciprocal pages", () => {
    const [en, zh] = reviewedPair();
    const errors = checkSeo({
      pages: [en!, { ...zh!, noindex: true, hreflang: [] }],
      sitemapUrls: [url("/json-formatter")],
      files: new Set(),
    });
    expect(errors).toContain(
      "/json-formatter：hreflang 指向 noindex 页面 https://tools.jaze.top/zh/json-formatter",
    );
  });

  it("rejects non-self canonicals, broken JSON-LD and missing artifacts", () => {
    const errors = checkSeo({
      pages: [
        page("/x", "en", {
          noindex: true,
          canonical: url("/y"),
          jsonLd: ["{"],
          ogImage: url("/og/en/x.png"),
          markdown: "/x.md",
        }),
      ],
      sitemapUrls: [url("/missing")],
      files: new Set(["/x.md"]),
    });
    expect(errors).toEqual(
      expect.arrayContaining([
        "sitemap 中的 https://tools.jaze.top/missing 没有对应页面",
        "/x：canonical https://tools.jaze.top/y 不是自引用",
        "/x：JSON-LD 不是合法 JSON",
        "/x：OG 图 https://tools.jaze.top/og/en/x.png 不存在",
      ]),
    );
  });
});
