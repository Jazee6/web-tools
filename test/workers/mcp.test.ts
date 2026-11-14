import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

import { createMcpFetch, handleMcp } from "@/lib/agent/mcp";
import { tools } from "@/tools/registry";

const productionFetch = createMcpFetch(tools);
// 生产目录已不开放简单计算；用显式 opt-in 的测试副本继续覆盖适配层的调用与错误处理。
const fixtureTools = tools
  .filter((tool) => ["json-formatter", "uuid-generator"].includes(tool.id))
  .map((tool) => ({ ...tool, agent: { ...tool.agent, remote: true } }));
const fixtureFetch = createMcpFetch(fixtureTools);

let id = 0;

const rpc = async (method: string, params: unknown, ip = "192.0.2.10", mcpFetch = fixtureFetch) => {
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

describe("/mcp adapter (opt-in fixtures)", () => {
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

  it("generates UUIDs through the remote Agent Interface", async () => {
    const call = await rpc(
      "tools/call",
      { name: "uuid-generator", arguments: { count: 2, uppercase: true } },
      "192.0.2.13",
    );
    expect(call.body.error).toBeUndefined();
    expect(call.body.result.isError).toBeFalsy();
    const lines = call.body.result.structuredContent.uuids.split("\n");
    expect(lines).toHaveLength(2);
    for (const line of lines) {
      expect(line).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/);
    }
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

const modern = async (method: string, params: Record<string, unknown>, mcpFetch = fixtureFetch) => {
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
describe("/mcp adapter (2026-07-28, opt-in fixtures)", () => {
  it("lists and calls Tools with plain JSON responses", async () => {
    const list = await modern("tools/list", {});
    expect(list.response.headers.get("content-type")).toMatch(/application\/json/);
    // 列表由 agent.remote 为真的 Tool 自动生成
    expect(
      JSON.parse(list.text)
        .result.tools.map((tool: { name: string }) => tool.name)
        .toSorted(),
    ).toEqual(
      fixtureTools
        .filter((tool) => tool.agent.remote)
        .map((tool) => tool.id)
        .toSorted(),
    );
    const call = await modern("tools/call", {
      name: "json-formatter",
      arguments: { json: "[1, 2]", indent: "minify" },
    });
    expect(JSON.parse(call.text).result.structuredContent).toEqual({ formatted: "[1,2]" });
  });
});

describe("/mcp production catalog", () => {
  it("keeps WebMCP available without exposing remote Tools", () => {
    expect(tools.filter((tool) => tool.agent.remote)).toEqual([]);
    expect(tools.filter((tool) => tool.agent.webmcp)).toHaveLength(14);
  });

  // 无注册工具时，SDK 不启用 tools capability，而不是返回空列表。
  it("does not expose tools/list to legacy clients", async () => {
    const list = await rpc("tools/list", {}, "192.0.2.30", productionFetch);
    expect(list.response.status).toBe(200);
    expect(list.body.error).toMatchObject({ code: -32601 });
    expect(list.body.result).toBeUndefined();
  });

  it("does not expose tools/list to modern clients", async () => {
    const list = await modern("tools/list", {}, productionFetch);
    expect(list.response.status).toBe(404);
  });

  it("rejects direct calls to removed Tools", async () => {
    const call = await rpc(
      "tools/call",
      { name: "json-formatter", arguments: { json: "{}" } },
      "192.0.2.31",
      productionFetch,
    );
    expect(call.body.error).toBeDefined();
    expect(call.body.result).toBeUndefined();
  });
});
