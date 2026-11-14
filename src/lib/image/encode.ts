export type ImageMimeType = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

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

export const optimisePng = async (bytes: ArrayBuffer): Promise<ArrayBuffer> => {
  const { default: optimise } = await import("@jsquash/oxipng/optimise");
  return optimise(bytes, { level: 2 });
};

// jSquash 按格式编码；编码器按需加载，各自初始化一次 WASM。PNG 用浏览器原生编码器得到字节，再用 OxiPNG 无损优化
export const encodeImage = async (
  image: ImageData,
  type: ImageMimeType,
  quality: number,
): Promise<ArrayBuffer> => {
  switch (type) {
    case "image/jpeg": {
      const { default: encodeJpeg } = await import("@jsquash/jpeg/encode");
      flattenOnWhite(image);
      return encodeJpeg(image, { quality });
    }
    case "image/webp": {
      const { default: encodeWebp } = await import("@jsquash/webp/encode");
      return encodeWebp(image, { quality });
    }
    case "image/avif": {
      const { default: encodeAvif } = await import("@jsquash/avif/encode");
      return encodeAvif(image, { quality });
    }
    case "image/png": {
      const canvas = new OffscreenCanvas(image.width, image.height);
      canvas.getContext("2d")!.putImageData(image, 0, 0);
      const blob = await canvas.convertToBlob({ type: "image/png" });
      return optimisePng(await blob.arrayBuffer());
    }
  }
};
