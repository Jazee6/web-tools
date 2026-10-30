import type { ToolContext } from "@/lib/tool-contract/define-tool";
import { ToolError } from "@/lib/tool-contract/define-tool";

export interface CompressImagesInput {
  files: File[];
  quality: number;
}

// 原生 API 解码（createImageBitmap 会按 EXIF 方向摆正），jSquash 按格式编码；编码器按需加载，各自初始化一次 WASM。
// PNG 直接对原始字节做 oxipng 无损优化，不经过解码。
const decodeBitmap = async (file: File): Promise<ImageBitmap> => {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new ToolError("decode_failed", { field: "files", detail: file.name });
  }
};

const readPixels = (
  bitmap: ImageBitmap,
  x = 0,
  y = 0,
  width = bitmap.width,
  height = bitmap.height,
): ImageData => {
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, x, y, width, height, 0, 0, width, height);
  return context.getImageData(0, 0, width, height);
};

const decode = async (file: File): Promise<ImageData> => {
  const bitmap = await decodeBitmap(file);
  const pixels = readPixels(bitmap);
  bitmap.close();
  return pixels;
};

const optimisePng = async (bytes: ArrayBuffer) => {
  const { default: optimise } = await import("@jsquash/oxipng/optimise");
  return optimise(bytes, { level: 2 });
};

const encodePixels = async (type: string, pixels: ImageData, quality: number) => {
  switch (type) {
    case "image/png": {
      // 采样预估用：先用原生 PNG 编码器得到字节，再交给 oxipng
      const canvas = new OffscreenCanvas(pixels.width, pixels.height);
      canvas.getContext("2d")!.putImageData(pixels, 0, 0);
      const blob = await canvas.convertToBlob({ type: "image/png" });
      return optimisePng(await blob.arrayBuffer());
    }
    case "image/jpeg": {
      const { default: encodeJpeg } = await import("@jsquash/jpeg/encode");
      return encodeJpeg(pixels, { quality });
    }
    case "image/webp": {
      const { default: encodeWebp } = await import("@jsquash/webp/encode");
      return encodeWebp(pixels, { quality });
    }
    case "image/avif": {
      const { default: encodeAvif } = await import("@jsquash/avif/encode");
      return encodeAvif(pixels, { quality });
    }
    default:
      throw new Error(`不支持的图片类型 ${type}`);
  }
};

const encode = async (file: File, quality: number): Promise<ArrayBuffer> => {
  if (file.type === "image/png") return optimisePng(await file.arrayBuffer());
  if (!["image/jpeg", "image/webp", "image/avif"].includes(file.type)) {
    throw new ToolError("decode_failed", { field: "files", detail: file.name });
  }
  return encodePixels(file.type, await decode(file), quality);
};

const compressedName = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? `${name.slice(0, dot)}-compressed${name.slice(dot)}` : `${name}-compressed`;
};

// 逐个处理：并行解码多张大图会撑爆内存
export const compressImages = async (
  { files, quality }: CompressImagesInput,
  ctx: ToolContext = {},
) => {
  const compressed: File[] = [];
  for (const [index, file] of files.entries()) {
    ctx.signal?.throwIfAborted();
    ctx.onProgress?.(index / files.length);
    const encoded = await encode(file, quality);
    // 已经足够小的图片重新编码可能反而变大，这时原样返回
    const bytes = encoded.byteLength < file.size ? encoded : await file.arrayBuffer();
    compressed.push(new File([bytes], compressedName(file.name), { type: file.type }));
  }
  return { files: compressed };
};

// 体积预估：不超过 WHOLE_PIXELS 的图片直接完整编码，结果就是真实体积；
// 更大的图片取几块原始分辨率的图块真实编码，按像素数外推（整图缩小后再编码会让每像素字节数偏高）
const WHOLE_PIXELS = 1024 * 1024;
const TILE = 512;
const TILE_CENTERS = [0.2, 0.5, 0.8];

interface Sample {
  width: number;
  height: number;
  whole: boolean;
  tiles: ImageData[];
}

const sampleOf = async (file: File): Promise<Sample> => {
  const bitmap = await decodeBitmap(file);
  const { width, height } = bitmap;
  const whole = width * height <= WHOLE_PIXELS;
  const tileWidth = whole ? width : Math.min(TILE, width);
  const tileHeight = whole ? height : Math.min(TILE, height);
  const tiles = (whole ? [0] : TILE_CENTERS).map((center) =>
    readPixels(
      bitmap,
      Math.round((width - tileWidth) * center),
      Math.round((height - tileHeight) * center),
      tileWidth,
      tileHeight,
    ),
  );
  bitmap.close();
  return { width, height, whole, tiles };
};

// 质量改变时重新预估不必重复解码：按文件缓存采样，每次预估只保留当前这批文件的
const samples = new Map<string, Promise<Sample>>();
const keyOf = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

const estimateFile = async (file: File, quality: number, ctx: ToolContext) => {
  const key = keyOf(file);
  if (!samples.has(key)) {
    const sample = sampleOf(file);
    samples.set(key, sample);
    sample.catch(() => samples.delete(key));
  }
  const sample = await samples.get(key)!;
  // PNG 原图是 oxipng 的输入，完整图片直接用原始字节（和真实压缩一致）
  if (sample.whole && file.type === "image/png") return (await encode(file, quality)).byteLength;
  let encoded = 0;
  let pixels = 0;
  for (const tile of sample.tiles) {
    ctx.signal?.throwIfAborted();
    encoded += (await encodePixels(file.type, tile, quality)).byteLength;
    pixels += tile.width * tile.height;
  }
  return Math.round((encoded * sample.width * sample.height) / pixels);
};

export const estimateSizes = async (
  { files, quality }: CompressImagesInput,
  ctx: ToolContext = {},
): Promise<(number | null)[]> => {
  const keys = new Set(files.map(keyOf));
  for (const key of samples.keys()) if (!keys.has(key)) samples.delete(key);

  const sizes: (number | null)[] = [];
  for (const file of files) {
    ctx.signal?.throwIfAborted();
    try {
      // 重新编码后更大时 compressImages 会原样返回原文件
      sizes.push(Math.min(await estimateFile(file, quality, ctx), file.size));
    } catch (error) {
      if (ctx.signal?.aborted) throw error;
      sizes.push(null);
    }
  }
  return sizes;
};
