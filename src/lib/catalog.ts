// 站点目录：注册表 + 内容集合 + Review Status 汇总成页面列表（只在构建期 / 服务端使用）。
// 页面、sitemap、hreflang、llms.txt、⌘K 索引都从这里取数据，不扫描构建产物（ADR-0004）。
import { type CollectionEntry, getCollection } from "astro:content";

import { type CategoryId, categoryIds } from "@/categories/categories";
import { defaultLocale, type Locale, isLocale, localizePath, locales } from "@/lib/i18n/locales";
import { isIndexable, type Statuses } from "@/lib/seo/indexing";
import type { AnyTool } from "@/lib/tool-contract/define-tool";
import { tools } from "@/tools/registry";

type ToolEntry = CollectionEntry<"tools">;
type CategoryEntry = CollectionEntry<"categories">;

export interface ToolNode {
  kind: "tool";
  id: string;
  path: string;
  tool: AnyTool;
  entries: Partial<Record<Locale, ToolEntry>>;
  statuses: Statuses;
}

export interface CategoryNode {
  kind: "category";
  id: CategoryId;
  path: string;
  entries: Partial<Record<Locale, CategoryEntry>>;
  statuses: Statuses;
}

export interface Catalog {
  tools: ToolNode[];
  categories: CategoryNode[];
}

const splitId = (id: string): [string, Locale] => {
  const [owner, locale] = id.split("/");
  if (!owner || !isLocale(locale)) throw new Error(`内容文件 ${id} 的文件名必须是 Locale id`);
  return [owner, locale];
};

const group = <E extends { id: string; data: { review: "draft" | "reviewed" } }>(
  entries: E[],
  known: ReadonlySet<string>,
  kind: string,
) => {
  const byOwner = new Map<string, { entries: Partial<Record<Locale, E>>; statuses: Statuses }>();
  for (const entry of entries) {
    const [owner, locale] = splitId(entry.id);
    if (!known.has(owner)) throw new Error(`内容 ${entry.id} 没有对应的 ${kind}`);
    const node = byOwner.get(owner) ?? { entries: {}, statuses: {} };
    node.entries[locale] = entry;
    node.statuses[locale] = entry.data.review;
    byOwner.set(owner, node);
  }
  for (const owner of known) {
    if (!byOwner.get(owner)?.entries[defaultLocale]) {
      throw new Error(`${kind} ${owner} 缺少 en 内容（en 是内容事实源）`);
    }
  }
  return byOwner;
};

let cached: Promise<Catalog> | undefined;

export const getCatalog = (): Promise<Catalog> => {
  cached ??= (async () => {
    const toolContent = group(
      await getCollection("tools"),
      new Set(tools.map((tool) => tool.id)),
      "Tool",
    );
    const categoryContent = group(
      await getCollection("categories"),
      new Set(categoryIds),
      "Category",
    );
    return {
      tools: tools.map((tool) => ({
        kind: "tool" as const,
        id: tool.id,
        path: `/${tool.id}`,
        tool,
        ...toolContent.get(tool.id)!,
      })),
      categories: categoryIds.map((id) => ({
        kind: "category" as const,
        id,
        path: `/${id}`,
        ...categoryContent.get(id)!,
      })),
    };
  })();
  return cached;
};

// 某 Category 在某 Locale 下列出的 Tool：主 Category 或 alsoListedIn，且该 Locale 有内容
export const toolsInCategory = (catalog: Catalog, category: CategoryId, locale: Locale) =>
  catalog.tools.filter(
    (node) =>
      node.entries[locale] &&
      (node.tool.category === category || node.tool.alsoListedIn?.includes(category)),
  );

export const categoryOf = (catalog: Catalog, node: ToolNode): CategoryNode =>
  catalog.categories.find((category) => category.id === node.tool.category)!;

// 首页只由 UI 文案构成，没有 Review Status，视为各 Locale 都可索引
export const homeStatuses: Statuses = Object.fromEntries(
  locales.map((locale) => [locale, "reviewed"]),
);

export interface PageRef {
  path: string;
  locale: Locale;
  indexable: boolean;
  updated?: Date;
}

// 每个 Locale 下已发布的 Tool / Category 页面
export const publishedPages = (
  node: ToolNode | CategoryNode,
): (PageRef & { entry: ToolEntry | CategoryEntry })[] =>
  locales.flatMap((locale) => {
    const entry = node.entries[locale];
    if (!entry) return [];
    return [
      {
        path: localizePath(locale, node.path),
        locale,
        indexable: isIndexable(node.statuses, locale),
        updated: entry.data.updated,
        entry,
      },
    ];
  });
