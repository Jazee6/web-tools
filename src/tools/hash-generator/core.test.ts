import { describe, expect, it } from "vitest";

import { generateHash, type HashInput } from "./core";
import { md5 } from "./md5";

const hash = async (
  text: string,
  algorithm: HashInput["algorithm"],
  format: HashInput["format"] = "hex",
) => (await generateHash({ text, algorithm, format })).hash;

const hex = (n: number) =>
  Array.from(md5(new Uint8Array(n).fill(97)), (b) => b.toString(16).padStart(2, "0")).join("");

describe("generateHash", () => {
  it("matches the MD5 test vectors from RFC 1321", async () => {
    expect(await hash("", "md5")).toBe("d41d8cd98f00b204e9800998ecf8427e");
    expect(await hash("a", "md5")).toBe("0cc175b9c0f1b6a831c399e269772661");
    expect(await hash("abc", "md5")).toBe("900150983cd24fb0d6963f7d28e17f72");
    expect(await hash("message digest", "md5")).toBe("f96b697d7cb7938d525a2f31aaf161d0");
    expect(
      await hash(
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
        "md5",
      ),
    ).toBe("57edf4a22be3c955ac49da2e2107b67a");
  });

  it("pads MD5 correctly around block boundaries", () => {
    // 55、56、64 字节分别落在填充需要 1 块、2 块的边界上
    expect(hex(55)).toBe("ef1772b6dff9a122358552954ad0df65");
    expect(hex(56)).toBe("3b0c8ac703f828b04c6c197006d17218");
    expect(hex(64)).toBe("014842d480b571495a4a0363793f7367");
  });

  it("matches the SHA test vectors", async () => {
    expect(await hash("abc", "sha-1")).toBe("a9993e364706816aba3e25717850c26c9cd0d89d");
    expect(await hash("abc", "sha-256")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
    expect(await hash("abc", "sha-384")).toBe(
      "cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7",
    );
    expect(await hash("abc", "sha-512")).toBe(
      "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
    );
  });

  it("hashes the UTF-8 bytes of non-ASCII text", async () => {
    expect(await hash("café", "md5")).toBe("07117fe4a1ebd544965dc19573183da2");
    expect(await hash("世界", "sha-256")).toBe(
      "33650a369521ec29f2e26c43d25967535bcb26436755f536735d1ef6e84a1ec5",
    );
  });

  it("formats the digest as uppercase hex or Base64", async () => {
    expect(await hash("abc", "sha-1", "hex-upper")).toBe(
      "A9993E364706816ABA3E25717850C26C9CD0D89D",
    );
    expect(await hash("abc", "sha-1", "base64")).toBe("qZk+NkcGgWq6PiVxeFDCbJzQ2J0=");
    expect(await hash("abc", "md5", "base64")).toBe("kAFQmDzST7DWlj99KOF/cg==");
  });
});
