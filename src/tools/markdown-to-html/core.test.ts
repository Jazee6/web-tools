import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { toExampleShape } from "../example-output";
import { createSlugger, markdownToHtml, type MarkdownToHtmlInput } from "./core";
import tool from "./tool";

const run = async (markdown: string, options: Partial<MarkdownToHtmlInput> = {}) =>
  (
    await markdownToHtml({
      markdown,
      headingIds: true,
      document: false,
      highlight: false,
      theme: "github-light",
      ...options,
    })
  ).html;

describe("createSlugger", () => {
  it.each([
    ["Getting Started", "getting-started"],
    ["  What's new in v2.0?  ", "whats-new-in-v20"],
    ["中文 标题！", "中文-标题"],
    ["🚀 Launch", "-launch"],
    ["snake_case and kebab-case", "snake_case-and-kebab-case"],
    ["Ünïcödé", "ünïcödé"],
    ["Hello <em>World</em>", "hello-world"],
    ["A &amp; B", "a--b"],
    ["❤️ Love", "-love"],
    ["Step 1️⃣", "step-1"],
  ])("%j → %s", (text, slug) => {
    expect(createSlugger()(text)).toBe(slug);
  });

  it("numbers repeats and avoids existing suffixes", () => {
    const slug = createSlugger();
    expect(["a", "a", "a-1", "a"].map(slug)).toEqual(["a", "a-1", "a-1-1", "a-2"]);
  });
});

describe("markdownToHtml", () => {
  it("slugs the plain text of a heading, not its Markdown", async () => {
    expect(await run("## Use `npm` and **bun**")).toBe(
      '<h2 id="use-npm-and-bun">Use <code>npm</code> and <strong>bun</strong></h2>\n',
    );
  });

  it("leaves the id out when nothing is left of the heading", async () => {
    expect(await run("# 😀\n\n# 🎉")).toBe("<h1>😀</h1>\n<h1>🎉</h1>\n");
  });

  it("leaves ids out when headingIds is off", async () => {
    expect(await run("# A", { headingIds: false })).toBe("<h1>A</h1>\n");
  });

  it("keeps raw HTML", async () => {
    expect(await run('<div align="center"><img src="a.png" width="80"></div>')).toBe(
      '<div align="center"><img src="a.png" width="80"></div>',
    );
  });

  it("outputs plain code blocks unless highlight is on", async () => {
    expect(await run("```js\nconst a = 1;\n```")).toBe(
      '<pre><code class="language-js">const a = 1;\n</code></pre>\n',
    );
  });

  it("highlights with the chosen theme and escapes code", async () => {
    const html = await run("```html\n<b>&</b>\n```", { highlight: true, theme: "github-dark" });
    expect(html).toMatch(
      /^<pre style="background-color:#24292e;color:#e1e4e8"><code class="language-html">/,
    );
    expect(html).toContain("&lt;");
    expect(html).toContain("&amp;");
    expect(html).not.toContain("<b>");
  });

  it("leaves unknown languages unhighlighted", async () => {
    expect(await run("```nope\nx\n```", { highlight: true })).toBe(
      '<pre><code class="language-nope">x\n</code></pre>\n',
    );
  });

  it("wraps a document titled by the first heading 1", async () => {
    const html = await run("## Intro\n\n# Main & more\n\n# Second", { document: true });
    expect(html).toMatch(/^<!doctype html>\n/);
    expect(html).toContain("<title>Main &amp; more</title>");
    expect(html).toMatch(/<body>\n<h2 id="intro">Intro<\/h2>\n[\s\S]*<\/body>\n<\/html>\n$/);
  });

  it("skips empty heading 1s for the title", async () => {
    expect(await run("#\n\n# Real", { document: true })).toContain("<title>Real</title>");
  });

  it("titles a document without heading 1 as Document", async () => {
    expect(await run("text", { document: true })).toContain("<title>Document</title>");
  });

  // Worker Tool 的 examples 由 contract.browser.test.ts 在浏览器里跑，这里在 Node 里也核对一遍
  it.each(tool.examples.map((example, index) => [index, example] as const))(
    "example %i",
    async (_, example) => {
      const input = v.parse(tool.input, example.input);
      const output = await markdownToHtml(input);
      expect(toExampleShape(output, example.output)).toEqual(example.output);
    },
  );
});
