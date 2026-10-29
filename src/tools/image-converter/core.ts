import { ToolError } from "@/lib/tool-contract/define-tool";

export interface ConvertImageInput {
  file: File;
  format: "jpeg" | "png" | "webp" | "avif";
  quality: number;
}

const OUTPUT = {
  jpeg: { type: "image/jpeg", extension: ".jpg" },
  png: { type: "image/png", extension: ".png" },
  webp: { type: "image/webp", extension: ".webp" },
  avif: { type: "image/avif", extension: ".avif" },
} as const;

// libheif（HEIC 解码，含 HEVC）编译成的 WASM，首次遇到 HEIC 时加载并初始化一次
let libheif: Promise<
  Awaited<ReturnType<typeof import("libheif-js/libheif-wasm/libheif-bundle.mjs").default>>
>;

const decodeHeic = async (file: File): Promise<ImageData> => {
  libheif ??= import("libheif-js/libheif-wasm/libheif-bundle.mjs").then((m) => m.default());
  try {
    const [image] = new (await libheif).HeifDecoder().decode(await file.arrayBuffer());
    if (!image) throw new Error("HEIC 文件里没有图像");
    const width = image.get_width();
    const height = image.get_height();
    const decoded = await new Promise<ImageData | null>((resolve) =>
      image.display({ data: new Uint8ClampedArray(width * height * 4), width, height }, resolve),
    );
    if (!decoded) throw new Error("HEIC 解码失败");
    // libheif 回调给的是只有 data / width / height 的普通对象，putImageData 要真正的 ImageData
    return new ImageData(decoded.data, width, height);
  } catch {
    throw new ToolError("decode_failed", { field: "file" });
  }
};

// 原生 API 解码（createImageBitmap 会按 EXIF 方向摆正）
const decodeNative = async (file: File): Promise<ImageData> => {
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

const decode = (file: File) =>
  file.type === "image/heic" || file.type === "image/heif" ? decodeHeic(file) : decodeNative(file);

// JPEG 没有透明通道，编码器会把透明像素当成黑色，所以先铺上白底
const flattenOnWhite = (image: ImageData) => {
  const { data } = image;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]! / 255;
    if (alpha === 1) continue;
    data[i] = Math.round(data[i]! * alpha + 255 * (1 - alpha));
    data[i + 1] = Math.round(data[i + 1]! * alpha + 255 * (1 - alpha));
    data[i + 2] = Math.round(data[i + 2]! * alpha + 255 * (1 - alpha));
    data[i + 3] = 255;
  }
};

const encode = async (image: ImageData, format: ConvertImageInput["format"], quality: number) => {
  switch (format) {
    case "jpeg": {
      const { default: encodeJpeg } = await import("@jsquash/jpeg/encode");
      flattenOnWhite(image);
      return encodeJpeg(image, { quality });
    }
    case "webp": {
      const { default: encodeWebp } = await import("@jsquash/webp/encode");
      return encodeWebp(image, { quality });
    }
    case "avif": {
      const { default: encodeAvif } = await import("@jsquash/avif/encode");
      return encodeAvif(image, { quality });
    }
    case "png": {
      // 浏览器原生编码出 PNG，再用 OxiPNG 无损优化
      const canvas = new OffscreenCanvas(image.width, image.height);
      canvas.getContext("2d")!.putImageData(image, 0, 0);
      const blob = await canvas.convertToBlob({ type: "image/png" });
      const { default: optimise } = await import("@jsquash/oxipng/optimise");
      return optimise(await blob.arrayBuffer(), { level: 2 });
    }
  }
};

const convertedName = (name: string, extension: string) => {
  const dot = name.lastIndexOf(".");
  return `${dot > 0 ? name.slice(0, dot) : name}${extension}`;
};

export const convertImage = async ({ file, format, quality }: ConvertImageInput) => {
  const output = OUTPUT[format];
  const bytes = await encode(await decode(file), format, quality);
  return {
    file: new File([bytes], convertedName(file.name, output.extension), { type: output.type }),
  };
};
