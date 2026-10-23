import { describe, expect, it } from "vitest";

import type { VariantPageData } from "@/lib/variant-page";
import {
  assetBundleLoader,
  lookupVariant,
  type VariantBundle,
  variantCacheKey,
} from "@/lib/variant-ssr";

// on-demand 模式的 Variant 查找（ADR-0004）：内容包来自 env.ASSETS，这里用假的 Fetcher
const page = (path: string, markdown?: string) =>
  ({ path, head: { markdown } }) as unknown as VariantPageData;

const bundles: Record<string, VariantBundle> = {
  "/variant-data/en/video-converter.json": {
    "mov-to-mp4": page("/video-converter/mov-to-mp4", "/video-converter/mov-to-mp4.md"),
  },
  "/variant-data/zh/video-converter.json": {
    "mov-to-mp4": page("/zh/video-converter/mov-to-mp4"),
  },
};

const fakeAssets = () => {
  const requests: string[] = [];
  const assets: Fetcher = {
    fetch: async (input) => {
      const { pathname } = new URL(String(input));
      requests.push(pathname);
      const bundle = bundles[pathname];
      return bundle ? Response.json(bundle) : new Response(null, { status: 404 });
    },
  };
  return { assets, requests };
};

describe("lookupVariant", () => {
  it("finds a Variant in its Locale's bundle", async () => {
    const load = assetBundleLoader(fakeAssets().assets);
    const result = await lookupVariant(load, {
      locale: "zh",
      slug: "video-converter",
      variant: "mov-to-mp4",
    });
    expect(result).toMatchObject({
      status: "found",
      data: { path: "/zh/video-converter/mov-to-mp4" },
    });
  });

  it("redirects a missing translation to en with the en page data", async () => {
    const load = assetBundleLoader(fakeAssets().assets);
    const result = await lookupVariant(load, {
      locale: "ja",
      slug: "video-converter",
      variant: "mov-to-mp4",
    });
    expect(result).toMatchObject({
      status: "redirect",
      location: "/video-converter/mov-to-mp4",
      target: { head: { markdown: "/video-converter/mov-to-mp4.md" } },
    });
  });

  it.each([
    { slug: "video-converter", variant: "nope" },
    { slug: "zh", variant: "unknown" },
    { locale: "en", slug: "video-converter", variant: "mov-to-mp4" },
    { locale: "zh/extra", slug: "video-converter", variant: "mov-to-mp4" },
    { slug: "../video-converter", variant: "mov-to-mp4" },
  ])("returns not-found for %o", async (params) => {
    const load = assetBundleLoader(fakeAssets().assets);
    expect(await lookupVariant(load, params)).toEqual({ status: "not-found" });
  });

  it("reads each bundle from ASSETS once per isolate", async () => {
    const { assets, requests } = fakeAssets();
    const load = assetBundleLoader(assets);
    const params = { locale: "zh", slug: "video-converter", variant: "mov-to-mp4" };
    await Promise.all([lookupVariant(load, params), lookupVariant(load, params)]);
    await lookupVariant(load, { slug: "no-such-tool", variant: "x" });
    await lookupVariant(load, { slug: "no-such-tool", variant: "x" });
    expect(requests).toEqual([
      "/variant-data/zh/video-converter.json",
      "/variant-data/en/no-such-tool.json",
    ]);
  });
});

describe("variantCacheKey", () => {
  it("keys on the path and build, ignoring the query", async () => {
    const a = variantCacheKey(new URL("https://tools.jaze.top/zh/x/y?utm=1"), "b1");
    const b = variantCacheKey(new URL("https://tools.jaze.top/zh/x/y"), "b1");
    const next = variantCacheKey(new URL("https://tools.jaze.top/zh/x/y"), "b2");
    expect(a.url).toBe(b.url);
    expect(next.url).not.toBe(a.url);
    // 能作为 Workers Cache API 的键
    await caches.default.put(
      a,
      new Response("cached", { headers: { "Cache-Control": "s-maxage=60" } }),
    );
    expect(await (await caches.default.match(b))?.text()).toBe("cached");
    expect(await caches.default.match(next)).toBeUndefined();
  });
});
