import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  canEncodeAudio,
  Conversion,
  EncodedPacketSink,
  Input,
  Mp4OutputFormat,
  Output,
} from "mediabunny";
import { describe, expect, it } from "vitest";

import { loadExampleFile } from "../example-files";
import { extractAudio } from "./core";

// 样例 6 秒；MP4、MOV、MKV 是 H.264 + AAC（单声道 44.1 kHz），WebM 是 VP9 + Opus（单声道 48 kHz）
const load = (name: string) => loadExampleFile("extract-audio", name);

// 读回格式、轨道和时长
const probe = async (file: File) => {
  const input = new Input({
    source: new BlobSource(file),
    formats: ALL_FORMATS,
  });
  try {
    const audio = (await input.getPrimaryAudioTrack())!;
    return {
      format: (await input.getFormat()).name,
      video: (await input.getVideoTracks()).length,
      codec: await audio.getCodec(),
      channels: await audio.getNumberOfChannels(),
      sampleRate: await audio.getSampleRate(),
      duration: await input.computeDuration(),
    };
  } finally {
    input.dispose();
  }
};

// 主音频轨第一个数据包的字节：复制时与源完全相同
const firstPacket = async (file: File) => {
  const input = new Input({
    source: new BlobSource(file),
    formats: ALL_FORMATS,
  });
  try {
    const track = (await input.getPrimaryAudioTrack())!;
    return Array.from((await new EncodedPacketSink(track).getFirstPacket())!.data);
  } finally {
    input.dispose();
  }
};

describe("extractAudio", () => {
  it.each([
    ["clip.mp4", 44_100],
    ["clip.webm", 48_000],
  ])("encodes the sound of %s as MP3", async (name, sampleRate) => {
    const { file } = await extractAudio({ file: await load(name), format: "mp3" }, {});
    expect(file.name).toBe("clip.mp3");
    expect(file.type).toBe("audio/mpeg");
    const result = await probe(file);
    expect(result).toMatchObject({
      format: "MP3",
      video: 0,
      codec: "mp3",
      channels: 1,
      sampleRate,
    });
    expect(result.duration).toBeGreaterThan(5.8);
    expect(result.duration).toBeLessThan(6.2);
  });

  it("writes 16-bit WAV", async () => {
    const { file } = await extractAudio({ file: await load("clip.mov"), format: "wav" }, {});
    expect(file.name).toBe("clip.wav");
    expect(file.type).toBe("audio/wav");
    expect(await probe(file)).toMatchObject({
      format: "WAVE",
      codec: "pcm-s16",
      sampleRate: 44_100,
    });
    // 6 秒 × 44.1 kHz × 2 字节，加文件头
    expect(file.size).toBeGreaterThan(6 * 44_100 * 2 * 0.97);
  });

  it("copies AAC into M4A without re-encoding", async () => {
    const source = await load("clip.mp4");
    const { file } = await extractAudio({ file: source, format: "m4a" }, {});
    expect(file.name).toBe("clip.m4a");
    expect(file.type).toBe("audio/mp4");
    expect(await probe(file)).toMatchObject({
      video: 0,
      codec: "aac",
      sampleRate: 44_100,
    });
    expect(await firstPacket(file)).toEqual(await firstPacket(source));
  });

  it("encodes Opus as AAC where the browser can, or says it can't", async () => {
    // Firefox 没有 AAC 编码器
    const expected = (await canEncodeAudio("aac"))
      ? { video: 0, codec: "aac" }
      : { code: "aac_unavailable", field: "format" };
    const result = await extractAudio({ file: await load("clip.webm"), format: "m4a" }, {}).then(
      ({ file }) => probe(file),
      (error: unknown) => error,
    );
    expect(result).toMatchObject(expected);
  });

  it.each([
    ["clip.mp4", "clip.m4a", "audio/mp4", "aac"],
    ["clip.webm", "clip.ogg", "audio/ogg", "opus"],
  ])("keeps the original track of %s", async (name, output, type, codec) => {
    const source = await load(name);
    const { file } = await extractAudio({ file: source, format: "original" }, {});
    expect(file.name).toBe(output);
    expect(file.type).toBe(type);
    expect(await probe(file)).toMatchObject({ video: 0, codec });
    expect(await firstPacket(file)).toEqual(await firstPacket(source));
  });

  it("reports a video without sound", async () => {
    // 复制视频轨、丢弃音轨，得到一个没有声音的 MP4
    const input = new Input({
      source: new BlobSource(await load("clip.mp4")),
      formats: ALL_FORMATS,
    });
    const target = new BufferTarget();
    const output = new Output({ format: new Mp4OutputFormat(), target });
    const conversion = await Conversion.init({
      input,
      output,
      audio: { discard: true },
    });
    await conversion.execute();
    input.dispose();
    const silent = new File([target.buffer!], "silent.mp4", {
      type: "video/mp4",
    });
    await expect(extractAudio({ file: silent, format: "mp3" }, {})).rejects.toMatchObject({
      code: "no_audio",
      field: "file",
    });
  });

  it("reports a file it can't read", async () => {
    const broken = new File(["not a video"], "broken.mp4", {
      type: "video/mp4",
    });
    await expect(extractAudio({ file: broken, format: "mp3" }, {})).rejects.toMatchObject({
      code: "invalid_video",
      field: "file",
    });
  });

  it("cancels a running extraction when aborted", async () => {
    const controller = new AbortController();
    const running = extractAudio(
      { file: await load("clip.mp4"), format: "mp3" },
      { signal: controller.signal, onProgress: () => controller.abort() },
    );
    await expect(running).rejects.toMatchObject({ name: "AbortError" });
  });
});
