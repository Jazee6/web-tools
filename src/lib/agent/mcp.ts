import {
  type CallToolResult,
  createMcpHandler,
  fromJsonSchema,
  type JsonSchemaType,
  McpServer,
} from "@modelcontextprotocol/server";
import * as v from "valibot";

import { clientIp, type ExecuteEnv, executeTool } from "@/lib/server/execute";
import { type AnyTool, ToolError } from "@/lib/tool-contract/define-tool";
import { toolJsonSchemas } from "@/lib/tool-contract/json-schema";

import pkg from "../../../package.json" with { type: "json" };

// 远程 MCP（/mcp）：无状态 Streamable HTTP，工具列表由注册表中 agent.remote 为 true 的 Tool 生成（architecture §10）。
// 匿名可用，只按 IP 限流；每次调用都占 Free 计划每天的 Worker 请求配额，并受 10ms CPU 约束。
export interface McpEnv extends ExecuteEnv {
  MCP_RATE_LIMITER: RateLimit;
}

// 单次 JSON-RPC 请求体上限：轻量 Tool 的输入都是文本，大输入会超出 CPU 预算
const MAX_BODY_BYTES = 64 * 1024;

const text = (value: unknown) => [{ type: "text" as const, text: JSON.stringify(value) }];

const callTool = async (tool: AnyTool, args: unknown, env: McpEnv): Promise<CallToolResult> => {
  try {
    // JSON Schema 校验已由 SDK 完成；再经 Valibot 解析一次以补上 schema 默认值
    const output = (await executeTool(tool, v.parse(tool.input, args), env)) as Record<
      string,
      unknown
    >;
    return { content: text(output), structuredContent: output };
  } catch (error) {
    if (!(error instanceof ToolError)) throw error;
    const { code, field, detail } = error;
    return { isError: true, content: text({ error: { code, field, detail } }) };
  }
};

export const createMcpFetch = (tools: readonly AnyTool[]) => {
  // JSON Schema 和 SDK 的校验器在模块作用域只构建一次（10ms CPU 预算），每个请求只新建 McpServer 并注册
  const remote = tools
    .filter((tool) => tool.agent.remote)
    .map((tool) => {
      // @valibot/to-json-schema 与 SDK 的 JSON Schema 类型定义不同，结构相同
      const { input, output } = toolJsonSchemas(tool) as Record<string, JsonSchemaType>;
      return { tool, input: fromJsonSchema(input!), output: fromJsonSchema(output!) };
    });

  // handler 每个 isolate（按 env）只建一次：每次新建会重复初始化，并在每个请求上打一条 responseMode 警告日志。
  // 工厂仍为每个请求新建 McpServer（SDK 的无状态约定）。
  const handlers = new WeakMap<McpEnv, ReturnType<typeof createMcpHandler>>();
  const handlerFor = (env: McpEnv) => {
    let handler = handlers.get(env);
    if (!handler) {
      handler = createMcpHandler(
        () => {
          const server = new McpServer({ name: "web-tools", version: pkg.version });
          for (const { tool, input, output } of remote) {
            server.registerTool(
              tool.id,
              {
                description: tool.agent.description,
                inputSchema: input,
                outputSchema: output,
                annotations: {
                  readOnlyHint: true,
                  idempotentHint: true,
                  openWorldHint: tool.runtime.where === "server",
                },
              },
              (args) => callTool(tool, args, env),
            );
          }
          return server;
        },
        { responseMode: "json", maxRequestBodySize: MAX_BODY_BYTES },
      );
      handlers.set(env, handler);
    }
    return handler;
  };

  return (request: Request, env: McpEnv) => handlerFor(env).fetch(request);
};

export const handleMcp = async (
  request: Request,
  env: McpEnv,
  mcpFetch: ReturnType<typeof createMcpFetch>,
): Promise<Response> => {
  const { success } = await env.MCP_RATE_LIMITER.limit({ key: clientIp(request) });
  if (!success) {
    return Response.json(
      { jsonrpc: "2.0", error: { code: -32000, message: "Rate limit exceeded" }, id: null },
      { status: 429, headers: { "retry-after": "60" } },
    );
  }
  return mcpFetch(request, env);
};
