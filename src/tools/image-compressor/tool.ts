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
  id: "image-compressor",
  category: "image",
  input: v.object({
    file: v.pipe(
      v.file(),
      fileType(imageTypes),
      v.maxSize(50 * 1024 * 1024),
      v.description("The JPEG, PNG, WebP or AVIF image to compress, up to 50 MB"),
    ),
    quality: v.optional(
      v.pipe(
        v.number(),
        v.integer(),
        v.minValue(1),
        v.maxValue(100),
        v.description(
          "Quality for JPEG, WebP and AVIF (1–100); PNG is always optimized losslessly",
        ),
      ),
      75,
    ),
  }),
  output: v.object({
    file: v.pipe(v.file(), v.description("The compressed image, in the same format as the input")),
  }),
  examples: [
    {
      input: {},
      files: { file: "photo.jpg" },
      output: { file: { type: "image/jpeg", maxSize: 8_000 } },
    },
    {
      input: {},
      files: { file: "chart.png" },
      output: { file: { type: "image/png", maxSize: 1_000 } },
    },
    {
      input: { quality: 60 },
      files: { file: "photo.webp" },
      output: { file: { type: "image/webp", maxSize: 4_000 } },
    },
    {
      input: { quality: 60 },
      files: { file: "photo.avif" },
      output: { file: { type: "image/avif", maxSize: 4_000 } },
    },
  ],
  // 多线程 AVIF / oxipng 需要 SharedArrayBuffer；没有隔离时 jSquash 自动退回单线程
  runtime: { where: "client", worker: true, crossOriginIsolated: true, requires: ["wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（architecture §10）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Compress a JPEG, PNG, WebP or AVIF image in the browser, keeping its format and dimensions.",
  },
});
