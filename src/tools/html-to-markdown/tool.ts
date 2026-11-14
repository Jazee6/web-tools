import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

export default defineTool({
  id: "html-to-markdown",
  category: "text",
  alsoListedIn: ["developer"],
  input: v.object({
    html: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.maxLength(1_000_000),
      v.description("The HTML to convert, a fragment or a whole page, up to 1,000,000 characters"),
      v.metadata<string, FieldMetadata>({ widget: "code", paste: "html" }),
    ),
  }),
  output: v.object({
    markdown: v.pipe(
      v.string(),
      v.description("The content as GitHub Flavored Markdown"),
      v.metadata<string, FieldMetadata>({ widget: "code" }),
    ),
  }),
  examples: [
    {
      input: {
        html: '<h2>Release notes</h2><p>Fixed <strong>two</strong> bugs, see <a href="https://example.com/issues">the issues</a>.</p><ul><li><del>Old API</del></li><li>New API</li></ul>',
      },
      output: {
        markdown:
          "## Release notes\n\nFixed **two** bugs, see [the issues](https://example.com/issues).\n\n- ~~Old API~~\n- New API",
      },
    },
    {
      input: {
        html: "<table><tr><td>Plan</td><td>Price</td></tr><tr><td>Pro | Team</td><td>$12</td></tr></table>",
      },
      output: { markdown: "| Plan | Price |\n| --- | --- |\n| Pro \\| Team | $12 |" },
    },
    {
      input: {
        html: '<pre><code class="language-python">print("hi")\n</code></pre><script>track()</script>',
      },
      output: { markdown: '```python\nprint("hi")\n```' },
    },
  ],
  // turndown 在浏览器里依赖 DOMParser，Web Worker 里没有，所以在主线程运行；
  // 服务端只能用 domino 解析，和页面结果可能不同，不开放远程 MCP（ADR-0026）
  runtime: { where: "client" },
  form: { live: true, split: true },
  agent: {
    webmcp: true,
    remote: false,
    description:
      "Convert HTML (a fragment or a whole page) to GitHub Flavored Markdown with # headings, - bullets, ``` fenced code blocks and inline links. Tables become Markdown tables with the first row as the header, even without <th>; | in a cell becomes \\| and line breaks in a cell become <br>. <del>, <s> and checkboxes in list items become ~~strikethrough~~ and task lists. <script>, <style>, <noscript>, <iframe>, <template> and <head> are dropped; everything else, navigation and footers included, is converted. Fails with error code empty when nothing is left to convert.",
  },
  run: () => import("./core").then((m) => m.htmlToMarkdown),
});
