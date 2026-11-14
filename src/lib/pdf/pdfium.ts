import { init, type WrappedPdfiumModule } from "@embedpdf/pdfium";

import { ToolError } from "@/lib/tool-contract/define-tool";

// PDFium 的 FPDF_GetLastError 错误码（fpdfview.h）
const FPDF_ERR_PASSWORD = 4;

export type Pdfium = WrappedPdfiumModule & { pdfium: { HEAPU8: Uint8Array } };

// PDFium（Chrome 的 PDF 引擎）编译成的 WASM，首次调用时加载并初始化一次；.wasm 由胶水代码按 import.meta.url 定位
let pdfium: Promise<Pdfium> | undefined;

export const loadPdfium = (): Promise<Pdfium> =>
  (pdfium ??= init({}).then((module) => {
    module.PDFiumExt_Init();
    return module as Pdfium;
  }));

export interface OpenDocument {
  document: number;
  pointer: number;
}

// 把文件复制进 WASM 堆并打开；加密（需要打开密码）或损坏的文件抛出 ToolError，文件名放在 detail。
// PDFium 读取时一直引用这段内存，所以用 closeDocument 一起释放
export const openDocument = async (
  module: Pdfium,
  file: File,
  field: string,
): Promise<OpenDocument> => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pointer = module.pdfium.wasmExports.malloc(bytes.length);
  module.pdfium.HEAPU8.set(bytes, pointer);
  const document = module.FPDF_LoadMemDocument(pointer, bytes.length, "");
  if (!document) {
    const code = module.FPDF_GetLastError() === FPDF_ERR_PASSWORD ? "encrypted" : "invalid_pdf";
    module.pdfium.wasmExports.free(pointer);
    throw new ToolError(code, { field, detail: file.name });
  }
  return { document, pointer };
};

export const closeDocument = (module: Pdfium, { document, pointer }: OpenDocument): void => {
  module.FPDF_CloseDocument(document);
  module.pdfium.wasmExports.free(pointer);
};

export const saveDocument = (module: Pdfium, document: number): Uint8Array<ArrayBuffer> => {
  const writer = module.PDFiumExt_OpenFileWriter();
  try {
    if (!module.PDFiumExt_SaveAsCopy(document, writer)) throw new Error("PDFium 保存失败");
    const size = module.PDFiumExt_GetFileWriterSize(writer);
    const pointer = module.pdfium.wasmExports.malloc(size);
    try {
      module.PDFiumExt_GetFileWriterData(writer, pointer, size);
      return module.pdfium.HEAPU8.slice(pointer, pointer + size);
    } finally {
      module.pdfium.wasmExports.free(pointer);
    }
  } finally {
    module.PDFiumExt_CloseFileWriter(writer);
  }
};
