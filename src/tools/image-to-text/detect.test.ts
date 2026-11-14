import { describe, expect, it } from "vitest";

import { boxesFromProbabilities, detectionSize, MAX_SIDE } from "./detect";

// 宽 width、高 height 的概率图，fill 里返回 true 的像素概率为 0.9，其余为 0
const probabilityMap = (
  width: number,
  height: number,
  fill: (x: number, y: number) => boolean,
): Float32Array => {
  const map = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) if (fill(x, y)) map[y * width + x] = 0.9;
  }
  return map;
};

describe("detectionSize", () => {
  it("rounds both sides to multiples of 32 without upscaling", () => {
    expect(detectionSize(800, 230)).toEqual({ width: 800, height: 224 });
    expect(detectionSize(10, 10)).toEqual({ width: 32, height: 32 });
  });

  it(`scales the longer side down to ${MAX_SIDE} pixels`, () => {
    expect(detectionSize(4032, 3024)).toEqual({ width: 2048, height: 1536 });
    expect(detectionSize(1000, 5000)).toEqual({ width: 416, height: 2048 });
  });
});

describe("boxesFromProbabilities", () => {
  it("grows an axis-aligned region by the DB unclip distance", () => {
    // 100 × 10 的区域（像素中心 10–109、20–29，外接矩形 99 × 9），distance = 99 × 9 × 1.5 / (2 × 108) ≈ 6.19
    const map = probabilityMap(200, 50, (x, y) => x >= 10 && x < 110 && y >= 20 && y < 30);
    expect(boxesFromProbabilities(map, 200, 50, 200, 50)).toEqual([
      [
        [4, 14],
        [115, 14],
        [115, 35],
        [4, 35],
      ],
    ]);
  });

  it("scales boxes back to the source size", () => {
    const map = probabilityMap(200, 50, (x, y) => x >= 10 && x < 110 && y >= 20 && y < 30);
    expect(boxesFromProbabilities(map, 200, 50, 400, 100)).toEqual([
      [
        [8, 28],
        [230, 28],
        [230, 70],
        [8, 70],
      ],
    ]);
  });

  it("follows a tilted line with a rotated box", () => {
    // 一条斜向下约 11° 的带子
    const map = probabilityMap(
      300,
      120,
      (x, y) => x >= 20 && x < 260 && Math.abs(y - (30 + (x - 20) * 0.2)) < 6,
    );
    const [box] = boxesFromProbabilities(map, 300, 120, 300, 120);
    const [topLeft, topRight, bottomRight, bottomLeft] = box!;
    // 上下两条边与带子平行（斜率 0.2），左上角在左、右下角在下
    expect((topRight![1] - topLeft![1]) / (topRight![0] - topLeft![0])).toBeCloseTo(0.2, 1);
    expect((bottomRight![1] - bottomLeft![1]) / (bottomRight![0] - bottomLeft![0])).toBeCloseTo(
      0.2,
      1,
    );
    expect(topLeft![0]).toBeLessThan(topRight![0]);
    expect(bottomLeft![1]).toBeGreaterThan(topLeft![1]);
  });

  it("drops regions that are too thin or too faint", () => {
    const thin = probabilityMap(100, 40, (x, y) => x >= 10 && x < 90 && y === 20);
    expect(boxesFromProbabilities(thin, 100, 40, 100, 40)).toEqual([]);
    // 超过二值化阈值（0.3）但平均分低于 box_thresh（0.6）
    const faint = new Float32Array(100 * 40);
    for (let y = 10; y < 20; y++) for (let x = 10; x < 90; x++) faint[y * 100 + x] = 0.4;
    expect(boxesFromProbabilities(faint, 100, 40, 100, 40)).toEqual([]);
  });

  it("finds separate regions as separate boxes", () => {
    const map = probabilityMap(
      200,
      80,
      (x, y) => x >= 10 && x < 190 && ((y >= 10 && y < 20) || (y >= 50 && y < 60)),
    );
    expect(boxesFromProbabilities(map, 200, 80, 200, 80)).toHaveLength(2);
  });
});
