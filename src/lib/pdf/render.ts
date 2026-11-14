import type { Pdfium } from "./pdfium";

// fpdfview.h：画出注释（含表单域的外观），并直接输出 RGBA 而不是 BGRA
const FPDF_ANNOT = 0x01;
const FPDF_REVERSE_BYTE_ORDER = 0x10;

// 把一页（从 1 开始）画成 RGBA 像素，白底。scaleOf 由页面的宽高（pt，已经计入 /Rotate）给出缩放比例，
// 渲染时也按页面自身的旋转摆正。像素的长边超过 maxSide、或 WASM 堆放不下位图时返回 undefined
export const renderPage = (
  module: Pdfium,
  document: number,
  page: number,
  scaleOf: (width: number, height: number) => number,
  maxSide: number,
): ImageData | undefined => {
  const handle = module.FPDF_LoadPage(document, page - 1);
  if (!handle) throw new Error(`PDFium 无法加载第 ${page} 页`);
  try {
    const pageWidth = module.FPDF_GetPageWidthF(handle);
    const pageHeight = module.FPDF_GetPageHeightF(handle);
    const scale = scaleOf(pageWidth, pageHeight);
    const width = Math.max(1, Math.round(pageWidth * scale));
    const height = Math.max(1, Math.round(pageHeight * scale));
    if (Math.max(width, height) > maxSide) return undefined;
    // WASM 堆放不下时返回 0
    const bitmap = module.FPDFBitmap_Create(width, height, 1);
    if (!bitmap) return undefined;
    try {
      module.FPDFBitmap_FillRect(bitmap, 0, 0, width, height, 0xffffffff);
      module.FPDF_RenderPageBitmap(
        bitmap,
        handle,
        0,
        0,
        width,
        height,
        0,
        FPDF_ANNOT | FPDF_REVERSE_BYTE_ORDER,
      );
      const buffer = module.FPDFBitmap_GetBuffer(bitmap);
      const stride = module.FPDFBitmap_GetStride(bitmap);
      const pixels = new Uint8ClampedArray(width * height * 4);
      for (let row = 0; row < height; row++) {
        const from = buffer + row * stride;
        pixels.set(module.pdfium.HEAPU8.subarray(from, from + width * 4), row * width * 4);
      }
      return new ImageData(pixels, width, height);
    } finally {
      module.FPDFBitmap_Destroy(bitmap);
    }
  } finally {
    module.FPDF_ClosePage(handle);
  }
};
