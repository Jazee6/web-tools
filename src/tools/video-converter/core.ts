import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Conversion,
  type InputTrack,
  Input,
  MkvOutputFormat,
  MovOutputFormat,
  Mp4OutputFormat,
  Output,
  type OutputFormat,
  WebMOutputFormat,
} from "mediabunny";

import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

import type { videoFormats } from "./tool";

export interface ConvertVideoInput {
  file: File;
  format: (typeof videoFormats)[number];
}

// keep：源 codec 在列表里就直接复制数据包（不重新编码）；不在列表里时强制转码，由 Mediabunny 取容器支持、
// 浏览器能编码的第一个 codec（视频 H.264 → HEVC → VP9 → AV1，音频 AAC → Opus → …）。
// MP4 / MOV 只保留播放兼容性最好的 H.264 / HEVC + AAC，WebM 容器本身只能装 VP8 / VP9 / AV1 + Opus / Vorbis，
// MKV 什么都能装，全部复制。浏览器没有 AAC 编码器时（如 Firefox）MP4 / MOV 里的音频改用 Opus。
const containers: Record<
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

const convertedName = (name: string, extension: string) => {
  const dot = name.lastIndexOf(".");
  return `${dot > 0 ? name.slice(0, dot) : name}${extension}`;
};

// 只处理主视频轨和主音频轨，字幕和多余的轨道丢弃。任何一条主轨被丢弃（无法解码、浏览器没有可用编码器）
// 都报错，不静默输出没有声音或没有画面的文件。输出整个放在内存里（BufferTarget），所以输入有体积上限。
export const convertVideo = async (
  { file, format }: ConvertVideoInput,
  { signal, onProgress }: ToolContext,
) => {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    const video = await input.getPrimaryVideoTrack().catch(() => {
      throw new ToolError("invalid_video", { field: "file" });
    });
    if (!video) throw new ToolError("no_video", { field: "file" });

    const container = containers[format];
    const target = new BufferTarget();
    const output = new Output({ format: container.create(), target });
    const conversion = await Conversion.init({
      input,
      output,
      tracks: "primary",
      video: trackOptions(container.keep),
      audio: trackOptions(container.keep),
      showWarnings: false,
    });
    // 认不出 codec 的轨道按无法读取处理；认得出但解不了码或没有可用编码器的，把源 codec 放在 detail
    const codec = await conversion.discardedTracks[0]?.track.getCodec();
    if (!conversion.isValid || conversion.discardedTracks.length > 0) {
      throw codec
        ? new ToolError("unsupported_codec", { field: "file", detail: codec })
        : new ToolError("invalid_video", { field: "file" });
    }

    // 中止时取消转换；Mediabunny 抛出的取消错误（随取消时所处阶段而不同）统一换成 signal.reason
    signal?.throwIfAborted();
    const abort = () => void conversion.cancel();
    signal?.addEventListener("abort", abort, { once: true });
    conversion.onProgress = (ratio) => onProgress?.(ratio);
    try {
      await conversion.execute();
    } catch (error) {
      signal?.throwIfAborted();
      throw error;
    } finally {
      signal?.removeEventListener("abort", abort);
    }

    return {
      file: new File([target.buffer!], convertedName(file.name, output.format.fileExtension), {
        type: output.format.mimeType,
      }),
    };
  } finally {
    input.dispose();
  }
};
