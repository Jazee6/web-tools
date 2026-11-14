import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  type InputTrack,
  Input,
  MkvOutputFormat,
  MovOutputFormat,
  Mp4OutputFormat,
  Output,
  type OutputFormat,
  WebMOutputFormat,
} from "mediabunny";

import { primaryVideoTrack, replaceExtension, runConversion } from "@/lib/media/conversion";
import type { ToolContext } from "@/lib/tool-contract/define-tool";

import type { videoFormats } from "./tool";

export interface ConvertVideoInput {
  file: File;
  format: (typeof videoFormats)[number];
}

// keep：源 codec 在列表里就直接复制数据包（不重新编码）；不在列表里时强制转码，由 Mediabunny 取容器支持、
// 浏览器能编码的第一个 codec（视频 H.264 → HEVC → VP9 → AV1，音频 AAC → Opus → …）。
// MP4 / MOV 只保留播放兼容性最好的 H.264 / HEVC + AAC，WebM 容器本身只能装 VP8 / VP9 / AV1 + Opus / Vorbis，
// MKV 什么都能装，全部复制。浏览器没有 AAC 编码器时（如 Firefox）MP4 / MOV 里的音频改用 Opus。
export const containers: Record<
  ConvertVideoInput["format"],
  { create: () => OutputFormat; keep?: readonly string[] }
> = {
  mp4: {
    create: () => new Mp4OutputFormat({ fastStart: "in-memory" }),
    keep: ["avc", "hevc", "aac"],
  },
  mov: {
    create: () => new MovOutputFormat({ fastStart: "in-memory" }),
    keep: ["avc", "hevc", "aac"],
  },
  webm: { create: () => new WebMOutputFormat() },
  mkv: { create: () => new MkvOutputFormat() },
};

const trackOptions = (keep: readonly string[] | undefined) => async (track: InputTrack) => ({
  forceTranscode: keep !== undefined && !keep.includes((await track.getCodec()) ?? ""),
});

// 输出整个放在内存里（BufferTarget），所以输入有体积上限。
export const convertVideo = async ({ file, format }: ConvertVideoInput, ctx: ToolContext) => {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    await primaryVideoTrack(input);
    const container = containers[format];
    const target = new BufferTarget();
    const output = new Output({ format: container.create(), target });
    await runConversion(
      {
        input,
        output,
        video: trackOptions(container.keep),
        audio: trackOptions(container.keep),
      },
      ctx,
    );
    return {
      file: new File([target.buffer!], replaceExtension(file.name, output.format.fileExtension), {
        type: output.format.mimeType,
      }),
    };
  } finally {
    input.dispose();
  }
};
