import { renderHeaderRules } from "@/lib/runtime/isolation";

// 页面的静态 .md 副本（architecture §10）：与 HTML 同一骨架，供 AI 引用。
export interface MarkdownLink {
  name: string;
  // 链接目标：有 .md 副本时指向副本，否则指向 HTML 页面（markdownHref）
  path: string;
  summary?: string;
}

// Variant 的独有数据表格：表头和单元格都已是当前 Locale 的文字
export interface MarkdownTable {
  caption: string;
  header: string[];
  rows: string[][];
}

export interface ToolMarkdown {
  name: string;
  answer: string;
  url: string;
  updated: string;
  headings: { steps: string; faq: string; related: string; updated: string };
  steps: string[];
  // Variant 页在步骤之后、正文之前列出独有数据表格（与 HTML 同序）
  table?: MarkdownTable;
  body: string;
  faq: { q: string; a: string }[];
  // Tool 页列出自己的 Variant（在相关 Tool 之前，与 HTML 同序）
  variants?: { heading: string; links: MarkdownLink[] };
  related: MarkdownLink[];
}

const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");

export const renderMarkdownTable = (table: MarkdownTable): string =>
  [
    `## ${table.caption}`,
    "",
    `| ${table.header.map(cell).join(" | ")} |`,
    `| ${table.header.map(() => "---").join(" | ")} |`,
    ...table.rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
  ].join("\n");

const linkList = (links: MarkdownLink[]) =>
  links
    .map((link) => `- [${link.name}](${link.path})${link.summary ? `: ${link.summary}` : ""}`)
    .join("\n");

export const renderToolMarkdown = (page: ToolMarkdown): string =>
  [
    `# ${page.name}`,
    page.answer,
    `${page.url}\n\n${page.headings.updated}`,
    `## ${page.headings.steps}\n\n${page.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
    page.table ? renderMarkdownTable(page.table) : "",
    page.body.trim(),
    `## ${page.headings.faq}\n\n${page.faq.map(({ q, a }) => `### ${q}\n\n${a}`).join("\n\n")}`,
    page.variants && page.variants.links.length > 0
      ? `## ${page.variants.heading}\n\n${linkList(page.variants.links)}`
      : "",
    page.related.length > 0 ? `## ${page.headings.related}\n\n${linkList(page.related)}` : "",
  ]
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");

export const renderCategoryMarkdown = (page: {
  name: string;
  intro: string;
  url: string;
  body: string;
  toolsHeading: string;
  tools: MarkdownLink[];
}): string =>
  [
    `# ${page.name}`,
    page.intro,
    page.url,
    page.body.trim(),
    `## ${page.toolsHeading}\n\n${linkList(page.tools)}`,
  ]
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");

// llms.txt（https://llmstxt.org）：按 Category 列出可索引的 Tool
export const renderLlmsTxt = (site: {
  name: string;
  description: string;
  sections: { name: string; tools: MarkdownLink[] }[];
}): string =>
  [
    `# ${site.name}`,
    `> ${site.description}`,
    ...site.sections
      .filter((section) => section.tools.length > 0)
      .map((section) => `## ${section.name}\n\n${linkList(section.tools)}`),
  ]
    .join("\n\n")
    .concat("\n");

// .md 副本和 HTML 页面内容相同：用一条 splat 规则给所有副本加 canonical 指向 HTML 页面，
// 避免重复收录（ADR-0019）。:splat 会在 header 值里被替换，/zh/x.md → </zh/x>。
export const canonicalMarkdownRule = (siteUrl: string): string =>
  renderHeaderRules(["/*.md"], { Link: `<${siteUrl}/:splat>; rel="canonical"` });
