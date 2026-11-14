import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it, vi } from "vitest";

import { site } from "../src/lib/site";
import {
  changedUrls,
  ENDPOINT,
  isAccepted,
  loadSitemaps,
  MAX_URLS_PER_REQUEST,
  parseSitemapXml,
  submitUrls,
} from "./indexnow";

const entries = (record: Record<string, string>) => new Map(Object.entries(record));

describe("parseSitemapXml", () => {
  it("reads loc and lastmod from urlset and sitemapindex", () => {
    expect(
      parseSitemapXml(
        `<urlset><url><loc>https://a/x</loc><lastmod>2026-11-01</lastmod></url><url><loc>https://a/</loc></url></urlset>`,
      ),
    ).toEqual([
      { loc: "https://a/x", lastmod: "2026-11-01" },
      { loc: "https://a/", lastmod: "" },
    ]);
    expect(
      parseSitemapXml(`<sitemapindex><sitemap><loc>https://a/s.xml</loc></sitemap></sitemapindex>`),
    ).toEqual([{ loc: "https://a/s.xml", lastmod: "" }]);
  });
});

describe("loadSitemaps", () => {
  it("merges every sitemap listed in the index", async () => {
    const files: Record<string, string> = {
      [`${site.url}/sitemap-index.xml`]: `<sitemapindex><sitemap><loc>${site.url}/sitemap-en-pages.xml</loc></sitemap><sitemap><loc>${site.url}/sitemap-en-pdf.xml</loc></sitemap></sitemapindex>`,
      [`${site.url}/sitemap-en-pages.xml`]: `<urlset><url><loc>${site.url}/</loc></url></urlset>`,
      [`${site.url}/sitemap-en-pdf.xml`]: `<urlset><url><loc>${site.url}/merge-pdf</loc><lastmod>2026-11-01</lastmod></url></urlset>`,
    };
    expect(await loadSitemaps(async (url) => files[url]!)).toEqual(
      entries({ [`${site.url}/`]: "", [`${site.url}/merge-pdf`]: "2026-11-01" }),
    );
  });
});

describe("changedUrls", () => {
  const before = entries({ "/a": "2026-11-01", "/b": "2026-11-01", "/home": "" });

  it("returns nothing when the sitemap is unchanged", () => {
    expect(changedUrls(before, new Map(before))).toEqual([]);
  });

  it("returns new, updated and removed URLs", () => {
    const after = entries({ "/a": "2026-11-12", "/home": "", "/c": "2026-11-12" });
    expect(changedUrls(before, after)).toEqual(["/a", "/c", "/b"]);
  });

  it("returns every URL without a previous sitemap", () => {
    expect(changedUrls(new Map(), before)).toEqual(["/a", "/b", "/home"]);
  });
});

describe("submitUrls", () => {
  it("posts the key and splits large lists into batches", async () => {
    const fetchImpl = vi.fn<(url: string, init: RequestInit) => Promise<Response>>(
      async () => new Response("", { status: 202 }),
    );
    const urls = Array.from({ length: MAX_URLS_PER_REQUEST + 1 }, (_, i) => `${site.url}/${i}`);
    const results = await submitUrls(urls, fetchImpl);

    expect(results.map((result) => [result.count, result.status])).toEqual([
      [MAX_URLS_PER_REQUEST, 202],
      [1, 202],
    ]);
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe(ENDPOINT);
    const body = JSON.parse(init!.body as string);
    expect(body).toMatchObject({
      host: new URL(site.url).host,
      key: site.indexNowKey,
      keyLocation: `${site.url}/${site.indexNowKey}.txt`,
    });
    expect(body.urlList).toHaveLength(MAX_URLS_PER_REQUEST);
  });

  it("accepts only 200 and 202", () => {
    expect([200, 202, 400, 403, 422, 429].map(isAccepted)).toEqual([
      true,
      true,
      false,
      false,
      false,
      false,
    ]);
  });
});

describe("IndexNow key file", () => {
  it("is served from the site root with the key as its content", () => {
    const path = `public/${site.indexNowKey}.txt`;
    expect(existsSync(path)).toBe(true);
    expect(readFileSync(path, "utf8").trim()).toBe(site.indexNowKey);
  });
});

describe("CI deploy job", () => {
  it("snapshots the live sitemap before deploying and submits after", () => {
    const workflow = readFileSync(".github/workflows/ci.yml", "utf8");
    const snapshot = workflow.indexOf("scripts/indexnow.ts snapshot");
    const deploy = workflow.indexOf("bun run deploy");
    const submit = workflow.indexOf("scripts/indexnow.ts submit");
    expect(snapshot).toBeGreaterThan(-1);
    expect(snapshot).toBeLessThan(deploy);
    expect(submit).toBeGreaterThan(deploy);
  });
});
