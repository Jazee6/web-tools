import { describe, expect, it } from "vitest";

import { convertColor } from "./core";

const run = (value: string) => convertColor({ value });

describe("convertColor", () => {
  it("converts a hex colour to every format", () => {
    expect(run("#ff5733")).toEqual({
      hex: "#ff5733",
      rgb: "rgb(255 87 51)",
      hsl: "hsl(10.6 100% 60%)",
      hwb: "hwb(10.6 20% 0%)",
      oklch: expect.stringMatching(/^oklch\(0\.\d{1,4} 0\.\d{1,4} \d+(\.\d)?\)$/),
    });
  });

  it("matches the reference OKLCH values of the sRGB primaries, black and white", () => {
    expect(run("#ff0000").oklch).toBe("oklch(0.628 0.2577 29.2)");
    expect(run("#00ff00").oklch).toBe("oklch(0.8664 0.2948 142.5)");
    expect(run("#0000ff").oklch).toBe("oklch(0.452 0.3132 264.1)");
    expect(run("#ffffff").oklch).toBe("oklch(1 0 0)");
    expect(run("#000000").oklch).toBe("oklch(0 0 0)");
  });

  it("reads 3, 4, 6 and 8 digit hex, with or without case", () => {
    expect(run("#f53").hex).toBe("#ff5533");
    expect(run("#F53").hex).toBe("#ff5533");
    expect(run("#f538").hex).toBe("#ff553388");
    expect(run("#FF573380").rgb).toBe("rgb(255 87 51 / 0.502)");
    expect(run("#ff5733ff").hex).toBe("#ff5733");
  });

  it("reads rgb in modern, legacy and percentage syntax", () => {
    expect(run("rgb(255 87 51)").hex).toBe("#ff5733");
    expect(run("rgb(255, 87, 51)").hex).toBe("#ff5733");
    expect(run("rgba(255, 87, 51, 0.5)").hex).toBe("#ff573380");
    expect(run("rgb(255 87 51 / 50%)").hex).toBe("#ff573380");
    expect(run("RGB(100% 0% 0%)").hex).toBe("#ff0000");
    expect(run("rgb(300 -5 0)").hex).toBe("#ff0000");
  });

  it("reads hsl with units, unitless saturation and legacy commas", () => {
    expect(run("hsl(0 100% 50%)").hex).toBe("#ff0000");
    expect(run("hsl(120, 100%, 25%)").hex).toBe("#008000");
    expect(run("hsla(240, 100%, 50%, 0.25)").hex).toBe("#0000ff40");
    expect(run("hsl(0.5turn 100 50)").hex).toBe("#00ffff");
    expect(run("hsl(180deg 100% 50%)").hex).toBe("#00ffff");
    expect(run("hsl(200grad 100% 50%)").hex).toBe("#00ffff");
    expect(run("hsl(3.14159rad 100% 50%)").hex).toBe("#00ffff");
    expect(run("hsl(-120 100% 50%)").hex).toBe("#0000ff");
    expect(run("hsl(480 100% 50%)").hex).toBe("#00ff00");
  });

  it("reads hwb, including the case where white plus black reaches 100%", () => {
    expect(run("hwb(0 0% 0%)").hex).toBe("#ff0000");
    expect(run("hwb(120 20% 20%)").hex).toBe("#33cc33");
    expect(run("hwb(0 50% 50%)").hex).toBe("#808080");
    expect(run("hwb(0 80% 80%)").hex).toBe("#808080");
  });

  it("reads oklch and clamps colours outside the sRGB gamut", () => {
    expect(run("oklch(0.62796 0.25768 29.234)").hex).toBe("#ff0000");
    expect(run("oklch(62.796% 0.25768 29.234)").hex).toBe("#ff0000");
    expect(run("oklch(62.796% 64.42% 29.234deg)").hex).toBe("#ff0000");
    expect(run("oklch(0.7 0.4 150)").hex).toMatch(/^#[0-9a-f]{6}$/);
    expect(run("oklch(1 0 0)").hex).toBe("#ffffff");
    expect(run("oklch(0 0 0)").hex).toBe("#000000");
  });

  it("keeps the alpha channel in every output", () => {
    expect(run("rgb(0 0 0 / 0.5)")).toEqual({
      hex: "#00000080",
      rgb: "rgb(0 0 0 / 0.5)",
      hsl: "hsl(0 0% 0% / 0.5)",
      hwb: "hwb(0 0% 100% / 0.5)",
      oklch: "oklch(0 0 0 / 0.5)",
    });
    expect(run("rgb(0 0 0 / 0)").hex).toBe("#00000000");
    expect(run("rgb(0 0 0 / 1)").rgb).toBe("rgb(0 0 0)");
    expect(run("rgb(0 0 0 / 2)").rgb).toBe("rgb(0 0 0)");
  });

  it("trims surrounding whitespace and tolerates spaces inside the parentheses", () => {
    expect(run("  #ff5733 \n").hex).toBe("#ff5733");
    expect(run("rgb(  255   87   51  )").hex).toBe("#ff5733");
    expect(run("rgb(255 87 51 /0.5)").hex).toBe("#ff573380");
  });

  it("outputs achromatic colours without a hue", () => {
    expect(run("#808080").hsl).toBe("hsl(0 0% 50.2%)");
    expect(run("#808080").oklch).toMatch(/^oklch\(0\.\d+ 0 0\)$/);
  });

  it("throws invalid_color for anything it cannot read", () => {
    for (const value of [
      "",
      "red",
      "ff5733",
      "#ff573",
      "#ff57331",
      "#gg0000",
      "rgb(255 87)",
      "rgb(255 87 51 12)",
      "rgb(255, 87, 51 0.5)",
      "rgb(255, 87 51)",
      "rgb(255, 87, 51, 0.5, 1)",
      "rgb(255 87 51 / 0.5 / 1)",
      "rgb(255,87,51 / 0.5)",
      "rgb(255 87 51",
      "rgb(a b c)",
      "rgb(10px 0 0)",
      "hsl(0 100% 50% / 5deg)",
      "hsl(0 100px 50%)",
      "hsl(10foo 100% 50%)",
      "lab(50 20 20)",
      "color(srgb 1 0 0)",
    ]) {
      expect(() => run(value)).toThrow(
        expect.objectContaining({ code: "invalid_color", field: "value" }),
      );
    }
  });
});
