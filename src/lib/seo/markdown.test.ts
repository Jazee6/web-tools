import { describe, expect, it } from "vitest";

import {
  canonicalMarkdownRule,
  renderLlmsTxt,
  renderMarkdownTable,
  renderToolMarkdown,
} from "./markdown";

describe("renderToolMarkdown", () => {
  it("follows the answer-first skeleton", () => {
    const md = renderToolMarkdown({
      name: "JSON Formatter",
      answer: "Paste JSON and press Format.",
      url: "https://tools.jaze.top/json-formatter",
      updated: "2026-10-22",
      headings: { steps: "How to use", faq: "FAQ", related: "Related", updated: "Last updated" },
      steps: ["Paste", "Press"],
      body: "## Privacy\n\nLocal only.\n",
      faq: [{ q: "Is it free?", a: "Yes." }],
      related: [{ name: "Base64", path: "/base64.md", summary: "Encode" }],
    });
    expect(md.indexOf("# JSON Formatter")).toBe(0);
    expect(md).toContain("## How to use\n\n1. Paste\n2. Press");
    expect(md).toContain("## FAQ\n\n### Is it free?\n\nYes.");
    expect(md).toContain("- [Base64](/base64.md): Encode");
    expect(md.indexOf("## Privacy")).toBeLessThan(md.indexOf("## FAQ"));
  });
});

describe("renderLlmsTxt", () => {
  it("skips empty sections", () => {
    const txt = renderLlmsTxt({
      name: "Web Tools",
      description: "Tools",
      sections: [
        { name: "Developer", tools: [{ name: "JSON Formatter", path: "/json-formatter.md" }] },
        { name: "Image", tools: [] },
      ],
    });
    expect(txt).toBe(
      "# Web Tools\n\n> Tools\n\n## Developer\n\n- [JSON Formatter](/json-formatter.md)\n",
    );
  });
});

describe("canonicalMarkdownRule", () => {
  it("points every .md copy at its HTML page with one rule", () => {
    expect(canonicalMarkdownRule("https://tools.jaze.top")).toBe(
      '\n/*.md\n  Link: <https://tools.jaze.top/:splat>; rel="canonical"\n',
    );
  });
});

describe("renderMarkdownTable", () => {
  it("renders a captioned table and escapes pipes", () => {
    expect(
      renderMarkdownTable({
        caption: "Streams",
        header: ["Codec", "Result"],
        rows: [
          ["H.264", "Copied"],
          ["PCM", "AAC | Opus"],
        ],
      }),
    ).toBe(
      "## Streams\n\n| Codec | Result |\n| --- | --- |\n| H.264 | Copied |\n| PCM | AAC \\| Opus |",
    );
  });
});
