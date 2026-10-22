import type { APIRoute } from "astro";

import { site } from "@/lib/site";

// 放行所有爬虫，包括 AI 检索类与训练类（ADR-0012）
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap-index.xml", site.url).href}\n`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
