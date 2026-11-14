import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

// .mkv 在 Firefox、Safari 里没有 MIME 类型，靠扩展名识别（fileType）
const videoTypes = {
  "video/mp4": [".mp4", ".m4v"],
  "video/quicktime": [".mov"],
  "video/webm": [".webm"],
  "video/x-matroska": [".mkv"],
} as const;

const line = v.metadata<string, FieldMetadata>({ widget: "line" });

export default defineTool({
  id: "trim-video",
  category: "media",
  input: v.object({
    file: v.pipe(
      v.file(),
      fileType(videoTypes),
      v.maxSize(500 * 1024 * 1024),
      v.description("The MP4, MOV, WebM or MKV video to trim, up to 500 MB"),
    ),
    start: v.optional(
      v.pipe(
        v.string(),
        v.description(
          "Where the clip starts: seconds (90.5), minutes:seconds (1:30) or hours:minutes:seconds (1:02:03.25). Leave empty to start at the beginning",
        ),
        line,
      ),
      "",
    ),
    end: v.optional(
      v.pipe(
        v.string(),
        v.description("Where the clip ends, in the same format. Leave empty to run to the end"),
        line,
      ),
      "",
    ),
    mode: v.optional(
      v.pipe(
        v.picklist(["precise", "fast"]),
        v.description(
          "precise re-encodes when needed so the clip starts at the exact time; fast copies without re-encoding and starts at the nearest earlier key frame",
        ),
      ),
      "precise",
    ),
  }),
  output: v.object({
    file: v.pipe(v.file(), v.description("The trimmed video, in the same container as the input")),
  }),
  examples: [
    {
      input: { start: "3", end: "5" },
      files: { file: "clip.mp4" },
      output: { file: { type: "video/mp4", maxSize: 200_000 } },
    },
    {
      input: { start: "0:03", end: "0:05", mode: "fast" },
      files: { file: "clip.mp4" },
      output: { file: { type: "video/mp4", maxSize: 30_000 } },
    },
    {
      input: { start: "2" },
      files: { file: "clip.webm" },
      output: { file: { type: "video/webm", maxSize: 500_000 } },
    },
    {
      input: { end: "4", mode: "fast" },
      files: { file: "clip.mov" },
      output: { file: { type: "video/quicktime", maxSize: 30_000 } },
    },
    {
      input: { start: "2", end: "4", mode: "fast" },
      files: { file: "clip.mkv" },
      output: { file: { type: "video/x-matroska", maxSize: 30_000 } },
    },
  ],
  // 编解码全走 WebCodecs，Mediabunny 是纯 TypeScript，不需要 WASM 和跨源隔离
  runtime: { where: "client", worker: true, requires: ["webcodecs"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description: "Cut a video to a start and end time in the browser, keeping its container.",
  },
});
