import { ToolError } from "@/lib/tool-contract/define-tool";

export interface JwtInput {
  token: string;
}

const TIME_CLAIMS = ["iat", "nbf", "exp"] as const;

// JWT 用无 padding 的 base64url；只接受这个字母表，混入 + / = 说明复制错了
const decodeSegment = (segment: string) => {
  if (!/^[A-Za-z0-9_-]+$/.test(segment) || segment.length % 4 === 1) {
    throw new ToolError("invalid_token", { field: "token" });
  }
  const base64 = segment.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(
      Uint8Array.from(binary, (char) => char.charCodeAt(0)),
    );
  } catch {
    throw new ToolError("invalid_token", { field: "token" });
  }
};

// 头和载荷都必须是 JSON 对象（RFC 7519 §7.2）
const parseObject = (segment: string): Record<string, unknown> => {
  let value: unknown;
  try {
    value = JSON.parse(decodeSegment(segment));
  } catch (error) {
    if (error instanceof ToolError) throw error;
    throw new ToolError("invalid_json", { field: "token" });
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ToolError("invalid_json", { field: "token" });
  }
  return value as Record<string, unknown>;
};

const toUtc = (seconds: number) => {
  const date = new Date(Math.floor(seconds) * 1000);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().replace(".000Z", "Z");
};

export const decodeJwt = ({ token }: JwtInput) => {
  // 常从 Authorization 头整段复制，所以容忍 Bearer 前缀和首尾空白
  const parts = token
    .trim()
    .replace(/^Bearer\s+/i, "")
    .split(".");
  // JWE 是五段：内容已加密，没有可以直接读的载荷
  if (parts.length === 5) throw new ToolError("encrypted_token", { field: "token" });
  // 第三段（签名）可以为空：alg 为 none 的未签名 JWT
  if (parts.length !== 3 || !parts[0] || !parts[1]) {
    throw new ToolError("invalid_token", { field: "token" });
  }
  const [headerPart, payloadPart, signature] = parts as [string, string, string];
  if (signature && !/^[A-Za-z0-9_-]+$/.test(signature)) {
    throw new ToolError("invalid_token", { field: "token" });
  }
  const header = parseObject(headerPart);
  const payload = parseObject(payloadPart);

  const times = TIME_CLAIMS.flatMap((claim) => {
    const value = payload[claim];
    const time = typeof value === "number" ? toUtc(value) : undefined;
    return time ? [{ claim, time }] : [];
  });

  return {
    header: JSON.stringify(header, null, 2),
    payload: JSON.stringify(payload, null, 2),
    signature,
    times,
  };
};
