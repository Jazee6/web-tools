import type { AnyTool, ToolContext } from "@/lib/tool-contract/define-tool";

import { createSafeFetch } from "./safe-fetch";

// /api/tools/* 与 /mcp 共用的服务端执行入口：input 已经过该 Tool 的 Valibot schema 校验。
// Server-assisted Tool 拿到带 SSRF 防护和按目标限流的 fetch；轻量 Tool 直接在 Worker 里跑 core。
export interface ExecuteEnv {
  TARGET_RATE_LIMITER: RateLimit;
}

// 对外请求的总时长上限（含重定向）；等待网络不计入 10ms CPU
const TIMEOUT_MS = 8000;

export const executeTool = async (tool: AnyTool, input: unknown, env: ExecuteEnv) => {
  const ctx: ToolContext =
    tool.runtime.where === "server"
      ? {
          signal: AbortSignal.timeout(TIMEOUT_MS),
          fetch: createSafeFetch({
            limitHost: async (host) => (await env.TARGET_RATE_LIMITER.limit({ key: host })).success,
          }),
        }
      : {};
  const run = await tool.run();
  return run(input, ctx);
};

export const clientIp = (request: Request) => request.headers.get("cf-connecting-ip") ?? "unknown";
