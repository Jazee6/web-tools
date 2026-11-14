import { encodeImage, type ImageMimeType } from "@/lib/image/encode";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

import { type Fit, MAX_SIDE, planResize } from "./size";

export interface ResizeImagesInput {
  files: File[];
  width?: number;
  height?: number;
  fit: Fit;
  quality: number;
}

const canvasContext = (width: number, height: number) => {
  const context = new OffscreenCanvas(width, height).getContext("2d", {
    willReadFrequently: true,
  });
  if (!context) throw new Error("无法创建画布");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  return context;
};

// 先按整数像素裁好再缩放：直接带取样区域缩放时，WebKit 的插值会混入区域外的像素。
// 一次缩小很多倍时，浏览器的插值只看少数相邻像素，细节会变成锯齿；所以每次最多缩小一半，逐步缩到接近目标尺寸
const drawScaled = (
  bitmap: ImageBitmap,
  crop: { x: number; y: number; width: number; height: number },
  width: number,
  height: number,
) => {
  const cropped = canvasContext(crop.width, crop.height);
  cropped.imageSmoothingEnabled = false;
  cropped.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

  let source = cropped.canvas;
  while (source.width > width * 2 || source.height > height * 2) {
    const step = canvasContext(
      Math.max(width, Math.ceil(source.width / 2)),
      Math.max(height, Math.ceil(source.height / 2)),
    );
    step.drawImage(source, 0, 0, step.canvas.width, step.canvas.height);
    source = step.canvas;
  }
  const context = canvasContext(width, height);
  context.drawImage(source, 0, 0, width, height);
  return context.getImageData(0, 0, width, height);
};

const resizedName = (name: string, width: number, height: number) => {
  const dot = name.lastIndexOf(".");
  const size = `-${width}x${height}`;
  return dot > 0 ? `${name.slice(0, dot)}${size}${name.slice(dot)}` : `${name}${size}`;
};

const resizeImage = async (file: File, input: ResizeImagesInput) => {
  // createImageBitmap 会按 EXIF 方向摆正
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new ToolError("decode_failed", { field: "files", detail: file.name });
  });
  try {
    const { width, height, crop } = planResize(bitmap, input);
    if (Math.max(width, height) > MAX_SIDE) {
      throw new ToolError("too_large", { field: "files", detail: file.name });
    }
    let pixels: ImageData;
    try {
      pixels = drawScaled(bitmap, crop, width, height);
    } catch {
      // 浏览器的画布面积上限各不相同（手机上更小），超出时创建画布或读取像素会失败
      throw new ToolError("too_large", { field: "files", detail: file.name });
    }
    const bytes = await encodeImage(pixels, file.type as ImageMimeType, input.quality);
    return new File([bytes], resizedName(file.name, width, height), { type: file.type });
  } finally {
    bitmap.close();
  }
};

// 逐个处理：并行解码多张大图会撑爆内存
export const resizeImages = async (input: ResizeImagesInput, ctx: ToolContext = {}) => {
  if (input.width === undefined && input.height === undefined) {
    throw new ToolError("size_required", { field: "width" });
  }
  const resized: File[] = [];
  for (const [index, file] of input.files.entries()) {
    ctx.signal?.throwIfAborted();
    ctx.onProgress?.(index / input.files.length);
    resized.push(await resizeImage(file, input));
  }
  return { files: resized };
};
