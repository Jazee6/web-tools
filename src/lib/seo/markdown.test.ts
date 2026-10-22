import { describe, expect, it } from "vitest";

import { renderLlmsTxt, renderToolMarkdown } from "./markdown";

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
      related: [{ name: "Base64", path: "/base64", summary: "Encode" }],
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
        { name: "Developer", tools: [{ name: "JSON Formatter", path: "/json-formatter" }] },
        { name: "Image", tools: [] },
      ],
    });
    expect(txt).toBe(
      "# Web Tools\n\n> Tools\n\n## Developer\n\n- [JSON Formatter](/json-formatter.md)\n",
    );
  });
});
