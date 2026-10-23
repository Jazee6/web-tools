import { ToolError } from "@/lib/tool-contract/define-tool";

export interface CompressImageInput {
  file: File;
  quality: number;
}

// 原生 API 解码（createImageBitmap 会按 EXIF 方向摆正），jSquash 按格式编码；编码器按需加载，各自初始化一次 WASM。
// PNG 直接对原始字节做 oxipng 无损优化，不经过解码。
const decode = async (file: File): Promise<ImageData> => {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new ToolError("decode_failed", { field: "file" });
  }
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  return context.getImageData(0, 0, canvas.width, canvas.height);
};

const encode = async (file: File, quality: number): Promise<ArrayBuffer> => {
  switch (file.type) {
    case "image/png": {
      const { default: optimise } = await import("@jsquash/oxipng/optimise");
      return optimise(await file.arrayBuffer(), { level: 2 });
    }
    case "image/jpeg": {
      const { default: encodeJpeg } = await import("@jsquash/jpeg/encode");
      return encodeJpeg(await decode(file), { quality });
    }
    case "image/webp": {
      const { default: encodeWebp } = await import("@jsquash/webp/encode");
      return encodeWebp(await decode(file), { quality });
    }
    case "image/avif": {
      const { default: encodeAvif } = await import("@jsquash/avif/encode");
      return encodeAvif(await decode(file), { quality });
    }
    default:
      throw new ToolError("decode_failed", { field: "file" });
  }
};

const compressedName = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? `${name.slice(0, dot)}-compressed${name.slice(dot)}` : `${name}-compressed`;
};

export const compressImage = async ({ file, quality }: CompressImageInput) => {
  const encoded = await encode(file, quality);
  // 已经足够小的图片重新编码可能反而变大，这时原样返回
  const bytes = encoded.byteLength < file.size ? encoded : await file.arrayBuffer();
  return { file: new File([bytes], compressedName(file.name), { type: file.type }) };
};
