import { encodeImage } from "@/lib/image/encode";
import { type PageRange, readPages, resolvePages } from "@/lib/pdf/pages";
import { closeDocument, loadPdfium, openDocument } from "@/lib/pdf/pdfium";
import { renderPage } from "@/lib/pdf/render";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

export interface PdfToImageInput {
  file: File;
  pages: string;
  format: "jpeg" | "png" | "webp";
  dpi: "72" | "150" | "300";
  quality: number;
}

const OUTPUT = {
  jpeg: { type: "image/jpeg", extension: ".jpg" },
  png: { type: "image/png", extension: ".png" },
  webp: { type: "image/webp", extension: ".webp" },
} as const;

// 每张图都留在内存里，结果列表也要一项一项渲染（与 Split PDF 相同）
const MAX_OUTPUT_FILES = 500;
// 与 Image Resizer 相同；PDFium 的位图在 WASM 堆里，10,000 × 10,000 已经是 400 MB
const MAX_SIDE = 10_000;

// 页码去重并保持首次出现的顺序：同一页只出一张图，文件名不会重复
const pageNumbers = (requested: PageRange[], total: number) => {
  const ranges = resolvePages(requested, total);
  if (ranges.length === 0) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = new Set<number>();
  for (const { start, end } of ranges) {
    for (let page = start; page <= end && pages.size <= MAX_OUTPUT_FILES; page++) pages.add(page);
  }
  return [...pages];
};

const tooLarge = (page: number) =>
  new ToolError("too_large", { field: "dpi", detail: String(page) });

const stemOf = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
};

// 把取消消息和进度留给事件循环：PDFium 的调用都是同步的
const yieldToEvents = () => new Promise((done) => setTimeout(done));

export const pdfToImage = async (
  { file, pages, format, dpi, quality }: PdfToImageInput,
  { signal, onProgress }: ToolContext,
) => {
  const requested = readPages(pages);
  const output = OUTPUT[format];
  const module = await loadPdfium();
  const source = await openDocument(module, file, "file");
  try {
    const total = module.FPDF_GetPageCount(source.document);
    const numbers = pageNumbers(requested, total);
    if (numbers.length > MAX_OUTPUT_FILES) {
      throw new ToolError("too_many_files", { field: "pages" });
    }

    const stem = stemOf(file.name);
    const files: File[] = [];
    for (const [index, page] of numbers.entries()) {
      signal?.throwIfAborted();
      const scale = Number(dpi) / 72;
      const image = renderPage(module, source.document, page, () => scale, MAX_SIDE);
      if (!image) throw tooLarge(page);
      let bytes: ArrayBuffer;
      try {
        bytes = await encodeImage(image, output.type, quality);
      } catch (error) {
        // 只有 PNG 经过画布编码，浏览器的画布面积上限各不相同（手机上更小）；其他失败原样抛出
        if (format === "png") throw tooLarge(page);
        throw error;
      }
      files.push(new File([bytes], `${stem}-${page}${output.extension}`, { type: output.type }));
      onProgress?.((index + 1) / numbers.length);
      await yieldToEvents();
    }
    return { files };
  } finally {
    closeDocument(module, source);
  }
};
