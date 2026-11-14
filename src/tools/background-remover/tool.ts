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
  id: "background-remover",
  category: "image",
  input: v.object({
    file: v.pipe(
      v.file(),
      fileType(imageTypes),
      v.maxSize(50 * 1024 * 1024),
      v.description(
        "The HEIC, JPEG, PNG, WebP or AVIF image to remove the background from, up to 50 MB",
      ),
    ),
    format: v.optional(
      v.pipe(
        v.picklist(["png", "webp", "jpeg"]),
        v.description(
          "The output format. PNG and WebP keep the background transparent; JPEG has no transparency and needs a background color",
        ),
      ),
      "png",
    ),
    background: v.optional(
      v.pipe(
        v.string(),
        v.description(
          "A background color to fill in behind the subject as a hex code such as #ffffff. Leave empty to keep the background transparent",
        ),
      ),
      "",
    ),
    quality: v.optional(
      v.pipe(
        v.number(),
        v.integer(),
        v.minValue(1),
        v.maxValue(100),
        v.description("Quality for WebP and JPEG (1–100); PNG is always lossless"),
      ),
      90,
    ),
  }),
  output: v.object({
    file: v.pipe(v.file(), v.description("The image with the background removed")),
  }),
  examples: [
    {
      input: {},
      files: { file: "ball.jpg" },
      output: { file: { type: "image/png", maxSize: 400_000 } },
    },
    {
      input: { format: "jpeg", background: "#ffffff" },
      files: { file: "ball.heic" },
      output: { file: { type: "image/jpeg", maxSize: 200_000 } },
    },
  ],
  // BiRefNet_lite 由 Transformers.js 运行：有可用的 WebGPU 时在 GPU 上跑，否则用 WASM（跨源隔离下多线程）。
  // HEIC 用 libheif 解码
  runtime: { where: "client", worker: true, crossOriginIsolated: true, requires: ["wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Remove the background from a photo in the browser with the BiRefNet_lite segmentation model, leaving a transparent PNG or WebP, or a solid background color.",
  },
});
