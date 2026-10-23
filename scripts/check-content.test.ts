import * as v from "valibot";
import { describe, expect, it } from "vitest";

import type { AnyTool } from "../src/lib/tool-contract/define-tool";
import type { AnyVariant } from "../src/lib/tool-contract/define-variant";
import { checkContent } from "./check-content";
import type { ContentFile } from "./lib/content";

const tool = {
  id: "demo",
  category: "developer",
  input: v.object({ text: v.string(), mode: v.optional(v.picklist(["a", "b"]), "a") }),
  output: v.object({ result: v.string() }),
} as unknown as AnyTool;

const toolFile = (overrides: Partial<ContentFile> = {}): ContentFile => ({
  path: "src/tools/demo/content/en.md",
  owner: "demo",
  locale: "en",
  data: {
    review: "draft",
    name: "Demo",
    fields: { text: { label: "Text" }, mode: { label: "Mode", options: { a: "A", b: "B" } } },
    output: { result: { label: "Result" } },
  },
  body: "## Privacy\n\nSee [the category](/developer).\n",
  ...overrides,
});

const categoryFile: ContentFile = {
  path: "src/categories/developer/en.md",
  owner: "developer",
  locale: "en",
  data: { review: "reviewed", name: "Developer" },
  body: "",
};

const run = (toolContent: ContentFile[]) =>
  checkContent({
    tools: [tool],
    categories: ["developer"],
    toolContent,
    categoryContent: [categoryFile],
  });

describe("checkContent", () => {
  it("passes aligned content", () => {
    expect(run([toolFile()]).errors).toEqual([]);
  });

  it("requires en content", () => {
    expect(
      run([toolFile({ locale: "zh", path: "src/tools/demo/content/zh.md" })]).errors,
    ).toContain("Tool demo 缺少 en 内容");
  });

  it("requires field labels and select options to match the contract", () => {
    const errors = run([
      toolFile({
        data: {
          review: "draft",
          name: "Demo",
          fields: { text: { label: "Text" }, mode: { label: "Mode", options: { a: "A" } } },
          output: { result: { label: "Result" } },
        },
      }),
    ]).errors;
    expect(errors.some((error) => error.includes("fields.mode.options"))).toBe(true);
  });

  it("only requires labels for options of a language field that are not language codes", () => {
    const languageTool = {
      ...tool,
      input: v.object({
        language: v.pipe(v.picklist(["auto", "en", "de"]), v.metadata({ languageNames: true })),
      }),
    } as unknown as AnyTool;
    const check = (options: Record<string, string>) =>
      checkContent({
        tools: [languageTool],
        categories: ["developer"],
        toolContent: [
          toolFile({
            data: {
              review: "draft",
              name: "Demo",
              fields: { language: { label: "Language", options } },
              output: { result: { label: "Result" } },
            },
          }),
        ],
        categoryContent: [categoryFile],
      }).errors;
    expect(check({ auto: "Detect" })).toEqual([]);
    expect(check({ auto: "Detect", en: "English" })).toEqual([]);
    expect(check({}).some((error) => error.includes("auto"))).toBe(true);
    expect(check({ auto: "Detect", xx: "?" })).toHaveLength(1);
  });

  it("requires column labels for table outputs", () => {
    const tableTool = {
      ...tool,
      output: v.object({ rows: v.array(v.object({ name: v.string(), value: v.string() })) }),
    } as unknown as AnyTool;
    const output = (columns: Record<string, string>) =>
      checkContent({
        tools: [tableTool],
        categories: ["developer"],
        toolContent: [
          toolFile({
            data: { ...toolFile().data, output: { rows: { label: "Rows", columns } } },
          }),
        ],
        categoryContent: [categoryFile],
      }).errors;
    expect(output({ name: "Name", value: "Value" })).toEqual([]);
    expect(output({ name: "Name" }).some((error) => error.includes("output.rows.columns"))).toBe(
      true,
    );
  });

  it("rejects broken internal links and bodies without sections", () => {
    const errors = run([toolFile({ body: "See [missing](/nope)." })]).errors;
    expect(errors.some((error) => error.includes("/nope"))).toBe(true);
    expect(errors.some((error) => error.includes('"## "'))).toBe(true);
  });

  it("only allows .md links to indexable pages", () => {
    // Category 是 Reviewed，有 .md 副本；Tool 还是 Draft，没有
    const body = "## Links\n\n[ok](/developer.md) [draft](/demo.md)\n";
    const errors = run([toolFile({ body })]).errors;
    expect(errors).toEqual([
      "src/tools/demo/content/en.md：内链 /demo.md 指向的页面不可索引，没有 .md 副本",
    ]);
  });

  it("reports coverage per locale", () => {
    const { coverage } = run([toolFile()]);
    expect(coverage.find((row) => row.locale === "en")).toEqual({
      locale: "en",
      reviewed: 1,
      draft: 1,
      missing: 0,
    });
    expect(coverage.find((row) => row.locale === "zh")?.missing).toBe(2);
  });
});

const variantFile = (table: unknown, body = "## Notes\n\nUppercase only.\n"): ContentFile => ({
  path: "src/tools/demo/variants/upper/en.md",
  owner: "demo/upper",
  locale: "en",
  data: {
    review: "draft",
    name: "Upper",
    answer: "Turn text into capital letters with mode B preselected.",
    steps: ["Paste", "Press"],
    faq: [{ q: "Which letters change?", a: "Every lowercase letter." }],
    table,
  },
  body,
});

describe("checkContent for Variants", () => {
  const variant = {
    id: "upper",
    tool: "demo",
    preset: { mode: "b" },
    table: { columns: ["mode", "result"], rows: [{ mode: "B", result: { term: "upper" } }] },
    demand: { query: "uppercase", source: "google-autocomplete", checkedAt: "2026-10-23" },
  } as unknown as AnyVariant;

  const runVariant = (file: ContentFile) =>
    checkContent({
      tools: [tool],
      categories: ["developer"],
      toolContent: [toolFile()],
      categoryContent: [categoryFile],
      variants: [variant],
      variantContent: [file],
    });

  it("passes when the table labels match variant.ts", () => {
    const table = { columns: { mode: "Mode", result: "Result" }, terms: { upper: "Uppercase" } };
    expect(runVariant(variantFile(table)).errors).toEqual([]);
  });

  it("requires labels for every column and every term used", () => {
    const errors = runVariant(variantFile({ columns: { mode: "Mode" }, terms: {} }, "")).errors;
    expect(errors).toEqual([
      "src/tools/demo/variants/upper/en.md：table.columns 必须与 variant.ts 的列一一对应（mode, result）",
      "src/tools/demo/variants/upper/en.md：table.terms 必须恰好覆盖表格用到的 upper",
      'src/tools/demo/variants/upper/en.md：正文至少需要一个 "## " 小节',
    ]);
  });

  it("requires en content for every Variant", () => {
    const errors = runVariant({ ...variantFile({}), locale: "zh" }).errors;
    expect(errors).toContain("Variant demo/upper 缺少 en 内容");
  });
});
