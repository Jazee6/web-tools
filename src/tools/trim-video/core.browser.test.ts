import { ALL_FORMATS, BlobSource, EncodedPacketSink, Input, VideoSampleSink } from "mediabunny";
import { describe, expect, it } from "vitest";

import { loadExampleFile } from "../example-files";
import { trimVideo } from "./core";

// 样例 6 秒，每秒一种纯色（红、绿、蓝、黄、品红、青），关键帧每 2 秒一个；MP4、MOV、MKV 是 H.264 + AAC，WebM 是 VP9 + Opus
const load = (name: string) => loadExampleFile("trim-video", name);

const nameOfColor = ([r, g, b]: number[]) => {
  const on = [r! > 128, g! > 128, b! > 128].map(Number).join("");
  return (
    {
      "100": "red",
      "010": "green",
      "001": "blue",
      "110": "yellow",
      "101": "magenta",
      "011": "cyan",
    }[on] ?? on
  );
};

// 读回主轨 codec、时长和播放起点（时间 0）那一帧的颜色
const probe = async (file: File) => {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    const video = (await input.getPrimaryVideoTrack())!;
    const audio = await input.getPrimaryAudioTrack();
    const sample = (await new VideoSampleSink(video).getSample(0))!;
    const canvas = new OffscreenCanvas(16, 16);
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    sample.draw(context, 0, 0, 16, 16);
    sample.close();
    return {
      video: await video.getCodec(),
      audio: await audio?.getCodec(),
      duration: await input.computeDuration(),
      startColor: nameOfColor(Array.from(context.getImageData(8, 8, 1, 1).data.slice(0, 3))),
    };
  } finally {
    input.dispose();
  }
};

const firstPacketBytes = async (file: File, timestamp: number) => {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    const packets = new EncodedPacketSink((await input.getPrimaryVideoTrack())!);
    return Array.from((await packets.getKeyPacket(timestamp))!.data);
  } finally {
    input.dispose();
  }
};

const mimeTypes: Record<string, string> = {
  "clip.mp4": "video/mp4",
  "clip.mov": "video/quicktime",
  "clip.webm": "video/webm",
  "clip.mkv": "video/x-matroska",
};

// 裁掉的画面可能是敏感内容：precise 不能留在文件里，fast 的 MP4 留着但播放时看不到（内容里已写明）
const colorsInFile = async (file: File) => {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    const packets = new EncodedPacketSink((await input.getPrimaryVideoTrack())!);
    const sink = new VideoSampleSink((await input.getPrimaryVideoTrack())!);
    const colors = new Set<string>();
    const canvas = new OffscreenCanvas(16, 16);
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    for await (const sample of sink.samples(-Infinity)) {
      sample.draw(context, 0, 0, 16, 16);
      colors.add(nameOfColor(Array.from(context.getImageData(8, 8, 1, 1).data.slice(0, 3))));
      sample.close();
    }
    return { colors, first: (await packets.getFirstPacket())!.timestamp };
  } finally {
    input.dispose();
  }
};

describe("trimVideo", () => {
  it.each(Object.keys(mimeTypes))("precise mode cuts %s at both exact times", async (name) => {
    const progress: number[] = [];
    const { file } = await trimVideo(
      { file: await load(name), start: "3", end: "5", mode: "precise" },
      { onProgress: (ratio) => progress.push(ratio) },
    );
    const result = await probe(file);
    expect(result.startColor).toBe("yellow");
    expect(Math.abs(result.duration - 2)).toBeLessThan(0.1);
    expect(result.audio).toBeTruthy();
    expect(progress.at(-1)).toBe(1);
    expect(file.type).toBe(mimeTypes[name]);
    expect(file.name).toBe(name.replace(".", "-trimmed."));
  });

  // MP4 / MOV 用编辑列表隐藏起点之前的帧；WebM / MKV 从 2 秒的关键帧（蓝色）开始，比要求的多 1 秒
  it.each([
    ["clip.mp4", "yellow", 2],
    ["clip.mov", "yellow", 2],
    ["clip.webm", "blue", 3],
    ["clip.mkv", "blue", 3],
  ])("fast mode copies %s without re-encoding", async (name, startColor, duration) => {
    const source = await load(name);
    const { file } = await trimVideo({ file: source, start: "3", end: "5", mode: "fast" }, {});
    const original = await probe(source);
    const result = await probe(file);
    expect(result.startColor).toBe(startColor);
    expect(result.duration).toBeGreaterThanOrEqual(duration - 0.05);
    expect(result.duration).toBeLessThan(duration + 0.5);
    expect(result.video).toBe(original.video);
    expect(result.audio).toBe(original.audio);
    expect(await firstPacketBytes(file, 0)).toEqual(await firstPacketBytes(source, 3));
  });

  it("copies in precise mode when the start is on a key frame and the end is not cut", async () => {
    const source = await load("clip.mp4");
    const { file } = await trimVideo({ file: source, start: "2", end: "", mode: "precise" }, {});
    expect(await probe(file)).toMatchObject({ startColor: "blue", video: "avc" });
    expect(await firstPacketBytes(file, 0)).toEqual(await firstPacketBytes(source, 2));
  });

  it.each(Object.keys(mimeTypes))("precise mode leaves no cut footage in %s", async (name) => {
    const { file } = await trimVideo(
      { file: await load(name), start: "3", end: "5", mode: "precise" },
      {},
    );
    const { colors, first } = await colorsInFile(file);
    expect(first).toBeGreaterThanOrEqual(0);
    expect([...colors].toSorted()).toEqual(["magenta", "yellow"]);
  });

  it("precise mode with a start on a key frame leaves no earlier footage", async () => {
    const { file } = await trimVideo(
      { file: await load("clip.mp4"), start: "2", end: "", mode: "precise" },
      {},
    );
    const { colors } = await colorsInFile(file);
    expect(colors.has("red")).toBe(false);
    expect(colors.has("green")).toBe(false);
  });

  it("clamps an end past the video to its duration", async () => {
    const { file } = await trimVideo(
      { file: await load("clip.mp4"), start: "4", end: "1:00", mode: "precise" },
      {},
    );
    expect((await probe(file)).duration).toBeCloseTo(2, 0);
  });

  it("requires a range", async () => {
    await expect(
      trimVideo({ file: await load("clip.mp4"), start: "", end: " ", mode: "fast" }, {}),
    ).rejects.toMatchObject({ code: "range_required", field: "start" });
  });

  it("rejects malformed times and names the field", async () => {
    await expect(
      trimVideo({ file: await load("clip.mp4"), start: "abc", end: "", mode: "fast" }, {}),
    ).rejects.toMatchObject({ code: "invalid_time", field: "start", detail: "abc" });
    await expect(
      trimVideo({ file: await load("clip.mp4"), start: "", end: "1:99", mode: "fast" }, {}),
    ).rejects.toMatchObject({ code: "invalid_time", field: "end", detail: "1:99" });
  });

  it("rejects an end at or before the start", async () => {
    await expect(
      trimVideo({ file: await load("clip.mp4"), start: "3", end: "3", mode: "fast" }, {}),
    ).rejects.toMatchObject({ code: "end_before_start", field: "end" });
  });

  it("reports the duration when the start is past the end of the video", async () => {
    await expect(
      trimVideo({ file: await load("clip.mp4"), start: "10", end: "", mode: "fast" }, {}),
    ).rejects.toMatchObject({ code: "start_past_end", field: "start" });
  });

  it("rejects files without a video track or that are not videos", async () => {
    const audioOnly = await loadExampleFile("video-converter", "tone.webm");
    await expect(
      trimVideo({ file: audioOnly, start: "0", end: "0:01", mode: "fast" }, {}),
    ).rejects.toMatchObject({ code: "no_video", field: "file" });
    const garbage = new File(["not a video"], "broken.mp4", { type: "video/mp4" });
    await expect(
      trimVideo({ file: garbage, start: "0", end: "1", mode: "fast" }, {}),
    ).rejects.toMatchObject({ code: "invalid_video", field: "file" });
  });

  it("cancels a running trim when aborted", async () => {
    const controller = new AbortController();
    const running = trimVideo(
      { file: await load("clip.mp4"), start: "1", end: "5", mode: "precise" },
      { signal: controller.signal, onProgress: () => controller.abort() },
    );
    await expect(running).rejects.toMatchObject({ name: "AbortError" });
  });
});
