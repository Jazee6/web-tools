import type { APIRoute } from "astro";

import { site } from "@/lib/site";
import { renderVariantMarkdown } from "@/lib/variant-markdown";
import { lookupVariant, variantCacheControl } from "@/lib/variant-ssr";

import { loadBundle } from "./bundles";

// Variant 页 .md 副本的 on-demand 模式：只有可索引页面有副本（ADR-0019）。
// SSR 响应不经过 _headers，canonical 的 Link 头在这里补上（与 static 模式的 /*.md 规则相同）。
export const prerender = false;

export const GET: APIRoute = async ({ params, redirect }) => {
  const result = await lookupVariant(loadBundle, params);
  if (result.status === "redirect" && result.target.head.markdown) {
    return redirect(result.target.head.markdown, 302);
  }
  if (result.status !== "found" || !result.data.head.markdown) {
    return new Response(null, { status: 404 });
  }
  const { data } = result;
  return new Response(renderVariantMarkdown(data), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": variantCacheControl,
      Link: `<${new URL(data.path, site.url).href}>; rel="canonical"`,
    },
  });
};
