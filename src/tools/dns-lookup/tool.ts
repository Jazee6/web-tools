import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

import { recordTypes, resolvers } from "./record-types";

const line = v.metadata<string, FieldMetadata>({ widget: "line" });

export default defineTool({
  id: "dns-lookup",
  category: "developer",
  input: v.object({
    domain: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.maxLength(2048),
      v.description(
        "The domain name to look up, such as example.com. A full URL also works: the scheme, path and port are removed, and an internationalized name is converted to punycode",
      ),
      line,
    ),
    type: v.optional(
      v.pipe(v.picklist(recordTypes), v.description("The DNS record type to look up")),
      "A",
    ),
    resolver: v.optional(
      v.pipe(
        v.picklist(resolvers),
        v.description(
          "The public DNS-over-HTTPS resolver that answers: cloudflare (1.1.1.1) or google (Google Public DNS)",
        ),
      ),
      "cloudflare",
    ),
  }),
  output: v.object({
    status: v.pipe(
      v.string(),
      v.description(
        "The DNS response code: NOERROR (also when the name has no records of this type), NXDOMAIN (the name does not exist), SERVFAIL, REFUSED, FORMERR or NOTIMP",
      ),
      line,
    ),
    records: v.pipe(
      v.array(v.object({ name: v.string(), type: v.string(), ttl: v.number(), data: v.string() })),
      v.description(
        "The answer records in the order the resolver returned them: owner name, type, TTL in seconds and data. A CNAME chain lists the CNAME records before the final records. TXT data is the joined text without quotes; the trailing dot of CNAME, NS and MX targets is removed",
      ),
    ),
  }),
  examples: [
    {
      input: { domain: "example.com" },
      output: {
        status: "NOERROR",
        records: [
          { name: "example.com", type: "A", ttl: 167, data: "104.20.23.154" },
          { name: "example.com", type: "A", ttl: 167, data: "172.66.147.243" },
        ],
      },
    },
    {
      input: { domain: "https://google.com/search?q=mail", type: "MX", resolver: "google" },
      output: {
        status: "NOERROR",
        records: [{ name: "google.com", type: "MX", ttl: 99, data: "10 smtp.google.com" }],
      },
    },
    {
      input: { domain: "example.com", type: "TXT" },
      output: {
        status: "NOERROR",
        records: [
          { name: "example.com", type: "TXT", ttl: 300, data: "v=spf1 -all" },
          { name: "example.com", type: "TXT", ttl: 300, data: "first part, second part" },
        ],
      },
    },
    {
      input: { domain: "no-such-host.example.com" },
      output: { status: "NXDOMAIN", records: [] },
    },
  ],
  // 浏览器直接向公共 DoH 服务查询（ADR-0002），域名发给访客选择的解析器，不经过我们的服务器。
  // 不开放远程 MCP：由 Worker 代查就成了替匿名调用者查询第三方解析器的代理（ADR-0015）
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: false,
    description:
      "Look up DNS records of a domain through a public DNS-over-HTTPS resolver (cloudflare or google), queried directly from the browser. Record types: A, AAAA, CNAME, MX, TXT, NS, SOA, CAA. Returns the DNS response code (NOERROR, NXDOMAIN, SERVFAIL, REFUSED...) and the answer records with name, type, TTL and data; a domain with no records of the type gives NOERROR and an empty list. Fails with error code invalid_domain when the input is not a valid domain name, and lookup_failed when the resolver cannot be reached or answers with an error.",
  },
  run: () => import("./core").then((m) => m.lookupDns),
});
