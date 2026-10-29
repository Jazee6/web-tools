import { md5 } from "./md5";

export interface HashInput {
  text: string;
  algorithm: "md5" | "sha-1" | "sha-256" | "sha-384" | "sha-512";
  format: "hex" | "hex-upper" | "base64";
}

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

// 与 base64-encode-decode 一样不用 Uint8Array.toBase64：workerd 和旧 Safari 未必有
const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));

export const generateHash = async ({ text, algorithm, format }: HashInput) => {
  const data = new TextEncoder().encode(text);
  const digest =
    algorithm === "md5"
      ? md5(data)
      : new Uint8Array(await crypto.subtle.digest(algorithm.toUpperCase(), data));
  const hash =
    format === "base64"
      ? toBase64(digest)
      : format === "hex-upper"
        ? toHex(digest).toUpperCase()
        : toHex(digest);
  return { hash };
};
