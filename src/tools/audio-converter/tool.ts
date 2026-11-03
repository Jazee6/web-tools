import * as v from "valibot";

import { defineTool } from "@/lib/tool-contract/define-tool";
import { fileType } from "@/lib/tool-contract/file-type";

// 扩展名兜底见 fileType（Safari 的 .m4a 是 audio/x-m4a）
const audioTypes = {
  "audio/mpeg": [".mp3"],
  "audio/mp4": [".m4a"],
  "audio/aac": [".aac"],
  "audio/wav": [".wav"],
  "audio/ogg": [".ogg", ".oga", ".opus"],
  "audio/flac": [".flac"],
  "audio/webm": [".weba"],
} as const;

// 输出格式和码率，顺序即下拉框顺序
export const audioFormats = ["mp3", "m4a", "wav", "ogg"] as const;
export const audioBitrates = ["128", "192", "320"] as const;

export default defineTool({
  id: "audio-converter",
  category: "media",
  input: v.object({
    file: v.pipe(
      v.file(),
      fileType(audioTypes),
      v.maxSize(500 * 1024 * 1024),
      v.description("The MP3, M4A, AAC, WAV, OGG, Opus, FLAC or WebM audio file, up to 500 MB"),
    ),
    format: v.optional(
      v.pipe(
        v.picklist(audioFormats),
        v.description("Output format: mp3, m4a (AAC), wav (16-bit PCM) or ogg (Opus)"),
      ),
      "mp3",
    ),
    bitrate: v.optional(
      v.pipe(
        v.picklist(audioBitrates),
        v.description("Bitrate in kbps for MP3, M4A and OGG; ignored for WAV"),
      ),
      "192",
    ),
  }),
  output: v.object({
    file: v.pipe(v.file(), v.description("The converted audio file")),
  }),
  examples: [
    {
      input: { format: "mp3" },
      files: { file: "tone.wav" },
      output: { file: { type: "audio/mpeg", maxSize: 60_000 } },
    },
    {
      input: { format: "wav" },
      files: { file: "tone.mp3" },
      output: { file: { type: "audio/wav", maxSize: 400_000 } },
    },
    {
      input: { format: "ogg", bitrate: "128" },
      files: { file: "tone.m4a" },
      output: { file: { type: "audio/ogg", maxSize: 60_000 } },
    },
    {
      input: { format: "mp3", bitrate: "320" },
      files: { file: "tone.ogg" },
      output: { file: { type: "audio/mpeg", maxSize: 100_000 } },
    },
  ],
  // 解码走 WebCodecs；MP3 用 LAME 的 WASM 编码器（浏览器不能编码 MP3），不需要跨源隔离
  runtime: { where: "client", worker: true, requires: ["webcodecs", "wasm"] },
  // WebMCP 的输入输出只有 JSON，不能传文件（ADR-0016）
  agent: {
    webmcp: false,
    remote: false,
    description: "Convert an audio file between MP3, M4A, WAV and OGG in the browser.",
  },
});
