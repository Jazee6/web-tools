import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

const code = v.metadata<string, FieldMetadata>({ widget: "code" });

export default defineTool({
  id: "markdown-table-generator",
  category: "text",
  alsoListedIn: ["developer"],
  input: v.object({
    data: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.maxLength(200_000),
      v.description(
        "The table as CSV, TSV (cells copied from Excel or Google Sheets) or an existing Markdown table, up to 200,000 characters",
      ),
      code,
    ),
    from: v.optional(
      v.pipe(
        v.picklist(["auto", "csv", "tsv", "markdown"]),
        v.description(
          "Input format; auto treats lines starting with | or followed by a --- row as Markdown, a first line with tabs as TSV, and anything else as CSV",
        ),
      ),
      "auto",
    ),
    header: v.optional(
      v.pipe(
        v.boolean(),
        v.description(
          "Use the first row as the header; when off, an empty header row is added because Markdown tables require one",
        ),
      ),
      true,
    ),
    align: v.optional(
      v.pipe(
        v.picklist(["none", "left", "center", "right"]),
        v.description(
          "Alignment for every column; none keeps the column alignment of a Markdown input and leaves others unspecified",
        ),
      ),
      "none",
    ),
    pad: v.optional(
      v.pipe(
        v.boolean(),
        v.description(
          "Pad cells with spaces so the columns line up in a monospace font; Chinese, Japanese, Korean characters and emoji count as two columns",
        ),
      ),
      true,
    ),
  }),
  output: v.object({
    markdown: v.pipe(v.string(), v.description("The GitHub Flavored Markdown table"), code),
  }),
  examples: [
    {
      input: { data: "Name,Role\nAda,Engineer\nGrace,Admiral" },
      output: {
        markdown:
          "| Name  | Role     |\n| ----- | -------- |\n| Ada   | Engineer |\n| Grace | Admiral  |",
      },
    },
    {
      input: { data: 'Plan\tPrice\nFree\t$0\n"Pro | Team"\t$12', align: "right" },
      output: {
        markdown:
          "|        Plan | Price |\n| ----------: | ----: |\n|        Free |    $0 |\n| Pro \\| Team |   $12 |",
      },
    },
    {
      input: { data: "|名称|数量|\n|:-|-:|\n|苹果|3|" },
      output: { markdown: "| 名称 | 数量 |\n| :--- | ---: |\n| 苹果 |    3 |" },
    },
  ],
  runtime: { where: "client" },
  form: { live: true, split: true },
  // 简单的文本转换，agent 可以自己写代码完成，不开放远程 MCP（architecture §远程 MCP 当前开放范围）
  agent: {
    webmcp: true,
    remote: false,
    description:
      "Turn CSV, TSV (cells copied from Excel or Google Sheets) or an existing Markdown table into a GitHub Flavored Markdown table. Quoted CSV fields may contain commas, quotes and line breaks; | in a cell becomes \\| and a line break becomes <br>. Short rows are filled with empty cells. Optionally sets one alignment for every column and pads cells so the columns line up, counting Chinese, Japanese, Korean characters and emoji as two columns. Fails with error code empty when the input holds no cells.",
  },
  run: () => import("./core").then((m) => m.generateTable),
});
