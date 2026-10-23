import { describe, expect, it } from "vitest";

import { offlinePageFor, offlinePages, strategyFor } from "./sw-routes";

const origin = "https://tools.jaze.top";

const route = (
  path: string,
  init: Partial<{ method: string; mode: RequestMode; range: boolean }>,
) =>
  strategyFor(
    {
      url: new URL(path, origin),
      method: init.method ?? "GET",
      mode: init.mode ?? "cors",
      range: init.range ?? false,
    },
    origin,
  );

describe("strategyFor", () => {
  it("serves navigations network-first as pages", () => {
    expect(route("/json-formatter", { mode: "navigate" })).toBe("page");
    expect(route("/zh/image-compressor", { mode: "navigate" })).toBe("page");
  });

  it("serves hashed build output cache-first", () => {
    expect(route("/_astro/ToolIsland.abc123.js", { mode: "same-origin" })).toBe("asset");
    expect(route("/_astro/pdfium.def456.wasm", {})).toBe("asset");
  });

  it("serves other same-origin files network-first", () => {
    expect(route("/zh/search.json", {})).toBe("network-first");
    expect(route("/json-formatter.md", {})).toBe("network-first");
    expect(route("/manifest.webmanifest", {})).toBe("network-first");
  });

  it("passes through the API, MCP, model parts and the worker script", () => {
    expect(route("/api/tools/http-header-checker", {})).toBeUndefined();
    expect(route("/api/tools/http-header-checker", { mode: "navigate" })).toBeUndefined();
    expect(route("/mcp", {})).toBeUndefined();
    expect(route("/mcp", { mode: "navigate" })).toBeUndefined();
    expect(route("/models/onnx-community/whisper-base/onnx/encoder_model.onnx.part0", {})).toBe(
      undefined,
    );
    expect(route("/sw.js", {})).toBeUndefined();
  });

  it("does not treat tool ids starting with mcp as the MCP endpoint", () => {
    expect(route("/mcp-inspector", { mode: "navigate" })).toBe("page");
  });

  it("passes through non-GET, ranged and cross-origin requests", () => {
    expect(route("/json-formatter", { method: "POST", mode: "navigate" })).toBeUndefined();
    expect(route("/_astro/a.js", { range: true })).toBeUndefined();
    expect(route("https://challenges.cloudflare.com/turnstile/v0/api.js", {})).toBeUndefined();
  });
});

describe("offlinePageFor", () => {
  it("picks the offline page of the locale in the path", () => {
    expect(offlinePageFor("/json-formatter")).toBe("/offline");
    expect(offlinePageFor("/zh/json-formatter")).toBe("/zh/offline");
    expect(offlinePageFor("/ja")).toBe("/ja/offline");
    expect(offlinePageFor("/")).toBe("/offline");
  });

  it("lists one offline page per locale", () => {
    expect(offlinePages).toContain("/offline");
    expect(offlinePages).toContain("/fr/offline");
    expect(offlinePages).toHaveLength(7);
  });
});
