import { describe, expect, it } from "vitest";

import { decodeJwt } from "./core";

const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
const token = (header: unknown, payload: unknown, signature = "c2ln") =>
  `${encode(header)}.${encode(payload)}.${signature}`;

const rejection = (code: string) => expect.objectContaining({ code, field: "token" });
const decode = (input: string) => () => decodeJwt({ token: input });

describe("decodeJwt", () => {
  it("decodes header, payload and signature", () => {
    const result = decodeJwt({ token: token({ alg: "HS256" }, { sub: "a", admin: true }) });
    expect(JSON.parse(result.header)).toEqual({ alg: "HS256" });
    expect(JSON.parse(result.payload)).toEqual({ sub: "a", admin: true });
    expect(result.signature).toBe("c2ln");
    expect(result.times).toEqual([]);
  });

  it("decodes non-ASCII claims as UTF-8", () => {
    const result = decodeJwt({ token: token({ alg: "none" }, { name: "Zoë 世界 😀" }) });
    expect(JSON.parse(result.payload).name).toBe("Zoë 世界 😀");
  });

  it("converts time claims to UTC in iat, nbf, exp order and ignores bad values", () => {
    const result = decodeJwt({
      token: token({ alg: "none" }, { exp: 1700003600.9, iat: 0, nbf: "soon" }),
    });
    expect(result.times).toEqual([
      { claim: "iat", time: "1970-01-01T00:00:00Z" },
      { claim: "exp", time: "2023-11-14T23:13:20Z" },
    ]);
    expect(decodeJwt({ token: token({}, { exp: 1e20 }) }).times).toEqual([]);
  });

  it("accepts a Bearer prefix, surrounding whitespace and an empty signature", () => {
    const result = decodeJwt({ token: `  bearer  ${token({ alg: "none" }, { a: 1 }, "")}\n` });
    expect(result.signature).toBe("");
    expect(JSON.parse(result.payload)).toEqual({ a: 1 });
  });

  it("rejects tokens that are not three base64url parts", () => {
    for (const input of ["abc", "a.b", "a.b.c.d", "..", ".e30.", "e30..", "e30.e30.sig+nature"]) {
      expect(decode(input)).toThrow(rejection("invalid_token"));
    }
    // 标准 Base64 的字符不属于 base64url
    expect(decode("e30=.e30.c2ln")).toThrow(rejection("invalid_token"));
    expect(decode("e+/0.e30.c2ln")).toThrow(rejection("invalid_token"));
    // 长度除 4 余 1 不可能是任何字节序列
    expect(decode("e30ab.e30.c2ln")).toThrow(rejection("invalid_token"));
  });

  it("rejects segments that are not UTF-8", () => {
    expect(decode(`${Buffer.from([0xff, 0xfe]).toString("base64url")}.e30.c2ln`)).toThrow(
      rejection("invalid_token"),
    );
  });

  it("rejects a header or payload that is not a JSON object", () => {
    expect(decode(`${Buffer.from("nope").toString("base64url")}.e30.c2ln`)).toThrow(
      rejection("invalid_json"),
    );
    expect(decode(`e30.${encode([1, 2])}.c2ln`)).toThrow(rejection("invalid_json"));
    expect(decode(`e30.${encode("text")}.c2ln`)).toThrow(rejection("invalid_json"));
    expect(decode(`e30.${encode(null)}.c2ln`)).toThrow(rejection("invalid_json"));
  });

  it("reports five-part encrypted tokens separately", () => {
    expect(decode("a.b.c.d.e")).toThrow(rejection("encrypted_token"));
  });
});
