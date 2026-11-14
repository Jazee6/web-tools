// 像素运算都用 JS 自己算（不用画布的 drawImage）：各浏览器的画布缩放算法不同，检测框和识别结果会跟着变，
// examples 就不能在三个引擎上稳定匹配。

export interface Rgba {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export type Point = readonly [x: number, y: number];

// 双线性取样（与 OpenCV 的 INTER_LINEAR 一致：像素中心对齐，越界按边缘像素复制），按 BGR 顺序写进 target 的三个平面
const sampleInto = (
  image: Rgba,
  x: number,
  y: number,
  target: Float32Array,
  index: number,
  plane: number,
  normalize: (value: number, channel: number) => number,
) => {
  const { width, height, data } = image;
  const cx = Math.min(Math.max(x, 0), width - 1);
  const cy = Math.min(Math.max(y, 0), height - 1);
  const x0 = Math.floor(cx);
  const y0 = Math.floor(cy);
  const x1 = Math.min(x0 + 1, width - 1);
  const y1 = Math.min(y0 + 1, height - 1);
  const fx = cx - x0;
  const fy = cy - y0;
  const a = (y0 * width + x0) * 4;
  const b = (y0 * width + x1) * 4;
  const c = (y1 * width + x0) * 4;
  const d = (y1 * width + x1) * 4;
  for (let channel = 0; channel < 3; channel++) {
    // BGR：模型按 OpenCV 读入的通道顺序训练
    const source = 2 - channel;
    const top = data[a + source]! + (data[b + source]! - data[a + source]!) * fx;
    const bottom = data[c + source]! + (data[d + source]! - data[c + source]!) * fx;
    target[channel * plane + index] = normalize(top + (bottom - top) * fy, channel);
  }
};

// 缩放成 width × height 并归一化，得到 [3, height, width] 的 BGR 平面（padTo 更宽时右侧补 fill）
export const resizeToPlanes = (
  image: Rgba,
  width: number,
  height: number,
  normalize: (value: number, channel: number) => number,
  padTo = width,
  fill = 0,
): Float32Array => {
  const plane = padTo * height;
  const planes = new Float32Array(3 * plane).fill(fill);
  const scaleX = image.width / width;
  const scaleY = image.height / height;
  for (let y = 0; y < height; y++) {
    const sy = (y + 0.5) * scaleY - 0.5;
    for (let x = 0; x < width; x++) {
      sampleInto(image, (x + 0.5) * scaleX - 0.5, sy, planes, y * padTo + x, plane, normalize);
    }
  }
  return planes;
};

// 按四边形（左上、右上、右下、左下）把一行文字裁成水平的 RGBA 图（与 PaddleOCR 的 get_rotate_crop_image 一致）。
// 检测框是矩形（可能旋转），用仿射映射即可
export const cropQuad = (image: Rgba, quad: readonly Point[]): Rgba => {
  const [p0, p1, p2, p3] = quad as [Point, Point, Point, Point];
  const length = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const width = Math.max(1, Math.trunc(Math.max(length(p0, p1), length(p2, p3))));
  const height = Math.max(1, Math.trunc(Math.max(length(p0, p3), length(p1, p2))));
  const ux = [(p1[0] - p0[0]) / width, (p1[1] - p0[1]) / width] as const;
  const vy = [(p3[0] - p0[0]) / height, (p3[1] - p0[1]) / height] as const;
  const plane = width * height;
  const bgr = new Float32Array(3 * plane);
  for (let v = 0; v < height; v++) {
    for (let u = 0; u < width; u++) {
      const x = p0[0] + ux[0] * u + vy[0] * v;
      const y = p0[1] + ux[1] * u + vy[1] * v;
      sampleInto(image, x, y, bgr, v * width + u, plane, (value) => value);
    }
  }
  const data = new Uint8ClampedArray(plane * 4);
  for (let i = 0; i < plane; i++) {
    data[i * 4] = bgr[2 * plane + i]!;
    data[i * 4 + 1] = bgr[plane + i]!;
    data[i * 4 + 2] = bgr[i]!;
    data[i * 4 + 3] = 255;
  }
  const crop = { width, height, data };
  // 竖长的框当作竖排文字，逆时针转 90° 再识别（与 np.rot90 一致）
  return height / width >= 1.5 ? rotateCounterClockwise(crop) : crop;
};

const rotateCounterClockwise = ({ width, height, data }: Rgba): Rgba => {
  const rotated = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 原图 (x, y) → 新图 (y, width - 1 - x)，新图宽为 height
      const target = ((width - 1 - x) * height + y) * 4;
      rotated.set(data.subarray((y * width + x) * 4, (y * width + x) * 4 + 4), target);
    }
  }
  return { width: height, height: width, data: rotated };
};

// 透明像素铺在白底上：透明 PNG 里的文字多是深色，透明处的 RGB 常是黑色
export const flattenOnWhite = (image: Rgba): Rgba => {
  const { data } = image;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]!;
    if (alpha === 255) continue;
    for (let channel = 0; channel < 3; channel++) {
      data[i + channel] = (data[i + channel]! * alpha + 255 * (255 - alpha)) / 255;
    }
    data[i + 3] = 255;
  }
  return image;
};
