import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

const url = v.metadata<string, FieldMetadata>({ widget: "url" });

export default defineTool({
  id: "http-header-checker",
  category: "developer",
  input: v.object({
    url: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.maxLength(2048),
      v.description("The http:// or https:// URL to check; https:// is assumed when omitted"),
      url,
    ),
    followRedirects: v.optional(
      v.pipe(v.boolean(), v.description("Follow up to 5 redirects and report each hop")),
      true,
    ),
  }),
  output: v.object({
    status: v.pipe(v.number(), v.description("HTTP status code of the final response")),
    url: v.pipe(v.string(), v.description("URL of the final response"), url),
    headers: v.pipe(
      v.array(v.object({ name: v.string(), value: v.string() })),
      v.description("Response headers of the final response, names in lower case"),
    ),
    redirects: v.pipe(
      v.array(v.object({ status: v.number(), url: v.string() })),
      v.description("Redirect hops before the final response, in order"),
    ),
  }),
  examples: [
    {
      input: { url: "example.com" },
      output: {
        status: 200,
        url: "https://www.example.com/",
        headers: [
          { name: "cache-control", value: "max-age=3600" },
          { name: "content-type", value: "text/html; charset=utf-8" },
        ],
        redirects: [{ status: 301, url: "https://example.com/" }],
      },
    },
  ],
  // 浏览器读不到跨源响应头，必须由服务端请求（ADR-0002）。
  // 不开放远程 MCP：匿名调用没有 Turnstile，容易被当作代理反复请求第三方网站。
  runtime: { where: "server" },
  agent: {
    webmcp: true,
    remote: false,
    description:
      "Send a HEAD request to a public http(s) URL from the server and return the final status code, URL, response headers and redirect chain (up to 5 hops). Private, local and non-standard-port addresses are rejected with error code blocked_url.",
  },
  run: () => import("./core").then((m) => m.checkHeaders),
});
