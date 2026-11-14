import { describe, expect, it } from "vitest";

import type { ProgressStage } from "@/lib/tool-contract/define-tool";

import { loadExampleFile } from "../example-files";
import { type Backend, detectBackend, transcribe } from "./core";

const example = (name: string) => loadExampleFile("speech-to-text", name);

// WASM 路径在所有浏览器上都跑；WebGPU 路径只在有真实 GPU 且支持 shader-f16 的浏览器上跑
// （本机 macOS 上的 WebKit；headless Chromium 只有软件回退的 SwiftShader，Linux CI 上通常都没有）
const backends: Backend[] = (await detectBackend()) === "webgpu" ? ["wasm", "webgpu"] : ["wasm"];

describe.each(backends)("transcribe on %s", (backend) => {
  it("transcribes English speech to text and SRT subtitles", async () => {
    const progress: [number, ProgressStage | undefined][] = [];
    const { text, subtitles } = await transcribe(
      { file: await example("speech.mp3"), language: "auto" },
      { onProgress: (ratio, stage) => progress.push([ratio, stage]) },
      backend,
    );
    expect(text).toBe("Hello, every tool on this website runs in your browser.");
    expect(subtitles.name).toBe("speech.srt");
    expect(subtitles.type).toBe("application/x-subrip");
    expect(await subtitles.text()).toMatch(
      /^1\n00:00:00,000 --> 00:00:0\d,\d{3}\nHello, every tool on this website runs in your browser\.\n$/,
    );
    // 每个测试文件里首次用某种后端时加载模型（缓存命中也按文件大小回报），下载阶段走到 100%
    expect(progress.findLast(([, stage]) => stage === "download")?.[0]).toBe(1);
    expect(progress.at(-1)).toEqual([1, undefined]);
  }, 120_000);

  it("transcribes in the chosen language", async () => {
    const { text } = await transcribe(
      { file: await example("german.wav"), language: "de" },
      {},
      backend,
    );
    expect(text).toBe("Guten Morgen, wie geht es dir heute?");
  }, 120_000);

  // Transformers.js 自己不识别语言（不指定时按英语转录），自动识别由 core 实现
  it("detects the spoken language automatically", async () => {
    const german = await transcribe(
      { file: await example("german.wav"), language: "auto" },
      {},
      backend,
    );
    expect(german.text).toBe("Guten Morgen, wie geht es dir heute?");
    const chinese = await transcribe(
      { file: await example("chinese.wav"), language: "auto" },
      {},
      backend,
    );
    // Whisper 常输出繁体字，只断言简繁相同的字
    expect(chinese.text).toMatch(/^你好.*工具.*你的/);
  }, 120_000);
});

describe("transcribe", () => {
  it("rejects files without an audio track", async () => {
    await expect(
      transcribe({ file: await example("silent.mp4"), language: "auto" }, {}),
    ).rejects.toMatchObject({ code: "no_audio", field: "file" });
  });

  it("rejects files that are not audio", async () => {
    const garbage = new File(["not audio"], "broken.mp3", { type: "audio/mpeg" });
    await expect(transcribe({ file: garbage, language: "auto" }, {})).rejects.toMatchObject({
      code: "invalid_audio",
      field: "file",
    });
  });

  it("cancels a running transcription when aborted", async () => {
    const controller = new AbortController();
    const running = transcribe(
      { file: await example("speech.mp3"), language: "auto" },
      {
        signal: controller.signal,
        // 解码完成、开始转录时取消
        onProgress: (ratio, stage) => stage === undefined && ratio >= 0.1 && controller.abort(),
      },
      "wasm",
    );
    await expect(running).rejects.toMatchObject({ name: "AbortError" });
  }, 120_000);
});
