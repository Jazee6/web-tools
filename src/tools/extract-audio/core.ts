import { ALL_FORMATS, BlobSource, BufferTarget, Input, Output } from "mediabunny";

import { audioConversion, copyTargetOf, runAudioConversion } from "@/lib/media/audio";
import { replaceExtension } from "@/lib/media/conversion";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

import type { audioFormats } from "./tool";

export interface ExtractAudioInput {
  file: File;
  format: (typeof audioFormats)[number];
}

// 只取主音频轨，视频轨丢弃。MP3 和 M4A 是 192 kbps，源已经是同一 codec 时直接复制；
// original 原样复制，容器按源 codec 选。输出整个放在内存里（BufferTarget），所以输入有体积上限
export const extractAudio = async ({ file, format }: ExtractAudioInput, ctx: ToolContext) => {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    const track = await input.getPrimaryAudioTrack().catch(() => {
      throw new ToolError("invalid_video", { field: "file" });
    });
    if (!track) throw new ToolError("no_audio", { field: "file" });
    const { target, options } =
      format === "original"
        ? { target: copyTargetOf(await track.getCodec()), options: {} }
        : await audioConversion(format, track, { bitrate: 192_000, copySameCodec: true });

    const buffer = new BufferTarget();
    const output = new Output({ format: target.create(), target: buffer });
    await runAudioConversion({ input, output, audio: options }, track, ctx, "invalid_video");
    return {
      file: new File([buffer.buffer!], replaceExtension(file.name, target.extension), {
        type: target.type,
      }),
    };
  } finally {
    input.dispose();
  }
};
