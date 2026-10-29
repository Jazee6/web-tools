import { describe, expect, it } from "vitest";

import { convertUrl, type UrlInput } from "./core";

const run = (
  text: string,
  mode: UrlInput["mode"] = "encode",
  scope: UrlInput["scope"] = "component",
) => convertUrl({ text, mode, scope }).result;

describe("convertUrl", () => {
  it("encodes a URL component, including reserved characters", () => {
    expect(run("a/b?c=d&e#f")).toBe("a%2Fb%3Fc%3Dd%26e%23f");
    expect(run("café 世界 😀")).toBe("caf%C3%A9%20%E4%B8%96%E7%95%8C%20%F0%9F%98%80");
  });

  it("keeps reserved characters when encoding a whole URL", () => {
    expect(run("https://example.com/a b?q=café#top", "encode", "url")).toBe(
      "https://example.com/a%20b?q=caf%C3%A9#top",
    );
  });

  it("encodes form data with + for spaces", () => {
    expect(run("a b&c=d+e", "encode", "form")).toBe("a+b%26c%3Dd%2Be");
    expect(run("it's (ok)!", "encode", "form")).toBe("it%27s+%28ok%29%21");
  });

  it("decodes each scope", () => {
    expect(run("a%2Fb%20c", "decode")).toBe("a/b c");
    expect(run("a+b%20c", "decode")).toBe("a+b c");
    expect(run("a+b%20c", "decode", "form")).toBe("a b c");
    // decodeURI 不还原保留字符的转义
    expect(run("%3Fa%3D1%20b", "decode", "url")).toBe("%3Fa%3D1 b");
  });

  it("throws invalid_encoding on malformed sequences and non-UTF-8 bytes", () => {
    for (const text of ["100%", "%E4%B8", "%ZZ", "%FF"]) {
      expect(() => run(text, "decode")).toThrow(
        expect.objectContaining({ code: "invalid_encoding", field: "text" }),
      );
    }
  });

  it("throws invalid_encoding for lone surrogates in every scope", () => {
    for (const scope of ["component", "url", "form"] as const) {
      expect(() => run("\ud800", "encode", scope)).toThrow(
        expect.objectContaining({ code: "invalid_encoding" }),
      );
    }
  });
});
