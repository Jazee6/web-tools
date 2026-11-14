import { ToolError } from "@/lib/tool-contract/define-tool";

export interface Base64Input {
  text: string;
  mode: "encode" | "decode";
  urlSafe: boolean;
}

// btoa 只接受 Latin-1，所以先用 TextEncoder 得到 UTF-8 字节，再按字节编码
const encode = (text: string, urlSafe: boolean) => {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  // 分块避免 String.fromCharCode(...bytes) 在大输入上超出参数个数上限
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  const standard = btoa(binary);
  return urlSafe ? standard.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "") : standard;
};

const decode = (text: string) => {
  // 空白（含 MIME 的换行）不属于数据；两种字母表都接受，缺少的 padding 补回
  const normalized = text
    .replace(/\s+/g, "")
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .replace(/=+$/, "");
  // 长度除 4 余 1 时，不可能是任何字节序列的 Base64；全是空白或 = 也没有数据可解
  if (!/^[A-Za-z0-9+/]+$/.test(normalized) || normalized.length % 4 === 1) {
    throw new ToolError("invalid_base64", { field: "text" });
  }
  let binary: string;
  try {
    binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  } catch {
    throw new ToolError("invalid_base64", { field: "text" });
  }
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new ToolError("invalid_utf8", { field: "text" });
  }
};

export const convertBase64 = ({ text, mode, urlSafe }: Base64Input) => ({
  result: mode === "encode" ? encode(text, urlSafe) : decode(text),
});
