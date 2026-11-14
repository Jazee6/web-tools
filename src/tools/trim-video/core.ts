import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  type ConversionOptions,
  Input,
  MkvOutputFormat,
  MovOutputFormat,
  Mp4OutputFormat,
  Output,
  type OutputFormat,
  WebMOutputFormat,
} from "mediabunny";

import { primaryVideoTrack, replaceExtension, runConversion } from "@/lib/media/conversion";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

import { formatTime, parseTime } from "./time";

export interface TrimVideoInput {
  file: File;
  start: string;
  end: string;
  mode: "precise" | "fast";
}

// 输出容器和输入一样（按文件内容识别，不看扩展名）
const containers: Record<string, () => OutputFormat> = {
  "video/mp4": () => new Mp4OutputFormat({ fastStart: "in-memory" }),
  "video/quicktime": () => new MovOutputFormat({ fastStart: "in-memory" }),
  "video/webm": () => new WebMOutputFormat(),
  "video/x-matroska": () => new MkvOutputFormat(),
};

// fast 一律复制：从起点之前最近的关键帧开始，结尾可能因为 B 帧多出几帧。MP4 / MOV 支持负时间戳（编辑列表），
// 起点之前的帧留在文件里但不显示；WebM / MKV 不支持，时间轴整体平移到 0，多出来的画面会被看到。
// precise 只有在两端都不用切开时才复制（起点正好是关键帧、没有裁结尾），否则重新编码，从指定的那一帧开始、到指定的时间结束。
const copyOptions = (mode: TrimVideoInput["mode"], cutsEnd: boolean): ConversionOptions["copy"] => {
  if (mode === "fast") return { boundaryPolicy: "expand", shiftTolerance: Infinity };
  return cutsEnd ? false : { boundaryTolerance: 0 };
};

const parseField = (text: string, field: "start" | "end") => {
  const seconds = parseTime(text);
  if (seconds === undefined) throw new ToolError("invalid_time", { field, detail: text.trim() });
  return seconds;
};

// 输出整个放在内存里（BufferTarget），所以输入有体积上限。
export const trimVideo = async ({ file, start, end, mode }: TrimVideoInput, ctx: ToolContext) => {
  const from = start.trim() ? parseField(start, "start") : 0;
  const to = end.trim() ? parseField(end, "end") : undefined;
  if (from === 0 && to === undefined) throw new ToolError("range_required", { field: "start" });
  if (to !== undefined && to <= from) throw new ToolError("end_before_start", { field: "end" });

  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    await primaryVideoTrack(input);
    const create = containers[(await input.getFormat()).mimeType];
    if (!create) throw new ToolError("invalid_video", { field: "file" });

    const duration = await input.computeDuration();
    if (from >= duration) {
      throw new ToolError("start_past_end", { field: "start", detail: formatTime(duration) });
    }

    const last = Math.min(to ?? duration, duration);
    const target = new BufferTarget();
    const output = new Output({ format: create(), target });
    await runConversion(
      {
        input,
        output,
        trim: { start: from, end: last },
        copy: copyOptions(mode, last < duration),
      },
      ctx,
    );
    return {
      file: new File(
        [target.buffer!],
        replaceExtension(file.name, `-trimmed${output.format.fileExtension}`),
        { type: output.format.mimeType },
      ),
    };
  } finally {
    input.dispose();
  }
};
