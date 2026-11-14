import { describe, expect, it } from "vitest";

import { displaySize, imageMatrix, layoutPage } from "./layout";

const A4 = [595.28, 841.89];

const rounded = (values: Record<string, number>) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Math.round(value * 100) / 100]),
  );

describe("layoutPage", () => {
  it("fits a portrait image to the width of a portrait A4 page and centres it", () => {
    const layout = layoutPage(
      { pageSize: "a4", orientation: "auto", margin: "none" },
      { width: 1000, height: 1000 },
    );
    expect([layout.width, layout.height].map((side) => Math.round(side * 100) / 100)).toEqual(A4);
    expect(rounded(layout.image)).toEqual({ x: 0, y: 123.31, width: 595.28, height: 595.28 });
  });

  it("turns the page landscape for wide images on auto, and keeps the chosen orientation otherwise", () => {
    const wide = { width: 400, height: 200 };
    const auto = layoutPage({ pageSize: "letter", orientation: "auto", margin: "none" }, wide);
    expect([auto.width, auto.height]).toEqual([792, 612]);
    expect(auto.image).toEqual({ x: 0, y: 108, width: 792, height: 396 });

    const portrait = layoutPage(
      { pageSize: "letter", orientation: "portrait", margin: "none" },
      wide,
    );
    expect([portrait.width, portrait.height]).toEqual([612, 792]);
    expect(portrait.image).toEqual({ x: 0, y: 243, width: 612, height: 306 });

    const tall = { width: 200, height: 400 };
    const landscape = layoutPage(
      { pageSize: "letter", orientation: "landscape", margin: "none" },
      tall,
    );
    expect([landscape.width, landscape.height]).toEqual([792, 612]);
  });

  it("enlarges small images to fill the space inside the margins", () => {
    const layout = layoutPage(
      { pageSize: "letter", orientation: "portrait", margin: "large" },
      { width: 10, height: 10 },
    );
    expect(layout.image).toEqual({ x: 72, y: 162, width: 468, height: 468 });
  });

  it("sizes fit pages from the image at 96 pixels per inch, plus the margins", () => {
    expect(
      layoutPage(
        { pageSize: "fit", orientation: "landscape", margin: "small" },
        { width: 400, height: 200 },
      ),
    ).toEqual({ width: 372, height: 222, image: { x: 36, y: 36, width: 300, height: 150 } });
  });
});

describe("displaySize", () => {
  it("swaps the sides for orientations that turn the image by 90°", () => {
    const stored = { width: 40, height: 20 };
    expect(displaySize(stored, 1)).toEqual(stored);
    expect(displaySize(stored, 3)).toEqual(stored);
    expect(displaySize(stored, 6)).toEqual({ width: 20, height: 40 });
    expect(displaySize(stored, 8)).toEqual({ width: 20, height: 40 });
  });
});

// 把存储图像的左上角 (u, v) = (0, 1) 和右上角 (1, 1) 映射到页面上
const corners = (matrix: number[]) => {
  const [a, b, c, d, e, f] = matrix as [number, number, number, number, number, number];
  const at = (u: number, v: number) => [a * u + c * v + e, b * u + d * v + f];
  return { topLeft: at(0, 1), topRight: at(1, 1) };
};

describe("imageMatrix", () => {
  const rect = { x: 10, y: 20, width: 100, height: 50 };
  it("maps the unit square onto the rectangle without rotation", () => {
    expect(imageMatrix(rect, 1)).toEqual([100, 0, 0, 50, 10, 20]);
  });

  it.each([
    // 方向 → 存储图像左上角、右上角在页面上的位置（页面原点在左下）
    [2, [110, 70], [10, 70]],
    [3, [110, 20], [10, 20]],
    [4, [10, 20], [110, 20]],
    [5, [10, 70], [10, 20]],
    [6, [110, 70], [110, 20]],
    [7, [110, 20], [110, 70]],
    [8, [10, 20], [10, 70]],
  ] as const)(
    "places the stored top edge correctly for orientation %i",
    (orientation, topLeft, topRight) => {
      expect(corners(imageMatrix(rect, orientation))).toEqual({ topLeft, topRight });
    },
  );
});
