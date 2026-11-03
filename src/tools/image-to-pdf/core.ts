import { encodeImage } from "@/lib/image/encode";
import { loadPdfium, type Pdfium, saveDocument } from "@/lib/pdf/pdfium";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

import { jpegOrientation, type Orientation } from "./exif";
import { displaySize, imageMatrix, layoutPage, type LayoutOptions } from "./layout";
import { isLosslessWebp } from "./webp";

export interface ImageToPdfInput extends LayoutOptions {
  files: File[];
}

// 有损的 WebP 和 AVIF（不透明时）转成 JPEG 嵌入：无损存储的照片实测比原文件大 3–4 倍
const JPEG_QUALITY = 90;

const decodeFailed = (file: File) =>
  new ToolError("decode_failed", { field: "files", detail: file.name });
const tooLarge = (file: File) => new ToolError("too_large", { field: "files", detail: file.name });

const isJpeg = (bytes: Uint8Array) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
const isPng = (bytes: Uint8Array) =>
  bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
// 原本就是无损的图片（PNG、无损 WebP）继续无损存储
const isLossless = (bytes: Uint8Array) => isPng(bytes) || isLosslessWebp(bytes);

// FPDFImageObj_LoadJpegFileInline 通过 FPDF_FILEACCESS 的回调读取 JPEG。
// 回调只注册一次，每次加载前把 current 指向这张图在 WASM 堆里的字节
const createJpegLoader = (module: Pdfium) => {
  const heap = module.pdfium;
  let current = 0;
  const callback = heap.addFunction(
    (_param: number, position: number, buffer: number, size: number) => {
      // 内存增长后 HEAPU8 会换成新的视图，每次都重新取
      heap.HEAPU8.copyWithin(buffer, current + position, current + position + size);
      return 1;
    },
    "iiiii",
  );
  // wasm32 上的 struct FPDF_FILEACCESS { unsigned long m_FileLen; m_GetBlock; void* m_Param; }
  const access = heap.wasmExports.malloc(12);

  const load = (document: number, bytes: Uint8Array) => {
    const pointer = heap.wasmExports.malloc(bytes.length);
    if (!pointer) return 0;
    const image = module.FPDFPageObj_NewImageObj(document);
    try {
      heap.HEAPU8.set(bytes, pointer);
      current = pointer;
      heap.setValue(access, bytes.length, "i32");
      heap.setValue(access + 4, callback, "i32");
      heap.setValue(access + 8, 0, "i32");
      // Inline：立即把整个文件读进文档，之后就能释放这段内存
      if (module.FPDFImageObj_LoadJpegFileInline(0, 0, image, access)) return image;
      module.FPDFPageObj_Destroy(image);
      return 0;
    } finally {
      heap.wasmExports.free(pointer);
    }
  };

  const dispose = () => {
    heap.wasmExports.free(access);
    heap.removeFunction(callback);
  };
  return { load, dispose };
};

const readPixels = (bitmap: ImageBitmap) => {
  const context = new OffscreenCanvas(bitmap.width, bitmap.height).getContext("2d", {
    willReadFrequently: true,
  });
  if (!context) throw new Error("无法创建画布");
  context.drawImage(bitmap, 0, 0);
  return context.getImageData(0, 0, bitmap.width, bitmap.height);
};

const isOpaque = ({ data }: ImageData) => {
  for (let index = 3; index < data.length; index += 4) if (data[index] !== 255) return false;
  return true;
};

// PDFium 的位图是 BGRA（不透明时是 BGRx），保存时以 Flate 压缩，透明度存成 SMask
const bitmapImage = (module: Pdfium, document: number, pixels: ImageData, opaque: boolean) => {
  const { width, height, data } = pixels;
  const bitmap = module.FPDFBitmap_Create(width, height, opaque ? 0 : 1);
  if (!bitmap) return 0;
  try {
    const buffer = module.FPDFBitmap_GetBuffer(bitmap);
    const stride = module.FPDFBitmap_GetStride(bitmap);
    const heap = module.pdfium.HEAPU8;
    for (let row = 0; row < height; row++) {
      let to = buffer + row * stride;
      let from = row * width * 4;
      for (let column = 0; column < width; column++, to += 4, from += 4) {
        heap[to] = data[from + 2]!;
        heap[to + 1] = data[from + 1]!;
        heap[to + 2] = data[from]!;
        heap[to + 3] = data[from + 3]!;
      }
    }
    const image = module.FPDFPageObj_NewImageObj(document);
    if (module.FPDFImageObj_SetBitmap(0, 0, image, bitmap)) return image;
    module.FPDFPageObj_Destroy(image);
    return 0;
  } finally {
    module.FPDFBitmap_Destroy(bitmap);
  }
};

const addPage = (
  module: Pdfium,
  document: number,
  image: number,
  pixels: { width: number; height: number },
  orientation: Orientation,
  options: LayoutOptions,
) => {
  const layout = layoutPage(options, displaySize(pixels, orientation));
  const page = module.FPDFPage_New(
    document,
    module.FPDF_GetPageCount(document),
    layout.width,
    layout.height,
  );
  if (!page) {
    module.FPDFPageObj_Destroy(image);
    throw new Error("PDFium 无法新建页面");
  }
  try {
    module.FPDFImageObj_SetMatrix(image, ...imageMatrix(layout.image, orientation));
    // 插入后图像对象归页面所有，不再单独释放
    module.FPDFPage_InsertObject(page, image);
    if (!module.FPDFPage_GenerateContent(page)) throw new Error("PDFium 无法生成页面内容");
  } finally {
    module.FPDF_ClosePage(page);
  }
};

const stemOf = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
};

// 把取消消息和进度留给事件循环：PDFium 的调用都是同步的
const yieldToEvents = () => new Promise((done) => setTimeout(done));

// 每张图一页。JPEG 原样嵌入（DCTDecode，不重新编码），EXIF 方向写进图像矩阵；
// 其他格式先用浏览器解码：PNG、无损 WebP 和带透明度的图片无损存储，其余（有损 WebP、AVIF）转成 JPEG
export const imageToPdf = async (
  { files, ...options }: ImageToPdfInput,
  { signal, onProgress }: ToolContext,
) => {
  const module = await loadPdfium();
  const document = module.FPDF_CreateNewDocument();
  const jpeg = createJpegLoader(module);
  try {
    for (const [index, file] of files.entries()) {
      signal?.throwIfAborted();
      const bytes = new Uint8Array(await file.arrayBuffer());
      // 先完整解码一次：损坏的文件在这里报错，而不是在 PDF 里显示成乱码
      const bitmap = await createImageBitmap(new Blob([bytes])).catch(() => {
        throw decodeFailed(file);
      });

      // JPEG 原样嵌入；PDFium 不支持直通的 JPEG（如 12 位）退回下面的解码路径
      const passed = isJpeg(bytes) ? jpeg.load(document, bytes) : 0;
      if (passed) {
        bitmap.close();
        const size = module.pdfium.wasmExports.malloc(8);
        try {
          module.FPDFImageObj_GetImagePixelSize(passed, size, size + 4);
          const stored = {
            width: module.pdfium.getValue(size, "i32"),
            height: module.pdfium.getValue(size + 4, "i32"),
          };
          addPage(module, document, passed, stored, jpegOrientation(bytes), options);
        } finally {
          module.pdfium.wasmExports.free(size);
        }
      } else {
        // createImageBitmap 已按图片自带的方向摆正
        let pixels: ImageData;
        try {
          pixels = readPixels(bitmap);
        } catch {
          // 浏览器的画布面积上限各不相同（手机上更小）
          throw tooLarge(file);
        } finally {
          bitmap.close();
        }
        const opaque = isOpaque(pixels);
        const image =
          opaque && !isLossless(bytes)
            ? jpeg.load(
                document,
                new Uint8Array(await encodeImage(pixels, "image/jpeg", JPEG_QUALITY)),
              )
            : bitmapImage(module, document, pixels, opaque);
        // WASM 堆放不下时分配失败
        if (!image) throw tooLarge(file);
        addPage(module, document, image, pixels, 1, options);
      }
      onProgress?.((index + 1) / (files.length + 1));
      await yieldToEvents();
    }
    const output = saveDocument(module, document);
    return {
      file: new File([output], `${stemOf(files[0]!.name)}.pdf`, { type: "application/pdf" }),
    };
  } finally {
    jpeg.dispose();
    module.FPDF_CloseDocument(document);
  }
};
