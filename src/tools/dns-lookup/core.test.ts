import { describe, expect, it } from "vitest";

import { ToolError } from "@/lib/tool-contract/define-tool";

import { type DnsInput, lookupDns } from "./core";

const respond = (body: unknown, init?: ResponseInit) => async (url: URL) => {
  seen.push(url.href);
  return new Response(JSON.stringify(body), init);
};
const seen: string[] = [];

const run = (input: Partial<DnsInput>, fetch: (url: URL) => Promise<Response>) =>
  lookupDns({ domain: "example.com", type: "A", resolver: "cloudflare", ...input }, { fetch });
const codeOf = async (promise: Promise<unknown>) => {
  try {
    await promise;
  } catch (error) {
    return error instanceof ToolError ? error.code : String(error);
  }
};

describe("lookupDns", () => {
  it("queries the chosen resolver with the normalized name and type", async () => {
    seen.length = 0;
    await run(
      { domain: "  HTTPS://Example.COM:8443/a/b?c=1#d ", type: "AAAA" },
      respond({ Status: 0 }),
    );
    await run({ domain: "example.com.", resolver: "google" }, respond({ Status: 0 }));
    await run({ domain: "bücher.example" }, respond({ Status: 0 }));
    expect(seen).toEqual([
      "https://cloudflare-dns.com/dns-query?name=example.com&type=AAAA",
      "https://dns.google/resolve?name=example.com&type=A",
      "https://cloudflare-dns.com/dns-query?name=xn--bcher-kva.example&type=A",
    ]);
  });

  it("maps answers: type names, trailing dots and joined TXT text", async () => {
    const result = await run(
      {},
      respond({
        Status: 0,
        Answer: [
          { name: "www.example.com.", type: 5, TTL: 60, data: "example.com." },
          { name: "example.com.", type: 15, TTL: 60, data: "10 mail.example.com." },
          { name: "example.com.", type: 16, TTL: 60, data: '"a \\"b\\"" "c"' },
          { name: "example.com.", type: 16, TTL: 60, data: "already joined" },
          { name: "example.com.", type: 6, TTL: 60, data: "ns. admin. 1 2 3 4 5" },
          { name: "example.com.", type: 257, TTL: 60, data: '0 issue "pki.goog"' },
          { name: "example.com.", type: 99, TTL: 60, data: "x" },
        ],
      }),
    );
    expect(result.records).toEqual([
      { name: "www.example.com", type: "CNAME", ttl: 60, data: "example.com" },
      { name: "example.com", type: "MX", ttl: 60, data: "10 mail.example.com" },
      { name: "example.com", type: "TXT", ttl: 60, data: 'a "b"c' },
      { name: "example.com", type: "TXT", ttl: 60, data: "already joined" },
      { name: "example.com", type: "SOA", ttl: 60, data: "ns. admin. 1 2 3 4 5" },
      { name: "example.com", type: "CAA", ttl: 60, data: '0 issue "pki.goog"' },
      { name: "example.com", type: "TYPE99", ttl: 60, data: "x" },
    ]);
  });

  it("names response codes and returns no records when there is no answer", async () => {
    expect(await run({}, respond({ Status: 3 }))).toEqual({ status: "NXDOMAIN", records: [] });
    expect(await run({}, respond({ Status: 0 }))).toEqual({ status: "NOERROR", records: [] });
    expect((await run({}, respond({ Status: 2 }))).status).toBe("SERVFAIL");
    expect((await run({}, respond({ Status: 9 }))).status).toBe("RCODE9");
  });

  it("rejects input that is not a domain name", async () => {
    for (const domain of [
      "",
      "   ",
      "a b",
      "-bad.example",
      "exa mple.com",
      "[::1]",
      "a..b",
      `${"a".repeat(64)}.com`,
    ]) {
      expect(await codeOf(run({ domain }, respond({ Status: 0 })))).toBe("invalid_domain");
    }
  });

  it("reports an unreachable or broken resolver as lookup_failed", async () => {
    expect(await codeOf(run({}, respond({}, { status: 500 })))).toBe("lookup_failed");
    expect(await codeOf(run({}, respond({ nope: true })))).toBe("lookup_failed");
    expect(
      await codeOf(
        run({}, async () => {
          throw new TypeError("Failed to fetch");
        }),
      ),
    ).toBe("lookup_failed");
    expect(await codeOf(run({}, async () => new Response("not json")))).toBe("lookup_failed");
  });

  it("passes a user cancellation through instead of reporting a failed lookup", async () => {
    const controller = new AbortController();
    const fail = async () => {
      controller.abort();
      throw new DOMException("aborted", "AbortError");
    };
    await expect(
      lookupDns(
        { domain: "example.com", type: "A", resolver: "cloudflare" },
        { fetch: fail, signal: controller.signal },
      ),
    ).rejects.toThrow("aborted");
  });
});
