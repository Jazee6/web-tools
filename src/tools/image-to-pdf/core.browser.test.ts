import { describe, expect, it } from "vitest";

import { loadPdfium } from "@/lib/pdf/pdfium";
import { pageSizes } from "@/lib/pdf/test-helpers";

import { loadExampleFile } from "../example-files";
import { imageToPdf, type ImageToPdfInput } from "./core";

const defaults: Omit<ImageToPdfInput, "files"> = {
  pageSize: "fit",
  orientation: "auto",
  margin: "none",
};

const run = (files: File[], input: Partial<ImageToPdfInput> = {}) =>
  imageToPdf({ ...defaults, files, ...input }, {});

// 40 × 20 像素：左半红、右半蓝；alpha 为 true 时右半透明
const drawImage = async (type: string, alpha = false) => {
  const canvas = new OffscreenCanvas(40, 20);
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#f00";
  context.fillRect(0, 0, 20, 20);
  if (!alpha) {
    context.fillStyle = "#00f";
    context.fillRect(20, 0, 20, 20);
  }
  return new Uint8Array(await (await canvas.convertToBlob({ type, quality: 0.95 })).arrayBuffer());
};

// 在 SOI 之后插入只含方向一项的 EXIF（大端）
const withOrientation = (jpeg: Uint8Array, orientation: number) => {
  const segment = new Uint8Array(36);
  const view = new DataView(segment.buffer);
  view.setUint16(0, 0xffe1);
  view.setUint16(2, 34);
  segment.set(new TextEncoder().encode("Exif"), 4);
  view.setUint16(10, 0x4d4d);
  view.setUint16(12, 42);
  view.setUint32(14, 8);
  view.setUint16(18, 1);
  view.setUint16(20, 0x0112);
  view.setUint16(22, 3);
  view.setUint32(24, 1);
  view.setUint16(28, orientation);
  return new Uint8Array([...jpeg.subarray(0, 2), ...segment, ...jpeg.subarray(2)]);
};

const file = (bytes: Uint8Array<ArrayBuffer>, name: string, type: string) =>
  new File([bytes], name, { type });

// 用 PDFium 按 1 pt = 1 px 把第 index 页画成 RGBA，白底
const render = async (pdf: File, index = 0) => {
  const module = await loadPdfium();
  const bytes = new Uint8Array(await pdf.arrayBuffer());
  const pointer = module.pdfium.wasmExports.malloc(bytes.length);
  module.pdfium.HEAPU8.set(bytes, pointer);
  const document = module.FPDF_LoadMemDocument(pointer, bytes.length, "");
  const page = module.FPDF_LoadPage(document, index);
  const width = Math.round(module.FPDF_GetPageWidthF(page));
  const height = Math.round(module.FPDF_GetPageHeightF(page));
  const bitmap = module.FPDFBitmap_Create(width, height, 1);
  try {
    module.FPDFBitmap_FillRect(bitmap, 0, 0, width, height, 0xffffffff);
    module.FPDF_RenderPageBitmap(bitmap, page, 0, 0, width, height, 0, 0x10);
    const buffer = module.FPDFBitmap_GetBuffer(bitmap);
    const stride = module.FPDFBitmap_GetStride(bitmap);
    const pixels = module.pdfium.HEAPU8.slice(buffer, buffer + stride * height);
    return {
      width,
      height,
      at: (x: number, y: number) => [
        ...pixels.subarray(y * stride + x * 4, y * stride + x * 4 + 3),
      ],
    };
  } finally {
    module.FPDFBitmap_Destroy(bitmap);
    module.FPDF_ClosePage(page);
    module.FPDF_CloseDocument(document);
    module.pdfium.wasmExports.free(pointer);
  }
};

const text = async (pdf: File) => new TextDecoder("latin1").decode(await pdf.arrayBuffer());

// 有损编码只核对大致颜色
const isRed = ([r, g, b]: number[]) => r! > 200 && g! < 60 && b! < 60;
const isBlue = ([r, g, b]: number[]) => r! < 60 && g! < 60 && b! > 200;
const isWhite = ([r, g, b]: number[]) => r! > 245 && g! > 245 && b! > 245;

describe("imageToPdf", () => {
  it("puts each image on its own page in order, named after the first file", async () => {
    const files = [
      await loadExampleFile("image-to-pdf", "photo.jpg"),
      await loadExampleFile("image-to-pdf", "chart.png"),
      await loadExampleFile("image-to-pdf", "photo.webp"),
    ];
    const { file: pdf } = await run(files);
    expect(pdf.name).toBe("photo.pdf");
    expect(pdf.type).toBe("application/pdf");
    // 320 × 240 和 300 × 200 像素，按 96 ppi 换成 pt
    expect(await pageSizes(pdf)).toEqual([
      [240, 180],
      [225, 150],
      [240, 180],
    ]);
  });

  it("embeds JPEG files unchanged instead of re-encoding them", async () => {
    const photo = await loadExampleFile("image-to-pdf", "photo.jpg");
    const { file: pdf } = await run([photo]);
    expect(await text(pdf)).toContain("/DCTDecode");
    // 嵌入的 JPEG 字节原样出现在 PDF 里
    const source = new Uint8Array(await photo.arrayBuffer());
    const output = new Uint8Array(await pdf.arrayBuffer());
    const start = output.findIndex(
      (byte, index) =>
        byte === source[0] && output[index + 1] === source[1] && output[index + 2] === source[2],
    );
    expect(output.subarray(start, start + source.length)).toEqual(source);
  });

  it("passes CMYK JPEG files through without inverting the colors", async () => {
    // cmyk.jpg 是 photo.jpg 经 macOS sips 转成的 CMYK（4 个分量，带 Adobe APP14）
    const cmyk = await loadExampleFile("image-to-pdf", "cmyk.jpg");
    const { file: pdf } = await run([cmyk]);
    expect(await text(pdf)).toContain("/DeviceCMYK");

    const bitmap = await createImageBitmap(cmyk);
    const context = new OffscreenCanvas(bitmap.width, bitmap.height).getContext("2d")!;
    context.drawImage(bitmap, 0, 0);
    // fit 页面是 0.75 pt / px，渲染时 1 pt = 1 px，所以页面坐标是像素坐标的 0.75 倍
    const page = await render(pdf);
    for (const [x, y] of [
      [40, 40],
      [160, 120],
      [280, 200],
    ] as const) {
      const expected = [...context.getImageData(x, y, 1, 1).data].slice(0, 3);
      const actual = page.at(Math.round(x * 0.75), Math.round(y * 0.75));
      // PDFium 与浏览器的 CMYK 换算不同，只排除反相这类大错
      for (const [channel, value] of actual.entries()) {
        expect(Math.abs(value - expected[channel]!)).toBeLessThan(60);
      }
    }
  });

  it.each([
    // 方向 → 页面尺寸（pt），以及摆正后红色所在的位置
    [1, [30, 15], "left"],
    [3, [30, 15], "right"],
    [6, [15, 30], "top"],
    [8, [15, 30], "bottom"],
  ] as const)(
    "turns a JPEG with EXIF orientation %i the right way up",
    async (orientation, size, red) => {
      const jpeg = withOrientation(await drawImage("image/jpeg"), orientation);
      const { file: pdf } = await run([file(jpeg, "photo.jpg", "image/jpeg")], { pageSize: "fit" });
      expect(await pageSizes(pdf)).toEqual([size]);

      const page = await render(pdf);
      const [first, second] =
        red === "left" || red === "right"
          ? [page.at(7, 7), page.at(22, 7)]
          : [page.at(7, 7), page.at(7, 22)];
      const redFirst = red === "left" || red === "top";
      expect(isRed(redFirst ? first! : second!)).toBe(true);
      expect(isBlue(redFirst ? second! : first!)).toBe(true);
    },
  );

  it("keeps PNG lossless and transparent areas show the white page", async () => {
    const png = await drawImage("image/png", true);
    const { file: pdf } = await run([file(png, "logo.png", "image/png")]);
    const output = await text(pdf);
    expect(output).not.toContain("/DCTDecode");
    expect(output).toContain("/SMask");
    const page = await render(pdf);
    expect(page.at(7, 7)).toEqual([255, 0, 0]);
    expect(page.at(22, 7)).toEqual([255, 255, 255]);
  });

  it("stores lossy WebP as JPEG and keeps lossless or transparent WebP lossless", async () => {
    // WebKit 的画布不能编码 WebP，所以用 jSquash 编码
    const { default: encodeWebp } = await import("@jsquash/webp/encode");
    const webp = async (options: { lossless?: number }, alpha = false) => {
      const png = await createImageBitmap(new Blob([await drawImage("image/png", alpha)]));
      const context = new OffscreenCanvas(40, 20).getContext("2d")!;
      context.drawImage(png, 0, 0);
      const bytes = await encodeWebp(context.getImageData(0, 0, 40, 20), {
        quality: 90,
        ...options,
      });
      return file(new Uint8Array(bytes), "image.webp", "image/webp");
    };

    const lossy = await run([await webp({})]);
    expect(await text(lossy.file)).toContain("/DCTDecode");
    const page = await render(lossy.file);
    expect(isRed(page.at(7, 7))).toBe(true);
    expect(isBlue(page.at(22, 7))).toBe(true);

    const lossless = await run([await webp({ lossless: 1 })]);
    expect(await text(lossless.file)).not.toContain("/DCTDecode");
    const exact = await render(lossless.file);
    expect(exact.at(7, 7)).toEqual([255, 0, 0]);
    expect(exact.at(22, 7)).toEqual([0, 0, 255]);

    const transparent = await run([await webp({}, true)]);
    const output = await text(transparent.file);
    expect(output).not.toContain("/DCTDecode");
    expect(output).toContain("/SMask");
  });

  it("stores AVIF as JPEG", async () => {
    const { file: pdf } = await run([await loadExampleFile("image-resizer", "photo.avif")]);
    expect(await text(pdf)).toContain("/DCTDecode");
  });

  it("scales images to fit A4 inside the margins and centres them", async () => {
    const png = await drawImage("image/png");
    const { file: pdf } = await run([file(png, "wide.png", "image/png")], {
      pageSize: "a4",
      margin: "large",
    });
    // 宽图在 auto 下是横向 A4：842 × 595 pt；可用宽度 842 − 144 = 698，图片高 349，居中
    const [[width, height]] = (await pageSizes(pdf)) as [[number, number]];
    expect(Math.round(width)).toBe(842);
    expect(Math.round(height)).toBe(595);
    const page = await render(pdf);
    expect(isWhite(page.at(36, 297))).toBe(true);
    expect(isRed(page.at(200, 297))).toBe(true);
    expect(isBlue(page.at(600, 297))).toBe(true);
    expect(isWhite(page.at(400, 80))).toBe(true);
  });

  it("names the file that cannot be decoded", async () => {
    const broken = new File(["not an image"], "broken.png", { type: "image/png" });
    const photo = await loadExampleFile("image-to-pdf", "photo.jpg");
    await expect(run([photo, broken])).rejects.toMatchObject({
      code: "decode_failed",
      field: "files",
      detail: "broken.png",
    });
  });

  it("stops when aborted", async () => {
    const controller = new AbortController();
    const photo = await loadExampleFile("image-to-pdf", "photo.jpg");
    const running = imageToPdf(
      { ...defaults, files: [photo, photo] },
      { signal: controller.signal, onProgress: () => controller.abort() },
    );
    await expect(running).rejects.toMatchObject({ name: "AbortError" });
  });
});
