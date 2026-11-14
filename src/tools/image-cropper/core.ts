import {
  applyOrientation,
  type Aspect,
  centeredCrop,
  fitsIn,
  InvalidCropError,
  orientedSize,
  parseCrop,
  type Rotation,
} from "@/lib/image/crop";
import { encodeImage, type ImageMimeType } from "@/lib/image/encode";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

export interface CropImageInput {
  file: File;
  rotate: Rotation;
  flipHorizontal: boolean;
  flipVertical: boolean;
  aspect: Aspect;
  crop: string;
  quality: number;
}

const readCrop = (text: string) => {
  try {
    return parseCrop(text);
  } catch (error) {
    if (error instanceof InvalidCropError) {
      throw new ToolError("invalid_crop", { field: "crop", detail: error.message });
    }
    throw error;
  }
};

const croppedName = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? `${name.slice(0, dot)}-cropped${name.slice(dot)}` : `${name}-cropped`;
};

// 只画裁剪区域那么大的画布：平移到区域原点，再按旋转、翻转画整张图。
// 90° 的倍数加整数平移，关掉插值后逐像素精确
export const cropImage = async (input: CropImageInput, { signal }: ToolContext = {}) => {
  const { file, rotate, flipHorizontal, flipVertical } = input;
  const requested = readCrop(input.crop);
  // createImageBitmap 会按 EXIF 方向摆正
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new ToolError("decode_failed", { field: "file" });
  });
  try {
    // ImageBitmap 的宽高是原型上的 getter，展开时会丢失，先取成普通对象
    const source = { width: bitmap.width, height: bitmap.height };
    const size = orientedSize(source, rotate);
    const area = requested ?? centeredCrop(size, input.aspect);
    if (!fitsIn(area, size)) {
      throw new ToolError("crop_out_of_range", {
        field: "crop",
        detail: `${size.width} × ${size.height}`,
      });
    }
    signal?.throwIfAborted();

    let pixels: ImageData;
    try {
      const context = new OffscreenCanvas(area.width, area.height).getContext("2d", {
        willReadFrequently: true,
      });
      if (!context) throw new Error("无法创建画布");
      context.imageSmoothingEnabled = false;
      context.translate(-area.x, -area.y);
      applyOrientation(context, source, { rotate, flipHorizontal, flipVertical });
      context.drawImage(bitmap, 0, 0);
      pixels = context.getImageData(0, 0, area.width, area.height);
    } catch {
      // 浏览器的画布面积上限各不相同（手机上更小），超出时创建画布或读取像素会失败
      throw new ToolError("too_large", { field: "file" });
    }
    const bytes = await encodeImage(pixels, file.type as ImageMimeType, input.quality);
    return { file: new File([bytes], croppedName(file.name), { type: file.type }) };
  } finally {
    bitmap.close();
  }
};
