import { describe, expect, it } from "vitest";

import { ToolError } from "@/lib/tool-contract/define-tool";

import { checkHeaders } from "./core";
import { fetch } from "./fixtures";

const blocked = async (): Promise<Response> => {
  throw new ToolError("blocked_url", { detail: "127.0.0.1" });
};

const down = async (): Promise<Response> => {
  throw new TypeError("connection refused");
};

const redirectLoop = async (url: URL) =>
  new Response(null, { status: 302, headers: { location: `${url.href}x` } });

describe("checkHeaders", () => {
  it("assumes https and follows redirects hop by hop", async () => {
    const result = await checkHeaders({ url: "example.com", followRedirects: true }, { fetch });
    expect(result.status).toBe(200);
    expect(result.url).toBe("https://www.example.com/");
    expect(result.redirects).toEqual([{ status: 301, url: "https://example.com/" }]);
  });

  it("reports the redirect itself when not following", async () => {
    const result = await checkHeaders(
      { url: "https://example.com", followRedirects: false },
      { fetch },
    );
    expect(result.status).toBe(301);
    expect(result.headers).toEqual([{ name: "location", value: "https://www.example.com/" }]);
    expect(result.redirects).toEqual([]);
  });

  it("stops after 5 redirects", async () => {
    await expect(
      checkHeaders({ url: "https://a.test/", followRedirects: true }, { fetch: redirectLoop }),
    ).rejects.toMatchObject({ code: "too_many_redirects" });
  });

  it("rejects non-http schemes and malformed URLs on the url field", async () => {
    for (const url of ["ftp://example.com/", "https://exa mple.com"]) {
      await expect(checkHeaders({ url, followRedirects: true }, { fetch })).rejects.toMatchObject({
        code: "invalid_url",
        field: "url",
      });
    }
  });

  it("maps blocked targets to the url field and network failures to fetch_failed", async () => {
    await expect(
      checkHeaders({ url: "http://127.0.0.1", followRedirects: true }, { fetch: blocked }),
    ).rejects.toMatchObject({ code: "blocked_url", field: "url" });
    await expect(
      checkHeaders({ url: "https://down.test", followRedirects: true }, { fetch: down }),
    ).rejects.toMatchObject({ code: "fetch_failed", detail: "connection refused" });
  });

  it("requires a server-injected fetch", async () => {
    await expect(checkHeaders({ url: "example.com", followRedirects: true }, {})).rejects.toThrow(
      /服务端/,
    );
  });
});
