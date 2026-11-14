import { describe, expect, it } from "vitest";

import { type TextBox, toText } from "./layout";

// 左上角 (x, y)、宽 width、高 height 的水平框
const box = (text: string, x: number, y: number, width = 100, height = 30): TextBox => ({
  text,
  quad: [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ],
});

describe("toText", () => {
  it("orders lines top to bottom and boxes left to right", () => {
    expect(toText([box("world", 150, 2), box("second", 0, 45), box("Hello", 0, 0)])).toBe(
      "Hello world\nsecond",
    );
  });

  it("joins Chinese and Japanese without spaces", () => {
    expect(toText([box("你好", 0, 0), box("世界。", 120, 0), box("OK", 240, 0)])).toBe(
      "你好世界。 OK",
    );
  });

  it("separates paragraphs with a blank line", () => {
    expect(toText([box("one", 0, 0), box("two", 0, 40), box("three", 0, 120)])).toBe(
      "one\ntwo\n\nthree",
    );
  });

  it("keeps tilted boxes on the same line and skips empty text", () => {
    const tilted: TextBox = {
      text: "tilted",
      quad: [
        [120, 0],
        [220, 10],
        [217, 40],
        [117, 30],
      ],
    };
    expect(toText([box("start", 0, 0), tilted, box("  ", 0, 100)])).toBe("start tilted");
  });

  it("returns an empty string when nothing was read", () => {
    expect(toText([])).toBe("");
  });
});
