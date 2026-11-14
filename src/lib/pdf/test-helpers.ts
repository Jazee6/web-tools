import { loadPdfium } from "./pdfium";

// 浏览器测试共用：用 PDFium 读回每一页的尺寸，按尺寸核对页序
export const pageSizes = async (file: File): Promise<number[][]> => {
  const module = await loadPdfium();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pointer = module.pdfium.wasmExports.malloc(bytes.length);
  const size = module.pdfium.wasmExports.malloc(8);
  module.pdfium.HEAPU8.set(bytes, pointer);
  const document = module.FPDF_LoadMemDocument(pointer, bytes.length, "");
  try {
    return Array.from({ length: module.FPDF_GetPageCount(document) }, (_, index) => {
      module.FPDF_GetPageSizeByIndexF(document, index, size);
      return [module.pdfium.getValue(size, "float"), module.pdfium.getValue(size + 4, "float")];
    });
  } finally {
    module.FPDF_CloseDocument(document);
    module.pdfium.wasmExports.free(size);
    module.pdfium.wasmExports.free(pointer);
  }
};
