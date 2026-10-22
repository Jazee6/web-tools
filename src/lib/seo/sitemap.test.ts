import { describe, expect, it } from "vitest";

import { renderSitemap, renderSitemapIndex } from "./sitemap";

describe("sitemap", () => {
  it("renders absolute, escaped URLs with lastmod dates", () => {
    const xml = renderSitemap([
      { path: "/json-formatter", lastmod: new Date("2026-10-22T08:00:00Z") },
      { path: "/zh?a=1&b=2" },
    ]);
    expect(xml).toContain(
      "<url><loc>https://tools.jaze.top/json-formatter</loc><lastmod>2026-10-22</lastmod></url>",
    );
    expect(xml).toContain("<loc>https://tools.jaze.top/zh?a=1&amp;b=2</loc>");
  });

  it("renders a sitemap index", () => {
    expect(renderSitemapIndex([{ path: "/sitemap-en-developer.xml" }])).toContain(
      "<sitemap><loc>https://tools.jaze.top/sitemap-en-developer.xml</loc></sitemap>",
    );
  });
});
