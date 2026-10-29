import { ToolError } from "@/lib/tool-contract/define-tool";

export interface UrlInput {
  text: string;
  mode: "encode" | "decode";
  scope: "component" | "url" | "form";
}

// 表单编码按 WHATWG application/x-www-form-urlencoded：除字母数字和 *-._ 外都转义，空格变 +。
// 在 encodeURIComponent 的基础上改写，这样孤立代理项和其他范围一样会报错，而不是被悄悄替换成 U+FFFD
const encodeForm = (text: string) =>
  encodeURIComponent(text)
    .replaceAll("%20", "+")
    .replace(/[!'()~]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);

const encode = (text: string, scope: UrlInput["scope"]) => {
  try {
    if (scope === "form") return encodeForm(text);
    return scope === "url" ? encodeURI(text) : encodeURIComponent(text);
  } catch {
    // 孤立代理项（如单独的 \ud800）无法转成 UTF-8
    throw new ToolError("invalid_encoding", { field: "text" });
  }
};

const decode = (text: string, scope: UrlInput["scope"]) => {
  try {
    if (scope === "form") return decodeURIComponent(text.replaceAll("+", " "));
    return scope === "url" ? decodeURI(text) : decodeURIComponent(text);
  } catch {
    throw new ToolError("invalid_encoding", { field: "text" });
  }
};

export const convertUrl = ({ text, mode, scope }: UrlInput) => ({
  result: mode === "encode" ? encode(text, scope) : decode(text, scope),
});
