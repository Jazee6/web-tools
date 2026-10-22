import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

const code = v.metadata<string, FieldMetadata>({ widget: "code" });

export default defineTool({
  id: "json-formatter",
  category: "developer",
  input: v.object({
    json: v.pipe(v.string(), v.nonEmpty(), v.description("The JSON text to format"), code),
    indent: v.optional(
      v.pipe(
        v.picklist(["2", "4", "tab", "minify"]),
        v.description("Indentation: 2 or 4 spaces, tabs, or minify to a single line"),
      ),
      "2",
    ),
    sortKeys: v.optional(
      v.pipe(v.boolean(), v.description("Sort object keys alphabetically, recursively")),
      false,
    ),
  }),
  output: v.object({
    formatted: v.pipe(v.string(), v.description("The formatted JSON text"), code),
  }),
  examples: [
    {
      input: { json: '{"name":"Ada","langs":["en","fr"],"active":true}' },
      output: {
        formatted:
          '{\n  "name": "Ada",\n  "langs": [\n    "en",\n    "fr"\n  ],\n  "active": true\n}',
      },
    },
    {
      input: { json: '{ "b": 1, "a": { "d": null, "c": 2 } }', indent: "minify", sortKeys: true },
      output: { formatted: '{"a":{"c":2,"d":null},"b":1}' },
    },
  ],
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: true,
    description:
      "Validate a JSON document and pretty-print it with 2 or 4 spaces or tabs, or minify it to one line, optionally sorting object keys recursively. Fails with error code invalid_json when the input is not valid JSON.",
  },
  run: () => import("./core").then((m) => m.formatJson),
});
