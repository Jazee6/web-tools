import * as v from "valibot";

import { highlightThemes } from "@/lib/markdown/highlight-themes";
import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

export default defineTool({
  id: "markdown-to-html",
  category: "text",
  alsoListedIn: ["developer"],
  input: v.object({
    markdown: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.maxLength(200_000),
      v.description(
        "The Markdown (CommonMark with GitHub tables, task lists and strikethrough), up to 200,000 characters",
      ),
      v.metadata<string, FieldMetadata>({ widget: "code", draft: true }),
    ),
    headingIds: v.optional(
      v.pipe(
        v.boolean(),
        v.description(
          'Give each heading a GitHub-style id for anchor links, such as id="getting-started"; repeated headings get -1, -2',
        ),
      ),
      true,
    ),
    document: v.optional(
      v.pipe(
        v.boolean(),
        v.description(
          "Return a complete HTML page with <!doctype>, <head>, a title from the first heading 1 and a readable default stylesheet, instead of a fragment",
        ),
      ),
      false,
    ),
    highlight: v.optional(
      v.pipe(
        v.boolean(),
        v.description(
          "Syntax highlight code blocks that name a language, with the colors written as inline styles",
        ),
      ),
      false,
    ),
    theme: v.optional(
      v.pipe(
        v.picklist(highlightThemes),
        v.description("Color theme for highlighted code blocks; only used when highlight is on"),
      ),
      "github-light",
    ),
  }),
  output: v.object({
    html: v.pipe(
      v.string(),
      v.description("The HTML fragment, or the complete page when document is on"),
      v.metadata<string, FieldMetadata>({ widget: "html", preview: "wide", source: true }),
    ),
  }),
  examples: [
    {
      input: {
        markdown:
          "## Getting started\n\nInstall it with **one** command:\n\n- [x] Download\n- [ ] Run",
      },
      output: {
        html: '<h2 id="getting-started">Getting started</h2>\n<p>Install it with <strong>one</strong> command:</p>\n<ul>\n<li><input checked="" disabled="" type="checkbox"> Download</li>\n<li><input disabled="" type="checkbox"> Run</li>\n</ul>\n',
      },
    },
    {
      input: {
        markdown:
          "| Plan | Price |\n| --- | ---: |\n| Pro | $12 |\n\n<details><summary>More</summary>Hidden</details>",
        headingIds: false,
      },
      output: {
        html: '<table>\n<thead>\n<tr>\n<th>Plan</th>\n<th align="right">Price</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Pro</td>\n<td align="right">$12</td>\n</tr>\n</tbody></table>\n<details><summary>More</summary>Hidden</details>',
      },
    },
    {
      input: { markdown: "# Notes\n\n```js\nconst a = 1;\n```", document: true, highlight: true },
      output: {
        html: {
          pattern:
            '<!doctype html>\\n<html>\\n<head>\\n[\\s\\S]*<title>Notes</title>\\n<style>\\n[^<]*</style>\\n</head>\\n<body>\\n<h1 id="notes">Notes</h1>\\n<pre style="background-color:#fff;color:#24292e"><code class="language-js"><span style="color:#[0-9A-F]{6}">const</span>.*</code></pre>\\n</body>\\n</html>\\n',
        },
      },
    },
  ],
  // shiki 的语法文件在 Web Worker 里按需加载，core 不进服务端的模块图，不开放远程 MCP（ADR-0024）
  runtime: { where: "client", worker: true },
  form: { live: true, split: true },
  agent: {
    webmcp: true,
    remote: false,
    description:
      "Convert Markdown (CommonMark with GitHub tables, task lists and strikethrough) to HTML. Raw HTML in the Markdown is kept as is. Headings get GitHub-style ids by default. Returns a fragment, or with document a complete page with a title and a readable default stylesheet. With highlight, code blocks that name a language are syntax highlighted using inline color styles in the chosen theme. Never fails for non-empty Markdown.",
  },
});
