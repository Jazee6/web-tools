import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

const pdf = { type: "application/pdf", maxSize: 2_000 };

export default defineTool({
  id: "organize-pdf",
  category: "pdf",
  input: v.object({
    file: v.pipe(
      v.file(),
      fileType({ "application/pdf": [".pdf"] }),
      v.maxSize(50 * 1024 * 1024),
      v.description("The PDF file to organize, up to 50 MB"),
    ),
    pages: v.optional(
      v.pipe(
        v.string(),
        v.description(
          "The new page order: comma-separated pages and ranges, counted from 1, such as 3, 1-2, 5- (5- runs to the last page). Pages left out are deleted and pages can repeat. Add r90, r180 or r270 after a part to rotate those pages clockwise, such as 1-2 r90. Leave empty to keep every page as it is",
        ),
        v.metadata<string, FieldMetadata>({ widget: "pages", pagesOf: "file" }),
      ),
      "",
    ),
  }),
  output: v.object({
    file: v.pipe(v.file(), v.description("The reorganized PDF")),
  }),
  examples: [
    {
      input: { pages: "4, 1-3" },
      files: { file: "pages.pdf" },
      output: { file: pdf },
    },
    {
      input: { pages: "1, 2 r90, 4" },
      files: { file: "pages.pdf" },
      output: { file: pdf },
    },
  ],
  // PDFium 的 WASM 是单线程构建，不需要跨源隔离
  runtime: { where: "client", worker: true, requires: ["wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Reorder, rotate and delete the pages of a PDF in the browser, and return the reorganized PDF.",
  },
});
