import { defineVariant } from "@/lib/tool-contract/define-variant";

import tool from "../../tool";

// 电子表格复制出的 TSV 单元格到 Markdown 单元格的转换，与 core.ts 的 parseDelimited + escapeCell 一致
// （variants.test.ts 核对）。↵ 表示换行
export default defineVariant(tool, {
  id: "excel-to-markdown-table",
  preset: { from: "tsv" },
  table: {
    columns: ["clipboard", "cell", "rule"],
    rows: [
      { clipboard: "1,234.50", cell: "1,234.50", rule: { term: "commaKept" } },
      { clipboard: '"Line 1↵Line 2"', cell: "Line 1<br>Line 2", rule: { term: "lineBreak" } },
      { clipboard: '"5"" screen"', cell: '5" screen', rule: { term: "doubledQuote" } },
      { clipboard: "Yes|No", cell: "Yes\\|No", rule: { term: "pipe" } },
      { clipboard: "  Total  ", cell: "Total", rule: { term: "trimmed" } },
    ],
  },
  demand: {
    query: "excel to markdown table",
    source: "google-autocomplete",
    checkedAt: "2026-11-14",
  },
});
