/// <reference types="bun" />
// Bun 脚本读取内容文件（frontmatter + 正文）。Astro 页面走 content collections，
// 两边读同一批文件，Review Status 规则都由 src/lib/seo/indexing.ts 判定。

import { categoryIds } from "../../src/categories/categories";
import { isLocale, type Locale } from "../../src/lib/i18n/locales";
import type { ReviewStatus, Statuses } from "../../src/lib/seo/indexing";
import type { AnyTool } from "../../src/lib/tool-contract/define-tool";
import type { AnyVariant } from "../../src/lib/tool-contract/define-variant";
import { createRegistry } from "../../src/lib/tool-contract/registry";
import { createVariantRegistry } from "../../src/lib/tool-contract/variant-registry";

export interface ContentFile {
  path: string;
  owner: string;
  locale: Locale;
  data: Record<string, unknown> & { review: ReviewStatus; name: string };
  body: string;
}

export const parseContent = (path: string, text: string): Omit<ContentFile, "owner" | "locale"> => {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error(`${path} 缺少 frontmatter`);
  return { path, data: Bun.YAML.parse(match[1]!) as ContentFile["data"], body: match[2]! };
};

const readAll = async (pattern: string, ownerOf: (parts: string[]) => string) => {
  const files: ContentFile[] = [];
  for await (const path of new Bun.Glob(pattern).scan(".")) {
    const parts = path.split("/");
    const locale = parts.at(-1)!.replace(/\.md$/, "");
    if (!isLocale(locale)) throw new Error(`${path} 的文件名必须是 Locale id`);
    files.push({
      ...parseContent(path, await Bun.file(path).text()),
      owner: ownerOf(parts),
      locale,
    });
  }
  return files.toSorted((a, b) => a.path.localeCompare(b.path));
};

export const readToolContent = () => readAll("src/tools/*/content/*.md", (parts) => parts[2]!);
// Variant 的 owner 是 "<tool>/<variant>"，与 Variant 的 URL 路径一致
export const readVariantContent = () =>
  readAll("src/tools/*/variants/*/*.md", (parts) => `${parts[2]}/${parts[4]}`);
export const readCategoryContent = () => readAll("src/categories/*/*.md", (parts) => parts[2]!);

export const loadTools = async (): Promise<AnyTool[]> => {
  const modules: Record<string, { default: AnyTool }> = {};
  for await (const path of new Bun.Glob("src/tools/*/tool.ts").scan(".")) {
    modules[path] = await import(`${process.cwd()}/${path}`);
  }
  return createRegistry(modules);
};

export const loadVariants = async (tools: readonly AnyTool[]): Promise<AnyVariant[]> => {
  const modules: Record<string, { default: AnyVariant }> = {};
  for await (const path of new Bun.Glob("src/tools/*/variants/*/variant.ts").scan(".")) {
    modules[path] = await import(`${process.cwd()}/${path}`);
  }
  return createVariantRegistry(tools, modules);
};

export const statusesByOwner = (files: ContentFile[]): Map<string, Statuses> => {
  const map = new Map<string, Statuses>();
  for (const file of files) {
    const statuses = map.get(file.owner) ?? {};
    statuses[file.locale] = file.data.review;
    map.set(file.owner, statuses);
  }
  return map;
};

export { categoryIds };
