import { describe, expect, it } from "vitest";

import { loadPdfium } from "@/lib/pdf/pdfium";
import { pageSizes } from "@/lib/pdf/test-helpers";
import { renderThumbnails, THUMBNAIL_SIDE } from "@/lib/pdf/thumbnails";

import { loadExampleFile } from "../example-files";
import { organizePdf } from "./core";

// pages.pdf 有 4 页，MediaBox 依次是 200×400、300×400、400×250、500×400 pt；第 3 页本身带 /Rotate 90，摆正后是 250×400
const pages = () => loadExampleFile("organize-pdf", "pages.pdf");

// 读回每页的 MediaBox 宽度（不计 /Rotate）和 /Rotate（度）
const layout = async (file: File) => {
  const module = await loadPdfium();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pointer = module.pdfium.wasmExports.malloc(bytes.length);
  module.pdfium.HEAPU8.set(bytes, pointer);
  const document = module.FPDF_LoadMemDocument(pointer, bytes.length, "");
  try {
    return Array.from({ length: module.FPDF_GetPageCount(document) }, (_, index) => {
      const page = module.FPDF_LoadPage(document, index);
      const rotate = module.FPDFPage_GetRotation(page) * 90;
      // 页面宽高计入了 /Rotate，转 90° 或 270° 时宽高互换
      const width = module.FPDF_GetPageWidthF(page);
      const height = module.FPDF_GetPageHeightF(page);
      module.FPDF_ClosePage(page);
      return [rotate % 180 ? height : width, rotate];
    });
  } finally {
    module.FPDF_CloseDocument(document);
    module.pdfium.wasmExports.free(pointer);
  }
};

describe("organizePdf", () => {
  it("keeps the document as it is when pages are empty", async () => {
    const { file } = await organizePdf({ file: await pages(), pages: "" }, {});
    expect(file.name).toBe("pages-organized.pdf");
    expect(file.type).toBe("application/pdf");
    expect(await layout(file)).toEqual([
      [200, 0],
      [300, 0],
      [400, 90],
      [500, 0],
    ]);
  });

  it("reorders, deletes and repeats pages", async () => {
    const { file } = await organizePdf({ file: await pages(), pages: "4, 1-2, 1" }, {});
    expect((await layout(file)).map(([width]) => width)).toEqual([500, 200, 300, 200]);
  });

  it("adds rotation to each page's own rotation", async () => {
    const { file } = await organizePdf(
      { file: await pages(), pages: "1 r90, 2 r180, 3 r270, 3 r90, 4" },
      {},
    );
    expect(await layout(file)).toEqual([
      [200, 90],
      [300, 180],
      // 第 3 页原来是 90°：加 270° 回到 0°，加 90° 到 180°
      [400, 0],
      [400, 180],
      [500, 0],
    ]);
    // 页面宽高按旋转后的方向读出
    expect((await pageSizes(file))[0]).toEqual([400, 200]);
  });

  it("rejects malformed pages and names the part", async () => {
    await expect(organizePdf({ file: await pages(), pages: "1, 2 r45" }, {})).rejects.toMatchObject(
      { code: "invalid_pages", field: "pages", detail: "2 r45" },
    );
  });

  it.each(["5", "2-5", "5-"])("reports the page count when %s does not exist", async (text) => {
    await expect(organizePdf({ file: await pages(), pages: text }, {})).rejects.toMatchObject({
      code: "page_out_of_range",
      field: "pages",
      detail: "4",
    });
  });

  it("reports encrypted and damaged files", async () => {
    const encrypted = await loadExampleFile("merge-pdf", "encrypted.pdf");
    await expect(organizePdf({ file: encrypted, pages: "" }, {})).rejects.toMatchObject({
      code: "encrypted",
      field: "file",
    });
    const damaged = new File(["not a pdf"], "broken.pdf", { type: "application/pdf" });
    await expect(organizePdf({ file: damaged, pages: "" }, {})).rejects.toMatchObject({
      code: "invalid_pdf",
      field: "file",
    });
  });
});

const size = async (blob: Blob) => {
  const bitmap = await createImageBitmap(blob);
  const result = [bitmap.width, bitmap.height];
  bitmap.close();
  return result;
};

describe("renderThumbnails", () => {
  it("renders a batch of pages upright with the long side fixed", async () => {
    const file = await pages();
    const first = await renderThumbnails({ file, start: 1, count: 3 });
    expect(first.total).toBe(4);
    expect(first.images.every((image) => image?.type === "image/jpeg")).toBe(true);
    expect(await Promise.all(first.images.map((image) => size(image!)))).toEqual([
      [160, THUMBNAIL_SIDE],
      [240, THUMBNAIL_SIDE],
      // 第 3 页带 /Rotate 90，按摆正后的方向渲染
      [200, THUMBNAIL_SIDE],
    ]);
    // 最后一批不足 count 页
    const last = await renderThumbnails({ file, start: 4, count: 3 });
    expect(last.images).toHaveLength(1);
    expect(await size(last.images[0]!)).toEqual([THUMBNAIL_SIDE, 256]);
  });

  it("keeps rendering while the tool runs on the same file", async () => {
    // 20 页：缩略图要分几轮让出事件循环，Organize 正好在中途运行
    const { file: big } = await organizePdf(
      { file: await pages(), pages: "1-4, 1-4, 1-4, 1-4, 1-4" },
      {},
    );
    // 先渲染一批，让文档进入缓存；第二批进行中时 Organize 运行
    await renderThumbnails({ file: big, start: 1, count: 1 });
    const thumbnails = renderThumbnails({ file: big, start: 1, count: 20 });
    await new Promise((done) => setTimeout(done, 20));
    const { file } = await organizePdf({ file: big, pages: "20, 1" }, {});
    const { images } = await thumbnails;
    expect(images).toHaveLength(20);
    expect(images.every((image) => image?.type === "image/jpeg")).toBe(true);
    expect(await layout(file)).toEqual([
      [500, 0],
      [200, 0],
    ]);
  });

  it("stops when aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      renderThumbnails({ file: await pages(), start: 1, count: 4 }, { signal: controller.signal }),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});
