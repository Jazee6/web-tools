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
  id: "image-to-text",
  category: "image",
  alsoListedIn: ["media"],
  input: v.object({
    file: v.pipe(
      v.file(),
      fileType(imageTypes),
      v.maxSize(50 * 1024 * 1024),
      v.description("The HEIC, JPEG, PNG, WebP or AVIF image to extract text from, up to 50 MB"),
    ),
  }),
  output: v.object({
    text: v.pipe(v.string(), v.description("The recognized text, one line per line of text")),
  }),
  examples: [
    {
      input: {},
      files: { file: "english.png" },
      output: {
        text: "Image to Text runs in your browser.\nNothing is uploaded to a server.\n\nSecond paragraph: 42 files, 3.5 MB.",
      },
    },
    {
      input: {},
      files: { file: "mixed.png" },
      output: {
        text: "图片转文字在浏览器里运行。\n画像はアップロードされません。\nGröße ändern, café, niño, ação",
      },
    },
  ],
  // PP-OCRv6 的检测和识别模型由 ONNX Runtime 在 WASM 上运行，跨源隔离下多线程（单线程时一页 40 行的
  // A4 扫描件约 10 秒，其中逐行识别占八成）；HEIC 用 libheif 解码
  runtime: { where: "client", worker: true, crossOriginIsolated: true, requires: ["wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Extract printed text from a photo, screenshot or scanned image in the browser with the PP-OCRv6 text detection and recognition models.",
  },
});
