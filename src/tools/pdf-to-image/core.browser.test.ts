import { describe, expect, it } from "vitest";

import { loadExampleFile } from "../example-files";
import { pdfToImage, type PdfToImageInput } from "./core";

// sample.pdf 有 3 页：
// 1. 200 × 100 pt，左半边红色；
// 2. 100 × 200 pt 加 /Rotate 90，原页面左下四分之一绿色，顺时针转后在左上四分之一，显示为 200 × 100；
// 3. 300 × 300 pt，中间 100 × 100 是蓝色
const sample = () => loadExampleFile("pdf-to-image", "sample.pdf");

const defaults: Omit<PdfToImageInput, "file"> = {
  pages: "",
  format: "png",
  dpi: "72",
  quality: 85,
};

const run = async (input: Partial<PdfToImageInput> = {}) =>
  pdfToImage({ ...defaults, file: await sample(), ...input }, {});

const decode = async (file: File) => {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
  return {
    width,
    height,
    at: (x: number, y: number) => [...data.subarray((y * width + x) * 4, (y * width + x) * 4 + 4)],
  };
};

const RED = [255, 0, 0, 255];
const GREEN = [0, 255, 0, 255];
const BLUE = [0, 0, 255, 255];
const WHITE = [255, 255, 255, 255];

describe("pdfToImage", () => {
  it("renders every page in RGBA on white, with page rotation applied", async () => {
    const { files } = await run();
    expect(files.map((file) => file.name)).toEqual([
      "sample-1.png",
      "sample-2.png",
      "sample-3.png",
    ]);
    expect(files.every((file) => file.type === "image/png")).toBe(true);

    const [first, second, third] = await Promise.all(files.map(decode));
    expect([first!.width, first!.height]).toEqual([200, 100]);
    expect(first!.at(50, 50)).toEqual(RED);
    expect(first!.at(190, 90)).toEqual(WHITE);

    expect([second!.width, second!.height]).toEqual([200, 100]);
    expect(second!.at(50, 25)).toEqual(GREEN);
    expect(second!.at(50, 75)).toEqual(WHITE);
    expect(second!.at(150, 25)).toEqual(WHITE);

    expect([third!.width, third!.height]).toEqual([300, 300]);
    expect(third!.at(150, 150)).toEqual(BLUE);
    expect(third!.at(20, 20)).toEqual(WHITE);
  });

  it("scales by dpi / 72 and rounds to whole pixels", async () => {
    const { files } = await run({ pages: "1", dpi: "150" });
    const image = await decode(files[0]!);
    expect([image.width, image.height]).toEqual([417, 208]);
    expect(image.at(100, 100)).toEqual(RED);
  });

  it.each([
    ["jpeg", "image/jpeg", ".jpg"],
    ["webp", "image/webp", ".webp"],
  ] as const)("encodes %s", async (format, type, extension) => {
    const { files } = await run({ pages: "3", format });
    expect(files[0]!.name).toBe(`sample-3${extension}`);
    expect(files[0]!.type).toBe(type);
    const image = await decode(files[0]!);
    const [r, g, b] = image.at(150, 150);
    // 有损编码只核对大致颜色
    expect(r).toBeLessThan(30);
    expect(g).toBeLessThan(30);
    expect(b).toBeGreaterThan(220);
  });

  it("keeps the order given and writes each page once", async () => {
    const { files } = await run({ pages: "3, 1-3, 1" });
    expect(files.map((file) => file.name)).toEqual([
      "sample-3.png",
      "sample-1.png",
      "sample-2.png",
    ]);
  });

  it("rejects malformed pages and names the part", async () => {
    await expect(run({ pages: "1, 3-2" })).rejects.toMatchObject({
      code: "invalid_pages",
      field: "pages",
      detail: "3-2",
    });
  });

  it.each(["4", "2-4", "4-"])("reports the page count when %s does not exist", async (pages) => {
    await expect(run({ pages })).rejects.toMatchObject({
      code: "page_out_of_range",
      field: "pages",
      detail: "3",
    });
  });

  it("names the page that would exceed 10,000 pixels", async () => {
    // 3,000 pt 宽的页面在 300 DPI 下是 12,500 px
    const huge = new File(
      [
        "%PDF-1.4\n1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n" +
          "2 0 obj << /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >> endobj\n" +
          "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 100 100] >> endobj\n" +
          "4 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 3000 100] >> endobj\n" +
          "trailer << /Root 1 0 R >>\n%%EOF\n",
      ],
      "poster.pdf",
      { type: "application/pdf" },
    );
    await expect(pdfToImage({ ...defaults, file: huge, dpi: "300" }, {})).rejects.toMatchObject({
      code: "too_large",
      field: "dpi",
      detail: "2",
    });
  });

  it("rejects password-protected files", async () => {
    const encrypted = await loadExampleFile("merge-pdf", "encrypted.pdf");
    await expect(run({ file: encrypted })).rejects.toMatchObject({
      code: "encrypted",
      field: "file",
      detail: "encrypted.pdf",
    });
  });

  it("rejects files that are not PDFs", async () => {
    const broken = new File(["not a pdf"], "broken.pdf", { type: "application/pdf" });
    await expect(run({ file: broken })).rejects.toMatchObject({
      code: "invalid_pdf",
      field: "file",
      detail: "broken.pdf",
    });
  });

  it("stops when aborted", async () => {
    const controller = new AbortController();
    const running = pdfToImage(
      { ...defaults, file: await sample() },
      { signal: controller.signal, onProgress: () => controller.abort() },
    );
    await expect(running).rejects.toMatchObject({ name: "AbortError" });
  });
});
