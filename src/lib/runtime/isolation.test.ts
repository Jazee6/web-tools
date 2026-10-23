import { describe, expect, it } from "vitest";

import { isolatedPaths, isolationHeaders, renderHeaderRules } from "./isolation";

describe("isolatedPaths", () => {
  it("covers every published Locale and its Variants", () => {
    expect(isolatedPaths("image-compressor", { en: "draft", zh: "reviewed" })).toEqual([
      "/image-compressor",
      "/image-compressor/*",
      "/zh/image-compressor",
      "/zh/image-compressor/*",
    ]);
  });
});

describe("renderHeaderRules", () => {
  it("renders _headers blocks", () => {
    expect(renderHeaderRules(["/a"], isolationHeaders)).toBe(
      "\n/a\n  Cross-Origin-Opener-Policy: same-origin\n  Cross-Origin-Embedder-Policy: credentialless\n",
    );
  });
});
