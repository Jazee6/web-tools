import { describe, expect, it } from "vitest";

import { convertBase64 } from "./core";

const encode = (text: string, urlSafe = false) =>
  convertBase64({ text, mode: "encode", urlSafe }).result;
const decode = (text: string) => convertBase64({ text, mode: "decode", urlSafe: false }).result;

describe("convertBase64", () => {
  it("encodes ASCII and non-Latin-1 text as UTF-8", () => {
    expect(encode("Hello")).toBe("SGVsbG8=");
    expect(encode("Hello, 世界!")).toBe("SGVsbG8sIOS4lueVjCE=");
    expect(encode("😀")).toBe("8J+YgA==");
  });

  it("uses the URL-safe alphabet without padding", () => {
    expect(encode("subjects?_d")).toBe("c3ViamVjdHM/X2Q=");
    expect(encode("subjects?_d", true)).toBe("c3ViamVjdHM_X2Q");
  });

  it("decodes both alphabets, with or without padding and whitespace", () => {
    expect(decode("SGVsbG8=")).toBe("Hello");
    expect(decode("SGVsbG8")).toBe("Hello");
    expect(decode("c3ViamVjdHM_X2Q")).toBe("subjects?_d");
    expect(decode("c3ViamVjdHM/X2Q=")).toBe("subjects?_d");
    expect(decode("SGVs\nbG8s IOS4\r\nlueVjCE=")).toBe("Hello, 世界!");
  });

  it("round-trips large input", () => {
    const text = "héllo 世界 ".repeat(50_000);
    expect(decode(encode(text))).toBe(text);
  });

  it("throws invalid_base64 for characters outside the alphabet or an impossible length", () => {
    for (const text of ["not base64!", "SGVsb", "SGVsbG8=x", "=="]) {
      expect(() => decode(text)).toThrow(
        expect.objectContaining({ code: "invalid_base64", field: "text" }),
      );
    }
  });

  it("throws invalid_utf8 when the decoded bytes are not text", () => {
    // 0xff 0xfe 不是合法的 UTF-8
    expect(() => decode("//4=")).toThrow(
      expect.objectContaining({ code: "invalid_utf8", field: "text" }),
    );
  });
});
