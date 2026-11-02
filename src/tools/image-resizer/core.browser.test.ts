import { describe, expect, it } from "vitest";

import { loadExampleFile } from "../example-files";
import { resizeImages, type ResizeImagesInput } from "./core";

const defaults = { fit: "contain", quality: 85 } as const;

const pixels = async (blob: Blob) => {
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  return context.getImageData(0, 0, canvas.width, canvas.height);
};

const png = async (
  width: number,
  height: number,
  draw: (context: OffscreenCanvasRenderingContext2D) => void,
) => {
  const canvas = new OffscreenCanvas(width, height);
  draw(canvas.getContext("2d")!);
  return new File([await canvas.convertToBlob({ type: "image/png" })], "source.png", {
    type: "image/png",
  });
};

const resizeOne = async (file: File, options: Partial<ResizeImagesInput>) =>
  (await resizeImages({ files: [file], ...defaults, ...options })).files[0]!;

describe("resizeImages", () => {
  it.each(["photo.jpg", "chart.png", "photo.webp", "photo.avif"])(
    "keeps the format of %s and names the file after the new size",
    async (name) => {
      const source = await loadExampleFile("image-resizer", name);
      const file = await resizeOne(source, { width: 150, height: 150, fit: "stretch" });
      expect(file.type).toBe(source.type);
      const [stem, extension] = name.split(".");
      expect(file.name).toBe(`${stem}-150x150.${extension}`);
      const { width, height } = await pixels(file);
      expect([width, height]).toEqual([150, 150]);
    },
  );

  it("cover crops the excess evenly from both sides", async () => {
    // 左右各 100 px 是红色，中间 200 px 是蓝色；裁成正方形后应该只剩蓝色
    const source = await png(400, 200, (context) => {
      context.fillStyle = "rgb(255 0 0)";
      context.fillRect(0, 0, 400, 200);
      context.fillStyle = "rgb(0 0 255)";
      context.fillRect(100, 0, 200, 200);
    });
    const { data, width, height } = await pixels(
      await resizeOne(source, { width: 100, height: 100, fit: "cover" }),
    );
    expect([width, height]).toEqual([100, 100]);
    // 取最左和最右的像素
    expect(Array.from(data.slice(0, 3))).toEqual([0, 0, 255]);
    expect(Array.from(data.slice(99 * 4, 99 * 4 + 3))).toEqual([0, 0, 255]);
  });

  it("averages fine detail when shrinking a lot instead of aliasing", async () => {
    // 1 px 黑白棋盘缩小 16 倍，每个像素都应该接近中灰；只取相邻像素的插值会留下明显的黑白斑块
    const source = await png(1600, 1600, (context) => {
      context.fillStyle = "rgb(255 255 255)";
      context.fillRect(0, 0, 1600, 1600);
      context.fillStyle = "rgb(0 0 0)";
      for (let y = 0; y < 1600; y++) {
        for (let x = y % 2; x < 1600; x += 2) context.fillRect(x, y, 1, 1);
      }
    });
    const { data } = await pixels(await resizeOne(source, { width: 100 }));
    let lowest = 255;
    let highest = 0;
    for (let i = 0; i < data.length; i += 4) {
      lowest = Math.min(lowest, data[i]!);
      highest = Math.max(highest, data[i]!);
    }
    expect(highest - lowest).toBeLessThan(40);
  }, 30_000);

  it("keeps transparency in PNG", async () => {
    const source = await png(32, 32, (context) => {
      context.fillStyle = "rgb(200 0 0)";
      context.fillRect(16, 0, 16, 32);
    });
    const { data } = await pixels(await resizeOne(source, { width: 16 }));
    expect(data[3]).toBe(0);
  });

  it("asks for a size when both sides are empty", async () => {
    const source = await loadExampleFile("image-resizer", "photo.jpg");
    await expect(resizeOne(source, {})).rejects.toMatchObject({
      code: "size_required",
      field: "width",
    });
  });

  it("rejects a derived side above the limit", async () => {
    // 宽高比 100:1，高度 200 时宽度是 20,000
    const source = await png(1000, 10, () => {});
    await expect(resizeOne(source, { height: 200 })).rejects.toMatchObject({
      code: "too_large",
      field: "files",
      detail: "source.png",
    });
  });

  it("reports unreadable images as decode_failed", async () => {
    const broken = new File([new Uint8Array(64)], "broken.jpg", { type: "image/jpeg" });
    await expect(resizeOne(broken, { width: 10 })).rejects.toMatchObject({
      code: "decode_failed",
      field: "files",
      detail: "broken.jpg",
    });
  });
});
