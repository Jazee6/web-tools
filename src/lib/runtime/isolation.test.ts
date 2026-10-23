import { describe, expect, it } from "vitest";

import { countHeaderRules, isolatedPaths, isolationHeaders, renderHeaderRules } from "./isolation";

describe("isolatedPaths", () => {
  it("covers every Locale and the Variants with four rules", () => {
    expect(isolatedPaths("image-compressor")).toEqual([
      "/image-compressor",
      "/image-compressor/*",
      "/:locale/image-compressor",
      "/:locale/image-compressor/*",
    ]);
  });
});

describe("countHeaderRules", () => {
  it("counts URL patterns only", () => {
    const headers = `# comment\n/_astro/*\n  Cache-Control: immutable\n${renderHeaderRules(["/a", "/b"], isolationHeaders)}`;
    expect(countHeaderRules(headers)).toBe(3);
  });
});

describe("renderHeaderRules", () => {
  it("renders _headers blocks", () => {
    expect(renderHeaderRules(["/a"], isolationHeaders)).toBe(
      "\n/a\n  Cross-Origin-Opener-Policy: same-origin\n  Cross-Origin-Embedder-Policy: credentialless\n",
    );
  });
});
