import { describe, expect, it } from "vitest";

import { loadExampleFile } from "../example-files";
import { cropImage, type CropImageInput } from "./core";

const defaults = {
  rotate: "0",
  flipHorizontal: false,
  flipVertical: false,
  aspect: "free",
  crop: "",
  quality: 85,
} as const;

const crop = (file: File, options: Partial<CropImageInput> = {}) =>
  cropImage({ file, ...defaults, ...options });

const colors = {
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
  white: [255, 255, 255],
} as const;
type Color = keyof typeof colors;

// 40 × 20 的四象限图：左上红、右上绿、左下蓝、右下白
const quadrants = async (type = "image/png") => {
  const canvas = new OffscreenCanvas(40, 20);
  const context = canvas.getContext("2d")!;
  for (const [color, x, y] of [
    ["red", 0, 0],
    ["green", 20, 0],
    ["blue", 0, 10],
    ["white", 20, 10],
  ] as const) {
    context.fillStyle = `rgb(${colors[color].join(" ")})`;
    context.fillRect(x, y, 20, 10);
  }
  const blob = await canvas.convertToBlob({ type, quality: 1 });
  return new File([blob], type === "image/png" ? "grid.png" : "grid.jpg", { type });
};

const pixels = async (blob: Blob) => {
  const bitmap = await createImageBitmap(blob);
  const context = new OffscreenCanvas(bitmap.width, bitmap.height).getContext("2d", {
    willReadFrequently: true,
  })!;
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  return context.getImageData(0, 0, context.canvas.width, context.canvas.height);
};

// 四个角的颜色（左上、右上、左下、右下），取离角 2 像素的点，避开 JPEG 在边缘的色差
const corners = async (blob: Blob) => {
  const image = await pixels(blob);
  const at = (x: number, y: number) => {
    const index = (y * image.width + x) * 4;
    const rgb = Array.from(image.data.slice(index, index + 3));
    return (Object.keys(colors) as Color[]).find((color) =>
      colors[color].every((value, channel) => Math.abs(value - rgb[channel]!) < 40),
    );
  };
  const right = image.width - 3;
  const bottom = image.height - 3;
  return {
    size: [image.width, image.height],
    corners: [at(2, 2), at(right, 2), at(2, bottom), at(right, bottom)],
  };
};

// 在 JPEG 的 APP0 之后插入只有 Orientation 一项的 EXIF（APP1）
const withOrientation = async (file: File, orientation: number) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  // TIFF 头（大端）、1 个条目（0x0112 SHORT 1 个）、没有下一个 IFD
  // prettier-ignore
  const tiff = [
    0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08,
    0x00, 0x01,
    0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, orientation, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
  ];
  const payload = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00, ...tiff];
  const length = payload.length + 2;
  const app1 = [0xff, 0xe1, length >> 8, length & 0xff, ...payload];
  const app0End = 4 + ((bytes[4]! << 8) | bytes[5]!);
  return new File(
    [bytes.slice(0, app0End), new Uint8Array(app1), bytes.slice(app0End)],
    file.name,
    {
      type: file.type,
    },
  );
};

describe("cropImage", () => {
  it.each([
    ["photo.jpg", "image/jpeg"],
    ["chart.png", "image/png"],
    ["photo.webp", "image/webp"],
    ["photo.avif", "image/avif"],
  ])("keeps the format of %s and names the file as cropped", async (name, type) => {
    const source = await loadExampleFile("image-cropper", name);
    const { file } = await crop(source, { crop: "10, 10, 100, 80" });
    expect(file.type).toBe(type);
    const [stem, extension] = name.split(".");
    expect(file.name).toBe(`${stem}-cropped.${extension}`);
    const bitmap = await createImageBitmap(file);
    expect([bitmap.width, bitmap.height]).toEqual([100, 80]);
    bitmap.close();
  });

  it("keeps exactly the pixels of the area", async () => {
    const { file } = await crop(await quadrants(), { crop: "20, 0, 20, 10" });
    const image = await pixels(file);
    expect([image.width, image.height]).toEqual([20, 10]);
    // 整块都是右上角的绿色，没有混入相邻象限
    for (let index = 0; index < image.data.length; index += 4) {
      expect(Array.from(image.data.slice(index, index + 3))).toEqual(colors.green);
    }
  });

  it("uses the whole image by default", async () => {
    expect(await corners((await crop(await quadrants())).file)).toEqual({
      size: [40, 20],
      corners: ["red", "green", "blue", "white"],
    });
  });

  it.each([
    [{ rotate: "90" }, [20, 40], ["blue", "red", "white", "green"]],
    [{ rotate: "180" }, [40, 20], ["white", "blue", "green", "red"]],
    [{ rotate: "270" }, [20, 40], ["green", "white", "red", "blue"]],
    [{ flipHorizontal: true }, [40, 20], ["green", "red", "white", "blue"]],
    [{ flipVertical: true }, [40, 20], ["blue", "white", "red", "green"]],
    // 翻转作用在旋转后的图上
    [{ rotate: "90", flipHorizontal: true }, [20, 40], ["red", "blue", "green", "white"]],
    [
      { rotate: "270", flipHorizontal: true, flipVertical: true },
      [20, 40],
      ["blue", "red", "white", "green"],
    ],
  ] as const)("orients the image with %j", async (options, size, expected) => {
    expect(await corners((await crop(await quadrants(), options)).file)).toEqual({
      size,
      corners: expected,
    });
  });

  it("measures the area on the rotated image", async () => {
    // 旋转 90° 后是 20 × 40，下半部分是原来的右半边
    const { file } = await crop(await quadrants(), { rotate: "90", crop: "0, 20, 20, 20" });
    expect(await corners(file)).toEqual({
      size: [20, 20],
      corners: ["white", "green", "white", "green"],
    });
  });

  it("takes the largest centred area for an aspect ratio", async () => {
    expect(await corners((await crop(await quadrants(), { aspect: "1:1" })).file)).toEqual({
      size: [20, 20],
      corners: ["red", "green", "blue", "white"],
    });
    const portrait = await crop(await quadrants(), { aspect: "9:16" });
    expect((await corners(portrait.file)).size).toEqual([11, 20]);
  });

  it("ignores the aspect ratio when an area is given", async () => {
    const { file } = await crop(await quadrants(), { aspect: "1:1", crop: "0, 0, 30, 10" });
    expect((await corners(file)).size).toEqual([30, 10]);
  });

  it("applies the EXIF orientation before cropping", async () => {
    // Orientation 6：显示时顺时针转 90°，和 rotate: "90" 一样
    const source = await withOrientation(await quadrants("image/jpeg"), 6);
    expect(await corners((await crop(source)).file)).toEqual({
      size: [20, 40],
      corners: ["blue", "red", "white", "green"],
    });
  });

  it("sizes the editor preview the same way", async () => {
    // 裁剪编辑器按 <img> 的 naturalWidth / naturalHeight 量图，必须和 core 一样是摆正后的尺寸
    const source = await withOrientation(await quadrants("image/jpeg"), 6);
    const image = new Image();
    image.src = URL.createObjectURL(source);
    await image.decode();
    URL.revokeObjectURL(image.src);
    expect([image.naturalWidth, image.naturalHeight]).toEqual([20, 40]);
  });

  it("reports an area outside the image with its size", async () => {
    await expect(crop(await quadrants(), { crop: "30, 0, 20, 10" })).rejects.toMatchObject({
      code: "crop_out_of_range",
      field: "crop",
      detail: "40 × 20",
    });
    // 旋转后宽只有 20
    await expect(
      crop(await quadrants(), { rotate: "90", crop: "0, 0, 30, 10" }),
    ).rejects.toMatchObject({ code: "crop_out_of_range", detail: "20 × 40" });
  });

  it("reports an area it can't read", async () => {
    await expect(crop(await quadrants(), { crop: "1, 2, 3" })).rejects.toMatchObject({
      code: "invalid_crop",
      field: "crop",
      detail: "1, 2, 3",
    });
  });

  it("reports a file it can't decode", async () => {
    const broken = new File(["not an image"], "broken.png", { type: "image/png" });
    await expect(crop(broken)).rejects.toMatchObject({ code: "decode_failed", field: "file" });
  });

  it("stops when aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      cropImage({ file: await quadrants(), ...defaults }, { signal: controller.signal }),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});
