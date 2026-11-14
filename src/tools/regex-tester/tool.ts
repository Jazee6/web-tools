import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

const line = v.metadata<string, FieldMetadata>({ widget: "line" });
const code = v.metadata<string, FieldMetadata>({ widget: "code" });

export default defineTool({
  id: "regex-tester",
  category: "developer",
  input: v.object({
    pattern: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.maxLength(1000),
      v.description("The JavaScript regular expression, without the surrounding slashes"),
      line,
    ),
    flags: v.optional(
      v.pipe(
        v.string(),
        v.description(
          "JavaScript regular expression flags, each at most once: d (indices), g (all matches), i (ignore case), m (multiline), s (dot matches line breaks), u or v (Unicode), y (sticky). Without g only the first match is returned",
        ),
        line,
      ),
      "g",
    ),
    text: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.description("The text to search, up to 100,000 characters"),
      code,
    ),
  }),
  output: v.object({
    count: v.pipe(v.number(), v.description("Number of matches found")),
    matches: v.pipe(
      v.array(v.object({ index: v.number(), match: v.string(), groups: v.string() })),
      v.description(
        "The first 200 matches in order: index is the 0-based position in the text (UTF-16 code units), match is the matched text, groups is the captured text as JSON (an array for numbered groups, an object for named groups, null for a group that did not take part), empty when the pattern has no groups",
      ),
    ),
  }),
  examples: [
    {
      input: {
        pattern: String.raw`(\d{4})-(\d{2})-(\d{2})`,
        text: "Released 2024-02-29, patched 2024-03-05.",
      },
      output: {
        count: 2,
        matches: [
          { index: 9, match: "2024-02-29", groups: '["2024","02","29"]' },
          { index: 29, match: "2024-03-05", groups: '["2024","03","05"]' },
        ],
      },
    },
    {
      input: {
        pattern: String.raw`(?<user>\w+)@(?<host>[\w.]+)`,
        flags: "gi",
        text: "Mail Ann@Example.com or bob@test.org",
      },
      output: {
        count: 2,
        matches: [
          { index: 5, match: "Ann@Example.com", groups: '{"user":"Ann","host":"Example.com"}' },
          { index: 24, match: "bob@test.org", groups: '{"user":"bob","host":"test.org"}' },
        ],
      },
    },
    {
      input: { pattern: "x(y)?", flags: "", text: "ax" },
      output: { count: 1, matches: [{ index: 1, match: "x", groups: "[null]" }] },
    },
    {
      input: { pattern: "z", text: "abc" },
      output: { count: 0, matches: [] },
    },
  ],
  // 在页面主线程运行：病态正则（嵌套量词）会卡住当前标签页，所以不开放远程 MCP，避免占用服务端 CPU（ADR-0021）
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: false,
    description:
      "Run a JavaScript regular expression against a text and list its matches. Flags default to g (all matches); without g only the first match is returned. Returns the total match count and the first 200 matches with their 0-based index, matched text and captured groups as JSON (an array, or an object for named groups; null for a group that did not participate). Fails with error code invalid_pattern when the pattern does not compile, invalid_flags for unknown or repeated flags, and text_too_long above 100,000 characters.",
  },
  run: () => import("./core").then((m) => m.testRegex),
});
