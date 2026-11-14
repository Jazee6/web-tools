import type { Orientation } from "./exif";

export type PageSize = "a4" | "letter" | "fit";
export type PageOrientation = "auto" | "portrait" | "landscape";
export type Margin = "none" | "small" | "large";

export interface LayoutOptions {
  pageSize: PageSize;
  orientation: PageOrientation;
  margin: Margin;
}

export interface PageLayout {
  // 页面尺寸，单位 pt（1/72 英寸）
  width: number;
  height: number;
  // 图片在页面上的位置和尺寸；PDF 的原点在左下角
  image: { x: number; y: number; width: number; height: number };
}

// 竖向的宽高（pt）：A4 是 210 × 297 mm，Letter 是 8.5 × 11 in
const SIZES = {
  a4: [(210 / 25.4) * 72, (297 / 25.4) * 72],
  letter: [612, 792],
} as const;

// 0.5 in、1 in
export const MARGINS: Record<Margin, number> = { none: 0, small: 36, large: 72 };

// 「适应图片」时按 96 像素每英寸换算：1 px = 0.75 pt，与浏览器打印图片的比例相同
const PX_TO_PT = 72 / 96;

// 按显示方向的像素尺寸（已摆正）排版：图片按比例放进页边距以内并居中，小图也会放大到填满
export const layoutPage = (
  { pageSize, orientation, margin }: LayoutOptions,
  pixels: { width: number; height: number },
): PageLayout => {
  const gap = MARGINS[margin];
  if (pageSize === "fit") {
    const width = pixels.width * PX_TO_PT;
    const height = pixels.height * PX_TO_PT;
    return {
      width: width + gap * 2,
      height: height + gap * 2,
      image: { x: gap, y: gap, width, height },
    };
  }

  const [short, long] = SIZES[pageSize];
  const landscape =
    orientation === "landscape" || (orientation === "auto" && pixels.width > pixels.height);
  const width = landscape ? long : short;
  const height = landscape ? short : long;
  const scale = Math.min((width - gap * 2) / pixels.width, (height - gap * 2) / pixels.height);
  const imageWidth = pixels.width * scale;
  const imageHeight = pixels.height * scale;
  return {
    width,
    height,
    image: {
      x: (width - imageWidth) / 2,
      y: (height - imageHeight) / 2,
      width: imageWidth,
      height: imageHeight,
    },
  };
};

// 方向 5–8 转了 90°，显示时宽高互换
export const displaySize = (
  stored: { width: number; height: number },
  orientation: Orientation,
): { width: number; height: number } =>
  orientation >= 5 ? { width: stored.height, height: stored.width } : stored;

// 存储图像里的归一化坐标 (s, t)（t 向下）→ 摆正后的显示坐标 (X, Y)（Y 向下）
const ORIENT: Record<Orientation, (s: number, t: number) => [number, number]> = {
  1: (s, t) => [s, t],
  2: (s, t) => [1 - s, t],
  3: (s, t) => [1 - s, 1 - t],
  4: (s, t) => [s, 1 - t],
  5: (s, t) => [t, s],
  6: (s, t) => [1 - t, s],
  7: (s, t) => [1 - t, 1 - s],
  8: (s, t) => [t, 1 - s],
};

// PDF 图像对象的矩阵 [a b c d e f] 把单位正方形映射到页面：(u, v) → (a·u + c·v + e, b·u + d·v + f)。
// 单位正方形里 v = 1 是图像第一行，即 s = u、t = 1 − v。三个角定出整个仿射变换
export const imageMatrix = (
  rect: PageLayout["image"],
  orientation: Orientation,
): [number, number, number, number, number, number] => {
  const place = (u: number, v: number) => {
    const [x, y] = ORIENT[orientation](u, 1 - v);
    return [rect.x + x * rect.width, rect.y + (1 - y) * rect.height] as const;
  };
  const [e, f] = place(0, 0);
  const [ux, uy] = place(1, 0);
  const [vx, vy] = place(0, 1);
  return [ux - e, uy - f, vx - e, vy - f, e, f];
};
