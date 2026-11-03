import { ALL_FORMATS, BlobSource, BufferTarget, Input, Output } from "mediabunny";

import { audioConversion, runAudioConversion } from "@/lib/media/audio";
import { replaceExtension } from "@/lib/media/conversion";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

import type { audioBitrates, audioFormats } from "./tool";

export interface ConvertAudioInput {
  file: File;
  format: (typeof audioFormats)[number];
  bitrate: (typeof audioBitrates)[number];
}

// 只转换主音频轨，封面等其他轨道丢弃。有损格式总是按选定的码率重新编码（同一格式也是，用来改码率），
// WAV 的源已经是 16 位 PCM 时直接复制。输出整个放在内存里（BufferTarget），所以输入有体积上限
export const convertAudio = async (
  { file, format, bitrate }: ConvertAudioInput,
  ctx: ToolContext,
) => {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    const track = await input.getPrimaryAudioTrack().catch(() => {
      throw new ToolError("invalid_audio", { field: "file" });
    });
    if (!track) throw new ToolError("invalid_audio", { field: "file" });
    const { target, options } = await audioConversion(format, track, {
      bitrate: Number(bitrate) * 1000,
      copySameCodec: false,
    });

    const buffer = new BufferTarget();
    const output = new Output({ format: target.create(), target: buffer });
    await runAudioConversion({ input, output, audio: options }, track, ctx, "invalid_audio");
    return {
      file: new File([buffer.buffer!], replaceExtension(file.name, target.extension), {
        type: target.type,
      }),
    };
  } finally {
    input.dispose();
  }
};
