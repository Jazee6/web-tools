import {
  closeDocument,
  loadPdfium,
  type OpenDocument,
  openDocument,
  saveDocument,
} from "@/lib/pdf/pdfium";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

export interface MergePdfInput {
  files: File[];
}

// 按顺序把每个文件的全部页面追加到新文档。来源文档保持打开到保存之后再释放：
// 导入的页面可能还引用来源里未复制的对象。WASM 堆在 Worker 里常驻，所有指针都在 finally 中释放。
export const mergePdf = async ({ files }: MergePdfInput, { signal, onProgress }: ToolContext) => {
  const module = await loadPdfium();
  const merged = module.FPDF_CreateNewDocument();
  const sources: OpenDocument[] = [];
  try {
    for (const [index, file] of files.entries()) {
      signal?.throwIfAborted();
      const source = await openDocument(module, file, "files");
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
    for (const source of sources) closeDocument(module, source);
  }
};
