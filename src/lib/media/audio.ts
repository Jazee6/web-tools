import { registerMp3Encoder } from "@mediabunny/mp3-encoder";
import {
  type AudioCodec,
  canEncodeAudio,
  type ConversionAudioOptions,
  type ConversionOptions,
  FlacOutputFormat,
  type InputAudioTrack,
  MkvOutputFormat,
  Mp3OutputFormat,
  Mp4OutputFormat,
  OggOutputFormat,
  type OutputFormat,
  PCM_AUDIO_CODECS,
  Quality,
  WavOutputFormat,
} from "mediabunny";

import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

import { runConversion } from "./conversion";

// 浏览器的 WebCodecs 不能编码 MP3，改用 LAME 的 WASM 编码器（Mediabunny 优先用注册的编码器，各浏览器输出一致）。
// 静态引入：按需 import 的 chunk 会反过来引入 Worker 的入口脚本取共用模块，WebKit 会把入口再实例化一次
// （exposeRun 注册两次、Mediabunny 有两份）。LAME 的 Worker 和 WASM 只在第一次编码 MP3 时启动
registerMp3Encoder();

export interface AudioTarget {
  create: () => OutputFormat;
  // Mediabunny 的 MP4、Ogg、MKV 默认给视频的扩展名和 MIME，只有音频时自己指定
  extension: string;
  type: string;
}

const m4a: AudioTarget = {
  create: () => new Mp4OutputFormat({ fastStart: "in-memory" }),
  extension: ".m4a",
  type: "audio/mp4",
};
const mp3: AudioTarget = {
  create: () => new Mp3OutputFormat(),
  extension: ".mp3",
  type: "audio/mpeg",
};
const wav: AudioTarget = {
  create: () => new WavOutputFormat(),
  extension: ".wav",
  type: "audio/wav",
};
const ogg: AudioTarget = {
  create: () => new OggOutputFormat(),
  extension: ".ogg",
  type: "audio/ogg",
};

// 原样复制音轨时，容器按源 codec 选；没有对应纯音频容器的（AC-3、DTS 等）放进 MKA
export const copyTargetOf = (codec: AudioCodec | null): AudioTarget => {
  if (codec === "aac") return m4a;
  if (codec === "mp3") return mp3;
  if (codec === "opus" || codec === "vorbis") return ogg;
  if (codec === "flac") {
    return { create: () => new FlacOutputFormat(), extension: ".flac", type: "audio/flac" };
  }
  if (codec && (PCM_AUDIO_CODECS as readonly string[]).includes(codec)) return wav;
  return { create: () => new MkvOutputFormat(), extension: ".mka", type: "audio/x-matroska" };
};

// 编码成的格式；codec 是目标 codec，rates 是编码器接受的采样率（第一个是不支持时的默认值）
const encoded = {
  // LAME：MPEG-1 / 2 / 2.5 的采样率
  mp3: {
    target: mp3,
    codec: "mp3",
    rates: [48_000, 44_100, 32_000, 24_000, 22_050, 16_000, 12_000, 11_025, 8000],
  },
  m4a: { target: m4a, codec: "aac", rates: [48_000, 44_100] },
  // Opus 内部总是 48 kHz
  ogg: { target: ogg, codec: "opus", rates: [48_000] },
} as const satisfies Record<string, { target: AudioTarget; codec: AudioCodec; rates: number[] }>;

export type AudioFormat = keyof typeof encoded | "wav";

export interface AudioEncoding {
  // 有损格式的码率（bit/s）
  bitrate: number;
  // 源已经是目标 codec 时直接复制，不按 bitrate 重新编码
  copySameCodec: boolean;
}

// 把音轨转成 format 的转换选项。有损格式最多 2 声道（环绕声混缩为立体声），采样率不受支持时用默认值；
// WAV 是 16 位 PCM，声道和采样率不变。浏览器不能编码 AAC 时（Firefox）抛出 aac_unavailable
export const audioConversion = async (
  format: AudioFormat,
  track: InputAudioTrack,
  { bitrate, copySameCodec }: AudioEncoding,
): Promise<{ target: AudioTarget; options: ConversionAudioOptions }> => {
  const source = await track.getCodec();
  if (format === "wav") return { target: wav, options: { codec: "pcm-s16" } };

  const { target, codec, rates } = encoded[format];
  // Mediabunny 看到 quality、声道或采样率的设置就会重新编码，所以复制时什么都不给
  if (copySameCodec && source === codec) return { target, options: { codec } };
  if (codec === "aac" && !(await canEncodeAudio("aac"))) {
    throw new ToolError("aac_unavailable", { field: "format" });
  }
  const sourceRate = await track.getSampleRate();
  const numberOfChannels = Math.min(await track.getNumberOfChannels(), 2);
  const sampleRate = (rates as readonly number[]).includes(sourceRate) ? sourceRate : rates[0];
  return {
    target,
    options: {
      codec,
      // Firefox 的 Opus 编码器每声道最多 256 kbps，更高时 isConfigSupported 说支持、编码时却抛 EncodingError
      quality: new Quality({
        bitrate: codec === "opus" ? Math.min(bitrate, 256_000 * numberOfChannels) : bitrate,
      }),
      numberOfChannels,
      sampleRate,
      forceTranscode: true,
    },
  };
};

// 只转换主音频轨（视频轨丢弃）。浏览器说能解码、真正解码时却失败的（如 WebKit 的 FLAC），
// WebCodecs 抛出 EncodingError；只有一条音轨，所以按这条音轨的 codec 报 unsupported_codec
export const runAudioConversion = async (
  options: Omit<ConversionOptions, "tracks" | "showWarnings" | "video">,
  track: InputAudioTrack,
  ctx: ToolContext,
  invalid: "invalid_video" | "invalid_audio",
): Promise<void> => {
  try {
    await runConversion({ ...options, video: { discard: true } }, ctx, invalid);
  } catch (error) {
    if (error instanceof DOMException && error.name === "EncodingError") {
      throw new ToolError("unsupported_codec", {
        field: "file",
        detail: (await track.getCodec()) ?? undefined,
      });
    }
    throw error;
  }
};
