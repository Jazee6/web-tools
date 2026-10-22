import * as v from "valibot";

import { TURNSTILE_HEADER } from "@/lib/tool-api";
import { ToolError } from "@/lib/tool-contract/define-tool";
import { getTool } from "@/tools/registry";

import { clientIp, type ExecuteEnv, executeTool } from "./execute";
import { verifyTurnstile } from "./turnstile";

// POST /api/tools/{id}：Server-assisted Tool 的网页调用入口（architecture §14）。
// 顺序：Tool 存在且 where=server → 按 IP 限流 → Turnstile → 输入校验 → 执行。
// 限流放在 Turnstile 之前，被拒的请求不再消耗 siteverify 子请求。
// 错误统一为 { error: { code, field?, detail? } }，code 对应内容 frontmatter 的 errors 或 UI 文案。
export interface ToolApiEnv extends ExecuteEnv {
  TOOL_RATE_LIMITER: RateLimit;
  TURNSTILE_SECRET_KEY?: string;
}

const MAX_BODY_BYTES = 16 * 1024;

const fail = (
  status: number,
  error: { code: string; field?: string; detail?: string },
  headers: Record<string, string> = {},
) => Response.json({ error }, { status, headers: { "cache-control": "no-store", ...headers } });

// 只记录 Tool id、耗时和结果类别，不记录请求体
const log = (tool: string, started: number, result: string) =>
  console.log(JSON.stringify({ event: "tool_api", tool, ms: Date.now() - started, result }));

export const handleToolApi = async (
  request: Request,
  env: ToolApiEnv,
  id: string | undefined,
): Promise<Response> => {
  const tool = id ? getTool(id) : undefined;
  if (!tool || tool.runtime.where !== "server") return fail(404, { code: "not_found" });
  if (request.method !== "POST") {
    return fail(405, { code: "method_not_allowed" }, { allow: "POST" });
  }

  const started = Date.now();
  const ip = clientIp(request);
  const { success } = await env.TOOL_RATE_LIMITER.limit({ key: `${tool.id}:${ip}` });
  if (!success) {
    log(tool.id, started, "rate_limited");
    return fail(429, { code: "rate_limited" }, { "retry-after": "60" });
  }

  const token = request.headers.get(TURNSTILE_HEADER) ?? "";
  if (!env.TURNSTILE_SECRET_KEY) console.error("TURNSTILE_SECRET_KEY 未配置，拒绝所有调用");
  if (!env.TURNSTILE_SECRET_KEY || !(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, ip))) {
    log(tool.id, started, "verification_failed");
    return fail(403, { code: "verification_failed" });
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return fail(413, { code: "too_large" });
  }
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return fail(413, { code: "too_large" });
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return fail(400, { code: "invalid_input" });
  }
  const parsed = v.safeParse(tool.input, body);
  if (!parsed.success) {
    log(tool.id, started, "invalid_input");
    return fail(400, { code: "invalid_input", field: v.getDotPath(parsed.issues[0]) ?? undefined });
  }

  try {
    const output = await executeTool(tool, parsed.output, env);
    log(tool.id, started, "ok");
    return Response.json({ output }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    if (error instanceof ToolError) {
      log(tool.id, started, error.code);
      return fail(422, { code: error.code, field: error.field, detail: error.detail });
    }
    log(tool.id, started, "internal_error");
    console.error(error);
    return fail(500, { code: "internal_error" });
  }
};
