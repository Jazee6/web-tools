import { defineVariant } from "@/lib/tool-contract/define-variant";

import tool from "../../tool";

// MOV 常见的 codec 换到 MP4 后怎么处理，与 core.ts 的 containers.mp4.keep 一致（variants.test.ts 核对）。
// ProRes 没有 WebCodecs 解码器，浏览器里转不了。
export default defineVariant(tool, {
  id: "mov-to-mp4",
  preset: { format: "mp4" },
  accept: { file: ["video/quicktime"] },
  table: {
    columns: ["track", "source", "result", "output"],
    rows: [
      {
        track: { term: "video" },
        source: "H.264 (AVC)",
        result: { term: "copied" },
        output: "H.264 (AVC)",
      },
      {
        track: { term: "video" },
        source: "HEVC (H.265)",
        result: { term: "copied" },
        output: "HEVC (H.265)",
      },
      {
        track: { term: "video" },
        source: "Apple ProRes",
        result: { term: "unsupported" },
        output: "—",
      },
      { track: { term: "audio" }, source: "AAC", result: { term: "copied" }, output: "AAC" },
      {
        track: { term: "audio" },
        source: "PCM",
        result: { term: "reencoded" },
        output: "AAC / Opus",
      },
      {
        track: { term: "audio" },
        source: "MP3",
        result: { term: "reencoded" },
        output: "AAC / Opus",
      },
    ],
  },
  demand: { query: "mov to mp4", source: "google-autocomplete", checkedAt: "2026-10-23" },
});
