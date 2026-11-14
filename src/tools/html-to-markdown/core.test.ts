import { describe, expect, it } from "vitest";

import { ToolError } from "@/lib/tool-contract/define-tool";

import { htmlToMarkdown } from "./core";

const run = (html: string) => htmlToMarkdown({ html }).markdown;

describe("htmlToMarkdown", () => {
  it("uses ATX headings, - bullets, * emphasis and --- rules", () => {
    expect(run("<h1>A</h1><p><em>b</em></p><hr><ul><li>c</li></ul>")).toBe(
      "# A\n\n*b*\n\n---\n\n- c",
    );
  });

  it("indents nested lists by the marker width and keeps ordered list numbers", () => {
    expect(
      run(
        '<ul><li>one<ul><li>nested</li></ul></li></ul><ol start="3"><li>three</li><li>four</li></ol>',
      ),
    ).toBe("- one\n  - nested\n\n3. three\n4. four");
  });

  it("keeps a list tight when items wrap their text in paragraphs (Google Docs)", () => {
    expect(run("<ul><li><p>one</p></li><li><p>two</p><p>more</p></li></ul>")).toBe(
      "- one\n- two\n\n  more",
    );
  });

  it("turns checkboxes in list items into task list items", () => {
    expect(
      run(
        '<ul><li><input type="checkbox" checked disabled> done</li><li><input type="checkbox"> todo</li></ul>',
      ),
    ).toBe("- [x] done\n- [ ] todo");
  });

  it("fences <pre> without <code> and keeps its whitespace", () => {
    expect(run("<pre>a\n  b</pre>")).toBe("```\na\n  b\n```");
  });

  it("uses a longer fence when the code contains ```", () => {
    expect(run("<pre>```\nx\n```</pre>")).toBe("````\n```\nx\n```\n````");
  });

  // Word 复制到剪贴板的 HTML：带条件注释、mso 样式和 <o:p>，表格没有 <th>
  it("converts a table pasted from Word", () => {
    const html =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="utf-8"><style>p.MsoNormal{margin:0}</style></head><body lang=EN-US><!--StartFragment--><table class=MsoTableGrid border=1 style="border-collapse:collapse;mso-yfti-tbllook:1184"><tr style="mso-yfti-irow:0"><td width=200 style="width:150pt"><p class=MsoNormal>Name<o:p></o:p></p></td><td><p class=MsoNormal>Role<o:p></o:p></p></td></tr><tr><td><p class=MsoNormal>Ada<o:p></o:p></p></td><td><p class=MsoNormal>Engineer<o:p></o:p></p><p class=MsoNormal>Lead<o:p></o:p></p></td></tr></table><!--EndFragment--></body></html>';
    expect(run(html)).toBe("| Name | Role |\n| --- | --- |\n| Ada | Engineer<br>Lead |");
  });

  it("reads column alignment and fills colspan", () => {
    expect(
      run(
        '<table><thead><tr><th align="left">a</th><th style="text-align: right">b</th></tr></thead><tbody><tr><td colspan="2">wide</td></tr></tbody></table>',
      ),
    ).toBe("| a | b |\n| :-- | --: |\n| wide | |");
  });

  it("drops scripts, styles, iframes and the page head", () => {
    expect(
      run(
        "<head><title>Page</title></head><script>x()</script><style>p{}</style><noscript>Enable JS</noscript><iframe src=a></iframe><p>Body</p>",
      ),
    ).toBe("Body");
  });

  it("fails with empty when nothing is left", () => {
    expect(() => run("<script>x()</script>")).toThrow(ToolError);
    expect(() => run("<style>p{}</style>")).toThrow("empty");
  });
});
