import type { CollectionEntry } from "astro:content";
import { env } from "cloudflare:workers";

import type { ToolServerProps, ToolStrings } from "@/components/tool/ToolIsland";
import type { AnyTool } from "@/lib/tool-contract/define-tool";

// Tool 页和 Variant 页共用的 island props：表单文案来自同一 Locale 的 Tool 内容
export const toolStrings = ({ action, fields, output, errors }: CollectionEntry<"tools">["data"]) =>
  ({ action, fields, output, errors }) satisfies ToolStrings;

// Server-assisted Tool 页的 Turnstile site key，来自 wrangler.jsonc 的 vars（本地由 .dev.vars 覆盖为测试 key）
export const serverProps = (tool: AnyTool): ToolServerProps | undefined => {
  if (tool.runtime.where !== "server") return undefined;
  if (!env.TURNSTILE_SITE_KEY) {
    // 预渲染错误经响应头传回构建进程，只能用 ASCII
    throw new Error("TURNSTILE_SITE_KEY is empty: set it under vars in wrangler.jsonc");
  }
  return { turnstileSiteKey: env.TURNSTILE_SITE_KEY };
};
