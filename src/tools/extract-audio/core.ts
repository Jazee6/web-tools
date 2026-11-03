import { registerMp3Encoder } from "@mediabunny/mp3-encoder";
import {
  ALL_FORMATS,
  type AudioCodec,
  BlobSource,
  BufferTarget,
  canEncodeAudio,
  type ConversionAudioOptions,
  FlacOutputFormat,
  Input,
  type InputAudioTrack,
  MkvOutputFormat,
  Mp3OutputFormat,
  Mp4OutputFormat,
  OggOutputFormat,
  Output,
  type OutputFormat,
  PCM_AUDIO_CODECS,
  Quality,
  WavOutputFormat,
} from "mediabunny";

import { replaceExtension, runConversion } from "@/lib/media/conversion";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

import type { audioFormats } from "./tool";

export interface ExtractAudioInput {
  file: File;
  format: (typeof audioFormats)[number];
}

interface Target {
  create: () => OutputFormat;
  // Mediabunny 的 MP4、Ogg、MKV 默认给视频的扩展名和 MIME，只有音频时自己指定
  extension: string;
  type: string;
}

const m4a: Target = {
  create: () => new Mp4OutputFormat({ fastStart: "in-memory" }),
  extension: ".m4a",
  type: "audio/mp4",
};
const mp3: Target = {
  create: () => new Mp3OutputFormat(),
  extension: ".mp3",
  type: "audio/mpeg",
};
const wav: Target = {
  create: () => new WavOutputFormat(),
  extension: ".wav",
  type: "audio/wav",
};

// original：音轨原样复制，容器按源 codec 选；没有对应纯音频容器的（AC-3、DTS 等）放进 MKA
const copyTargetOf = (codec: AudioCodec | null): Target => {
  if (codec === "aac") return m4a;
  if (codec === "mp3") return mp3;
  if (codec === "opus" || codec === "vorbis") {
    return {
      create: () => new OggOutputFormat(),
      extension: ".ogg",
      type: "audio/ogg",
    };
  }
  if (codec === "flac") {
    return {
      create: () => new FlacOutputFormat(),
      extension: ".flac",
      type: "audio/flac",
    };
  }
  if (codec && (PCM_AUDIO_CODECS as readonly string[]).includes(codec)) return wav;
  return {
    create: () => new MkvOutputFormat(),
    extension: ".mka",
    type: "audio/x-matroska",
  };
};

// 只在要编码时给码率：Mediabunny 看到 quality 就会重新编码，同 codec 的源也不再复制
const encodeAs = (target: AudioCodec, source: AudioCodec | null): ConversionAudioOptions =>
  source === target
    ? { codec: target }
    : { codec: target, quality: new Quality({ bitrate: 192_000 }) };

// LAME 只支持这些采样率（MPEG-1 / 2 / 2.5）和 1–2 声道
const MP3_SAMPLE_RATES = [48_000, 44_100, 32_000, 24_000, 22_050, 16_000, 12_000, 11_025, 8000];

// 浏览器的 WebCodecs 不能编码 MP3，改用 LAME 的 WASM 编码器（Mediabunny 优先用注册的编码器，各浏览器输出一致）。
// 静态引入：按需 import 的 chunk 会反过来引入 Worker 的入口脚本取共用模块，WebKit 会把入口再实例化一次
// （exposeRun 注册两次、Mediabunny 有两份）。LAME 的 Worker 和 WASM 只在第一次编码 MP3 时启动
registerMp3Encoder();

const audioOptions = async (
  format: ExtractAudioInput["format"],
  track: InputAudioTrack,
  codec: AudioCodec | null,
): Promise<{ target: Target; options: ConversionAudioOptions }> => {
  switch (format) {
    case "mp3": {
      // 源已经是 MP3 时直接复制（MP3 本身最多 2 声道，采样率也都在 LAME 支持的范围内）
      if (codec === "mp3") return { target: mp3, options: { codec: "mp3" } };
      const sampleRate = await track.getSampleRate();
      return {
        target: mp3,
        options: {
          ...encodeAs("mp3", codec),
          numberOfChannels: Math.min(await track.getNumberOfChannels(), 2),
          sampleRate: MP3_SAMPLE_RATES.includes(sampleRate) ? sampleRate : 48_000,
        },
      };
    }
    case "m4a": {
      // Firefox 没有 AAC 编码器；源已经是 AAC 时复制，不需要编码
      if (codec !== "aac" && !(await canEncodeAudio("aac"))) {
        throw new ToolError("aac_unavailable", { field: "format" });
      }
      return { target: m4a, options: encodeAs("aac", codec) };
    }
    case "wav": {
      return { target: wav, options: { codec: "pcm-s16" } };
    }
    case "original": {
      return { target: copyTargetOf(codec), options: {} };
    }
  }
};

// 只取主音频轨，视频轨丢弃。输出整个放在内存里（BufferTarget），所以输入有体积上限
export const extractAudio = async ({ file, format }: ExtractAudioInput, ctx: ToolContext) => {
  const input = new Input({
    source: new BlobSource(file),
    formats: ALL_FORMATS,
  });
  try {
    const track = await input.getPrimaryAudioTrack().catch(() => {
      throw new ToolError("invalid_video", { field: "file" });
    });
    if (!track) throw new ToolError("no_audio", { field: "file" });
    const codec = await track.getCodec();
    const { target, options } = await audioOptions(format, track, codec);

    const buffer = new BufferTarget();
    const output = new Output({ format: target.create(), target: buffer });
    await runConversion({ input, output, video: { discard: true }, audio: options }, ctx);
    return {
      file: new File([buffer.buffer!], replaceExtension(file.name, target.extension), {
        type: target.type,
      }),
    };
  } finally {
    input.dispose();
  }
};
