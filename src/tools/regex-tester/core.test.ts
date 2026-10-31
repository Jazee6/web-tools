import { describe, expect, it } from "vitest";

import { ToolError } from "@/lib/tool-contract/define-tool";

import { testRegex } from "./core";

const run = (pattern: string, text: string, flags = "g") => testRegex({ pattern, flags, text });
const codeOf = (fn: () => unknown) => {
  try {
    fn();
  } catch (error) {
    return error instanceof ToolError ? error.code : String(error);
  }
};

describe("testRegex", () => {
  it("lists every match with index and numbered groups", () => {
    expect(run(String.raw`(\d)(\w)`, "a1b 2c")).toEqual({
      count: 2,
      matches: [
        { index: 1, match: "1b", groups: '["1","b"]' },
        { index: 4, match: "2c", groups: '["2","c"]' },
      ],
    });
  });

  it("reports named groups as an object and unmatched groups as null", () => {
    expect(run("(?<a>x)(?<b>y)?", "x").matches[0]!.groups).toBe('{"a":"x","b":null}');
    expect(run("x(y)?", "x").matches[0]!.groups).toBe("[null]");
  });

  it("leaves groups empty when the pattern has none", () => {
    expect(run("x", "x").matches[0]!.groups).toBe("");
  });

  it("returns only the first match without the g flag", () => {
    expect(run("a", "aaa", "")).toMatchObject({ count: 1, matches: [{ index: 0 }] });
    expect(run("a", "aaa", "i").count).toBe(1);
  });

  it("honours i, m, s and u flags", () => {
    expect(run("^b", "a\nb", "gm").count).toBe(1);
    expect(run("a.b", "a\nb", "gs").count).toBe(1);
    expect(run("A", "a", "gi").count).toBe(1);
    expect(run(String.raw`\p{L}+`, "héllo wörld", "gu").count).toBe(2);
  });

  it("steps over empty matches", () => {
    expect(run("x*", "ab")).toMatchObject({ count: 3, matches: [{ index: 0, match: "" }, {}, {}] });
  });

  it("counts all matches but lists only the first 200", () => {
    const result = run("a", "a".repeat(250));
    expect(result.count).toBe(250);
    expect(result.matches).toHaveLength(200);
  });

  it("reports no match as an empty list", () => {
    expect(run("z", "abc")).toEqual({ count: 0, matches: [] });
  });

  it("rejects bad patterns, flags and oversized text", () => {
    expect(codeOf(() => run("(", "a"))).toBe("invalid_pattern");
    expect(codeOf(() => run("a", "a", "gx"))).toBe("invalid_flags");
    expect(codeOf(() => run("a", "a", "gg"))).toBe("invalid_flags");
    expect(codeOf(() => run("a", "a", "uv"))).toBe("invalid_pattern");
    expect(codeOf(() => run("a", "a".repeat(100_001)))).toBe("text_too_long");
  });
});
