import { defineVariant } from "@/lib/tool-contract/define-variant";

import tool from "../../tool";

// CSV 字段到 Markdown 单元格的转换，与 core.ts 的 parseDelimited + escapeCell 一致（variants.test.ts 核对）。
// ↵ 表示换行
export default defineVariant(tool, {
  id: "csv-to-markdown-table",
  preset: { from: "csv" },
  table: {
    columns: ["field", "cell", "rule"],
    rows: [
      { field: '"Smith, Ada"', cell: "Smith, Ada", rule: { term: "quotedComma" } },
      { field: '"5"" screen"', cell: '5" screen', rule: { term: "doubledQuote" } },
      { field: '"Line 1↵Line 2"', cell: "Line 1<br>Line 2", rule: { term: "lineBreak" } },
      { field: "A|B", cell: "A\\|B", rule: { term: "pipe" } },
      { field: "  padded  ", cell: "padded", rule: { term: "trimmed" } },
      { field: "a;b", cell: "a;b", rule: { term: "semicolon" } },
    ],
  },
  demand: {
    query: "csv to markdown table",
    source: "google-autocomplete",
    checkedAt: "2026-11-14",
  },
});
