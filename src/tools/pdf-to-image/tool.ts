import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

const jpeg = { type: "image/jpeg", maxSize: 10_000 };

export default defineTool({
  id: "pdf-to-image",
  category: "pdf",
  input: v.object({
    file: v.pipe(
      v.file(),
      fileType({ "application/pdf": [".pdf"] }),
      v.maxSize(50 * 1024 * 1024),
      v.description("The PDF file to convert, up to 50 MB"),
    ),
    pages: v.optional(
      v.pipe(
        v.string(),
        v.description(
          "Comma-separated pages and ranges, counted from 1, such as 1-3, 5, 8- (8- runs to the last page). Leave empty to convert every page",
        ),
        v.metadata<string, FieldMetadata>({ widget: "line" }),
      ),
      "",
    ),
    format: v.optional(
      v.pipe(
        v.picklist(["jpeg", "png", "webp"]),
        v.description("The image format. Pages are drawn on a white background"),
      ),
      "jpeg",
    ),
    dpi: v.optional(
      v.pipe(
        v.picklist(["72", "150", "300"]),
        v.description(
          "Resolution in dots per inch: 72 matches the page size in points, 300 is print quality",
        ),
      ),
      "150",
    ),
    quality: v.optional(
      v.pipe(
        v.number(),
        v.integer(),
        v.minValue(1),
        v.maxValue(100),
        v.description("Quality for JPEG and WebP (1–100); PNG is always lossless"),
      ),
      85,
    ),
  }),
  output: v.object({
    files: v.pipe(v.array(v.file()), v.description("One image per page, in page order")),
  }),
  examples: [
    {
      input: {},
      files: { file: "sample.pdf" },
      output: { files: [jpeg, jpeg, jpeg] },
    },
    {
      input: { pages: "1", format: "png", dpi: "300" },
      files: { file: "sample.pdf" },
      output: { files: [{ type: "image/png", maxSize: 20_000 }] },
    },
    {
      input: { pages: "2-", format: "webp", dpi: "72", quality: 70 },
      files: { file: "sample.pdf" },
      output: {
        files: [
          { type: "image/webp", maxSize: 5_000 },
          { type: "image/webp", maxSize: 5_000 },
        ],
      },
    },
  ],
  // PDFium 是单线程构建；只有 PNG 的 OxiPNG 能用上多线程，不值得为它开跨源隔离（占 4 条 _headers 规则）
  runtime: { where: "client", worker: true, requires: ["wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Convert the pages of a PDF to JPEG, PNG or WebP images at 72, 150 or 300 DPI, in the browser.",
  },
});
