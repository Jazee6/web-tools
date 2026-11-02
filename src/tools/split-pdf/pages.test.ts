import { describe, expect, it } from "vitest";

import { InvalidPagesError, parsePages, toRangeString } from "./pages";

describe("parsePages", () => {
  it("parses single pages, closed ranges and open-ended ranges", () => {
    expect(parsePages("1-3, 5, 8-")).toEqual([
      { start: 1, end: 3 },
      { start: 5, end: 5 },
      { start: 8, end: undefined },
    ]);
  });

  it("ignores spaces and empty parts", () => {
    expect(parsePages(" 2 - 4 ,, 7 ,")).toEqual([
      { start: 2, end: 4 },
      { start: 7, end: 7 },
    ]);
    expect(parsePages("  ")).toEqual([]);
  });

  it.each(["0", "0-3", "5-3", "a", "1-2-3", "-3", "1.5", "1 2"])("rejects %s", (text) => {
    expect(() => parsePages(text)).toThrow(InvalidPagesError);
  });

  it("names the invalid part", () => {
    expect(() => parsePages("1, 5-3, 7")).toThrow(
      expect.objectContaining({ part: "5-3" }) as Error,
    );
  });
});

describe("toRangeString", () => {
  it("writes a single page as one number", () => {
    expect(toRangeString({ start: 3, end: 3 })).toBe("3");
    expect(toRangeString({ start: 3, end: 5 })).toBe("3-5");
  });
});
