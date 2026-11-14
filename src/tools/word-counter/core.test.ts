import { describe, expect, it } from "vitest";

import { countText } from "./core";

const count = (text: string) => countText({ text });

describe("countText words", () => {
  it("splits on whitespace and ignores bare punctuation", () => {
    expect(count("one  two\tthree\nfour").words).toBe(4);
    expect(count("well-known — don't 3.14 e.g. https://example.com/a").words).toBe(5);
    expect(count("... --- !!!").words).toBe(0);
  });

  it("counts every Chinese character and Japanese kana as a word", () => {
    expect(count("你好，世界！").words).toBe(4);
    expect(count("コーヒーを飲む").words).toBe(7);
    expect(count("使用Bun运行").words).toBe(5);
  });

  it("counts Hangul and other space-delimited scripts as words", () => {
    expect(count("안녕하세요 세계").words).toBe(2);
    expect(count("Привет мир").words).toBe(2);
  });
});

describe("countText characters", () => {
  it("counts what a reader sees, not UTF-16 units", () => {
    expect(count("😀").characters).toBe(1);
    expect(count("👨‍👩‍👧").characters).toBe(1);
    expect(count("é").characters).toBe(1);
  });

  it("counts a CRLF line break once and leaves whitespace out of the second count", () => {
    expect(count("a b\r\nc")).toMatchObject({ characters: 5, charactersNoSpaces: 3 });
    expect(count("a　b\t")).toMatchObject({ characters: 4, charactersNoSpaces: 2 });
  });

  it("measures UTF-8 bytes", () => {
    expect(count("aé世😀").bytes).toBe(1 + 2 + 3 + 4);
  });
});

describe("countText lines and paragraphs", () => {
  it("counts blank lines but not a final line break", () => {
    expect(count("a\n\nb").lines).toBe(3);
    expect(count("a\nb\n").lines).toBe(2);
    expect(count("a\r\nb\rc").lines).toBe(3);
    expect(count("\n").lines).toBe(1);
  });

  it("separates paragraphs by blank lines, including whitespace-only ones", () => {
    expect(count("a\nb\n\n\n  \nc\n").paragraphs).toBe(2);
    expect(count("one").paragraphs).toBe(1);
    expect(count("   \n\n").paragraphs).toBe(0);
  });
});

describe("countText sentences", () => {
  it("ends a sentence at . ! ? … followed by whitespace or the end", () => {
    expect(count("Hi. How are you? Fine! Ok…").sentences).toBe(4);
    expect(count("Wait?! Really...").sentences).toBe(2);
    expect(count('He said "stop." Then left.').sentences).toBe(2);
  });

  it("does not split on a dot inside a number or a domain", () => {
    expect(count("Pi is 3.14 and the site is example.com").sentences).toBe(1);
  });

  it("splits on full-width punctuation anywhere and counts a trailing unfinished sentence", () => {
    expect(count("你好。世界！今天").sentences).toBe(3);
    expect(count("「好」。").sentences).toBe(1);
  });

  it("treats abbreviations as sentence ends and ignores punctuation-only parts", () => {
    expect(count("Mr. Smith left.").sentences).toBe(2);
    expect(count("... !!!").sentences).toBe(0);
  });
});
