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
    files: v.pipe(
      v.array(v.pipe(v.file(), fileType(imageTypes), v.maxSize(50 * 1024 * 1024))),
      v.minLength(1),
      v.maxLength(20),
      v.description(
        "The JPEG, PNG, WebP or AVIF images to compress: 1 to 20 files, up to 50 MB each",
      ),
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
    files: v.pipe(
      v.array(v.file()),
      v.description("The compressed images, in the same order and formats as the input"),
    ),
  }),
  examples: [
    {
      input: {},
      files: { files: ["photo.jpg"] },
      output: { files: [{ type: "image/jpeg", maxSize: 8_000 }] },
    },
    {
      input: {},
      files: { files: ["chart.png"] },
      output: { files: [{ type: "image/png", maxSize: 1_000 }] },
    },
    {
      input: { quality: 60 },
      files: { files: ["photo.webp"] },
      output: { files: [{ type: "image/webp", maxSize: 4_000 }] },
    },
    {
      input: { quality: 60 },
      files: { files: ["photo.avif"] },
      output: { files: [{ type: "image/avif", maxSize: 4_000 }] },
    },
    {
      input: { quality: 60 },
      files: { files: ["photo.jpg", "chart.png"] },
      output: {
        files: [
          { type: "image/jpeg", maxSize: 8_000 },
          { type: "image/png", maxSize: 1_000 },
        ],
      },
    },
  ],
  // 选好文件、调整质量后，在提交前预估每个文件压缩后的体积
  estimate: { field: "files" },
  // 多线程 AVIF / oxipng 需要 SharedArrayBuffer；没有隔离时 jSquash 自动退回单线程
  runtime: { where: "client", worker: true, crossOriginIsolated: true, requires: ["wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（architecture §10）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Compress JPEG, PNG, WebP or AVIF images in the browser, keeping their formats and dimensions.",
  },
});
