import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

import { handleToolApi } from "@/lib/server/tool-api";

// 按需渲染：Server-assisted Tool 的网页调用入口，逻辑在 handleToolApi（便于在 workerd 中单测）
export const prerender = false;

export const ALL: APIRoute = ({ request, params }) => handleToolApi(request, env, params.id);
