import { describe, expect, it } from "vitest";

import {
  centeredCrop,
  fitsIn,
  formatCrop,
  InvalidCropError,
  orientedSize,
  parseCrop,
  ratioOf,
  swapAspect,
} from "./crop";

describe("parseCrop", () => {
  it.each([
    ["10, 20, 30, 40", { x: 10, y: 20, width: 30, height: 40 }],
    ["10,20,30,40", { x: 10, y: 20, width: 30, height: 40 }],
    [" 0 0 1 1 ", { x: 0, y: 0, width: 1, height: 1 }],
  ])("reads %j", (text, rect) => {
    expect(parseCrop(text)).toEqual(rect);
  });

  it("treats an empty value as the default area", () => {
    expect(parseCrop("  ")).toBeUndefined();
  });

  it.each(["1, 2, 3", "1, 2, 3, 4, 5", "1, 2, 0, 4", "-1, 2, 3, 4", "1.5, 2, 3, 4", "a, b, c, d"])(
    "rejects %j",
    (text) => {
      expect(() => parseCrop(text)).toThrow(InvalidCropError);
    },
  );

  it("round-trips through formatCrop", () => {
    const rect = { x: 3, y: 4, width: 50, height: 60 };
    expect(parseCrop(formatCrop(rect))).toEqual(rect);
  });
});

describe("centeredCrop", () => {
  it("uses the whole image without a ratio", () => {
    expect(centeredCrop({ width: 320, height: 240 }, "free")).toEqual({
      x: 0,
      y: 0,
      width: 320,
      height: 240,
    });
  });

  it.each([
    ["1:1", { x: 40, y: 0, width: 240, height: 240 }],
    ["16:9", { x: 0, y: 30, width: 320, height: 180 }],
    ["9:16", { x: 92, y: 0, width: 135, height: 240 }],
    ["4:3", { x: 0, y: 0, width: 320, height: 240 }],
  ] as const)("takes the largest centred %s area", (aspect, rect) => {
    expect(centeredCrop({ width: 320, height: 240 }, aspect)).toEqual(rect);
  });

  it("keeps at least one pixel", () => {
    expect(centeredCrop({ width: 1000, height: 1 }, "9:16")).toMatchObject({ width: 1, height: 1 });
  });
});

describe("aspects", () => {
  it("swaps landscape and portrait", () => {
    expect(swapAspect("4:3")).toBe("3:4");
    expect(swapAspect("9:16")).toBe("16:9");
    expect(swapAspect("1:1")).toBe("1:1");
    expect(swapAspect("free")).toBe("free");
  });

  it("gives width over height", () => {
    expect(ratioOf("3:2")).toBe(1.5);
    expect(ratioOf("free")).toBeUndefined();
  });
});

describe("orientedSize and fitsIn", () => {
  it("swaps the sides for quarter turns", () => {
    expect(orientedSize({ width: 3, height: 2 }, "90")).toEqual({ width: 2, height: 3 });
    expect(orientedSize({ width: 3, height: 2 }, "180")).toEqual({ width: 3, height: 2 });
  });

  it("checks the area stays inside the image", () => {
    const size = { width: 10, height: 10 };
    expect(fitsIn({ x: 5, y: 5, width: 5, height: 5 }, size)).toBe(true);
    expect(fitsIn({ x: 6, y: 5, width: 5, height: 5 }, size)).toBe(false);
  });
});
