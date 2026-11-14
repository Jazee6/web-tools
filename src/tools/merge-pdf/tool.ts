import * as v from "valibot";

import { defineTool } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

export default defineTool({
  id: "merge-pdf",
  category: "pdf",
  input: v.object({
    files: v.pipe(
      v.array(
        v.pipe(v.file(), fileType({ "application/pdf": [".pdf"] }), v.maxSize(50 * 1024 * 1024)),
      ),
      v.minLength(2),
      v.maxLength(20),
      v.description("The PDF files to merge, in order: 2 to 20 files, up to 50 MB each"),
    ),
  }),
  output: v.object({
    file: v.pipe(
      v.file(),
      v.description("One PDF with every page of the input files, in the order given"),
    ),
  }),
  examples: [
    {
      input: {},
      files: { files: ["letter.pdf", "slides.pdf"] },
      output: { file: { type: "application/pdf", maxSize: 4_000 } },
    },
  ],
  // PDFium 的 WASM 是单线程构建，不需要跨源隔离
  runtime: { where: "client", worker: true, requires: ["wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description: "Merge several PDF files into one in the browser, keeping the given order.",
  },
});
