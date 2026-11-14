import * as v from "valibot";

import { ASPECTS, ROTATIONS } from "@/lib/image/crop";
import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

const imageTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
} as const;

// 旋转和翻转是针对这一张图的，不记作下次打开时的选项
const perImage = { remember: false } satisfies FieldMetadata;

const flip = (description: string) =>
  v.optional(v.pipe(v.boolean(), v.description(description), v.metadata(perImage)), false);

export default defineTool({
  id: "image-cropper",
  category: "image",
  input: v.object({
    file: v.pipe(
      v.file(),
      fileType(imageTypes),
      v.maxSize(50 * 1024 * 1024),
      v.description("The JPEG, PNG, WebP or AVIF image to crop, up to 50 MB"),
    ),
    rotate: v.optional(
      v.pipe(
        v.picklist(ROTATIONS),
        v.description("Rotate the image clockwise by this many degrees before cropping"),
        v.metadata(perImage),
      ),
      "0",
    ),
    flipHorizontal: flip("Mirror the rotated image left to right before cropping"),
    flipVertical: flip("Mirror the rotated image top to bottom before cropping"),
    aspect: v.optional(
      v.pipe(
        v.picklist(ASPECTS),
        v.description(
          "Width-to-height ratio of the default crop area: the largest centred area with this ratio. Ignored when crop is given; free uses the whole image",
        ),
      ),
      "free",
    ),
    crop: v.optional(
      v.pipe(
        v.string(),
        v.description(
          "The area to keep as x, y, width, height in whole pixels, such as 40, 0, 240, 240, measured on the image after rotating and flipping (x and y are the top-left corner). Leave empty for the default area set by aspect",
        ),
        v.metadata<string, FieldMetadata>({ widget: "crop", cropOf: "file" }),
      ),
      "",
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
    file: v.pipe(v.file(), v.description("The cropped image, in the same format as the input")),
  }),
  examples: [
    {
      input: { crop: "40, 0, 240, 240" },
      files: { file: "photo.jpg" },
      output: { file: { type: "image/jpeg", maxSize: 30_000 } },
    },
    {
      input: { aspect: "16:9" },
      files: { file: "chart.png" },
      output: { file: { type: "image/png", maxSize: 120_000 } },
    },
    {
      input: { rotate: "90", aspect: "1:1", quality: 70 },
      files: { file: "photo.webp" },
      output: { file: { type: "image/webp", maxSize: 20_000 } },
    },
    {
      input: { flipHorizontal: true, crop: "0, 0, 160, 120" },
      files: { file: "photo.avif" },
      output: { file: { type: "image/avif", maxSize: 10_000 } },
    },
  ],
  // 多线程 AVIF / oxipng 需要 SharedArrayBuffer；没有隔离时 jSquash 自动退回单线程
  runtime: { where: "client", worker: true, crossOriginIsolated: true, requires: ["wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Crop a JPEG, PNG, WebP or AVIF image to a pixel area or a centred aspect ratio in the browser, optionally rotating or flipping it first.",
  },
});
