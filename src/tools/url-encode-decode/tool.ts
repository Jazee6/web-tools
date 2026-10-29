import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

const code = v.metadata<string, FieldMetadata>({ widget: "code" });

export default defineTool({
  id: "url-encode-decode",
  category: "developer",
  input: v.object({
    text: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.description("The text to percent-encode, or the percent-encoded text to decode"),
      code,
    ),
    mode: v.optional(
      v.pipe(v.picklist(["encode", "decode"]), v.description("Encode text or decode it")),
      "encode",
    ),
    scope: v.optional(
      v.pipe(
        v.picklist(["component", "url", "form"]),
        v.description(
          "component: a URL part such as a query value (encodeURIComponent); url: a whole URL, keeping : / ? # & = intact (encodeURI); form: application/x-www-form-urlencoded, where spaces become +",
        ),
      ),
      "component",
    ),
  }),
  output: v.object({
    result: v.pipe(v.string(), v.description("The encoded or decoded text"), code),
  }),
  examples: [
    {
      input: { text: "Hello world & café" },
      output: { result: "Hello%20world%20%26%20caf%C3%A9" },
    },
    {
      input: { text: "https://example.com/a b?q=café", scope: "url" },
      output: { result: "https://example.com/a%20b?q=caf%C3%A9" },
    },
    {
      input: { text: "a b&c", scope: "form" },
      output: { result: "a+b%26c" },
    },
    {
      input: { text: "caf%C3%A9+%E4%B8%96%E7%95%8C", mode: "decode", scope: "form" },
      output: { result: "café 世界" },
    },
  ],
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: true,
    description:
      "Percent-encode text for use in a URL, or decode percent-encoded text. The scope is component (encodeURIComponent, for a query value or path segment), url (encodeURI, for a whole URL) or form (application/x-www-form-urlencoded, where spaces become +). Fails with error code invalid_encoding when decoding input with a malformed % sequence or bytes that are not valid UTF-8.",
  },
  run: () => import("./core").then((m) => m.convertUrl),
});
