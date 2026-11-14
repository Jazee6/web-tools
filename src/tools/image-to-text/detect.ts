// 文字检测（PP-OCRv6 det，DB 算法）的预处理和后处理，对照 PaddleX 3.7 的 DetResizeForTest 和 DBPostProcess。
// 后处理不用 OpenCV：连通域 → 凸包 → 最小外接矩形（旋转卡壳）→ 按 DB 的 unclip 外扩。
import { type Point, type Rgba, resizeToPlanes } from "./image";

// 长边上限：PaddleOCR 流水线允许到 4000 px，但浏览器里 WASM 单线程算一张 4000 px 的图又慢又占内存。
// 2048 px 下 A4 扫描件（约 150 DPI）的正文仍有十几像素高，够检测
export const MAX_SIDE = 2048;

// PaddleOCR 流水线（OCR.yaml）的检测参数
export const THRESH = 0.3;
export const BOX_THRESH = 0.6;
export const UNCLIP_RATIO = 1.5;
const MIN_SIZE = 3;
const MAX_CANDIDATES = 1000;

const MEAN = [0.406, 0.456, 0.485] as const; // BGR 顺序
const STD = [0.225, 0.224, 0.229] as const;

// 缩放后的边长取 32 的倍数（网络下采样 32 倍），至少 32
export const detectionSize = (width: number, height: number) => {
  const ratio = Math.min(1, MAX_SIDE / Math.max(width, height));
  const round32 = (value: number) => Math.max(Math.round(Math.trunc(value * ratio) / 32) * 32, 32);
  return { width: round32(width), height: round32(height) };
};

export const detectionInput = (image: Rgba) => {
  const size = detectionSize(image.width, image.height);
  const planes = resizeToPlanes(
    image,
    size.width,
    size.height,
    (value, channel) => (value / 255 - MEAN[channel]!) / STD[channel]!,
  );
  return { ...size, planes };
};

const cross = (o: Point, a: Point, b: Point) =>
  (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

// Andrew 单调链；points 已按 x、再按 y 排序
const convexHull = (points: Point[]): Point[] => {
  if (points.length < 3) return points;
  const lower: Point[] = [];
  for (const point of points) {
    while (lower.length >= 2 && cross(lower.at(-2)!, lower.at(-1)!, point) <= 0) lower.pop();
    lower.push(point);
  }
  const upper: Point[] = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i]!;
    while (upper.length >= 2 && cross(upper.at(-2)!, upper.at(-1)!, point) <= 0) upper.pop();
    upper.push(point);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};

interface Rect {
  center: Point;
  // 沿 axis 方向的边长和垂直方向的边长
  length: number;
  breadth: number;
  axis: Point;
}

// 凸包的最小面积外接矩形：最优矩形必有一条边与凸包的某条边重合，逐边投影取面积最小的
const minAreaRect = (hull: Point[]): Rect => {
  if (hull.length === 1) return { center: hull[0]!, length: 0, breadth: 0, axis: [1, 0] };
  let best: Rect | undefined;
  let bestArea = Infinity;
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i]!;
    const b = hull[(i + 1) % hull.length]!;
    const norm = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (norm === 0) continue;
    const ux = (b[0] - a[0]) / norm;
    const uy = (b[1] - a[1]) / norm;
    let minU = Infinity;
    let maxU = -Infinity;
    let minV = Infinity;
    let maxV = -Infinity;
    for (const [x, y] of hull) {
      const u = x * ux + y * uy;
      const v = -x * uy + y * ux;
      minU = Math.min(minU, u);
      maxU = Math.max(maxU, u);
      minV = Math.min(minV, v);
      maxV = Math.max(maxV, v);
    }
    const area = (maxU - minU) * (maxV - minV);
    if (area < bestArea) {
      bestArea = area;
      const cu = (minU + maxU) / 2;
      const cv = (minV + maxV) / 2;
      best = {
        center: [cu * ux - cv * uy, cu * uy + cv * ux],
        length: maxU - minU,
        breadth: maxV - minV,
        axis: [ux, uy],
      };
    }
  }
  return best!;
};

// 矩形四角排成左上、右上、右下、左下（与 PaddleOCR 的 get_mini_boxes 一致：先按 x 排序，左右两对各按 y 分上下）
const corners = ({ center, length, breadth, axis }: Rect): Point[] => {
  const [ux, uy] = axis;
  const hu = length / 2;
  const hv = breadth / 2;
  const points: Point[] = [
    [center[0] - ux * hu + uy * hv, center[1] - uy * hu - ux * hv],
    [center[0] + ux * hu + uy * hv, center[1] + uy * hu - ux * hv],
    [center[0] + ux * hu - uy * hv, center[1] + uy * hu + ux * hv],
    [center[0] - ux * hu - uy * hv, center[1] - uy * hu + ux * hv],
  ];
  const sorted = points.toSorted((a, b) => a[0] - b[0]);
  const [left0, left1, right0, right1] = sorted as [Point, Point, Point, Point];
  const [topLeft, bottomLeft] = left1[1] > left0[1] ? [left0, left1] : [left1, left0];
  const [topRight, bottomRight] = right1[1] > right0[1] ? [right0, right1] : [right1, right0];
  return [topLeft, topRight, bottomRight, bottomLeft];
};

// 框内（含边界）的平均概率，对应 box_score_fast
const boxScore = (prob: Float32Array, width: number, height: number, box: Point[]) => {
  const xs = box.map((p) => p[0]);
  const ys = box.map((p) => p[1]);
  const clampX = (value: number) => Math.max(0, Math.min(value, width - 1));
  const clampY = (value: number) => Math.max(0, Math.min(value, height - 1));
  const xmin = clampX(Math.floor(Math.min(...xs)));
  const xmax = clampX(Math.ceil(Math.max(...xs)));
  const ymin = clampY(Math.floor(Math.min(...ys)));
  const ymax = clampY(Math.ceil(Math.max(...ys)));
  const polygon = box.map(([x, y]) => [Math.trunc(x), Math.trunc(y)] as Point);
  let sum = 0;
  let count = 0;
  for (let y = ymin; y <= ymax; y++) {
    for (let x = xmin; x <= xmax; x++) {
      const point: Point = [x, y];
      let inside = true;
      for (let i = 0; i < 4 && inside; i++) {
        // 四角是顺时针（图像坐标 y 向下），内部点对每条边的叉积都不小于 0
        if (cross(polygon[i]!, polygon[(i + 1) % 4]!, point) < -0.5) inside = false;
      }
      if (inside) {
        sum += prob[y * width + x]!;
        count++;
      }
    }
  }
  return count ? sum / count : 0;
};

// 二值图的 8 连通域，每个连通域给出每行最左、最右的像素（凸包只需要这些点）
const components = (mask: Uint8Array, width: number, height: number): Point[][] => {
  const result: Point[][] = [];
  const seen = new Uint8Array(mask.length);
  const stack: number[] = [];
  for (let start = 0; start < mask.length && result.length < MAX_CANDIDATES; start++) {
    if (!mask[start] || seen[start]) continue;
    const rows = new Map<number, [number, number]>();
    seen[start] = 1;
    stack.push(start);
    while (stack.length) {
      const index = stack.pop()!;
      const x = index % width;
      const y = (index - x) / width;
      const row = rows.get(y);
      if (!row) rows.set(y, [x, x]);
      else {
        row[0] = Math.min(row[0], x);
        row[1] = Math.max(row[1], x);
      }
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          const next = ny * width + nx;
          if (mask[next] && !seen[next]) {
            seen[next] = 1;
            stack.push(next);
          }
        }
      }
    }
    const points: Point[] = [];
    for (const [y, [left, right]] of rows) {
      points.push([left, y]);
      if (right !== left) points.push([right, y]);
    }
    result.push(points.toSorted((a, b) => a[0] - b[0] || a[1] - b[1]));
  }
  return result;
};

// 概率图（检测输入尺寸）→ 原图坐标里外扩后的文字框，每个框四个角：左上、右上、右下、左下
export const boxesFromProbabilities = (
  prob: Float32Array,
  width: number,
  height: number,
  sourceWidth: number,
  sourceHeight: number,
): Point[][] => {
  const mask = new Uint8Array(prob.length);
  for (let i = 0; i < prob.length; i++) mask[i] = prob[i]! > THRESH ? 1 : 0;
  const scaleX = sourceWidth / width;
  const scaleY = sourceHeight / height;
  const toSource = (points: Point[]): Point[] =>
    points.map(([x, y]) => [
      Math.max(0, Math.min(Math.round(x * scaleX), sourceWidth)),
      Math.max(0, Math.min(Math.round(y * scaleY), sourceHeight)),
    ]);
  const boxes: Point[][] = [];
  for (const points of components(mask, width, height)) {
    const rect = minAreaRect(convexHull(points));
    if (Math.min(rect.length, rect.breadth) < MIN_SIZE) continue;
    if (boxScore(prob, width, height, corners(rect)) < BOX_THRESH) continue;
    // DB 的 unclip：多边形按 面积 × 比例 ÷ 周长 向外偏移。矩形偏移后（圆角）的最小外接矩形就是每边外扩 distance
    const distance =
      (rect.length * rect.breadth * UNCLIP_RATIO) / (2 * (rect.length + rect.breadth));
    const grown = {
      ...rect,
      length: rect.length + 2 * distance,
      breadth: rect.breadth + 2 * distance,
    };
    if (Math.min(grown.length, grown.breadth) < MIN_SIZE + 2) continue;
    boxes.push(toSource(corners(grown)));
  }
  return boxes;
};
