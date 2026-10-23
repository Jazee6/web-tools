// Variant 页的全部数据，在构建期从注册表和内容生成，可以 JSON 序列化（ADR-0004）：
// static 模式作为 props 传给 VariantPage.astro，on-demand 模式打包成 JSON 由 Worker 读取后渲染同一个组件，
// 两种模式的 HTML 因此一致。Markdown 副本也从它生成（variant-markdown.ts）。
// 这个模块读注册表和内容，只在构建期运行；SSR 路由只能引用它的类型。
import { toolStrings } from "@/components/pages/tool-island";
import type { ToolPresetProps, ToolStrings } from "@/components/tool/ToolIsland";
import { type Catalog, categoryOf, toolOf, type VariantNode } from "@/lib/catalog";
import { hreflang, type Locale, localizePath } from "@/lib/i18n/locales";
import { ogImagePath } from "@/lib/og";
import { type Alternate, alternates, isIndexable, markdownHref } from "@/lib/seo/indexing";
import { breadcrumbJsonLd, type Crumb, faqJsonLd, webApplicationJsonLd } from "@/lib/seo/json-ld";
import { fileTypesOf } from "@/lib/tool-contract/fields";
import { acceptOf } from "@/lib/tool-contract/file-type";
import { m } from "@/paraglide/messages";

export interface VariantPageData {
  toolId: string;
  // on-demand 模式下由 SSR 路由补上 COOP/COEP（static 模式由 _headers 负责）
  crossOriginIsolated: boolean;
  locale: Locale;
  path: string;
  head: {
    title: string;
    description: string;
    indexable: boolean;
    alternates: Alternate[];
    ogImage: string;
    markdown?: string;
    jsonLd: unknown[];
  };
  crumbs: Crumb[];
  name: string;
  answer: string;
  steps: string[];
  faq: { q: string; a: string }[];
  // 正文：HTML 页用渲染好的 HTML，Markdown 副本用原文
  html: string;
  markdown: string;
  // YYYY-MM-DD
  updated: string;
  // 独有数据表格，单元格已换成当前 Locale 的文字
  table: {
    caption: string;
    columns: string[];
    labels: Record<string, string>;
    rows: Record<string, string>[];
  };
  island: { strings: ToolStrings; variant: ToolPresetProps };
  // 文末链接：所属 Tool 在前，其后是该 Locale 已发布的兄弟 Variant
  // markdown 是 .md 副本里的链接目标（markdownHref）
  more: {
    heading: string;
    links: { name: string; path: string; markdown: string; summary: string }[];
  };
}

export const variantPageData = (
  catalog: Catalog,
  node: VariantNode,
  locale: Locale,
): VariantPageData => {
  const entry = node.entries[locale]!;
  const { data } = entry;
  const toolNode = toolOf(catalog, node);
  const toolEntry = toolNode.entries[locale]!;
  const category = categoryOf(catalog, toolNode).entries[locale];
  const path = localizePath(locale, node.path);
  const indexable = isIndexable(node.statuses, locale);
  const options = { locale };

  const crumbs: Crumb[] = [
    { name: m.nav_home({}, options), path: localizePath(locale) },
    ...(category
      ? [{ name: category.data.name, path: localizePath(locale, `/${toolNode.tool.category}`) }]
      : []),
    { name: toolEntry.data.name, path: localizePath(locale, toolNode.path) },
    { name: data.name, path },
  ];

  const { variant } = node;
  const accept = Object.fromEntries(
    Object.entries(variant.accept ?? {}).map(([field, types]) => {
      const known = fileTypesOf(toolNode.tool.input, field)!;
      return [
        field,
        acceptOf(Object.fromEntries((types as string[]).map((type) => [type, known[type]!]))),
      ];
    }),
  );

  const { columns, rows } = variant.table;
  const table = {
    caption: data.table.caption,
    columns: [...columns],
    labels: data.table.columns,
    rows: rows.map((row) =>
      Object.fromEntries(
        columns.map((column) => {
          const cell = row[column]!;
          return [column, typeof cell === "object" ? data.table.terms[cell.term]! : String(cell)];
        }),
      ),
    ),
  };

  const siblings = toolNode.variants.filter(
    (other) => other.id !== node.id && other.entries[locale],
  );

  return {
    toolId: toolNode.id,
    crossOriginIsolated: Boolean(toolNode.tool.runtime.crossOriginIsolated),
    locale,
    path,
    head: {
      title: data.title,
      description: data.description,
      indexable,
      alternates: alternates(node.statuses, locale, node.path),
      // Variant 复用所属 Tool 的 OG 图（architecture §9）
      ogImage: ogImagePath(locale, toolNode.id),
      markdown: indexable ? `${path}.md` : undefined,
      jsonLd: [
        webApplicationJsonLd({
          name: data.name,
          description: data.description,
          path,
          lang: hreflang[locale],
          updated: data.updated,
          featureList: Object.values(toolEntry.data.fields).map((field) => field.label),
        }),
        breadcrumbJsonLd(crumbs),
        faqJsonLd(data.faq),
      ],
    },
    crumbs,
    name: data.name,
    answer: data.answer,
    steps: data.steps,
    faq: data.faq,
    html: entry.rendered?.html ?? "",
    markdown: entry.body ?? "",
    updated: data.updated.toISOString().slice(0, 10),
    table,
    island: {
      strings: toolStrings(toolEntry.data),
      variant: { preset: { ...variant.preset }, accept },
    },
    more: {
      heading: m.variant_more({ name: toolEntry.data.name }, options),
      links: [toolNode, ...siblings].map((other) => {
        const otherData = other.entries[locale]!.data;
        return {
          name: otherData.name,
          path: localizePath(locale, other.path),
          markdown: markdownHref(other.statuses, locale, other.path),
          summary: otherData.answer,
        };
      }),
    },
  };
};
