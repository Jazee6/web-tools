import { describe, expect, it } from "vitest";

import { planResize } from "./size";

const source = { width: 400, height: 200 };
const whole = { x: 0, y: 0, width: 400, height: 200 };

describe("planResize", () => {
  it("derives the missing side from the aspect ratio", () => {
    expect(planResize(source, { width: 100, fit: "stretch" })).toEqual({
      width: 100,
      height: 50,
      crop: whole,
    });
    expect(planResize(source, { height: 100, fit: "cover" })).toEqual({
      width: 200,
      height: 100,
      crop: whole,
    });
  });

  it("never rounds a side down to zero", () => {
    expect(planResize({ width: 5000, height: 10 }, { width: 100, fit: "contain" }).height).toBe(1);
    expect(planResize({ width: 10, height: 5000 }, { height: 100, fit: "contain" }).width).toBe(1);
  });

  it("contain fits inside the box and keeps the ratio", () => {
    expect(planResize(source, { width: 100, height: 100, fit: "contain" })).toEqual({
      width: 100,
      height: 50,
      crop: whole,
    });
  });

  it("contain can enlarge", () => {
    expect(planResize(source, { width: 800, height: 800, fit: "contain" })).toMatchObject({
      width: 800,
      height: 400,
    });
  });

  it("cover fills the box and crops evenly from both sides", () => {
    expect(planResize(source, { width: 100, height: 100, fit: "cover" })).toEqual({
      width: 100,
      height: 100,
      crop: { x: 100, y: 0, width: 200, height: 200 },
    });
  });

  it("stretch uses the exact size and the whole image", () => {
    expect(planResize(source, { width: 100, height: 100, fit: "stretch" })).toEqual({
      width: 100,
      height: 100,
      crop: whole,
    });
  });
});
