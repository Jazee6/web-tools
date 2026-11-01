import { reportError, reportRun } from "@/lib/telemetry/client";
import { toolApiPath, TURNSTILE_HEADER } from "@/lib/tool-api";
import {
  type AnyTool,
  loadRun,
  type ToolContext,
  ToolError,
} from "@/lib/tool-contract/define-tool";

// 页面表单与 WebMCP 共用的调用入口：轻量 Tool 在主线程跑 core，重型 Tool 在 Web Worker 里跑，
// Server-assisted Tool 带上 Turnstile token 调 /api/tools/{id}，错误还原成 ToolError。
// input 必须已经过该 Tool 的 Valibot schema 解析（含默认值）。ctx 的取消和进度只传给客户端 Tool。
// 遥测放在这一层，表单和 WebMCP 的调用都会统计。ToolError 是预期结果，只算结果类别；其他异常才算错误。
export const invokeTool = async (
  tool: AnyTool,
  input: unknown,
  getToken: () => Promise<string>,
  ctx: ToolContext = {},
): Promise<Record<string, unknown>> => {
  const started = performance.now();
  try {
    const output = await execute(tool, input, getToken, ctx);
    reportRun(tool.id, "ok", performance.now() - started);
    return output;
  } catch (error) {
    const elapsed = performance.now() - started;
    if (ctx.signal?.aborted) {
      reportRun(tool.id, "cancelled", elapsed);
    } else if (error instanceof ToolError) {
      reportRun(tool.id, error.code, elapsed);
    } else {
      reportRun(tool.id, "unexpected", elapsed);
      reportError("tool", error, tool.id);
    }
    throw error;
  }
};

const execute = async (
  tool: AnyTool,
  input: unknown,
  getToken: () => Promise<string>,
  ctx: ToolContext,
): Promise<Record<string, unknown>> => {
  if (tool.runtime.where === "client") {
    if (tool.runtime.worker) {
      const { runInWorker } = await import("./tool-worker");
      return runInWorker(tool, input, ctx);
    }
    const run = await loadRun(tool);
    return run(input, ctx);
  }
  const response = await fetch(toolApiPath(tool.id), {
    method: "POST",
    headers: { "content-type": "application/json", [TURNSTILE_HEADER]: await getToken() },
    body: JSON.stringify(input),
  });
  const body = (await response.json().catch(() => ({}))) as {
    output?: Record<string, unknown>;
    error?: { code: string; field?: string; detail?: string };
  };
  if (response.ok && body.output) return body.output;
  if (body.error) throw new ToolError(body.error.code, body.error);
  throw new Error(`${toolApiPath(tool.id)} 返回 ${response.status}`);
};
