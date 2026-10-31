import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

import type { recordTypes, resolvers } from "./record-types";

export interface DnsInput {
  domain: string;
  type: (typeof recordTypes)[number];
  resolver: (typeof resolvers)[number];
}

// 两家的 DoH JSON 接口都允许跨源请求，浏览器直接查询，不经过我们的服务器（ADR-0002）
const endpoints = {
  cloudflare: "https://cloudflare-dns.com/dns-query",
  google: "https://dns.google/resolve",
} as const;

const TIMEOUT_MS = 10_000;

const statusNames: Record<number, string> = {
  0: "NOERROR",
  1: "FORMERR",
  2: "SERVFAIL",
  3: "NXDOMAIN",
  4: "NOTIMP",
  5: "REFUSED",
};

const typeNames: Record<number, string> = {
  1: "A",
  2: "NS",
  5: "CNAME",
  6: "SOA",
  15: "MX",
  16: "TXT",
  28: "AAAA",
  257: "CAA",
};

interface DohAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface DohResponse {
  Status: number;
  Answer?: DohAnswer[];
}

const LABEL = /^[a-z0-9_]([a-z0-9_-]{0,61}[a-z0-9_])?$/;

// 接受域名或完整网址：去掉协议、路径、端口，IDN 转成 punycode，末尾的点去掉
const normalizeDomain = (input: string) => {
  const candidate = input.trim().replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
  let host: string;
  try {
    host = new URL(`http://${candidate}`).hostname;
  } catch {
    throw new ToolError("invalid_domain", { field: "domain" });
  }
  host = host.replace(/\.$/, "");
  const labels = host.split(".");
  if (host.length === 0 || host.length > 253 || !labels.every((label) => LABEL.test(label))) {
    throw new ToolError("invalid_domain", { field: "domain" });
  }
  return host;
};

// Cloudflare 把 TXT 写成带引号的分段（"a" "b"），Google 给的是拼好的文本；统一成拼好的文本
const unquoteTxt = (data: string) =>
  data.startsWith('"')
    ? [...data.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]!.replace(/\\(.)/g, "$1")).join("")
    : data;

const record = (answer: DohAnswer) => {
  const type = typeNames[answer.type] ?? `TYPE${answer.type}`;
  let data = answer.data;
  if (type === "TXT") data = unquoteTxt(data);
  // 目标主机名末尾的点是 DNS 的绝对名称写法，MX 的优先级在前面
  if (type === "CNAME" || type === "NS" || type === "MX") data = data.replace(/\.$/, "");
  return {
    name: answer.name.replace(/\.$/, ""),
    type,
    ttl: answer.TTL,
    data,
  };
};

export const lookupDns = async ({ domain, type, resolver }: DnsInput, ctx: ToolContext) => {
  const url = new URL(endpoints[resolver]);
  url.searchParams.set("name", normalizeDomain(domain));
  url.searchParams.set("type", type);
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  const signal = ctx.signal ? AbortSignal.any([ctx.signal, timeout]) : timeout;
  let body: DohResponse;
  try {
    const response = await (ctx.fetch ?? fetch)(url, {
      headers: { accept: "application/dns-json" },
      signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    body = (await response.json()) as DohResponse;
  } catch (error) {
    // 用户取消不算查询失败，原样抛出
    if (ctx.signal?.aborted) throw error;
    throw new ToolError("lookup_failed", {
      detail: error instanceof Error ? error.message : undefined,
    });
  }
  if (typeof body.Status !== "number") throw new ToolError("lookup_failed");
  return {
    status: statusNames[body.Status] ?? `RCODE${body.Status}`,
    records: (body.Answer ?? []).map(record),
  };
};
