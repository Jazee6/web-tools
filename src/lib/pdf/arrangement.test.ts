import { describe, expect, it } from "vitest";

import {
  expandArrangement,
  formatArrangement,
  parseArrangement,
  rotateClockwise,
} from "./arrangement";
import { InvalidPagesError } from "./pages";

describe("parseArrangement", () => {
  it("parses pages, ranges and clockwise rotations", () => {
    expect(parseArrangement("3, 1-2 r90, 5- R270, 4r180")).toEqual([
      { start: 3, end: 3, rotate: 0 },
      { start: 1, end: 2, rotate: 90 },
      { start: 5, end: undefined, rotate: 270 },
      { start: 4, end: 4, rotate: 180 },
    ]);
    expect(parseArrangement(" ")).toEqual([]);
  });

  it.each(["0", "3-1", "1 r45", "r90", "1 r", "1-2-3", "1 2"])("rejects %s", (text) => {
    expect(() => parseArrangement(text)).toThrow(InvalidPagesError);
  });
});

describe("expandArrangement", () => {
  it("keeps every page when empty", () => {
    expect(expandArrangement([], 3)).toEqual([
      { page: 1, rotate: 0 },
      { page: 2, rotate: 0 },
      { page: 3, rotate: 0 },
    ]);
  });

  it("expands ranges in order, with repeats and open ends", () => {
    expect(expandArrangement(parseArrangement("3-, 1 r90, 1"), 4)).toEqual([
      { page: 3, rotate: 0 },
      { page: 4, rotate: 0 },
      { page: 1, rotate: 90 },
      { page: 1, rotate: 0 },
    ]);
  });

  it("returns undefined when a page does not exist", () => {
    expect(expandArrangement(parseArrangement("2-5"), 4)).toBeUndefined();
    expect(expandArrangement(parseArrangement("5-"), 4)).toBeUndefined();
  });
});

describe("formatArrangement", () => {
  it("writes the untouched document as an empty string", () => {
    expect(formatArrangement(expandArrangement([], 4)!, 4)).toBe("");
  });

  it("merges ascending runs with the same rotation", () => {
    const pages = expandArrangement(parseArrangement("4, 1-2 r90, 3 r90, 3"), 4)!;
    expect(formatArrangement(pages, 4)).toBe("4, 1-3 r90, 3");
  });

  it("round-trips through parse and expand", () => {
    const text = "2 r180, 1, 3-4";
    expect(formatArrangement(expandArrangement(parseArrangement(text), 4)!, 4)).toBe(text);
  });

  it("writes a deleted page as an explicit list", () => {
    expect(formatArrangement(expandArrangement(parseArrangement("1-2, 4"), 4)!, 4)).toBe("1-2, 4");
  });
});

it("rotates clockwise in quarter turns", () => {
  expect([0, 90, 180, 270].map((r) => rotateClockwise(r as 0))).toEqual([90, 180, 270, 0]);
});
