import { closeDocument, loadPdfium, type OpenDocument, openDocument } from "./pdfium";
import { renderPage } from "./render";

// 页面排列编辑器（widget: "pages"）的缩略图，在 Tool 的 Worker 里渲染（exposeRun 的 preview）。
// 编辑器按批请求，每批都把同一个文件传过来；文件复制进 WASM 堆的代价大，所以保留最近打开的一个文档
export interface ThumbnailRequest {
  file: File;
  start: number;
  count: number;
}

export interface Thumbnails {
  total: number;
  // 与 start 起的页面一一对应；画不出来的页为 null
  images: (Blob | null)[];
}

// 长边的像素数：编辑器里一格约 120 CSS px，按 2–3 倍屏够用
export const THUMBNAIL_SIDE = 320;

let cached: { key: string; document: Promise<OpenDocument> } | undefined;

const keyOf = (file: File) => `${file.name}\u0000${file.size}\u0000${file.lastModified}`;

// 换文件时释放上一份。只在这里关闭缓存的文档：同一文件的一批可能还在渲染（Tool 运行时也是），
// 换文件时编辑器会先中止旧的一批，它在下一次调用 PDFium 前检查 signal
const releaseThumbnails = async (): Promise<void> => {
  const previous = cached;
  cached = undefined;
  if (!previous) return;
  const module = await loadPdfium();
  await previous.document.then(
    (document) => closeDocument(module, document),
    () => {},
  );
};

const open = async (file: File) => {
  const key = keyOf(file);
  if (cached?.key !== key) {
    await releaseThumbnails();
    const document = loadPdfium().then((module) => openDocument(module, file, "file"));
    cached = { key, document };
    // 打不开的文件不留在缓存里，下次重试（错误仍抛给这次调用）
    document.catch(() => {
      if (cached?.document === document) cached = undefined;
    });
  }
  return cached.document;
};

// 把取消消息留给事件循环：PDFium 的调用都是同步的
const yieldToEvents = () => new Promise((done) => setTimeout(done));

export const renderThumbnails = async (
  { file, start, count }: ThumbnailRequest,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Thumbnails> => {
  const module = await loadPdfium();
  const { document } = await open(file);
  const total = module.FPDF_GetPageCount(document);
  const images: (Blob | null)[] = [];
  for (let page = start; page < start + count && page <= total; page++) {
    signal?.throwIfAborted();
    const image = renderPage(
      module,
      document,
      page,
      (width, height) => THUMBNAIL_SIDE / Math.max(width, height),
      THUMBNAIL_SIDE,
    );
    if (image) {
      const canvas = new OffscreenCanvas(image.width, image.height);
      canvas.getContext("2d")!.putImageData(image, 0, 0);
      images.push(await canvas.convertToBlob({ type: "image/jpeg", quality: 0.8 }));
    } else {
      images.push(null);
    }
    await yieldToEvents();
  }
  return { total, images };
};
