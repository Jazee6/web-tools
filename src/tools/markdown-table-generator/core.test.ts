import { describe, expect, it } from "vitest";

import { ToolError } from "@/lib/tool-contract/define-tool";

import { detectFormat, displayWidth, generateTable, parseDelimited, type TableInput } from "./core";

const run = (data: string, options: Partial<TableInput> = {}) =>
  generateTable({ data, from: "auto", header: true, align: "none", pad: true, ...options })
    .markdown;

describe("parseDelimited", () => {
  it("reads quoted fields with delimiters, quotes and line breaks", () => {
    expect(parseDelimited('a,"b, c","say ""hi""","x\r\ny"\n1,2,3,4', ",")).toEqual([
      ["a", "b, c", 'say "hi"', "x\r\ny"],
      ["1", "2", "3", "4"],
    ]);
  });

  it("skips blank lines and a trailing line break", () => {
    expect(parseDelimited("a\tb\r\n\r\n1\t2\r\n", "\t")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("keeps an empty quoted field as a row", () => {
    expect(parseDelimited('""\n1', ",")).toEqual([[""], ["1"]]);
  });

  it("reads an unterminated quote to the end", () => {
    expect(parseDelimited('a,"b\nc', ",")).toEqual([["a", "b\nc"]]);
  });
});

describe("detectFormat", () => {
  it.each([
    ["| a | b |\n| - | - |", "markdown"],
    ["a | b\n--- | ---\n1 | 2", "markdown"],
    ["a\tb\n1\t2", "tsv"],
    ["a,b\n1,2", "csv"],
    ["just text", "csv"],
  ])("%j is %s", (text, format) => {
    expect(detectFormat(text)).toBe(format);
  });
});

describe("displayWidth", () => {
  it.each([
    ["abc", 3],
    ["名称", 4],
    ["ｶﾅ", 2],
    ["カナ", 4],
    ["👍", 2],
    ["👨‍👩‍👧", 2],
    ["🇺🇸", 2],
    ["1️⃣", 2],
    ["©", 1],
    ["é", 1],
    ["한국", 4],
  ])("%s is %i columns", (text, width) => {
    expect(displayWidth(text)).toBe(width);
  });
});

describe("generateTable", () => {
  it("escapes pipes and turns line breaks into <br> in CSV cells", () => {
    expect(run('a,b\n"x | y","1\n2"', { pad: false })).toBe(
      "| a | b |\n| --- | --- |\n| x \\| y | 1<br>2 |",
    );
  });

  it("keeps escaped pipes and inline Markdown of a Markdown table", () => {
    expect(run("| a | b |\n|---|---|\n| `x \\| y` | **z** |", { pad: false })).toBe(
      "| a | b |\n| --- | --- |\n| `x \\| y` | **z** |",
    );
  });

  it("fills short rows with empty cells", () => {
    expect(run("a,b,c\n1", { pad: false })).toBe("| a | b | c |\n| --- | --- | --- |\n| 1 |  |  |");
  });

  it("adds an empty header row when the first row is data", () => {
    expect(run("1,2", { header: false })).toBe("|     |     |\n| --- | --- |\n| 1   | 2   |");
  });

  it("keeps the column alignment of a Markdown table unless one is chosen", () => {
    const table = "| a | b | c |\n|:-|:-:|-:|\n| 1 | 2 | 3 |";
    expect(run(table, { pad: false })).toBe("| a | b | c |\n| :-- | :-: | --: |\n| 1 | 2 | 3 |");
    expect(run(table, { pad: false, align: "center" })).toBe(
      "| a | b | c |\n| :-: | :-: | :-: |\n| 1 | 2 | 3 |",
    );
  });

  it("pads by display width and aligns the padding", () => {
    expect(run("名,n\n苹果,10", { align: "center" })).toBe(
      "|  名  |  n  |\n| :--: | :-: |\n| 苹果 | 10  |",
    );
  });

  it("reads a forced format even when auto would guess another", () => {
    expect(run("a\tb,c", { from: "csv", pad: false })).toBe("| a\tb | c |\n| --- | --- |");
  });

  it("fails with empty when there are no cells", () => {
    expect(() => run("  \n ,\n")).toThrow(ToolError);
    expect(() => run("  \n ,\n")).toThrow("empty");
  });
});
