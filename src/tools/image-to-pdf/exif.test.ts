import { describe, expect, it } from "vitest";

import { jpegOrientation } from "./exif";

// 最小的 JPEG 头：SOI、可选的 APP0、APP1（EXIF，IFD0 里只有方向一项），再接 SOS
const exif = (orientation: number, order: "II" | "MM" = "MM") => {
  const little = order === "II";
  const tiff = new DataView(new ArrayBuffer(26));
  tiff.setUint16(0, little ? 0x4949 : 0x4d4d);
  tiff.setUint16(2, 42, little);
  tiff.setUint32(4, 8, little);
  tiff.setUint16(8, 1, little);
  tiff.setUint16(10, 0x0112, little);
  tiff.setUint16(12, 3, little);
  tiff.setUint32(14, 1, little);
  tiff.setUint16(18, orientation, little);
  tiff.setUint32(22, 0, little);
  const body = [...new TextEncoder().encode("Exif"), 0, 0, ...new Uint8Array(tiff.buffer)];
  const length = body.length + 2;
  return [0xff, 0xe1, length >> 8, length & 0xff, ...body];
};

const app0 = [0xff, 0xe0, 0x00, 0x04, 0x4a, 0x46];
const sos = [0xff, 0xda, 0x00, 0x02];
const jpeg = (...segments: number[][]) => new Uint8Array([0xff, 0xd8, ...segments.flat(), ...sos]);

describe("jpegOrientation", () => {
  it.each([1, 3, 6, 8])("reads orientation %i in big-endian EXIF", (value) => {
    expect(jpegOrientation(jpeg(exif(value)))).toBe(value);
  });

  it("reads little-endian EXIF after other segments", () => {
    expect(jpegOrientation(jpeg(app0, exif(6, "II")))).toBe(6);
  });

  it("falls back to 1 without EXIF, for values outside 1–8 and for other files", () => {
    expect(jpegOrientation(jpeg(app0))).toBe(1);
    expect(jpegOrientation(jpeg(exif(9)))).toBe(1);
    expect(jpegOrientation(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe(1);
    expect(jpegOrientation(new Uint8Array([0xff, 0xd8, 0xff]))).toBe(1);
  });

  it("ignores EXIF after the start of scan", () => {
    const bytes = new Uint8Array([0xff, 0xd8, ...sos, ...exif(6)]);
    expect(jpegOrientation(bytes)).toBe(1);
  });
});
