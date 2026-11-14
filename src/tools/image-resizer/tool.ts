import * as v from "valibot";

import { defineTool } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

import { MAX_SIDE } from "./size";

const imageTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
} as const;

const side = (description: string) =>
  v.optional(
    v.pipe(
      v.number(),
      v.integer(),
      v.minValue(1),
      v.maxValue(MAX_SIDE),
      v.description(description),
    ),
  );

export default defineTool({
  id: "image-resizer",
  category: "image",
  input: v.object({
    files: v.pipe(
      v.array(v.pipe(v.file(), fileType(imageTypes), v.maxSize(50 * 1024 * 1024))),
      v.minLength(1),
      v.maxLength(20),
      v.description(
        "The JPEG, PNG, WebP or AVIF images to resize: 1 to 20 files, up to 50 MB each",
      ),
    ),
    width: side("Output width in pixels (1–10,000). Leave empty to derive it from the height"),
    height: side("Output height in pixels (1–10,000). Leave empty to derive it from the width"),
    fit: v.optional(
      v.pipe(
        v.picklist(["contain", "cover", "stretch"]),
        v.description(
          "How to use a width and height together: contain fits inside and keeps the aspect ratio, cover fills the size and crops the excess evenly, stretch ignores the aspect ratio",
        ),
      ),
      "contain",
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
    files: v.pipe(
      v.array(v.file()),
      v.description("The resized images, in the same order and formats as the input"),
    ),
  }),
  examples: [
    {
      input: { width: 160 },
      files: { files: ["photo.jpg"] },
      output: { files: [{ type: "image/jpeg", maxSize: 20_000 }] },
    },
    {
      input: { width: 100, height: 100, fit: "cover" },
      files: { files: ["chart.png"] },
      output: { files: [{ type: "image/png", maxSize: 40_000 }] },
    },
    {
      input: { height: 120, quality: 70 },
      files: { files: ["photo.webp"] },
      output: { files: [{ type: "image/webp", maxSize: 10_000 }] },
    },
    {
      input: { width: 200, height: 200, fit: "stretch", quality: 60 },
      files: { files: ["photo.avif"] },
      output: { files: [{ type: "image/avif", maxSize: 10_000 }] },
    },
    {
      input: { width: 64 },
      files: { files: ["photo.jpg", "chart.png"] },
      output: {
        files: [
          { type: "image/jpeg", maxSize: 5_000 },
          { type: "image/png", maxSize: 20_000 },
        ],
      },
    },
  ],
  // 多线程 AVIF / oxipng 需要 SharedArrayBuffer；没有隔离时 jSquash 自动退回单线程
  runtime: { where: "client", worker: true, crossOriginIsolated: true, requires: ["wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Resize JPEG, PNG, WebP or AVIF images to a given width and height in the browser, keeping their formats.",
  },
});
