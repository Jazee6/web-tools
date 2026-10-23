import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

// 唯一允许使用 Zod 的文件（ADR-0010），check:content 会拦截其他地方的 zod 引用。
// id = "<tool 或 category id>/<locale>"（Variant 见下方）
const contentId = ({ entry }: { entry: string }) =>
  entry.replace(/(?:\/content)?\/([^/]+)\.md$/, "/$1");

const common = {
  review: z.enum(["draft", "reviewed"]),
  // 内容实际更新日期：页面"最后更新"、sitemap lastmod
  updated: z.coerce.date(),
  // <title> 与 meta description
  title: z.string().min(10).max(70),
  description: z.string().min(50).max(170),
  // H1、面包屑、卡片、⌘K、OG 图上的名称
  name: z.string().min(2).max(60),
};

// "答案优先"骨架里 Tool 与 Variant 共用的部分
const skeleton = {
  answer: z.string().min(30).max(300),
  steps: z.array(z.string().min(1)).min(2),
  faq: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).min(3),
};

const label = z.object({ label: z.string().min(1), placeholder: z.string().optional() });

const tools = defineCollection({
  loader: glob({ base: "./src/tools", pattern: "*/content/*.md", generateId: contentId }),
  // 固定"答案优先"骨架（architecture §10）：H1 + answer → 工具 → steps → 正文（规格、限制、隐私）→ faq → 相关 Tool
  schema: z.object({
    ...common,
    ...skeleton,
    action: z.string().min(1),
    fields: z.record(
      z.string(),
      label.extend({ options: z.record(z.string(), z.string()).optional() }),
    ),
    // 表格输出（对象数组）的列标题写在 columns
    output: z.record(
      z.string(),
      label.extend({ columns: z.record(z.string(), z.string()).optional() }),
    ),
    errors: z.record(z.string(), z.string()).default({}),
  }),
});

// Tool Variant 的内容：src/tools/<tool>/variants/<variant>/{locale}.md，id = "<tool>/<variant>/<locale>"。
// 表单文案（字段、按钮、错误）沿用同一 Locale 的 Tool 内容；独有数据表格的行在 variant.ts，
// 这里只写表格标题、列标题和词语类单元格（{ term }）的文案。
const variants = defineCollection({
  loader: glob({
    base: "./src/tools",
    pattern: "*/variants/*/*.md",
    generateId: ({ entry }) => entry.replace(/\/variants\/([^/]+)\/([^/]+)\.md$/, "/$1/$2"),
  }),
  schema: z.object({
    ...common,
    ...skeleton,
    table: z.object({
      caption: z.string().min(1),
      columns: z.record(z.string(), z.string().min(1)),
      terms: z.record(z.string(), z.string().min(1)).default({}),
    }),
  }),
});

const categories = defineCollection({
  loader: glob({ base: "./src/categories", pattern: "*/*.md", generateId: contentId }),
  schema: z.object({
    ...common,
    intro: z.string().min(30).max(300),
  }),
});

export const collections = { tools, variants, categories };
