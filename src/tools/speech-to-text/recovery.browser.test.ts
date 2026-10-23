import { describe, expect, it } from "vitest";

import { loadExampleFile } from "../example-files";
import { transcribe } from "./core";

// 单独的测试文件：模块状态是新的，模型还没加载，取消下载时确实在下载
const input = async () => ({
  file: await loadExampleFile("speech-to-text", "speech.mp3"),
  language: "auto" as const,
});
const expected = "Hello, every tool on this website runs in your browser.";

describe("transcribe recovery", () => {
  it("works again after cancelling the model download", async () => {
    await caches.delete("models");
    const controller = new AbortController();
    const cancelled = transcribe(
      await input(),
      {
        signal: controller.signal,
        onProgress: (_, stage) => stage === "download" && controller.abort(),
      },
      "wasm",
    );
    await expect(cancelled).rejects.toMatchObject({ name: "AbortError" });
    expect((await transcribe(await input(), {}, "wasm")).text).toBe(expected);
  }, 120_000);

  it("works again after cancelling during generation", async () => {
    const controller = new AbortController();
    let starts = 0;
    const cancelled = transcribe(
      await input(),
      {
        signal: controller.signal,
        // 0.1 报两次：解码结束时、开始生成前；第二次时模型已就绪
        onProgress: (ratio, stage) =>
          stage === undefined && ratio === 0.1 && ++starts === 2 && controller.abort(),
      },
      "wasm",
    );
    await expect(cancelled).rejects.toMatchObject({ name: "AbortError" });
    expect((await transcribe(await input(), {}, "wasm")).text).toBe(expected);
  }, 120_000);
});
