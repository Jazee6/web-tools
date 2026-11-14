import { readPages, resolvePages, toRangeString } from "@/lib/pdf/pages";
import {
  closeDocument,
  loadPdfium,
  openDocument,
  type Pdfium,
  saveDocument,
} from "@/lib/pdf/pdfium";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

export interface SplitPdfInput {
  file: File;
  pages: string;
  mode: "separate" | "combined";
}

// 每个输出文件都会占内存，页面列表也要一项一项渲染
const MAX_OUTPUT_FILES = 500;

const extract = (module: Pdfium, source: number, ranges: string) => {
  const target = module.FPDF_CreateNewDocument();
  try {
    if (!module.FPDF_ImportPages(target, source, ranges, 0)) throw new Error("PDFium 导入页面失败");
    return saveDocument(module, target);
  } finally {
    module.FPDF_CloseDocument(target);
  }
};

const stemOf = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
};

const pdfFile = (bytes: Uint8Array<ArrayBuffer>, name: string) =>
  new File([bytes], name, { type: "application/pdf" });

// 把取消消息和进度留给事件循环：PDFium 的调用都是同步的，页数多时一轮要跑很久
const yieldToEvents = () => new Promise((done) => setTimeout(done));

export const splitPdf = async (
  { file, pages, mode }: SplitPdfInput,
  { signal, onProgress }: ToolContext,
) => {
  const requested = readPages(pages);
  if (requested.length === 0 && mode === "combined") {
    throw new ToolError("pages_required", { field: "pages" });
  }

  const module = await loadPdfium();
  const source = await openDocument(module, file, "file");
  try {
    const total = module.FPDF_GetPageCount(source.document);
    const ranges = resolvePages(requested, total);
    const stem = stemOf(file.name);

    if (mode === "combined") {
      const bytes = extract(module, source.document, ranges.map(toRangeString).join(","));
      return { files: [pdfFile(bytes, `${stem}-extracted.pdf`)] };
    }

    // 没填页面时，每一页是一个文件
    const parts =
      ranges.length > 0
        ? ranges
        : Array.from({ length: total }, (_, index) => ({ start: index + 1, end: index + 1 }));
    if (parts.length > MAX_OUTPUT_FILES) {
      throw new ToolError("too_many_files", { field: "pages" });
    }

    const files: File[] = [];
    for (const [index, part] of parts.entries()) {
      signal?.throwIfAborted();
      const range = toRangeString(part);
      files.push(pdfFile(extract(module, source.document, range), `${stem}-${range}.pdf`));
      onProgress?.((index + 1) / parts.length);
      await yieldToEvents();
    }
    return { files };
  } finally {
    closeDocument(module, source);
  }
};
