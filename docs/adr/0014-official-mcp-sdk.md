# 远程 MCP 直接用官方 SDK，不引入 agents

原定（Q45）用 Cloudflare `agents` 的 `createMcpHandler`。实现时核实：`agents/mcp/server` 只是对 `@modelcontextprotocol/server`（v2）同名函数的薄封装，多了 OAuth 上下文透传和 Host/Origin 校验；而 `agents` 本身把 `@modelcontextprotocol/server` 作为 peer 依赖，还带入 esbuild、babel 等运行时依赖。我们的 `/mcp` 匿名、无状态、不用 Durable Objects，用不到这些封装，所以直接用官方 SDK v2 的 `createMcpHandler` + `fromJsonSchema`（JSON Schema 仍由 `@valibot/to-json-schema` 从契约派生）。

已知代价：SDK 内部依赖 Zod，会随 `/mcp` 进入 Worker 服务端包（gzip 后整个 Worker 约 400 KiB）。这不违反 ADR-0010 的本意：我们自己的代码仍不引用 Zod，Zod 也不进入客户端包。以后如果需要 OAuth 或有状态会话，再评估改回 `agents`。
