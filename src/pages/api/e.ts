import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

import { handleEvents } from "@/lib/server/events";

// 按需渲染：事件和错误上报（architecture §16），逻辑在 handleEvents（便于在 workerd 中单测）
export const prerender = false;

export const ALL: APIRoute = ({ request }) => handleEvents(request, env);
