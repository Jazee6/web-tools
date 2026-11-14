import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

import { accentIds } from "./theme";

export default defineTool({
  id: "wechat-formatter",
  category: "text",
  input: v.object({
    markdown: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.maxLength(200_000),
      v.description(
        "The article in Markdown (CommonMark with GitHub tables, task lists and strikethrough), up to 200,000 characters",
      ),
      v.metadata<string, FieldMetadata>({ widget: "code", draft: true }),
    ),
    accent: v.optional(
      v.pipe(
        v.picklist(accentIds),
        v.description(
          "Accent color for the heading 2 bar, blockquote border, WeChat links, reference numbers and inline code; neutral is near-black",
        ),
      ),
      "neutral",
    ),
  }),
  output: v.object({
    html: v.pipe(
      v.string(),
      v.description(
        "The article as HTML with every style inline, ready to paste into the WeChat Official Account editor as rich text",
      ),
      v.metadata<string, FieldMetadata>({ widget: "html" }),
    ),
  }),
  // 内联样式很长，示例只核对元素结构和关键样式
  examples: [
    {
      input: { markdown: "## Why it works\n\nShort paragraphs and **one idea** per section." },
      output: {
        html: {
          pattern:
            '<section style="[^"]*font-size:16px;line-height:1\\.75;[^"]*"><h2 style="[^"]*border-left:3px solid #171717">Why it works</h2><p style="margin:16px 0 0 0">Short paragraphs and <strong style="font-weight:600">one idea</strong> per section\\.</p></section>',
        },
      },
    },
    {
      input: {
        markdown:
          "Read the [docs](https://example.com/docs) or the [previous post](https://mp.weixin.qq.com/s/abc).",
        accent: "blue",
      },
      output: {
        html: {
          pattern:
            '<section [^>]*><p [^>]*>Read the docs<sup [^>]*>\\[1\\]</sup> or the <a href="https://mp\\.weixin\\.qq\\.com/s/abc" style="color:#155dfc;[^"]*">previous post</a>\\.</p><section [^>]*><p [^>]*><span style="color:#155dfc">\\[1\\]</span> docs: https://example\\.com/docs</p></section></section>',
        },
      },
    },
    {
      input: { markdown: "```js\nconst a = 1;\n```" },
      output: {
        html: {
          pattern:
            '<section [^>]*><pre [^>]*><code [^>]*><span style="color:#[0-9A-F]{6}">const</span>.*<span style="color:#[0-9A-F]{6}">1</span>.*</code></pre></section>',
        },
      },
    },
  ],
  // shiki 的语法文件有 10 MB，在 Web Worker 里运行，core 不进服务端的模块图；
  // 冷启动编译语法会超出 Workers Free 的 CPU 时间，所以不开放远程 MCP（ADR-0024）
  runtime: { where: "client", worker: true },
  form: { live: true, split: true },
  agent: {
    webmcp: true,
    remote: false,
    description:
      "Turn a Markdown article into HTML for a WeChat Official Account post. Every style is inline (the WeChat editor strips <style> and classes), in a neutral shadcn-like theme at 16px with line height 1.75 and an optional accent color. Code blocks are syntax highlighted when the language is given. Links to other sites, which WeChat does not allow in the body, become numbered references listed at the end; links to mp.weixin.qq.com stay clickable. Images must be http(s) URLs; a paragraph holding only an image gets its alt text as a caption. Raw HTML in the Markdown is shown as text. Never fails for non-empty Markdown.",
  },
});
