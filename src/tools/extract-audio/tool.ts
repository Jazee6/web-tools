import * as v from "valibot";

import { defineTool } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

// .mkv 在 Firefox、Safari 里没有 MIME 类型，靠扩展名识别（fileType）
const videoTypes = {
  "video/mp4": [".mp4", ".m4v"],
  "video/quicktime": [".mov"],
  "video/webm": [".webm"],
  "video/x-matroska": [".mkv"],
} as const;

// 输出格式，顺序即下拉框顺序
export const audioFormats = ["mp3", "m4a", "wav", "original"] as const;

export default defineTool({
  id: "extract-audio",
  category: "media",
  input: v.object({
    file: v.pipe(
      v.file(),
      fileType(videoTypes),
      v.maxSize(500 * 1024 * 1024),
      v.description("The MP4, MOV, WebM or MKV video to take the sound from, up to 500 MB"),
    ),
    format: v.optional(
      v.pipe(
        v.picklist(audioFormats),
        v.description(
          "Audio format: mp3 (192 kbps), m4a (AAC, 192 kbps), wav (16-bit PCM) or original (the audio track copied without re-encoding, in a container that matches its codec)",
        ),
      ),
      "mp3",
    ),
  }),
  output: v.object({
    file: v.pipe(v.file(), v.description("The audio track of the video in the chosen format")),
  }),
  examples: [
    {
      input: { format: "mp3" },
      files: { file: "clip.mp4" },
      output: { file: { type: "audio/mpeg", maxSize: 200_000 } },
    },
    {
      input: { format: "mp3" },
      files: { file: "clip.webm" },
      output: { file: { type: "audio/mpeg", maxSize: 200_000 } },
    },
    {
      input: { format: "wav" },
      files: { file: "clip.mov" },
      output: { file: { type: "audio/wav", maxSize: 600_000 } },
    },
    {
      input: { format: "original" },
      files: { file: "clip.mp4" },
      output: { file: { type: "audio/mp4", maxSize: 30_000 } },
    },
  ],
  // 解码走 WebCodecs；MP3 用 LAME 的 WASM 编码器（浏览器不能编码 MP3），不需要跨源隔离
  runtime: { where: "client", worker: true, requires: ["webcodecs", "wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description: "Extract the audio track of a video as MP3, M4A or WAV in the browser.",
  },
});
