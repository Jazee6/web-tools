import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

const pdf = { type: "application/pdf", maxSize: 2_000 };

export default defineTool({
  id: "split-pdf",
  category: "pdf",
  input: v.object({
    file: v.pipe(
      v.file(),
      fileType({ "application/pdf": [".pdf"] }),
      v.maxSize(50 * 1024 * 1024),
      v.description("The PDF file to split, up to 50 MB"),
    ),
    pages: v.optional(
      v.pipe(
        v.string(),
        v.description(
          "Comma-separated pages and ranges, counted from 1, such as 1-3, 5, 8- (8- runs to the last page). Leave empty to split every page",
        ),
        v.metadata<string, FieldMetadata>({ widget: "line" }),
      ),
      "",
    ),
    mode: v.optional(
      v.pipe(
        v.picklist(["separate", "combined"]),
        v.description(
          "separate writes one PDF per comma-separated range; combined writes all the listed pages, in the order given, into one PDF",
        ),
      ),
      "separate",
    ),
  }),
  output: v.object({
    files: v.pipe(v.array(v.file()), v.description("The resulting PDF files")),
  }),
  examples: [
    {
      input: {},
      files: { file: "report.pdf" },
      output: { files: [pdf, pdf, pdf, pdf, pdf] },
    },
    {
      input: { pages: "1-2, 4-" },
      files: { file: "report.pdf" },
      output: { files: [pdf, pdf] },
    },
    {
      input: { pages: "5, 1", mode: "combined" },
      files: { file: "report.pdf" },
      output: { files: [pdf] },
    },
  ],
  // PDFium 的 WASM 是单线程构建，不需要跨源隔离
  runtime: { where: "client", worker: true, requires: ["wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Split a PDF into several files by page range, or extract selected pages into one PDF, in the browser.",
  },
});
