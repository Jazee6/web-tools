import { AUDIO_CODECS, VIDEO_CODECS } from "mediabunny";
import { describe, expect, it } from "vitest";

import type { AnyVariant } from "@/lib/tool-contract/define-variant";

import { containers } from "./core";
import mkvToMp4 from "./variants/mkv-to-mp4/variant";
import movToMp4 from "./variants/mov-to-mp4/variant";
import mp4ToWebm from "./variants/mp4-to-webm/variant";

// Variant 表格里的 codec 名 → Mediabunny 的 codec id
const codecIds: Record<string, string> = {
  "H.264 (AVC)": "avc",
  "HEVC (H.265)": "hevc",
  VP9: "vp9",
  AV1: "av1",
  "Apple ProRes": "prores",
  AAC: "aac",
  Opus: "opus",
  MP3: "mp3",
  Vorbis: "vorbis",
  FLAC: "flac",
  PCM: "pcm-s16",
};

const term = (cell: unknown) => (cell as { term: string }).term;

// 独有数据是事实陈述，必须和 core.ts 的处理方式一致：keep 列表里的（MKV / WebM 是容器装得下的）直接复制，
// 其余转码到容器支持的第一个 codec（Mediabunny 的偏好顺序）；ProRes 没有 WebCodecs 解码器
describe.each([movToMp4, mkvToMp4, mp4ToWebm] as AnyVariant[])("$id table", (variant) => {
  const format = variant.preset.format as keyof typeof containers;
  const container = containers[format];
  const supported = container.create().getSupportedCodecs() as string[];

  const expected = (id: string, audio: boolean) => {
    if (id === "prores") return { result: "unsupported", output: undefined };
    const copied = container.keep ? container.keep.includes(id) : supported.includes(id);
    if (copied) return { result: "copied", output: id };
    const order = (audio ? AUDIO_CODECS : VIDEO_CODECS) as readonly string[];
    return { result: "reencoded", output: order.find((codec) => supported.includes(codec)) };
  };

  it.each(variant.table.rows.map((row) => [row.source as string, row]))("%s", (source, row) => {
    expect(codecIds[source], `未登记的 codec ${source}`).toBeDefined();
    // 浏览器没有首选编码器时（Firefox 没有 AAC）退到下一个，表格写成 "AAC / Opus"，这里只比较首选
    const actual = {
      result: term(row.result),
      output: codecIds[String(row.output).split(" / ")[0]!],
    };
    expect(actual).toEqual(expected(codecIds[source]!, term(row.track) === "audio"));
  });
});
