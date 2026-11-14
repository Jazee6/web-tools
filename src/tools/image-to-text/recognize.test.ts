import { describe, expect, it } from "vitest";

import { cropQuad } from "./image";
import { characterCount, decode, HEIGHT, recognitionInput } from "./recognize";

// 识别模型输出 18710 类：blank、字典里的 18708 个字符、空格
const CLASSES = 18_710;

// 每个时间步把 index 那一类设成 probability
const steps = (indices: number[], probability = 0.9) => {
  const data = new Float32Array(indices.length * CLASSES);
  for (const [step, index] of indices.entries()) data[step * CLASSES + index] = probability;
  return data;
};

describe("dictionary", () => {
  it("has one entry per model class besides blank and space", () => {
    expect(characterCount).toBe(CLASSES - 2);
  });
});

describe("decode", () => {
  it("merges repeats, drops blanks and maps the last class to a space", () => {
    // 字典从 ASCII 标点开始："!"、"\""、"#"…；同一类的重复合并，被 blank 隔开的重复保留
    const first = decode(steps([1, 1, 0, 1]), 4, CLASSES);
    expect(first.text).toBe("!!");
    expect(first.score).toBeCloseTo(0.9);
    expect(decode(steps([1, CLASSES - 1, 3]), 3, CLASSES).text).toBe("! #");
  });

  it("returns empty text for blanks only", () => {
    expect(decode(steps([0, 0, 0]), 3, CLASSES)).toEqual({ text: "", score: 0 });
  });
});

const image = (width: number, height: number) => ({
  width,
  height,
  data: new Uint8ClampedArray(width * height * 4).fill(255),
});

describe("recognitionInput", () => {
  it("scales lines to 48 pixels high and pads to at least 320 wide", () => {
    expect(recognitionInput(image(100, 24)).width).toBe(320);
    expect(recognitionInput(image(400, 24)).width).toBe(800);
    expect(recognitionInput(image(10_000, 20)).width).toBe(3200);
    const { planes } = recognitionInput(image(100, 24));
    // 白色归一化为 1，补齐的部分为 0
    expect(planes[0]).toBe(1);
    expect(planes[319]).toBe(0);
    expect(planes.length).toBe(3 * HEIGHT * 320);
  });
});

describe("cropQuad", () => {
  // 4 × 2 的图，像素值等于 x + 10 × y
  const source = {
    width: 4,
    height: 2,
    data: new Uint8ClampedArray(
      Array.from({ length: 8 }, (_, i) => [i % 4, i % 4, (i >> 2) * 10, 255]).flat(),
    ),
  };

  it("cuts an axis-aligned box", () => {
    const crop = cropQuad(source, [
      [1, 0],
      [3, 0],
      [3, 2],
      [1, 2],
    ]);
    expect([crop.width, crop.height]).toEqual([2, 2]);
    expect(Array.from(crop.data).filter((_, i) => i % 4 === 0)).toEqual([1, 2, 1, 2]);
    expect(Array.from(crop.data).filter((_, i) => i % 4 === 2)).toEqual([0, 0, 10, 10]);
  });

  it("turns tall boxes into horizontal lines", () => {
    const crop = cropQuad(source, [
      [0, 0],
      [1, 0],
      [1, 2],
      [0, 2],
    ]);
    // 1 × 2 的竖条逆时针转 90° 成 2 × 1：原来的底部到右边
    expect([crop.width, crop.height]).toEqual([2, 1]);
    expect(Array.from(crop.data).filter((_, i) => i % 4 === 2)).toEqual([0, 10]);
  });
});
