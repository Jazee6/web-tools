import { toolApiPath, TURNSTILE_HEADER } from "@/lib/tool-api";
import { type AnyTool, ToolError } from "@/lib/tool-contract/define-tool";

// 页面表单与 WebMCP 共用的调用入口：轻量 Tool 在浏览器里跑 core，
// Server-assisted Tool 带上 Turnstile token 调 /api/tools/{id}，错误还原成 ToolError。
// input 必须已经过该 Tool 的 Valibot schema 解析（含默认值）。
export const invokeTool = async (
  tool: AnyTool,
  input: unknown,
  getToken: () => Promise<string>,
): Promise<Record<string, unknown>> => {
  if (tool.runtime.where === "client") {
    const run = await tool.run();
    return run(input, {});
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
