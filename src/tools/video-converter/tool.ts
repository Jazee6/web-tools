import * as v from "valibot";

import { defineTool } from "@/lib/tool-contract/define-tool";

// MKV 不在输入列表：Firefox、Safari 选中 .mkv 时 File.type 是空字符串，无法按 MIME 类型校验
const videoTypes = ["video/mp4", "video/quicktime", "video/webm"] as const;

// 输出容器，顺序即下拉框顺序；codec 由 core 按浏览器能编码的范围选择
export const videoFormats = ["mp4", "webm", "mov", "mkv"] as const;

export default defineTool({
  id: "video-converter",
  category: "media",
  input: v.object({
    file: v.pipe(
      v.file(),
      v.mimeType(videoTypes),
      v.maxSize(500 * 1024 * 1024),
      v.description("The MP4, MOV or WebM video to convert, up to 500 MB"),
    ),
    format: v.optional(
      v.pipe(
        v.picklist(videoFormats),
        v.description(
          "Output container: MP4 and MOV use H.264 + AAC where the browser can encode them, WebM uses VP9 + Opus, MKV keeps the source codecs",
        ),
      ),
      "mp4",
    ),
  }),
  output: v.object({
    file: v.pipe(v.file(), v.description("The converted video in the chosen container")),
  }),
  examples: [
    {
      input: { format: "mp4" },
      files: { file: "clip.webm" },
      output: { file: { type: "video/mp4", maxSize: 60_000 } },
    },
    {
      input: { format: "webm" },
      files: { file: "clip.mp4" },
      output: { file: { type: "video/webm", maxSize: 60_000 } },
    },
    {
      input: { format: "mp4" },
      files: { file: "clip.mov" },
      output: { file: { type: "video/mp4", maxSize: 20_000 } },
    },
  ],
  // 编解码全走 WebCodecs，Mediabunny 是纯 TypeScript，不需要 WASM 和跨源隔离
  runtime: { where: "client", worker: true, requires: ["webcodecs"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description: "Convert a video between MP4, WebM, MOV and MKV in the browser.",
  },
});
