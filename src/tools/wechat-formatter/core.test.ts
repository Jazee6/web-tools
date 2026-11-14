import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { examplePatternRegex, isExamplePattern } from "../example-output";
import { formatWechat } from "./core";
import tool from "./tool";

const format = async (markdown: string, accent: "neutral" | "blue" = "neutral") =>
  (await formatWechat({ markdown, accent })).html;

describe("formatWechat", () => {
  // Worker Tool 的契约测试在浏览器里跑，这里先在 Node 里核对示例，改样式时反馈更快
  it.each(tool.examples.map((example, index) => [index, example] as const))(
    "matches example %i",
    async (_, example) => {
      const { html } = await formatWechat(v.parse(tool.input, example.input));
      const expected = example.output.html;
      expect(isExamplePattern(expected) && examplePatternRegex(expected).test(html)).toBe(true);
    },
  );

  it("inlines every style and leaves no class or style element", async () => {
    const html = await format("# Title\n\nText with `code`.\n\n> Quote\n\n- item\n\n---");
    expect(html).not.toMatch(/class=|<style/);
    for (const [, tagName] of html.matchAll(/<([a-z0-9]+)[\s>]/g)) {
      if (tagName === "br") continue;
      expect(html).toMatch(new RegExp(`<${tagName} [^>]*style="`));
    }
  });

  it("keeps font names inside the style attribute", async () => {
    const html = await format("Text");
    expect(html).toMatch(
      /^<section style="font-family:[^"]*'PingFang SC'[^"]*;font-size:16px;line-height:1\.75;/,
    );
  });

  it("drops the top margin of the first block and tightens the block after a heading", async () => {
    const html = await format("Intro\n\n## Heading\n\nAfter");
    expect(html).toContain('<p style="margin:0 0 0 0">Intro</p>');
    expect(html).toContain('<p style="margin:16px 0 0 0">After</p>');
  });

  it("escapes raw HTML instead of rendering it", async () => {
    const html = await format('<script>alert(1)</script>\n\nInline <img src=x onerror="alert(1)">');
    expect(html).not.toMatch(/<script|<img src=x/);
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  });

  it("turns external links into numbered references and keeps WeChat links", async () => {
    const html = await format(
      "[A](https://a.example) [B](https://b.example) [A again](https://a.example) [WeChat](https://mp.weixin.qq.com/s/x)",
      "blue",
    );
    expect(html).not.toContain('href="https://a.example');
    expect(html.match(/>\[1\]</g)).toHaveLength(3);
    expect(html).toContain(">[2]<");
    expect(html).not.toContain(">[3]<");
    expect(html).toContain("A: https://a.example/</p>");
    expect(html).toContain("B: https://b.example/</p>");
    expect(html).toContain(
      '<a href="https://mp.weixin.qq.com/s/x" style="color:#155dfc;font-weight:500;text-decoration:underline">WeChat</a>',
    );
  });

  it("does not repeat a link's text when it is the URL itself", async () => {
    const html = await format("See https://a.example/docs");
    expect(html).toContain("</span> https://a.example/docs</p>");
  });

  it("keeps only the text of links and images that are not http(s)", async () => {
    const html = await format(
      "[x](javascript:alert(1)) [y](#anchor) ![z](data:image/png;base64,AA)",
    );
    expect(html).not.toMatch(/javascript:|href=|<img|<sup/);
    expect(html).toContain(">x y z</p>");
  });

  it("shows the alt text once for a lone image that is not http(s)", async () => {
    const html = await format("![A cat](file:///cat.png)");
    expect(html).toMatch(/<p style="margin:0 0 0 0">A cat<\/p><\/section>$/);
  });

  it("captions an image that stands alone", async () => {
    const html = await format('![A cat](https://img.example/cat.png "title")');
    expect(html).toMatch(
      /^<section[^>]*><figure style="margin:0 0 0 0"><img src="https:\/\/img\.example\/cat\.png" alt="A cat" style="display:block;/,
    );
    expect(html).toContain(">A cat</figcaption>");
  });

  it("highlights code with a known language and preserves whitespace", async () => {
    const html = await format("```js\nif (a) {\n  return 1;\n}\n```");
    expect(html).toMatch(/<span style="color:#[0-9A-Fa-f]{6}">if<\/span>/);
    expect(html).toContain("<br>");
    expect(html).toContain("&nbsp;&nbsp;");
    expect(html).not.toContain("\n");
  });

  it("prints code with an unknown or missing language as plain text", async () => {
    const html = await format("```nope\na < b\n  c\n```\n\n```\nplain\n```");
    expect(html).not.toContain("<span");
    expect(html).toContain("a&nbsp;&lt;&nbsp;b<br>&nbsp;&nbsp;c");
    expect(html).toContain(">plain</code>");
  });

  it("shows task list items with check marks instead of inputs", async () => {
    const html = await format("- [x] done\n- [ ] todo");
    expect(html).not.toContain("<input");
    expect(html).toContain("☑ done");
    expect(html).toContain("☐ todo");
    expect(html).toContain("list-style-type:none");
  });

  it("nests lists with their own markers", async () => {
    const html = await format("- a\n  - b\n    - c\n\n3. three");
    expect(html).toContain("list-style-type:disc");
    expect(html).toContain("list-style-type:circle");
    expect(html).toContain("list-style-type:square");
    expect(html).toContain('<ol start="3" style=');
  });

  it("wraps tables so they can scroll and keeps column alignment", async () => {
    const html = await format("| a | b |\n|:-:|--:|\n| 1 | 2 |");
    expect(html).toMatch(/<section style="[^"]*overflow-x:auto"><table /);
    expect(html).toContain("text-align:center");
    expect(html).toContain("text-align:right");
  });

  it("uses the accent for the heading 2 bar, quotes and inline code", async () => {
    const html = await format("## H\n\n> q\n\n`c`", "blue");
    expect(html).toContain("border-left:3px solid #155dfc");
    expect(html).toContain("border-left:2px solid #155dfc");
    expect(html).toMatch(/<code style="[^"]*color:#155dfc/);
  });
});
