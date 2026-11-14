import { ALL_FORMATS, BlobSource, Input } from "mediabunny";
import { describe, expect, it } from "vitest";

import { loadExampleFile } from "../example-files";
import { convertVideo } from "./core";

// 用 Mediabunny 读回输出的主轨 codec 和时长；具体 codec 取决于浏览器有哪些编码器，只断言在容器允许的范围内
const probe = async (file: File) => {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    const video = await input.getPrimaryVideoTrack();
    const audio = await input.getPrimaryAudioTrack();
    return {
      video: await video?.getCodec(),
      audio: await audio?.getCodec(),
      size: [await video?.getDisplayWidth(), await video?.getDisplayHeight()],
      duration: await input.computeDuration(),
    };
  } finally {
    input.dispose();
  }
};

describe("convertVideo", () => {
  it("transcodes WebM to MP4 with H.264 or a fallback the browser can encode", async () => {
    const progress: number[] = [];
    const { file } = await convertVideo(
      { file: await loadExampleFile("video-converter", "clip.webm"), format: "mp4" },
      { onProgress: (ratio) => progress.push(ratio) },
    );
    expect(file.name).toBe("clip.mp4");
    const result = await probe(file);
    expect(["avc", "hevc", "vp9", "av1"]).toContain(result.video);
    expect(["aac", "opus"]).toContain(result.audio);
    expect(result.size).toEqual([160, 120]);
    expect(result.duration).toBeCloseTo(1, 0);
    expect(progress.at(-1)).toBe(1);
  });

  it("copies H.264 and AAC from MOV into MP4 without re-encoding", async () => {
    const source = await loadExampleFile("video-converter", "clip.mov");
    const { file } = await convertVideo({ file: source, format: "mp4" }, {});
    expect(await probe(file)).toMatchObject({ video: "avc", audio: "aac" });
    // 只换容器，体积和原文件相近
    expect(Math.abs(file.size - source.size)).toBeLessThan(2_000);
  });

  it("rejects files without a video track", async () => {
    const audioOnly = await loadExampleFile("video-converter", "tone.webm");
    await expect(convertVideo({ file: audioOnly, format: "mp4" }, {})).rejects.toMatchObject({
      code: "no_video",
      field: "file",
    });
  });

  it("rejects files that are not videos", async () => {
    const garbage = new File(["not a video"], "broken.mp4", { type: "video/mp4" });
    await expect(convertVideo({ file: garbage, format: "webm" }, {})).rejects.toMatchObject({
      code: "invalid_video",
      field: "file",
    });
  });

  it("cancels a running conversion when aborted", async () => {
    const controller = new AbortController();
    const running = convertVideo(
      { file: await loadExampleFile("video-converter", "clip.mp4"), format: "webm" },
      { signal: controller.signal, onProgress: () => controller.abort() },
    );
    await expect(running).rejects.toMatchObject({ name: "AbortError" });
  });
});
