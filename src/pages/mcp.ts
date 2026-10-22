import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

import { createMcpFetch, handleMcp } from "@/lib/agent/mcp";
import { tools } from "@/tools/registry";

// 按需渲染：远程 MCP 端点，逻辑在 lib/agent/mcp（便于在 workerd 中单测）
export const prerender = false;

const mcpFetch = createMcpFetch(tools);

export const ALL: APIRoute = ({ request }) => handleMcp(request, env, mcpFetch);
