import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

import { createMcpFetch, handleMcp } from "@/lib/agent/mcp";
import { tools } from "@/tools/registry";

const mcpFetch = createMcpFetch(tools);

let id = 0;

const rpc = async (method: string, params: unknown, ip = "192.0.2.10") => {
  const response = await handleMcp(
    new Request("https://tools.test/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        "mcp-protocol-version": "2025-11-25",
        "cf-connecting-ip": ip,
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }),
    }),
    env,
    mcpFetch,
  );
  // 2025 版协议走 SDK 的无状态 legacy 路径，响应是 SSE；限流返回普通 JSON
  const text = await response.text();
  const data = text.startsWith("{") ? text : /^data: (.*)$/m.exec(text)?.[1];
  return { response, body: JSON.parse(data ?? "{}") as { result?: any; error?: any } };
};

describe("/mcp", () => {
  it("initializes, lists only remote Tools and calls them", async () => {
    const init = await rpc(
      "initialize",
      {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: { name: "test", version: "1.0.0" },
      },
      "192.0.2.11",
    );
    expect(init.response.status).toBe(200);
    expect(init.body.result.serverInfo.name).toBe("web-tools");

    const list = await rpc("tools/list", {}, "192.0.2.11");
    const names = list.body.result.tools.map((tool: { name: string }) => tool.name);
    expect(names).toContain("json-formatter");
    expect(names).not.toContain("http-header-checker");
    const formatter = list.body.result.tools.find(
      (tool: { name: string }) => tool.name === "json-formatter",
    );
    expect(formatter.inputSchema.properties.indent.default).toBe("2");
    expect(formatter.annotations.readOnlyHint).toBe(true);

    const call = await rpc(
      "tools/call",
      {
        name: "json-formatter",
        arguments: { json: '{"b":1,"a":2}', indent: "minify", sortKeys: true },
      },
      "192.0.2.11",
    );
    expect(call.body.result.structuredContent).toEqual({ formatted: '{"a":2,"b":1}' });
    expect(call.body.result.isError).toBeFalsy();
  });

  it("returns Tool errors as isError results", async () => {
    const call = await rpc(
      "tools/call",
      { name: "json-formatter", arguments: { json: "{oops" } },
      "192.0.2.12",
    );
    expect(call.body.result.isError).toBe(true);
    expect(JSON.parse(call.body.result.content[0].text)).toMatchObject({
      error: { code: "invalid_json" },
    });
  });

  it("rate-limits per IP", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 4; i++)
      statuses.push((await rpc("tools/list", {}, "192.0.2.99")).response.status);
    expect(statuses).toEqual([200, 200, 200, 429]);
  });
});

const modern = async (method: string, params: Record<string, unknown>) => {
  const response = await handleMcp(
    new Request("https://tools.test/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        "mcp-protocol-version": "2026-07-28",
        "mcp-method": method,
        // 2026 版要求 tools/call 在 Mcp-Name 头里重复工具名
        ...(typeof params.name === "string" ? { "mcp-name": params.name } : {}),
        "cf-connecting-ip": "192.0.2.20",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: ++id,
        method,
        params: {
          ...params,
          _meta: {
            "io.modelcontextprotocol/protocolVersion": "2026-07-28",
            "io.modelcontextprotocol/clientInfo": { name: "test", version: "1.0.0" },
            "io.modelcontextprotocol/clientCapabilities": {},
          },
        },
      }),
    }),
    env,
    mcpFetch,
  );
  return { response, text: await response.text() };
};

// 2026-07-28 版协议：每个请求自带 _meta 信封，不需要 initialize，响应是普通 JSON（responseMode: "json"）
describe("/mcp (2026-07-28)", () => {
  it("lists and calls Tools with plain JSON responses", async () => {
    const list = await modern("tools/list", {});
    expect(list.response.headers.get("content-type")).toMatch(/application\/json/);
    expect(JSON.parse(list.text).result.tools.map((tool: { name: string }) => tool.name)).toEqual([
      "json-formatter",
    ]);
    const call = await modern("tools/call", {
      name: "json-formatter",
      arguments: { json: "[1, 2]", indent: "minify" },
    });
    expect(JSON.parse(call.text).result.structuredContent).toEqual({ formatted: "[1,2]" });
  });
});
