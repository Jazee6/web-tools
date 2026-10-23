import { defineVariant } from "@/lib/tool-contract/define-variant";

import tool from "../../tool";

// MKV 常见的 codec 换到 MP4 后怎么处理，与 core.ts 的 containers.mp4.keep 一致（variants.test.ts 核对）
export default defineVariant(tool, {
  id: "mkv-to-mp4",
  preset: { format: "mp4" },
  accept: { file: ["video/x-matroska"] },
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
        source: "VP9",
        result: { term: "reencoded" },
        output: "H.264 (AVC)",
      },
      {
        track: { term: "video" },
        source: "AV1",
        result: { term: "reencoded" },
        output: "H.264 (AVC)",
      },
      { track: { term: "audio" }, source: "AAC", result: { term: "copied" }, output: "AAC" },
      {
        track: { term: "audio" },
        source: "Opus",
        result: { term: "reencoded" },
        output: "AAC / Opus",
      },
      {
        track: { term: "audio" },
        source: "Vorbis",
        result: { term: "reencoded" },
        output: "AAC / Opus",
      },
      {
        track: { term: "audio" },
        source: "FLAC",
        result: { term: "reencoded" },
        output: "AAC / Opus",
      },
    ],
  },
  demand: { query: "mkv to mp4", source: "google-autocomplete", checkedAt: "2026-10-23" },
});
