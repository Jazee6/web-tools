import { Marked, type Tokens } from "marked";

import {
  codeLanguages,
  type Highlight,
  type HighlightTheme,
  prepareHighlight,
} from "@/lib/markdown/highlight";
import type { ToolContext } from "@/lib/tool-contract/define-tool";

// CommonMark + GFM（marked），原始 HTML 原样保留：预览在不允许脚本的 sandbox iframe 里。
// 用独立的 Marked 实例，不改全局 marked 的配置（公众号排版也用 marked）

export interface MarkdownToHtmlInput {
  markdown: string;
  headingIds: boolean;
  document: boolean;
  highlight: boolean;
  theme: HighlightTheme;
}

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// GitHub 的标题锚点规则（github-slugger）：转小写，去掉标点和符号（保留各种文字、数字、- 和 _），空格换成 -；
// 重复的加 -1、-2
// 标题的纯文本：去掉标题里的原始 HTML 标签，解码实体（GitHub 按渲染后的文字生成锚点）
const plainText = (text: string) =>
  text
    .replace(/<[^>]*>/g, "")
    .replace(/&(?:#(\d+)|#x([\da-f]+)|(amp|lt|gt|quot|apos|nbsp));/gi, (entity, dec, hex, name) => {
      if (dec) return String.fromCodePoint(Number(dec));
      if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
      const named: Record<string, string> = {
        amp: "&",
        lt: "<",
        gt: ">",
        quot: '"',
        apos: "'",
        nbsp: " ",
      };
      return named[name.toLowerCase()] ?? entity;
    });

export const createSlugger = () => {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = plainText(text)
      .toLowerCase()
      .trim()
      // emoji 的变体选择符和 keycap 组合符也算符号（1️⃣ → 1）
      .replace(/[\uFE00-\uFE0F\u20E3]|[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, "")
      .replaceAll(" ", "-");
    // 什么都不剩的标题（如只有 emoji）不给 id，也不参与去重
    if (!base) return "";
    let slug = base;
    let count = seen.get(base) ?? 0;
    while (seen.has(slug)) slug = `${base}-${++count}`;
    seen.set(base, count);
    seen.set(slug, 0);
    return slug;
  };
};

const highlightedCode = (highlight: Highlight, token: Tokens.Code) => {
  const lines = highlight.tokens(token.text, token.lang);
  if (!lines || !highlight.colors) return undefined;
  const body = lines
    .map((line) =>
      line
        .map((part) => {
          const rules: string[] = [];
          if (part.color) rules.push(`color:${part.color}`);
          if (part.fontStyle && part.fontStyle & 1) rules.push("font-style:italic");
          if (part.fontStyle && part.fontStyle & 2) rules.push("font-weight:bold");
          if (part.fontStyle && part.fontStyle & 4) rules.push("text-decoration:underline");
          const text = escapeHtml(part.content);
          return rules.length > 0 ? `<span style="${rules.join(";")}">${text}</span>` : text;
        })
        .join(""),
    )
    .join("\n");
  const lang = token.lang?.trim().split(/\s+/)[0];
  const { bg, fg } = highlight.colors;
  return `<pre style="background-color:${bg};color:${fg}"><code${lang ? ` class="language-${escapeHtml(lang)}"` : ""}>${body}</code></pre>\n`;
};

// 完整文档的默认样式：可读的正文宽度和间距，表格、代码、引用都有基本样式；高亮的代码块用自己的内联颜色
const documentStyle = [
  "body{max-width:760px;margin:0 auto;padding:32px 16px;font:16px/1.6 system-ui,-apple-system,'Segoe UI',sans-serif;color:#1f2328;background:#fff}",
  "h1,h2,h3,h4,h5,h6{line-height:1.25;margin:1.5em 0 .5em}",
  "h1,h2{padding-bottom:.3em;border-bottom:1px solid #d1d9e0}",
  "a{color:#0969da}",
  "img{max-width:100%}",
  "code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.875em}",
  ":not(pre)>code{padding:.2em .4em;border-radius:6px;background:#eff1f3}",
  "pre{padding:16px;overflow:auto;border-radius:6px;background:#f6f8fa;line-height:1.45}",
  "blockquote{margin:0;padding:0 1em;color:#59636e;border-left:.25em solid #d1d9e0}",
  "table{border-collapse:collapse;display:block;overflow:auto}",
  "th,td{padding:6px 13px;border:1px solid #d1d9e0}",
  "hr{height:1px;border:0;background:#d1d9e0}",
].join("\n");

const wrapDocument = (body: string, title: string) =>
  `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
${documentStyle}
</style>
</head>
<body>
${body}</body>
</html>
`;

export const markdownToHtml = async (
  input: MarkdownToHtmlInput,
  _ctx: ToolContext = {},
): Promise<{ html: string }> => {
  const marked = new Marked({ gfm: true });
  const tokens = marked.lexer(input.markdown);
  // 主题或语法分块下载失败（如离线）时不高亮，照常输出
  const highlight = input.highlight
    ? await prepareHighlight(codeLanguages(tokens), input.theme).catch(() => undefined)
    : undefined;
  const slug = createSlugger();
  let title: string | undefined;

  marked.use({
    renderer: {
      heading({ tokens: inline, depth }) {
        const text = this.parser.parseInline(inline, this.parser.textRenderer);
        if (depth === 1 && !title) title = text.trim() || undefined;
        const id = input.headingIds ? slug(text) : "";
        return `<h${depth}${id ? ` id="${escapeHtml(id)}"` : ""}>${this.parser.parseInline(inline)}</h${depth}>\n`;
      },
      code(token) {
        return (highlight && highlightedCode(highlight, token)) || false;
      },
    },
  });

  const body = marked.parser(tokens);
  return { html: input.document ? wrapDocument(body, title ?? "Document") : body };
};
