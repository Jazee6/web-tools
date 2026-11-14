import { describe, expect, it } from "vitest";

import { assertPublicUrl } from "./safe-fetch";

const check = (url: string) => () => assertPublicUrl(new URL(url), "url");

describe("assertPublicUrl", () => {
  it.each([
    "https://example.com/path?q=1",
    "http://93.184.215.14/",
    "https://[2606:4700::6810:84e5]/",
    "https://sub.example.co.uk:443/",
  ])("allows %s", (url) => {
    expect(check(url)).not.toThrow();
  });

  it.each([
    "http://localhost/",
    "http://foo.localhost/",
    "http://printer.local/",
    "http://db.internal/",
    "http://intranet/",
    "http://127.0.0.1/",
    "http://0x7f.1/",
    "http://2130706433/",
    "http://10.1.2.3/",
    "http://172.16.0.1/",
    "http://172.31.255.255/",
    "http://192.168.1.1/",
    "http://169.254.169.254/latest/meta-data/",
    "http://100.64.0.1/",
    "http://0.0.0.0/",
    "http://224.0.0.1/",
    "http://255.255.255.255/",
    "http://[::1]/",
    "http://[::ffff:127.0.0.1]/",
    "http://[fc00::1]/",
    "http://[fe80::1]/",
    "http://[2001:db8::1]/",
    "http://[2002:7f00:1::]/",
    "https://example.com:8443/",
    "http://user:pass@example.com/",
    "ftp://example.com/",
    "https://tools.jaze.top/api/tools/http-header-checker",
  ])("blocks %s", (url) => {
    expect(check(url)).toThrow(expect.objectContaining({ code: "blocked_url", field: "url" }));
  });

  it("allows public addresses next to private ranges", () => {
    expect(check("http://172.32.0.1/")).not.toThrow();
    expect(check("http://11.0.0.1/")).not.toThrow();
  });
});
