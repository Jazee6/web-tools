import { site } from "@/lib/site";
import { ToolError } from "@/lib/tool-contract/define-tool";

// Server-assisted Tool 对外请求的防护（architecture §14）：
// - 只允许 http/https 和默认端口，拒绝 IP 字面量中的内网 / 保留地址、单标签主机名和内网后缀；
// - 不跟随重定向（redirect: "manual"），由调用方逐跳重新校验；
// - 主机名解析到内网的情况（DNS rebinding）由 global_fetch_strictly_public 兜底：Worker 的 fetch 只走公网。
// WHATWG URL 解析器已经把 0x7f.1、2130706433 之类的写法规范化成点分十进制，这里只需判断规范形式。

const ALLOWED_PORTS = new Set(["", "80", "443"]);

const BLOCKED_SUFFIXES = [".localhost", ".local", ".internal", ".home.arpa", ".lan", ".intranet"];

const USER_AGENT = `WebToolsBot/1.0 (+${site.url})`;

// [网络地址, 前缀长度]
const PRIVATE_V4: readonly [number, number][] = [
  [0x00000000, 8], // 0.0.0.0/8
  [0x0a000000, 8], // 10.0.0.0/8
  [0x64400000, 10], // 100.64.0.0/10（CGNAT）
  [0x7f000000, 8], // 127.0.0.0/8
  [0xa9fe0000, 16], // 169.254.0.0/16
  [0xac100000, 12], // 172.16.0.0/12
  [0xc0000000, 24], // 192.0.0.0/24
  [0xc0000200, 24], // 192.0.2.0/24（文档）
  [0xc0a80000, 16], // 192.168.0.0/16
  [0xc6120000, 15], // 198.18.0.0/15
  [0xc6336400, 24], // 198.51.100.0/24（文档）
  [0xcb007100, 24], // 203.0.113.0/24（文档）
  [0xe0000000, 3], // 224.0.0.0/3（组播与保留，含广播）
];

const parseIPv4 = (host: string): number | undefined => {
  const parts = host.split(".");
  if (parts.length !== 4 || !parts.every((part) => /^\d{1,3}$/.test(part))) return undefined;
  const bytes = parts.map(Number);
  if (bytes.some((byte) => byte > 255)) return undefined;
  return ((bytes[0]! << 24) | (bytes[1]! << 16) | (bytes[2]! << 8) | bytes[3]!) >>> 0;
};

const isPrivateIPv4 = (address: number) =>
  PRIVATE_V4.some(([network, prefix]) => {
    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    return (address & mask) >>> 0 === network;
  });

// 只放行全局单播 2000::/3，排除文档段 2001:db8::/32、Teredo 2001::/32 与 6to4 2002::/16
// （后两者可能内嵌私有 IPv4）；::1、fc00::/7、fe80::/10、::ffff:… 映射地址都不在 2000::/3 内。
const isPublicIPv6 = (host: string) => {
  const groups = host.slice(1, -1).split(":");
  const first = Number.parseInt(groups[0] || "0", 16);
  const second = Number.parseInt(groups[1] || "0", 16);
  if (first < 0x2000 || first > 0x3fff) return false;
  if (first === 0x2001 && (second === 0x0db8 || second === 0)) return false;
  return first !== 0x2002;
};

// 校验目标 URL，不通过时抛 ToolError("blocked_url")，field 由调用方的输入字段决定
export const assertPublicUrl = (url: URL, field?: string): URL => {
  const blocked = (detail: string) => new ToolError("blocked_url", { field, detail });
  if (url.protocol !== "http:" && url.protocol !== "https:") throw blocked(url.protocol);
  if (url.username || url.password) throw blocked("credentials");
  if (!ALLOWED_PORTS.has(url.port)) throw blocked(`port ${url.port}`);

  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (host.startsWith("[")) {
    if (!isPublicIPv6(host)) throw blocked(host);
    return url;
  }
  const ipv4 = parseIPv4(host);
  if (ipv4 !== undefined) {
    if (isPrivateIPv4(ipv4)) throw blocked(host);
    return url;
  }
  if (!host.includes(".") || host === "localhost") throw blocked(host);
  if (BLOCKED_SUFFIXES.some((suffix) => host.endsWith(suffix))) throw blocked(host);
  // 不请求本站，避免经由自身形成请求放大
  if (host === new URL(site.url).hostname) throw blocked(host);
  return url;
};

export interface SafeFetchOptions {
  field?: string;
  // 每次对外请求前按目标主机限流，返回 false 时拒绝
  limitHost?: (host: string) => Promise<boolean>;
}

export const createSafeFetch =
  ({ field, limitHost }: SafeFetchOptions = {}) =>
  async (url: URL, init: RequestInit = {}): Promise<Response> => {
    assertPublicUrl(url, field);
    if (limitHost && !(await limitHost(url.hostname))) throw new ToolError("rate_limited");
    const headers = new Headers(init.headers);
    headers.set("user-agent", USER_AGENT);
    return fetch(url, { ...init, headers, redirect: "manual" });
  };
