// 裁剪、旋转、翻转的几何（Image Cropper 的 core 和裁剪框编辑器共用）。
// 坐标都在「按 EXIF 摆正、旋转、翻转之后」的图上，也就是预览里看到的样子：先顺时针旋转，再在旋转后的图上翻转，最后裁剪

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Size {
  x: number;
  y: number;
}

export const ROTATIONS = ["0", "90", "180", "270"] as const;
export type Rotation = (typeof ROTATIONS)[number];

export interface Orientation {
  rotate: Rotation;
  flipHorizontal: boolean;
  flipVertical: boolean;
}

// 预设比例：横竖各一个（1:1 除外），free 表示不锁定
export const ASPECTS = ["free", "1:1", "4:3", "3:4", "3:2", "2:3", "16:9", "9:16"] as const;
export type Aspect = (typeof ASPECTS)[number];

// 宽 / 高；free 没有比例
export const ratioOf = (aspect: Aspect): number | undefined => {
  if (aspect === "free") return undefined;
  const [width, height] = aspect.split(":").map(Number);
  return width! / height!;
};

// 横竖互换（4:3 ↔ 3:4）；free 和 1:1 不变
export const swapAspect = (aspect: Aspect): Aspect => {
  if (aspect === "free") return aspect;
  const [width, height] = aspect.split(":");
  return `${height}:${width}` as Aspect;
};

export const orientedSize = (size: Size, rotate: Rotation): Size =>
  rotate === "90" || rotate === "270" ? { width: size.height, height: size.width } : size;

// 居中、按比例的最大区域；free 是整张图
export const centeredCrop = (size: Size, aspect: Aspect): Rect => {
  const ratio = ratioOf(aspect);
  if (ratio === undefined) return { x: 0, y: 0, ...size };
  const width =
    size.width / size.height > ratio
      ? Math.max(1, Math.min(size.width, Math.round(size.height * ratio)))
      : size.width;
  const height =
    width === size.width
      ? Math.max(1, Math.min(size.height, Math.round(width / ratio)))
      : size.height;
  return {
    x: Math.floor((size.width - width) / 2),
    y: Math.floor((size.height - height) / 2),
    width,
    height,
  };
};

export class InvalidCropError extends Error {}

// "x, y, width, height"（整数像素，逗号或空格分隔）；空字符串表示用默认区域，返回 undefined
export const parseCrop = (text: string): Rect | undefined => {
  const trimmed = text.trim();
  if (trimmed === "") return undefined;
  const parts = trimmed.split(/\s*[,\s]\s*/);
  if (parts.length !== 4 || parts.some((part) => !/^\d{1,6}$/.test(part))) {
    throw new InvalidCropError(trimmed);
  }
  const [x, y, width, height] = parts.map(Number) as [number, number, number, number];
  if (width < 1 || height < 1) throw new InvalidCropError(trimmed);
  return { x, y, width, height };
};

export const formatCrop = ({ x, y, width, height }: Rect): string =>
  `${x}, ${y}, ${width}, ${height}`;

export const fitsIn = (rect: Rect, size: Size): boolean =>
  rect.x + rect.width <= size.width && rect.y + rect.height <= size.height;

// 把源图（摆正后的尺寸 size）画到旋转、翻转后的坐标系里：之后在 (0, 0) 画源图即可。
// 用精确的整数矩阵，不用 rotate()：三角函数的舍入误差会让关掉插值的取样偏一个像素
export const applyOrientation = (
  context: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  size: Size,
  { rotate, flipHorizontal, flipVertical }: Orientation,
): void => {
  const oriented = orientedSize(size, rotate);
  // 后设置的变换先作用在源图上：先旋转，再翻转
  if (flipHorizontal) context.transform(-1, 0, 0, 1, oriented.width, 0);
  if (flipVertical) context.transform(1, 0, 0, -1, 0, oriented.height);
  if (rotate === "90") context.transform(0, 1, -1, 0, size.height, 0);
  if (rotate === "180") context.transform(-1, 0, 0, -1, size.width, size.height);
  if (rotate === "270") context.transform(0, -1, 1, 0, 0, size.width);
};
