import { describe, expect, it, vi } from "vitest";

import { GET as getLlmsTxt } from "../pages/[...locale]/llms.txt";
import { getCatalog, type Catalog, type SitePageNode } from "./catalog";
import { alternates, isIndexable, markdownHref, missingTranslationRedirects } from "./seo/indexing";
import { sitePageIds } from "./site-pages";
import { sitemapGroups } from "./sitemaps";

vi.mock("@/lib/catalog", () => ({
  getCatalog: vi.fn<typeof getCatalog>(),
  toolsInCategory: () => [],
  homeStatuses: {
    en: "reviewed",
    zh: "reviewed",
    ja: "reviewed",
    es: "reviewed",
    pt: "reviewed",
    de: "reviewed",
    fr: "reviewed",
  },
}));

describe.each(sitePageIds)("Site Page %s indexing lifecycle (synthetic only)", (id) => {
  const path = `/${id}`;
  it.each([
    { en: "draft", zh: "reviewed", listed: false },
    { en: "reviewed", zh: "draft", listed: false },
    { en: "reviewed", zh: "reviewed", listed: true },
  ] as const)(
    "llms.txt applies the shared en/translation gates: %j",
    async ({ en, zh, listed }) => {
      vi.mocked(getCatalog).mockResolvedValue({
        categories: [],
        tools: [],
        variants: [],
        sitePages: [
          {
            id,
            path,
            kind: "site",
            statuses: { en, zh },
            entries: {
              en: { data: { name: "Synthetic page", description: "Synthetic description" } },
              zh: { data: { name: "Synthetic translation", description: "Synthetic description" } },
            },
          },
        ],
      } as unknown as Catalog);
      const response = await getLlmsTxt({ props: { locale: "zh" } } as unknown as Parameters<
        typeof getLlmsTxt
      >[0]);
      expect((await response.text()).includes(`/zh${path}.md`)).toBe(listed);
    },
  );
  const sitemap = (statuses: SitePageNode["statuses"]) => {
    const node = {
      id,
      path,
      kind: "site",
      statuses,
      entries: {
        en: { data: { updated: new Date("2026-11-05") } },
        zh: { data: { updated: new Date("2026-11-05") } },
      },
    } as SitePageNode;
    return sitemapGroups({
      sitePages: [node],
      categories: [],
      tools: [],
      variants: [],
    } as Catalog).flatMap((group) => group.urls.map((url) => url.path));
  };
  it("Draft en suppresses sitemap, alternates and Markdown even if a translation is Reviewed", () => {
    const statuses = { en: "draft", zh: "reviewed" } as const;
    expect(isIndexable(statuses, "zh")).toBe(false);
    expect(sitemap(statuses)).not.toContain(`/zh${path}`);
    expect(alternates(statuses, "zh", path)).toEqual([]);
    expect(markdownHref(statuses, "zh", path)).toBe(`/zh${path}`);
    expect(missingTranslationRedirects(statuses, path)).toContainEqual({
      from: `/ja${path}`,
      to: path,
    });
    expect(missingTranslationRedirects(statuses, path).some((r) => r.from.endsWith(".md"))).toBe(
      false,
    );
  });
  it("Reviewed editions enter sitemap / reciprocal hreflang / Markdown; missing editions redirect", () => {
    const statuses = { en: "reviewed", zh: "reviewed" } as const;
    expect(sitemap(statuses)).toContain(path);
    expect(sitemap(statuses)).toContain(`/zh${path}`);
    expect(alternates(statuses, "en", path)).toEqual(alternates(statuses, "zh", path));
    expect(markdownHref(statuses, "zh", path)).toBe(`/zh${path}.md`);
    expect(missingTranslationRedirects(statuses, path)).toContainEqual({
      from: `/ja${path}.md`,
      to: `${path}.md`,
    });
  });
});
