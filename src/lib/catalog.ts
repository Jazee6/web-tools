// 站点目录：注册表 + 内容集合 + Review Status 汇总成页面列表（只在构建期 / 服务端使用）。
// 页面、sitemap、hreflang、llms.txt、⌘K 索引都从这里取数据，不扫描构建产物（ADR-0004）。
import { type CollectionEntry, getCollection } from "astro:content";

import { type CategoryId, categoryIds } from "@/categories/categories";
import { defaultLocale, type Locale, isLocale, localizePath, locales } from "@/lib/i18n/locales";
import { isIndexable, type Statuses } from "@/lib/seo/indexing";
import { type PageContent, variantContentErrors, variantKey } from "@/lib/seo/variant-admission";
import type { AnyTool } from "@/lib/tool-contract/define-tool";
import type { AnyVariant } from "@/lib/tool-contract/define-variant";
import { tools, variants } from "@/tools/registry";

type ToolEntry = CollectionEntry<"tools">;
type VariantEntry = CollectionEntry<"variants">;
type CategoryEntry = CollectionEntry<"categories">;

export interface ToolNode {
  kind: "tool";
  id: string;
  path: string;
  tool: AnyTool;
  entries: Partial<Record<Locale, ToolEntry>>;
  statuses: Statuses;
  variants: VariantNode[];
}

export interface VariantNode {
  kind: "variant";
  // "<tool>/<variant>"
  id: string;
  path: string;
  variant: AnyVariant;
  entries: Partial<Record<Locale, VariantEntry>>;
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
  variants: VariantNode[];
  categories: CategoryNode[];
}

// 内容 id 的最后一段是 Locale，前面是所属页面（Tool / Category id，Variant 是 "<tool>/<variant>"）
const splitId = (id: string): [string, Locale] => {
  const slash = id.lastIndexOf("/");
  const [owner, locale] = [id.slice(0, slash), id.slice(slash + 1)];
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

// 准入检查用的页面内容（Tool / Variant 按 owner、Locale 整理）
const contentOf = <E extends { data: Omit<PageContent, "body">; body?: string }>(
  grouped: Map<string, { entries: Partial<Record<Locale, E>> }>,
): Map<string, Partial<Record<Locale, PageContent>>> =>
  new Map(
    [...grouped].map(([owner, node]) => [
      owner,
      Object.fromEntries(
        Object.entries(node.entries).map(([locale, entry]) => [
          locale,
          { ...entry!.data, body: entry!.body ?? "" },
        ]),
      ),
    ]),
  );

let cached: Promise<Catalog> | undefined;

export const getCatalog = (): Promise<Catalog> => {
  cached ??= (async () => {
    const toolContent = group(
      await getCollection("tools"),
      new Set(tools.map((tool) => tool.id)),
      "Tool",
    );
    const variantContent = group(
      await getCollection("variants"),
      new Set(variants.map(variantKey)),
      "Variant",
    );
    const categoryContent = group(
      await getCollection("categories"),
      new Set(categoryIds),
      "Category",
    );

    // 准入门槛 4–5：Variant 的 Locale 有对应的 Tool 内容、与兄弟页面的近似度低于阈值
    const admission = variantContentErrors({
      variants,
      tools: contentOf(toolContent),
      pages: contentOf(variantContent),
    });
    if (admission.length > 0) throw new Error(`Variant 准入失败：\n${admission.join("\n")}`);

    const variantNodes = variants.map((variant) => ({
      kind: "variant" as const,
      id: variantKey(variant),
      path: `/${variantKey(variant)}`,
      variant,
      ...variantContent.get(variantKey(variant))!,
    }));
    return {
      tools: tools.map((tool) => ({
        kind: "tool" as const,
        id: tool.id,
        path: `/${tool.id}`,
        tool,
        ...toolContent.get(tool.id)!,
        variants: variantNodes.filter((node) => node.variant.tool === tool.id),
      })),
      variants: variantNodes,
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

export const toolOf = (catalog: Catalog, node: VariantNode): ToolNode =>
  catalog.tools.find((tool) => tool.id === node.variant.tool)!;

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

// 每个 Locale 下已发布的 Tool / Variant / Category 页面
export const publishedPages = <N extends ToolNode | VariantNode | CategoryNode>(
  node: N,
): (PageRef & { entry: NonNullable<N["entries"][Locale]> })[] =>
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
