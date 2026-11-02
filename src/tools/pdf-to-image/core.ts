import { encodeImage } from "@/lib/image/encode";
import { type PageRange, readPages, resolvePages } from "@/lib/pdf/pages";
import { closeDocument, loadPdfium, openDocument, type Pdfium } from "@/lib/pdf/pdfium";
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

// fpdfview.h：画出注释（含表单域的外观），并直接输出 RGBA 而不是 BGRA
const FPDF_ANNOT = 0x01;
const FPDF_REVERSE_BYTE_ORDER = 0x10;

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

// 按 dpi 把一页画成 RGBA 像素，白底。页面尺寸已经计入 /Rotate，渲染时也按页面自身的旋转摆正
const renderPage = (module: Pdfium, document: number, page: number, dpi: number): ImageData => {
  const handle = module.FPDF_LoadPage(document, page - 1);
  if (!handle) throw new Error(`PDFium 无法加载第 ${page} 页`);
  try {
    const scale = dpi / 72;
    const width = Math.max(1, Math.round(module.FPDF_GetPageWidthF(handle) * scale));
    const height = Math.max(1, Math.round(module.FPDF_GetPageHeightF(handle) * scale));
    if (Math.max(width, height) > MAX_SIDE) throw tooLarge(page);
    // WASM 堆放不下时返回 0
    const bitmap = module.FPDFBitmap_Create(width, height, 1);
    if (!bitmap) throw tooLarge(page);
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
      const image = renderPage(module, source.document, page, Number(dpi));
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
