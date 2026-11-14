import { describe, expect, it } from "vitest";

import { loadExampleFile } from "../example-files";
import { compressImages, estimateSizes } from "./core";

const examples = ["photo.jpg", "photo.webp", "photo.avif", "chart.png"];

// 噪声叠加渐变：约 2.6 MP，走图块采样路径；JPEG 体积足够大，外推误差才有意义
const makeLargeJpeg = async () => {
  const canvas = new OffscreenCanvas(2048, 1280);
  const context = canvas.getContext("2d")!;
  const gradient = context.createLinearGradient(0, 0, 2048, 1280);
  gradient.addColorStop(0, "#335");
  gradient.addColorStop(1, "#eb7");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 2048, 1280);
  for (let i = 0; i < 3000; i++) {
    context.fillStyle = `hsl(${(i * 47) % 360} 60% ${30 + (i % 40)}%)`;
    context.fillRect((i * 7919) % 2048, (i * 104729) % 1280, 20 + (i % 60), 20 + (i % 45));
  }
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.95 });
  return new File([blob], "large.jpg", { type: "image/jpeg", lastModified: 1 });
};

// 只生成一次：多个浏览器并行跑整套测试时，重复创建大画布会撑爆内存
const largeJpeg = (() => {
  let cached: Promise<File> | undefined;
  return () => (cached ??= makeLargeJpeg());
})();

describe("compressImages", () => {
  it("compresses every file in order and keeps names and formats", async () => {
    const files = await Promise.all(
      examples.map((name) => loadExampleFile("image-compressor", name)),
    );
    const progress: number[] = [];
    const { files: compressed } = await compressImages(
      { files, quality: 60 },
      { onProgress: (ratio) => progress.push(ratio) },
    );
    expect(compressed.map((file) => file.name)).toEqual([
      "photo-compressed.jpg",
      "photo-compressed.webp",
      "photo-compressed.avif",
      "chart-compressed.png",
    ]);
    expect(compressed.map((file) => file.type)).toEqual(files.map((file) => file.type));
    for (const [index, file] of compressed.entries()) {
      expect(file.size).toBeLessThanOrEqual(files[index]!.size);
    }
    expect(progress).toEqual([0, 0.25, 0.5, 0.75]);
  });

  it("stops between files when aborted", async () => {
    const file = await loadExampleFile("image-compressor", "photo.jpg");
    const controller = new AbortController();
    controller.abort();
    await expect(
      compressImages({ files: [file, file], quality: 60 }, { signal: controller.signal }),
    ).rejects.toMatchObject({ name: "AbortError" });
  });

  it("names the file that cannot be decoded", async () => {
    const broken = new File([new Uint8Array(64)], "broken.jpg", { type: "image/jpeg" });
    await expect(compressImages({ files: [broken], quality: 60 })).rejects.toMatchObject({
      code: "decode_failed",
      field: "files",
      detail: "broken.jpg",
    });
  });
});

describe("estimateSizes", () => {
  it("is the real size for images small enough to be encoded whole", async () => {
    const files = await Promise.all(
      examples.map((name) => loadExampleFile("image-compressor", name)),
    );
    const sizes = await estimateSizes({ files, quality: 60 });
    const { files: compressed } = await compressImages({ files, quality: 60 });
    expect(sizes).toEqual(compressed.map((file) => file.size));
  });

  it("extrapolates large images from tiles, within a reasonable error", async () => {
    const file = await largeJpeg();
    for (const quality of [40, 75]) {
      const [estimate] = await estimateSizes({ files: [file], quality });
      const { files: compressed } = await compressImages({ files: [file], quality });
      const actual = compressed[0]!.size;
      expect(estimate).not.toBeNull();
      expect(estimate! / actual).toBeGreaterThan(0.8);
      expect(estimate! / actual).toBeLessThan(1.25);
    }
  }, 60_000);

  it("never exceeds the original size and gives null for unreadable files", async () => {
    const tiny = await loadExampleFile("image-compressor", "chart.png");
    const broken = new File([new Uint8Array(64)], "broken.png", { type: "image/png" });
    const [small, unreadable] = await estimateSizes({ files: [tiny, broken], quality: 100 });
    expect(small).toBeLessThanOrEqual(tiny.size);
    expect(unreadable).toBeNull();
  });

  it("is cancellable", async () => {
    const file = await largeJpeg();
    const controller = new AbortController();
    controller.abort();
    await expect(
      estimateSizes({ files: [file], quality: 75 }, { signal: controller.signal }),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});
