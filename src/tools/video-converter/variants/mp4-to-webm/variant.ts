import { defineVariant } from "@/lib/tool-contract/define-variant";

import tool from "../../tool";

// MP4 常见的 codec 换到 WebM 后怎么处理：WebM 只能装 VP8 / VP9 / AV1 + Opus / Vorbis，
// 装得下的直接复制，其余转码到 VP9 / Opus（variants.test.ts 用 Mediabunny 的 WebM 格式核对）
export default defineVariant(tool, {
  id: "mp4-to-webm",
  preset: { format: "webm" },
  accept: { file: ["video/mp4"] },
  table: {
    columns: ["track", "source", "result", "output"],
    rows: [
      {
        track: { term: "video" },
        source: "H.264 (AVC)",
        result: { term: "reencoded" },
        output: "VP9",
      },
      {
        track: { term: "video" },
        source: "HEVC (H.265)",
        result: { term: "reencoded" },
        output: "VP9",
      },
      { track: { term: "video" }, source: "VP9", result: { term: "copied" }, output: "VP9" },
      { track: { term: "video" }, source: "AV1", result: { term: "copied" }, output: "AV1" },
      { track: { term: "audio" }, source: "AAC", result: { term: "reencoded" }, output: "Opus" },
      { track: { term: "audio" }, source: "MP3", result: { term: "reencoded" }, output: "Opus" },
      { track: { term: "audio" }, source: "Opus", result: { term: "copied" }, output: "Opus" },
    ],
  },
  demand: { query: "mp4 to webm", source: "google-autocomplete", checkedAt: "2026-10-23" },
});
