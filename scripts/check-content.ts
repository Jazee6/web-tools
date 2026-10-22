/// <reference types="bun" />
// 内容校验（architecture §12）：骨架与契约对齐、内链有效、Zod 边界、各 Locale 覆盖率报告。
// frontmatter 的字段类型和长度由 src/content.config.ts 在构建时校验。

import { defaultLocale, type Locale, localizePath, locales } from "../src/lib/i18n/locales";
import type { AnyTool } from "../src/lib/tool-contract/define-tool";
import { describeFields } from "../src/lib/tool-contract/fields";
import {
  type ContentFile,
  categoryIds,
  loadTools,
  readCategoryContent,
  readToolContent,
} from "./lib/content";

const sameKeys = (actual: string[], expected: string[]) =>
  actual.length === expected.length && expected.every((key) => actual.includes(key));

export interface ContentInput {
  tools: AnyTool[];
  categories: readonly string[];
  toolContent: ContentFile[];
  categoryContent: ContentFile[];
}

export interface CoverageRow {
  locale: Locale;
  reviewed: number;
  draft: number;
  missing: number;
}

export const checkContent = ({ tools, categories, toolContent, categoryContent }: ContentInput) => {
  const errors: string[] = [];
  const all = [...toolContent, ...categoryContent];

  // 站内页面路径（按 Locale），用于校验正文里的内链
  const pages = new Set(
    all
      .map((file) => localizePath(file.locale, `/${file.owner}`))
      .concat(locales.map((locale) => localizePath(locale))),
  );

  for (const [kind, ids, files] of [
    ["Tool", tools.map((tool) => tool.id), toolContent],
    ["Category", categories, categoryContent],
  ] as const) {
    for (const id of ids) {
      if (!files.some((file) => file.owner === id && file.locale === defaultLocale)) {
        errors.push(`${kind} ${id} 缺少 en 内容`);
      }
    }
    for (const file of files) {
      if (!ids.includes(file.owner)) errors.push(`${file.path}：没有对应的 ${kind}`);
    }
  }

  for (const file of toolContent) {
    const tool = tools.find((candidate) => candidate.id === file.owner);
    if (!tool) continue;
    const fields = describeFields(tool.input);
    const labels = (file.data.fields ?? {}) as Record<string, { options?: Record<string, string> }>;
    if (
      !sameKeys(
        Object.keys(labels),
        fields.map((field) => field.name),
      )
    ) {
      errors.push(
        `${file.path}：fields 必须与 input 字段一一对应（${fields.map((f) => f.name).join(", ")}）`,
      );
    }
    for (const field of fields) {
      if (field.kind !== "select") continue;
      if (!sameKeys(Object.keys(labels[field.name]?.options ?? {}), field.options)) {
        errors.push(
          `${file.path}：fields.${field.name}.options 必须覆盖 ${field.options.join(", ")}`,
        );
      }
    }
    const outputFields = describeFields(tool.output);
    const outputs = outputFields.map((field) => field.name);
    const outputLabels = (file.data.output ?? {}) as Record<
      string,
      { columns?: Record<string, string> }
    >;
    if (!sameKeys(Object.keys(outputLabels), outputs)) {
      errors.push(`${file.path}：output 必须与 output 字段一一对应（${outputs.join(", ")}）`);
    }
    for (const field of outputFields) {
      if (field.kind !== "table") continue;
      if (!sameKeys(Object.keys(outputLabels[field.name]?.columns ?? {}), field.columns)) {
        errors.push(
          `${file.path}：output.${field.name}.columns 必须覆盖 ${field.columns.join(", ")}`,
        );
      }
    }
    // 骨架第 4 段：正文至少一个 H2（规格、限制与隐私说明）
    if (!/^## \S/m.test(file.body)) errors.push(`${file.path}：正文至少需要一个 "## " 小节`);
  }

  for (const file of all) {
    for (const [, href] of file.body.matchAll(/\]\((\/[^)\s#?]*)/g)) {
      const path = href!.replace(/\.md$/, "");
      if (!pages.has(path)) errors.push(`${file.path}：内链 ${href} 指向不存在的页面`);
    }
  }

  const coverage: CoverageRow[] = locales.map((locale) => {
    const row = { locale, reviewed: 0, draft: 0, missing: 0 };
    for (const [ids, files] of [
      [tools.map((tool) => tool.id), toolContent],
      [categories, categoryContent],
    ] as const) {
      for (const id of ids) {
        const file = files.find((entry) => entry.owner === id && entry.locale === locale);
        if (!file) row.missing++;
        else row[file.data.review]++;
      }
    }
    return row;
  });

  return { errors, coverage };
};

// Zod 只允许出现在 src/content.config.ts（ADR-0010）
export const zodImports = async (root = "src"): Promise<string[]> => {
  const offenders: string[] = [];
  for await (const path of new Bun.Glob(`${root}/**/*.{ts,tsx,astro,mts}`).scan(".")) {
    if (path === "src/content.config.ts" || path.startsWith("src/paraglide/")) continue;
    const text = await Bun.file(path).text();
    if (
      /from\s+["'](?:zod(?:\/[^"']*)?|astro\/zod|astro:schema)["']/.test(text) ||
      /import\s*\{[^}]*\bz\b[^}]*\}\s*from\s*["']astro:content["']/.test(text)
    ) {
      offenders.push(path);
    }
  }
  return offenders;
};

if (import.meta.main) {
  const { errors, coverage } = checkContent({
    tools: await loadTools(),
    categories: categoryIds,
    toolContent: await readToolContent(),
    categoryContent: await readCategoryContent(),
  });
  for (const path of await zodImports())
    errors.push(`${path}：Zod 只能在 src/content.config.ts 中使用`);

  console.log("Review Status 覆盖率（Tool + Category）：");
  console.table(coverage);
  for (const error of errors) console.error(`✗ ${error}`);
  if (errors.length > 0) process.exit(1);
  console.log("✓ check:content 通过");
}
