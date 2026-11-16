import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

const imageTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/bmp": [".bmp"],
  "image/avif": [".avif"],
} as const;

export default defineTool({
  id: "qr-code-scanner",
  category: "image",
  alsoListedIn: ["developer"],
  input: v.object({
    file: v.pipe(
      v.file(),
      fileType(imageTypes),
      v.maxSize(20 * 1024 * 1024),
      v.description(
        "The JPEG, PNG, WebP, GIF, BMP or AVIF image with QR codes or barcodes, up to 20 MB",
      ),
      // 也可以用摄像头取景，识别到就停（ADR-0025）
      v.metadata<File, FieldMetadata>({ camera: "scan" }),
    ),
  }),
  output: v.object({
    codes: v.pipe(
      v.array(v.object({ text: v.string(), format: v.string() })),
      v.description(
        "Every code found, with its decoded text and its format, such as QR Code, EAN-13 or Code 128",
      ),
    ),
  }),
  examples: [
    {
      input: {},
      files: { file: "qr-code.png" },
      output: { codes: [{ text: "https://example.com/", format: "QR Code" }] },
    },
    {
      input: {},
      files: { file: "barcode.jpg" },
      output: { codes: [{ text: "4006381333931", format: "EAN-13" }] },
    },
    {
      input: {},
      files: { file: "multiple.png" },
      output: {
        codes: [
          { text: "扫码 QR コード", format: "QR Code" },
          { text: "WT-2026-11", format: "Code 128" },
        ],
      },
    },
  ],
  // zxing-cpp 的 WASM 读码器（约 950 KB，自托管）在 Web Worker 里按需加载
  runtime: { where: "client", worker: true, requires: ["wasm"] },
  form: { live: true },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Read QR codes, Data Matrix, PDF417 and barcodes such as EAN-13 and Code 128 from an image in the browser with zxing-cpp.",
  },
});
