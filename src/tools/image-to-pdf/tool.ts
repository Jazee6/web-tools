import * as v from "valibot";

import { defineTool } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

const imageTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
} as const;

export default defineTool({
  id: "image-to-pdf",
  category: "pdf",
  alsoListedIn: ["image"],
  input: v.object({
    files: v.pipe(
      v.array(v.pipe(v.file(), fileType(imageTypes), v.maxSize(50 * 1024 * 1024))),
      v.minLength(1),
      v.maxLength(50),
      v.description(
        "The JPEG, PNG, WebP or AVIF images to put in the PDF, one per page in order: 1 to 50 files, up to 50 MB each",
      ),
    ),
    pageSize: v.optional(
      v.pipe(
        v.picklist(["a4", "letter", "fit"]),
        v.description(
          "The page size: A4 (210 × 297 mm), US Letter (8.5 × 11 in), or fit, where each page takes the size of its image at 96 pixels per inch",
        ),
      ),
      "a4",
    ),
    orientation: v.optional(
      v.pipe(
        v.picklist(["auto", "portrait", "landscape"]),
        v.description(
          "Page orientation for A4 and Letter: auto turns the page landscape for images wider than they are tall",
        ),
      ),
      "auto",
    ),
    margin: v.optional(
      v.pipe(
        v.picklist(["none", "small", "large"]),
        v.description(
          "White space around each image: none, small (0.5 in, 12.7 mm) or large (1 in, 25.4 mm)",
        ),
      ),
      "none",
    ),
  }),
  output: v.object({
    file: v.pipe(
      v.file(),
      v.description(
        "One PDF with each image on its own page, scaled to fit inside the margins and centred",
      ),
    ),
  }),
  examples: [
    {
      input: {},
      files: { files: ["photo.jpg", "chart.png"] },
      output: { file: { type: "application/pdf", maxSize: 100_000 } },
    },
    {
      input: { pageSize: "fit" },
      files: { files: ["chart.png"] },
      output: { file: { type: "application/pdf", maxSize: 10_000 } },
    },
    {
      input: { pageSize: "letter", orientation: "portrait", margin: "small" },
      files: { files: ["photo.webp"] },
      output: { file: { type: "application/pdf", maxSize: 50_000 } },
    },
  ],
  // PDFium 和 jSquash 的 JPEG 编码器都是单线程，不需要跨源隔离
  runtime: { where: "client", worker: true, requires: ["wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Combine JPEG, PNG, WebP or AVIF images into one PDF in the browser, one image per page, on A4, Letter or image-sized pages.",
  },
});
