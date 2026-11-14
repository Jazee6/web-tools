import { describe, expect, it } from "vitest";

import type { ProgressStage } from "@/lib/tool-contract/define-tool";

import { loadExampleFile } from "../example-files";
import { imageToText } from "./core";

const example = (name: string) => loadExampleFile("image-to-text", name);

// 白底上画几行字，返回 PNG。用画布画字只是为了得到浏览器各自的字形：结果只断言能读出的内容，不做逐字比较
const renderLines = async (lines: string[], angle = 0) => {
  const canvas = new OffscreenCanvas(900, 140 + lines.length * 70);
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#f4efe4";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate((angle * Math.PI) / 180);
  context.translate(-canvas.width / 2, -canvas.height / 2);
  context.fillStyle = "#1a1a1a";
  context.font = "40px sans-serif";
  for (const [index, line] of lines.entries()) context.fillText(line, 80, 110 + index * 70);
  const blob = await canvas.convertToBlob({ type: "image/png" });
  return new File([blob], "lines.png", { type: "image/png" });
};

describe("imageToText", () => {
  it("reads the example and reports download and processing progress", async () => {
    const progress: [number, ProgressStage | undefined][] = [];
    const { text } = await imageToText(
      { file: await example("english.png") },
      { onProgress: (ratio, stage) => progress.push([ratio, stage]) },
    );
    expect(text).toBe(
      "Image to Text runs in your browser.\nNothing is uploaded to a server.\n\nSecond paragraph: 42 files, 3.5 MB.",
    );
    // 每个测试文件里首次运行时加载模型（缓存命中也按文件大小回报），下载阶段走到 100%
    expect(progress.findLast(([, stage]) => stage === "download")?.[0]).toBe(1);
    expect(progress.at(-1)).toEqual([1, undefined]);
  }, 120_000);

  it("reads Chinese, Japanese and accented Latin text in one image", async () => {
    const { text } = await imageToText({ file: await example("mixed.png") });
    expect(text).toBe(
      "图片转文字在浏览器里运行。\n画像はアップロードされません。\nGröße ändern, café, niño, ação",
    );
  }, 60_000);

  it("reads tilted lines", async () => {
    const { text } = await imageToText({
      file: await renderLines(["Tilted receipt TOTAL 42.50", "Thank you for shopping"], -8),
    });
    expect(text).toMatch(/TOTAL 42\.50/);
    expect(text.split("\n")).toHaveLength(2);
  }, 60_000);

  it("reports images without text", async () => {
    await expect(imageToText({ file: await renderLines([]) })).rejects.toMatchObject({
      code: "no_text",
    });
  }, 60_000);

  it("reports files that are not images before loading the models", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "broken.png", { type: "image/png" });
    await expect(imageToText({ file })).rejects.toMatchObject({ code: "decode_failed" });
  });
});
