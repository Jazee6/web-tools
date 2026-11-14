import { describe, expect, it } from "vitest";

import type { AnyVariant } from "@/lib/tool-contract/define-variant";

import { generateTable } from "./core";
import csvToMarkdownTable from "./variants/csv-to-markdown-table/variant";
import excelToMarkdownTable from "./variants/excel-to-markdown-table/variant";

// 独有数据是事实陈述：把左列的源文本（↵ 是换行）放进一行两列的表格，第一个单元格必须是右列的结果
describe.each([csvToMarkdownTable, excelToMarkdownTable] as AnyVariant[])(
  "$id table",
  (variant) => {
    const from = variant.preset.from as "csv" | "tsv";
    const [source, result] = variant.table.columns;
    const separator = from === "csv" ? "," : "\t";

    it.each(variant.table.rows.map((row) => [String(row[source]), row] as const))(
      "%j",
      (_, row) => {
        const field = String(row[source]).replaceAll("↵", "\n");
        const { markdown } = generateTable({
          data: `${field}${separator}x`,
          from,
          header: true,
          align: "none",
          pad: false,
        });
        const header = markdown.split("\n")[0]!;
        expect(header).toBe(`| ${String(row[result!])} | x |`);
      },
    );
  },
);
