import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

const logoTypes = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
} as const;

const color = (description: string, fallback: string) =>
  v.optional(
    v.pipe(
      v.string(),
      v.regex(/^#[0-9a-f]{6}$/i),
      v.description(description),
      v.metadata<string, FieldMetadata>({ widget: "color" }),
    ),
    fallback,
  );

export default defineTool({
  id: "qr-code-generator",
  category: "image",
  alsoListedIn: ["developer"],
  input: v.object({
    text: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.maxLength(7_089),
      v.description("The text or URL to encode, up to about 2,900 bytes depending on the content"),
    ),
    format: v.optional(
      v.pipe(v.picklist(["png", "svg"]), v.description("Image format of the QR code")),
      "png",
    ),
    size: v.optional(
      v.pipe(
        v.number(),
        v.integer(),
        v.minValue(128),
        v.maxValue(4096),
        v.description("Width and height of the whole image in pixels, margin included"),
      ),
      512,
    ),
    errorCorrection: v.optional(
      v.pipe(
        v.picklist(["L", "M", "Q", "H"]),
        v.description(
          "Error correction level: L, M, Q or H restore about 7%, 15%, 25% or 30% damage; H is always used with a logo",
        ),
      ),
      "M",
    ),
    margin: v.optional(
      v.pipe(
        v.number(),
        v.integer(),
        v.minValue(0),
        v.maxValue(16),
        v.description("Quiet zone around the code, in modules"),
      ),
      4,
    ),
    foreground: color("Color of the dark modules, as #RRGGBB", "#000000"),
    background: color("Color of the light modules and the margin, as #RRGGBB", "#ffffff"),
    logo: v.optional(
      v.pipe(
        v.file(),
        fileType(logoTypes),
        v.maxSize(5 * 1024 * 1024),
        v.description("An optional PNG, JPEG or WebP logo for the center, up to 5 MB"),
      ),
    ),
  }),
  output: v.object({
    file: v.pipe(v.file(), v.description("The QR code image, in PNG or SVG")),
  }),
  examples: [
    {
      input: { text: "https://example.com/" },
      output: { file: { type: "image/png", maxSize: 20_000 } },
    },
    {
      input: { text: "二维码 QR コード", format: "svg", errorCorrection: "H" },
      output: { file: { type: "image/svg+xml", maxSize: 20_000 } },
    },
    {
      input: { text: "https://example.com/", foreground: "#1d4ed8", background: "#fef9c3" },
      files: { logo: "logo.png" },
      output: { file: { type: "image/png", maxSize: 40_000 } },
    },
  ],
  // 用 OffscreenCanvas 画 PNG、解码 Logo，在 Web Worker 里运行；每次都很快，边改边出图
  runtime: { where: "client", worker: true },
  form: { live: true, split: true },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description:
      "Generate a QR code image (PNG or SVG) from text or a URL, with a chosen size, error correction level, margin, colors and an optional center logo.",
  },
});
