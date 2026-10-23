import { init, type WrappedPdfiumModule } from "@embedpdf/pdfium";

import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

export interface MergePdfInput {
  files: File[];
}

// PDFium 的 FPDF_GetLastError 错误码（fpdfview.h）
const FPDF_ERR_PASSWORD = 4;

type Pdfium = WrappedPdfiumModule & { pdfium: { HEAPU8: Uint8Array } };

// PDFium（Chrome 的 PDF 引擎）编译成的 WASM，首次调用时加载并初始化一次；.wasm 由胶水代码按 import.meta.url 定位
let pdfium: Promise<Pdfium> | undefined;

export const loadPdfium = (): Promise<Pdfium> =>
  (pdfium ??= init({}).then((module) => {
    module.PDFiumExt_Init();
    return module as Pdfium;
  }));

// 把文件复制进 WASM 堆并打开；加密（需要打开密码）或损坏的文件抛出 ToolError，文件名放在 detail
const openDocument = async (module: Pdfium, file: File) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pointer = module.pdfium.wasmExports.malloc(bytes.length);
  module.pdfium.HEAPU8.set(bytes, pointer);
  const document = module.FPDF_LoadMemDocument(pointer, bytes.length, "");
  if (!document) {
    const code = module.FPDF_GetLastError() === FPDF_ERR_PASSWORD ? "encrypted" : "invalid_pdf";
    module.pdfium.wasmExports.free(pointer);
    throw new ToolError(code, { field: "files", detail: file.name });
  }
  return { document, pointer };
};

const saveDocument = (module: Pdfium, document: number): Uint8Array<ArrayBuffer> => {
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

// 按顺序把每个文件的全部页面追加到新文档。来源文档保持打开到保存之后再释放：
// 导入的页面可能还引用来源里未复制的对象。WASM 堆在 Worker 里常驻，所有指针都在 finally 中释放。
export const mergePdf = async ({ files }: MergePdfInput, { signal, onProgress }: ToolContext) => {
  const module = await loadPdfium();
  const merged = module.FPDF_CreateNewDocument();
  const sources: { document: number; pointer: number }[] = [];
  try {
    for (const [index, file] of files.entries()) {
      signal?.throwIfAborted();
      const source = await openDocument(module, file);
      sources.push(source);
      const pages = module.FPDF_GetPageCount(merged);
      if (!module.FPDF_ImportPages(merged, source.document, "", pages)) {
        throw new ToolError("invalid_pdf", { field: "files", detail: file.name });
      }
      onProgress?.((index + 1) / (files.length + 1));
    }
    const bytes = saveDocument(module, merged);
    return { file: new File([bytes], "merged.pdf", { type: "application/pdf" }) };
  } finally {
    module.FPDF_CloseDocument(merged);
    for (const { document, pointer } of sources) {
      module.FPDF_CloseDocument(document);
      module.pdfium.wasmExports.free(pointer);
    }
  }
};
