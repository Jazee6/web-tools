import * as v from "valibot";

import { defineTool } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

const imageTypes = {
  "image/heic": [".heic"],
  "image/heif": [".heif"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
} as const;

export default defineTool({
  id: "image-converter",
  category: "image",
  input: v.object({
    file: v.pipe(
      v.file(),
      fileType(imageTypes),
      v.maxSize(50 * 1024 * 1024),
      v.description("The HEIC, JPEG, PNG, WebP or AVIF image to convert, up to 50 MB"),
    ),
    format: v.optional(
      v.pipe(
        v.picklist(["jpeg", "png", "webp", "avif"]),
        v.description("The output format. Transparent areas become white in JPEG"),
      ),
      "jpeg",
    ),
    quality: v.optional(
      v.pipe(
        v.number(),
        v.integer(),
        v.minValue(1),
        v.maxValue(100),
        v.description("Quality for JPEG, WebP and AVIF (1–100); PNG is always lossless"),
      ),
      85,
    ),
  }),
  output: v.object({
    file: v.pipe(v.file(), v.description("The converted image in the chosen format")),
  }),
  examples: [
    {
      input: {},
      files: { file: "photo.heic" },
      output: { file: { type: "image/jpeg", maxSize: 20_000 } },
    },
    {
      input: { format: "png" },
      files: { file: "photo.heic" },
      output: { file: { type: "image/png", maxSize: 200_000 } },
    },
    {
      input: { format: "webp", quality: 70 },
      files: { file: "photo.jpg" },
      output: { file: { type: "image/webp", maxSize: 20_000 } },
    },
    {
      input: { format: "avif", quality: 60 },
      files: { file: "chart.png" },
      output: { file: { type: "image/avif", maxSize: 20_000 } },
    },
    {
      input: {},
      files: { file: "photo.webp" },
      output: { file: { type: "image/jpeg", maxSize: 30_000 } },
    },
    {
      input: { format: "png" },
      files: { file: "photo.avif" },
      output: { file: { type: "image/png", maxSize: 200_000 } },
    },
  ],
  // 多线程 AVIF / oxipng 需要 SharedArrayBuffer；没有隔离时 jSquash 自动退回单线程
  runtime: { where: "client", worker: true, crossOriginIsolated: true, requires: ["wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（architecture §10）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Convert a HEIC, JPEG, PNG, WebP or AVIF image to JPEG, PNG, WebP or AVIF in the browser.",
  },
});
