import { lexer, type Token, type Tokens } from "marked";

import { codeLanguages, type Highlight, prepareHighlight } from "@/lib/markdown/highlight";
import type { ToolContext } from "@/lib/tool-contract/define-tool";

import { type Accent, accents, colors, flow, fonts, radius } from "./theme";

// 公众号编辑器会去掉 <style>、class 和外链，所以每个元素都带内联样式；
// 外链改成文末编号的参考链接，Markdown 里的原始 HTML 一律转义（也防止预览里执行脚本）。

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const style = (rules: Record<string, string | number>) =>
  Object.entries(rules)
    .map(([key, value]) => `${key}:${typeof value === "number" ? `${value}px` : value}`)
    .join(";");

const tag = (name: string, rules: Record<string, string | number>, content: string) =>
  `<${name} style="${style(rules)}">${content}</${name}>`;

const httpUrl = (href: string) => {
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? url : undefined;
  } catch {
    return undefined;
  }
};

// 公众号正文里只有公众号文章的链接可以点
const isWechatLink = (url: URL) => url.hostname === "mp.weixin.qq.com";

// 代码块里的空白：公众号会折叠空格和换行，换成 &nbsp; 和 <br>
const preserveWhitespace = (html: string) => html.replaceAll("\t", "  ").replace(/ /g, "&nbsp;");

interface Footnote {
  url: string;
  text: string;
}

class Renderer {
  private readonly footnotes: Footnote[] = [];

  constructor(
    private readonly accent: string,
    private readonly highlight: Highlight,
  ) {}

  render(tokens: Token[]): string {
    const body = this.blocks(tokens);
    return tag(
      "section",
      {
        "font-family": fonts.body,
        "font-size": 16,
        "line-height": "1.75",
        color: colors.foreground,
        "overflow-wrap": "break-word",
        "word-break": "break-word",
        "text-align": "left",
      },
      body + this.renderFootnotes(),
    );
  }

  // 一组块级元素：第一个不留上边距；标题下面的元素只隔 1em（typeset.css 的规则）
  private blocks(tokens: Token[]): string {
    let html = "";
    let previous: Token | undefined;
    for (const token of tokens) {
      const rendered = this.block(token);
      if (!rendered) continue;
      const top = previous === undefined ? "0" : previous.type === "heading" ? "16px" : undefined;
      html += top === undefined ? rendered : withMarginTop(rendered, top);
      previous = token;
    }
    return html;
  }

  private block(token: Token): string {
    switch (token.type) {
      case "space":
      case "def":
      case "checkbox":
        return "";
      case "heading":
        return this.heading(token as Tokens.Heading);
      case "paragraph":
        return this.paragraph(token as Tokens.Paragraph);
      case "text": {
        const text = token as Tokens.Text;
        return tag(
          "p",
          { margin: `${flow}px 0 0` },
          text.tokens ? this.inline(text.tokens) : escapeHtml(text.text),
        );
      }
      case "code":
        return this.code(token as Tokens.Code);
      case "blockquote":
        return tag(
          "blockquote",
          {
            margin: `${flow}px 0 0`,
            padding: "0 0 0 16px",
            "border-left": `2px solid ${this.accent}`,
          },
          this.blocks((token as Tokens.Blockquote).tokens),
        );
      case "list":
        return this.list(token as Tokens.List, 0);
      case "table":
        return this.table(token as Tokens.Table);
      case "hr":
        return `<hr style="${style({ margin: `${flow * 2.4}px 0 0`, border: "0", "border-top": `1px solid ${colors.border}`, height: "0" })}">`;
      case "html":
        return tag("p", { margin: `${flow}px 0 0` }, escapeHtml((token as Tokens.HTML).text));
      default:
        return "raw" in token ? tag("p", { margin: `${flow}px 0 0` }, escapeHtml(token.raw)) : "";
    }
  }

  private heading(token: Tokens.Heading): string {
    const content = this.inline(token.tokens);
    const base = { color: colors.foreground, "font-weight": "600", "margin-bottom": "0" };
    switch (token.depth) {
      case 1:
        return tag(
          "h1",
          { ...base, "font-size": 28, "line-height": "1.3", "margin-top": flow },
          content,
        );
      case 2:
        return tag(
          "h2",
          {
            ...base,
            "font-size": 20,
            "line-height": "1.4",
            "margin-top": flow * 1.4,
            "padding-left": 10,
            "border-left": `3px solid ${this.accent}`,
          },
          content,
        );
      case 3:
        return tag(
          "h3",
          { ...base, "font-size": 18, "line-height": "1.45", "margin-top": flow },
          content,
        );
      case 4:
        return tag(
          "h4",
          { ...base, "font-size": 16, "line-height": "1.5", "margin-top": flow },
          content,
        );
      case 5:
        return tag(
          "h5",
          {
            ...base,
            "font-size": 14,
            "line-height": "1.5",
            "font-weight": "500",
            color: colors.mutedForeground,
            "margin-top": flow,
          },
          content,
        );
      default:
        return tag(
          "h6",
          {
            ...base,
            "font-size": 13,
            "line-height": "1.5",
            "font-weight": "500",
            "letter-spacing": "0.08em",
            "text-transform": "uppercase",
            color: colors.mutedForeground,
            "margin-top": flow,
          },
          content,
        );
    }
  }

  private paragraph(token: Tokens.Paragraph): string {
    const [only] = token.tokens;
    // 单独成段的图片：图片加图注
    if (
      token.tokens.length === 1 &&
      only?.type === "image" &&
      httpUrl((only as Tokens.Image).href)
    ) {
      return this.figure(only as Tokens.Image);
    }
    return tag("p", { margin: `${flow}px 0 0` }, this.inline(token.tokens));
  }

  private figure(image: Tokens.Image): string {
    const caption = image.text.trim()
      ? tag(
          "figcaption",
          {
            margin: "12px 0 0",
            "font-size": 14,
            color: colors.mutedForeground,
            "text-align": "center",
          },
          escapeHtml(image.text),
        )
      : "";
    return tag("figure", { margin: `${flow}px 0 0` }, this.image(image, true) + caption);
  }

  private image(image: Tokens.Image, block = false): string {
    const url = httpUrl(image.href);
    if (!url) return escapeHtml(image.text);
    const rules: Record<string, string | number> = block
      ? {
          display: "block",
          margin: "0 auto",
          "max-width": "100%",
          height: "auto",
          "border-radius": radius,
        }
      : { "max-width": "100%", height: "auto", "vertical-align": "middle" };
    return `<img src="${escapeHtml(url.href)}" alt="${escapeHtml(image.text)}" style="${style(rules)}">`;
  }

  private code(token: Tokens.Code): string {
    const lines = this.highlight.tokens(token.text, token.lang);
    const body = lines
      ? lines
          .map((line) =>
            line
              .map((part) => {
                const rules: Record<string, string> = {};
                if (part.color) rules.color = part.color;
                if (part.fontStyle && part.fontStyle & 1) rules["font-style"] = "italic";
                if (part.fontStyle && part.fontStyle & 2) rules["font-weight"] = "600";
                const text = preserveWhitespace(escapeHtml(part.content));
                return Object.keys(rules).length > 0 ? tag("span", rules, text) : text;
              })
              .join(""),
          )
          .join("<br>")
      : token.text
          .split("\n")
          .map((line) => preserveWhitespace(escapeHtml(line)))
          .join("<br>");
    return tag(
      "pre",
      {
        margin: `${flow}px 0 0`,
        padding: "12px 16px",
        background: colors.muted,
        "border-radius": radius,
        "overflow-x": "auto",
        "font-size": 14,
        "line-height": "1.5",
        "text-align": "left",
      },
      tag(
        "code",
        {
          display: "block",
          "font-family": fonts.mono,
          "font-size": 14,
          color: colors.foreground,
          background: "transparent",
          "white-space": "nowrap",
        },
        body,
      ),
    );
  }

  private list(token: Tokens.List, depth: number): string {
    const ordered = token.ordered;
    const marker = ordered
      ? "decimal"
      : (["disc", "circle", "square"][Math.min(depth, 2)] as string);
    const task = token.items.some((item) => item.task);
    const items = token.items
      .map((item) => {
        const prefix = item.task ? (item.checked ? "☑ " : "☐ ") : "";
        const content = item.tokens
          .map((child, index) => {
            if (child.type === "list")
              return withMarginTop(this.list(child as Tokens.List, depth + 1), "8px");
            const html = this.listBlock(child, token.loose);
            return index === 0 || !html ? html : withMarginTop(html, "8px");
          })
          .join("");
        return tag(
          "li",
          { margin: "8px 0 0", padding: task ? "0" : "0 0 0 6px" },
          prefix + content,
        );
      })
      .join("");
    const rules = {
      margin: `${flow}px 0 0`,
      padding: `0 0 0 ${task ? 4 : 24}px`,
      "list-style-type": task ? "none" : marker,
    };
    const start =
      ordered && token.start !== "" && token.start !== 1 ? ` start="${token.start}"` : "";
    const name = ordered ? "ol" : "ul";
    return `<${name}${start} style="${style(rules)}">${items}</${name}>`;
  }

  // 紧凑列表项里的文字不包 <p>，宽松列表项里的段落去掉上边距（由调用方补 8px）
  private listBlock(token: Token, loose: boolean): string {
    if (token.type === "text") {
      const text = token as Tokens.Text;
      return text.tokens ? this.inline(text.tokens) : escapeHtml(text.text);
    }
    if (token.type === "paragraph" && loose) {
      return withMarginTop(this.paragraph(token as Tokens.Paragraph), "0");
    }
    const html = this.block(token);
    return html ? withMarginTop(html, "0") : "";
  }

  private table(token: Tokens.Table): string {
    const align = (index: number) => token.align[index] ?? "left";
    const head = token.header
      .map((cell, index) =>
        tag(
          "th",
          {
            padding: index === 0 ? "10px 16px 10px 0" : "10px 16px",
            "text-align": align(index),
            "font-weight": "500",
            "white-space": "nowrap",
            border: "0",
          },
          this.inline(cell.tokens),
        ),
      )
      .join("");
    const rows = token.rows
      .map(
        (row) =>
          `<tr>${row
            .map((cell, index) =>
              tag(
                "td",
                {
                  padding: index === 0 ? "12px 16px 12px 0" : "12px 16px",
                  "text-align": align(index),
                  "vertical-align": "top",
                  border: "0",
                  "border-top": `1px solid ${colors.border}`,
                },
                this.inline(cell.tokens),
              ),
            )
            .join("")}</tr>`,
      )
      .join("");
    const table = tag(
      "table",
      {
        "border-collapse": "collapse",
        "border-bottom": `1px solid ${colors.border}`,
        "font-size": 16,
        "line-height": "1.5",
        margin: "0",
      },
      `<thead><tr>${head}</tr></thead><tbody>${rows}</tbody>`,
    );
    return tag("section", { margin: `${flow}px 0 0`, "overflow-x": "auto" }, table);
  }

  private inline(tokens: Token[]): string {
    return tokens.map((token) => this.inlineToken(token)).join("");
  }

  private inlineToken(token: Token): string {
    switch (token.type) {
      case "text": {
        const text = token as Tokens.Text;
        return text.tokens ? this.inline(text.tokens) : escapeHtml(text.text);
      }
      case "escape":
        return escapeHtml((token as Tokens.Escape).text);
      case "html":
        return escapeHtml((token as Tokens.Tag).text);
      case "strong":
        return tag(
          "strong",
          { "font-weight": "600" },
          this.inline((token as Tokens.Strong).tokens),
        );
      case "em":
        return tag("em", { "font-style": "italic" }, this.inline((token as Tokens.Em).tokens));
      case "del":
        return tag(
          "del",
          { color: colors.mutedForeground, "text-decoration": "line-through" },
          this.inline((token as Tokens.Del).tokens),
        );
      case "codespan":
        return tag(
          "code",
          {
            "font-family": fonts.mono,
            "font-size": "0.85em",
            color: this.accent,
            background: colors.muted,
            "border-radius": 6,
            padding: "0.125em 0.3em",
          },
          escapeHtml((token as Tokens.Codespan).text),
        );
      case "br":
        return "<br>";
      case "link":
        return this.link(token as Tokens.Link);
      case "image":
        return this.image(token as Tokens.Image);
      case "checkbox":
        return "";
      default:
        return "raw" in token ? escapeHtml(token.raw) : "";
    }
  }

  private link(token: Tokens.Link): string {
    const content = this.inline(token.tokens);
    const url = httpUrl(token.href);
    if (!url) return content;
    if (isWechatLink(url)) {
      return `<a href="${escapeHtml(url.href)}" style="${style({
        color: this.accent,
        "font-weight": "500",
        "text-decoration": "underline",
      })}">${content}</a>`;
    }
    // 同一网址只编一个号
    let index = this.footnotes.findIndex((note) => note.url === url.href);
    if (index === -1) {
      index = this.footnotes.push({ url: url.href, text: token.text }) - 1;
    }
    return (
      content +
      tag(
        "sup",
        { color: this.accent, "font-size": 12, "line-height": "0", "vertical-align": "super" },
        `[${index + 1}]`,
      )
    );
  }

  private renderFootnotes(): string {
    if (this.footnotes.length === 0) return "";
    const items = this.footnotes
      .map(({ url, text }, index) => {
        const label = text.trim() && text.trim() !== url ? `${escapeHtml(text.trim())}: ` : "";
        return tag(
          "p",
          { margin: index === 0 ? "0" : "4px 0 0", "word-break": "break-all" },
          tag("span", { color: this.accent }, `[${index + 1}]`) + ` ${label}${escapeHtml(url)}`,
        );
      })
      .join("");
    return tag(
      "section",
      {
        margin: `${flow * 2}px 0 0`,
        padding: `${flow}px 0 0`,
        "border-top": `1px solid ${colors.border}`,
        "font-size": 14,
        "line-height": "1.6",
        color: colors.mutedForeground,
      },
      items,
    );
  }
}

// 覆盖最外层元素的上边距（style 里第一处 margin 或 margin-top）
const withMarginTop = (html: string, top: string) =>
  html.replace(/^(<[a-z0-9]+[^>]*? style=")([^"]*)"/, (_, open: string, rules: string) => {
    const margin = /(^|;)margin:([^;]+)/.exec(rules);
    if (margin) {
      // 展开简写：上 右 下 左
      const [first = "0", right = first, bottom = first, left = right] = margin[2]!
        .trim()
        .split(/\s+/);
      const values = [top, right, bottom, left].join(" ");
      return `${open}${rules.replace(margin[0], `${margin[1]}margin:${values}`)}"`;
    }
    if (/(^|;)margin-top:/.test(rules)) {
      return `${open}${rules.replace(/(^|;)margin-top:[^;]+/, `$1margin-top:${top}`)}"`;
    }
    return `${open}margin-top:${top};${rules}"`;
  });

export const formatWechat = async (
  input: { markdown: string; accent: Accent },
  _ctx: ToolContext = {},
): Promise<{ html: string }> => {
  const tokens = lexer(input.markdown, { gfm: true });
  const highlight = await prepareHighlight(codeLanguages(tokens));
  return { html: new Renderer(accents[input.accent], highlight).render(tokens) };
};
