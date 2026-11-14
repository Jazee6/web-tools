import { describe, expect, it } from "vitest";

import { loadExampleFile } from "../example-files";
import { convertImage } from "./core";

const pixels = async (blob: Blob) => {
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  return context.getImageData(0, 0, canvas.width, canvas.height);
};

// 两张同尺寸图片的平均逐通道绝对差（RGB）
const meanDifference = (a: ImageData, b: ImageData) => {
  let total = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    for (let channel = 0; channel < 3; channel++) {
      total += Math.abs(a.data[i + channel]! - b.data[i + channel]!);
    }
  }
  return total / ((a.data.length / 4) * 3);
};

describe("convertImage", () => {
  it("decodes HEIC with its original dimensions and colors", async () => {
    // photo.heic 由 photo.jpg 经 macOS sips 转出，二者应当几乎相同
    const heic = await loadExampleFile("image-converter", "photo.heic");
    const { file } = await convertImage({ file: heic, format: "png", quality: 85 });
    expect(file.type).toBe("image/png");
    expect(file.name).toBe("photo.png");
    const converted = await pixels(file);
    const original = await pixels(await loadExampleFile("image-converter", "photo.jpg"));
    expect([converted.width, converted.height]).toEqual([original.width, original.height]);
    expect(meanDifference(converted, original)).toBeLessThan(6);
  });

  it("treats a .heif file the same as .heic", async () => {
    const heic = await loadExampleFile("image-converter", "photo.heic");
    const heif = new File([heic], "photo.heif", { type: "image/heif" });
    const { file } = await convertImage({ file: heif, format: "jpeg", quality: 85 });
    expect(file.type).toBe("image/jpeg");
    expect(file.name).toBe("photo.jpg");
  });

  it("fills transparent areas with white when writing JPEG, and keeps them in PNG", async () => {
    const canvas = new OffscreenCanvas(32, 32);
    const context = canvas.getContext("2d")!;
    context.fillStyle = "rgb(200 0 0)";
    context.fillRect(16, 0, 16, 32);
    const source = new File([await canvas.convertToBlob({ type: "image/png" })], "alpha.png", {
      type: "image/png",
    });

    const jpeg = await pixels(
      (await convertImage({ file: source, format: "jpeg", quality: 90 })).file,
    );
    expect(Array.from(jpeg.data.slice(0, 3)).every((value) => value > 250)).toBe(true);

    const png = await pixels(
      (await convertImage({ file: source, format: "png", quality: 90 })).file,
    );
    expect(png.data[3]).toBe(0);
  });

  it("names the output after the input and the chosen format", async () => {
    const source = await loadExampleFile("image-converter", "photo.webp");
    expect((await convertImage({ file: source, format: "avif", quality: 50 })).file.name).toBe(
      "photo.avif",
    );
  });

  it("reports unreadable images as decode_failed", async () => {
    for (const type of ["image/heic", "image/jpeg"]) {
      const broken = new File([new Uint8Array(64)], "broken", { type });
      await expect(
        convertImage({ file: broken, format: "jpeg", quality: 85 }),
      ).rejects.toMatchObject({ code: "decode_failed", field: "file" });
    }
  });
});
