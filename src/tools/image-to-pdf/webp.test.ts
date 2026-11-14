import { describe, expect, it } from "vitest";

import { isLosslessWebp } from "./webp";

const ascii = (text: string) => [...text].map((char) => char.charCodeAt(0));

const chunk = (name: string, size: number) => [
  ...ascii(name),
  size & 0xff,
  (size >> 8) & 0xff,
  0,
  0,
  ...Array.from({ length: size + (size % 2) }, () => 0),
];

const webp = (...chunks: number[][]) =>
  new Uint8Array([...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WEBP"), ...chunks.flat()]);

describe("isLosslessWebp", () => {
  it("tells simple lossless files from lossy ones", () => {
    expect(isLosslessWebp(webp(chunk("VP8L", 10)))).toBe(true);
    expect(isLosslessWebp(webp(chunk("VP8 ", 10)))).toBe(false);
  });

  it("looks past the VP8X, ICC and alpha chunks of extended files", () => {
    expect(isLosslessWebp(webp(chunk("VP8X", 10), chunk("ICCP", 3), chunk("VP8L", 10)))).toBe(true);
    expect(isLosslessWebp(webp(chunk("VP8X", 10), chunk("ALPH", 5), chunk("VP8 ", 10)))).toBe(
      false,
    );
  });

  it("treats animations and other files as lossy", () => {
    expect(isLosslessWebp(webp(chunk("VP8X", 10), chunk("ANIM", 6), chunk("ANMF", 30)))).toBe(
      false,
    );
    expect(isLosslessWebp(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe(false);
  });
});
