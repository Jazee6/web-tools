import { Conversion, type ConversionOptions, type Input, type InputVideoTrack } from "mediabunny";

import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

// 读取主视频轨；读不出来或没有视频轨的文件抛出 ToolError
export const primaryVideoTrack = async (input: Input): Promise<InputVideoTrack> => {
  const video = await input.getPrimaryVideoTrack().catch(() => {
    throw new ToolError("invalid_video", { field: "file" });
  });
  if (!video) throw new ToolError("no_video", { field: "file" });
  return video;
};

// 只处理主视频轨和主音频轨，字幕和多余的轨道丢弃。任何一条主轨被丢弃（无法解码、浏览器没有可用编码器）
// 都报错，不静默输出没有声音或没有画面的文件；调用方用 discard: true 主动丢弃的轨道除外。
export const runConversion = async (
  options: Omit<ConversionOptions, "tracks" | "showWarnings">,
  { signal, onProgress }: ToolContext,
): Promise<void> => {
  const conversion = await Conversion.init({ ...options, tracks: "primary", showWarnings: false });
  // 认不出 codec 的轨道按无法读取处理；认得出但解不了码或没有可用编码器的，把源 codec 放在 detail
  const dropped = conversion.discardedTracks.filter(({ reason }) => reason !== "discarded_by_user");
  const codec = await dropped[0]?.track.getCodec();
  if (!conversion.isValid || dropped.length > 0) {
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
};

export const replaceExtension = (name: string, extension: string): string => {
  const dot = name.lastIndexOf(".");
  return `${dot > 0 ? name.slice(0, dot) : name}${extension}`;
};
