/// <reference types="bun" />
// 内容校验（architecture §12）：骨架与契约对齐、内链有效、Zod 边界、各 Locale 覆盖率报告。
// frontmatter 的字段类型和长度由 src/content.config.ts 在构建时校验。

import { defaultLocale, type Locale, localizePath, locales } from "../src/lib/i18n/locales";
import { isIndexable } from "../src/lib/seo/indexing";
import {
  type PageContent,
  variantContentErrors,
  variantKey,
} from "../src/lib/seo/variant-admission";
import type { AnyTool } from "../src/lib/tool-contract/define-tool";
import type { AnyVariant } from "../src/lib/tool-contract/define-variant";
import { describeFields } from "../src/lib/tool-contract/fields";
import {
  type ContentFile,
  categoryIds,
  loadTools,
  loadVariants,
  readCategoryContent,
  readToolContent,
  readVariantContent,
  statusesByOwner,
} from "./lib/content";

const sameKeys = (actual: string[], expected: string[]) =>
  actual.length === expected.length && expected.every((key) => actual.includes(key));

// 合法的 BCP 47 语言标签；"auto" 这类四个字母的子标签不合法
const isLanguageCode = (code: string) => {
  try {
    Intl.getCanonicalLocales(code);
    return true;
  } catch {
    return false;
  }
};

export interface ContentInput {
  tools: AnyTool[];
  categories: readonly string[];
  toolContent: ContentFile[];
  categoryContent: ContentFile[];
  variants?: AnyVariant[];
  variantContent?: ContentFile[];
}

// 按 owner、Locale 整理成准入检查用的 PageContent
const pageContents = (files: ContentFile[]) => {
  const map = new Map<string, Partial<Record<Locale, PageContent>>>();
  for (const file of files) {
    const pages = map.get(file.owner) ?? {};
    // 字段类型由 content.config.ts 在构建时校验，这里缺失的按空值处理
    const data = file.data as Partial<PageContent>;
    pages[file.locale] = {
      name: data.name ?? "",
      answer: data.answer ?? "",
      steps: data.steps ?? [],
      faq: data.faq ?? [],
      body: file.body,
    };
    map.set(file.owner, pages);
  }
  return map;
};

// 表格里用到的词语类单元格（{ term }）
const termsOf = (variant: AnyVariant) => [
  ...new Set(
    variant.table.rows.flatMap((row) =>
      Object.values(row).flatMap((cell) => (typeof cell === "object" ? [cell.term] : [])),
    ),
  ),
];

export interface CoverageRow {
  locale: Locale;
  reviewed: number;
  draft: number;
  missing: number;
}

export const checkContent = ({
  tools,
  categories,
  toolContent,
  categoryContent,
  variants = [],
  variantContent = [],
}: ContentInput) => {
  const errors: string[] = [];
  const all = [...toolContent, ...variantContent, ...categoryContent];

  // 站内页面路径（按 Locale），用于校验正文里的内链
  const pages = new Set(
    all
      .map((file) => localizePath(file.locale, `/${file.owner}`))
      .concat(locales.map((locale) => localizePath(locale))),
  );

  const variantIds = variants.map(variantKey);
  for (const [kind, ids, files] of [
    ["Tool", tools.map((tool) => tool.id), toolContent],
    ["Variant", variantIds, variantContent],
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
      const optionLabels = Object.keys(labels[field.name]?.options ?? {});
      // 语言代码选项的名称由 Intl.DisplayNames 生成，只有不是语言代码的选项（如 auto）需要标签
      if (field.languageNames) {
        const unlabeled = field.options.filter(
          (option) => !optionLabels.includes(option) && !isLanguageCode(option),
        );
        if (unlabeled.length > 0 || optionLabels.some((key) => !field.options.includes(key))) {
          errors.push(
            `${file.path}：fields.${field.name}.options 必须恰好覆盖不是语言代码的选项（缺少 ${unlabeled.join(", ")}）`,
          );
        }
        continue;
      }
      if (!sameKeys(optionLabels, field.options)) {
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

  // Variant：准入门槛 4–5（与构建期 lib/catalog.ts 相同），表格文案与 variant.ts 对齐
  errors.push(
    ...variantContentErrors({
      variants,
      tools: pageContents(toolContent),
      pages: pageContents(variantContent),
    }).filter((error) => !error.includes("缺少 en 内容")),
  );
  for (const file of variantContent) {
    const variant = variants.find((candidate) => variantKey(candidate) === file.owner);
    if (!variant) continue;
    const table = (file.data.table ?? {}) as {
      columns?: Record<string, string>;
      terms?: Record<string, string>;
    };
    if (!sameKeys(Object.keys(table.columns ?? {}), [...variant.table.columns])) {
      errors.push(
        `${file.path}：table.columns 必须与 variant.ts 的列一一对应（${variant.table.columns.join(", ")}）`,
      );
    }
    const terms = termsOf(variant);
    if (!sameKeys(Object.keys(table.terms ?? {}), terms)) {
      errors.push(`${file.path}：table.terms 必须恰好覆盖表格用到的 ${terms.join(", ")}`);
    }
    if (!/^## \S/m.test(file.body)) errors.push(`${file.path}：正文至少需要一个 "## " 小节`);
  }

  // 只有可索引页面有 .md 副本（ADR-0019）
  const statuses = statusesByOwner(all);
  const markdownPages = new Set(
    [...statuses].flatMap(([owner, byLocale]) =>
      locales
        .filter((locale) => isIndexable(byLocale, locale))
        .map((locale) => `${localizePath(locale, `/${owner}`)}.md`),
    ),
  );

  for (const file of all) {
    for (const [, href] of file.body.matchAll(/\]\((\/[^)\s#?]*)/g)) {
      if (href!.endsWith(".md")) {
        if (!markdownPages.has(href!)) {
          errors.push(`${file.path}：内链 ${href} 指向的页面不可索引，没有 .md 副本`);
        }
      } else if (!pages.has(href!)) {
        errors.push(`${file.path}：内链 ${href} 指向不存在的页面`);
      }
    }
  }

  const coverage: CoverageRow[] = locales.map((locale) => {
    const row = { locale, reviewed: 0, draft: 0, missing: 0 };
    for (const [ids, files] of [
      [tools.map((tool) => tool.id), toolContent],
      [variantIds, variantContent],
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
  const tools = await loadTools();
  const { errors, coverage } = checkContent({
    tools,
    categories: categoryIds,
    toolContent: await readToolContent(),
    categoryContent: await readCategoryContent(),
    variants: await loadVariants(tools),
    variantContent: await readVariantContent(),
  });
  for (const path of await zodImports())
    errors.push(`${path}：Zod 只能在 src/content.config.ts 中使用`);

  console.log("Review Status 覆盖率（Tool + Variant + Category）：");
  console.table(coverage);
  for (const error of errors) console.error(`✗ ${error}`);
  if (errors.length > 0) process.exit(1);
  console.log("✓ check:content 通过");
}
