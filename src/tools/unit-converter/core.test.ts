import { describe, expect, it } from "vitest";

import { ToolError } from "@/lib/tool-contract/define-tool";

import { convertUnit, type UnitInput } from "./core";
import { type UnitId, unitIds, units } from "./units";

const run = (value: number, from: UnitId, to: UnitId) => convertUnit({ value, from, to });
const codeOf = (input: UnitInput) => {
  try {
    convertUnit(input);
  } catch (error) {
    return error instanceof ToolError ? error.code : String(error);
  }
};

describe("convertUnit", () => {
  it("converts by exact definitions", () => {
    expect(run(1, "mi", "km").result).toBe("1.609344");
    expect(run(1, "in", "mm").result).toBe("25.4");
    expect(run(1, "lb", "kg").result).toBe("0.45359237");
    expect(run(1, "oz", "g").result).toBe("28.34952313");
    expect(run(1, "gal", "ml").result).toBe("3785.411784");
    expect(run(1, "ac", "m2").result).toBe("4046.856422");
    expect(run(1, "ha", "m2").result).toBe("10000");
    expect(run(1, "kn", "kmh").result).toBe("1.852");
    expect(run(1, "mph", "kmh").result).toBe("1.609344");
    expect(run(1, "wk", "h").result).toBe("168");
  });

  it("keeps decimal and binary data units apart", () => {
    expect(run(1, "KB", "B").result).toBe("1000");
    expect(run(1, "KiB", "B").result).toBe("1024");
    expect(run(1, "GiB", "MB").result).toBe("1073.741824");
    expect(run(1, "GB", "GiB").result).toBe("0.9313225746");
  });

  it("converts temperatures including their offsets", () => {
    expect(run(100, "celsius", "fahrenheit").result).toBe("212");
    expect(run(32, "fahrenheit", "celsius").result).toBe("0");
    expect(run(-40, "celsius", "fahrenheit").result).toBe("-40");
    expect(run(0, "celsius", "kelvin").result).toBe("273.15");
    expect(run(0, "kelvin", "fahrenheit").result).toBe("-459.67");
    expect(run(25, "celsius", "celsius").result).toBe("25");
  });

  it("accepts absolute zero but not below it", () => {
    expect(run(-273.15, "celsius", "kelvin").result).toBe("0");
    expect(run(-459.67, "fahrenheit", "kelvin").result).toBe("0");
    expect(codeOf({ value: -274, from: "celsius", to: "kelvin" })).toBe("below_absolute_zero");
    expect(codeOf({ value: -1, from: "kelvin", to: "celsius" })).toBe("below_absolute_zero");
  });

  it("rejects units of different kinds", () => {
    expect(codeOf({ value: 1, from: "km", to: "kg" })).toBe("incompatible_units");
    expect(codeOf({ value: 1, from: "celsius", to: "s" })).toBe("incompatible_units");
  });

  it("rounds to 10 significant digits without float noise", () => {
    expect(run(0.1, "kg", "g").result).toBe("100");
    expect(run(1, "m", "mi").result).toBe("0.0006213711922");
    expect(run(1e-9, "km", "mm").result).toBe("0.001");
  });

  it("writes a summary with symbols and handles negative and zero values", () => {
    expect(run(5, "km", "mi").summary).toBe("5 km = 3.106855961 mi");
    expect(run(-2.5, "celsius", "kelvin").summary).toBe("-2.5 °C = 270.65 K");
    expect(run(0, "m", "ft").result).toBe("0");
    expect(run(-0, "m", "ft").result).toBe("0");
  });

  it("converts every unit to every other unit of its kind and back", () => {
    for (const from of unitIds) {
      for (const to of unitIds) {
        if (units[from].group !== units[to].group || units[from].group === "temperature") continue;
        const forward = Number(run(1000, from, to).result);
        const back = Number(run(forward, to, from).result);
        expect(back / 1000).toBeCloseTo(1, 8);
      }
    }
  });
});
