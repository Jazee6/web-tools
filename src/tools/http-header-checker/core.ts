import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

export interface CheckHeadersInput {
  url: string;
  followRedirects: boolean;
}

const MAX_REDIRECTS = 5;

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

const parseTarget = (input: string): URL => {
  const raw = input.trim();
  const withScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  if (!URL.canParse(withScheme)) throw new ToolError("invalid_url", { field: "url" });
  const url = new URL(withScheme);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ToolError("invalid_url", { field: "url", detail: url.protocol });
  }
  url.hash = "";
  return url;
};

// ctx.fetch 由服务端注入（带 SSRF 防护、按目标限流，且不跟随重定向），这里逐跳跟随，每一跳都重新校验
const request = async (
  fetch: NonNullable<ToolContext["fetch"]>,
  url: URL,
  signal?: AbortSignal,
) => {
  try {
    const response = await fetch(url, { method: "HEAD", signal });
    await response.body?.cancel();
    return response;
  } catch (error) {
    if (error instanceof ToolError) {
      throw error.code === "blocked_url"
        ? new ToolError(error.code, { field: "url", detail: error.detail })
        : error;
    }
    if (
      error instanceof DOMException &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      throw new ToolError("timeout");
    }
    throw new ToolError("fetch_failed", {
      detail: error instanceof Error ? error.message : undefined,
    });
  }
};

export const checkHeaders = async (
  { url, followRedirects }: CheckHeadersInput,
  ctx: ToolContext,
) => {
  if (!ctx.fetch) throw new Error("http-header-checker 只能在服务端运行（需要注入 ctx.fetch）");
  let target = parseTarget(url);
  const redirects: { status: number; url: string }[] = [];
  for (;;) {
    const response = await request(ctx.fetch, target, ctx.signal);
    const location = response.headers.get("location");
    if (!followRedirects || !REDIRECT_STATUSES.has(response.status) || !location) {
      return {
        status: response.status,
        url: target.href,
        headers: [...response.headers].map(([name, value]) => ({ name, value })),
        redirects,
      };
    }
    if (redirects.length === MAX_REDIRECTS) {
      throw new ToolError("too_many_redirects", { detail: String(MAX_REDIRECTS) });
    }
    redirects.push({ status: response.status, url: target.href });
    if (!URL.canParse(location, target)) throw new ToolError("fetch_failed", { detail: location });
    target = new URL(location, target);
  }
};
