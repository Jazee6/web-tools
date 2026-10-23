// Variant 准入门槛中依赖内容的部分（architecture §11 门槛 4–5）；门槛 1–3 在 variant-registry.ts。
// Astro 构建（lib/catalog.ts）和 check:content 都调用这里，任一条不满足构建就失败（ADR-0005）。
import { defaultLocale, type Locale } from "@/lib/i18n/locales";
import type { AnyVariant } from "@/lib/tool-contract/define-variant";

import { jaccard, shingles } from "./similarity";

// 同一 Tool 下两个页面（Variant 之间、Variant 与 Tool 页）的近似度上限（3 词 shingle 的 Jaccard）。
// 2026-10-23 用 Video Converter 的样板实测（en）：三个 Variant 之间、与 Tool 页之间都在 0.03–0.06，
// 把 mkv-to-mp4 的格式名换成 MOV 的薄内容 Variant 是 0.87。取 0.3，两边都留出余量。
export const SIMILARITY_THRESHOLD = 0.3;

// 参与比较的文本：页面上由内容决定的全部文字（名称、答案、步骤、正文、FAQ）
export interface PageContent {
  name: string;
  answer: string;
  steps: readonly string[];
  faq: readonly { q: string; a: string }[];
  body: string;
}

export const pageText = (page: PageContent): string =>
  [
    page.name,
    page.answer,
    ...page.steps,
    page.body,
    ...page.faq.flatMap(({ q, a }) => [q, a]),
  ].join("\n");

export interface AdmissionInput {
  variants: readonly AnyVariant[];
  // Tool id → 各 Locale 的内容；Variant 的 key 是 "<tool>/<variant>"
  tools: ReadonlyMap<string, Partial<Record<Locale, PageContent>>>;
  pages: ReadonlyMap<string, Partial<Record<Locale, PageContent>>>;
  threshold?: number;
}

export const variantKey = (variant: AnyVariant): string => `${variant.tool}/${variant.id}`;

export const variantContentErrors = ({
  variants,
  tools,
  pages,
  threshold = SIMILARITY_THRESHOLD,
}: AdmissionInput): string[] => {
  const errors: string[] = [];

  for (const variant of variants) {
    const key = variantKey(variant);
    const content = pages.get(key) ?? {};
    if (!content[defaultLocale]) errors.push(`Variant ${key} 缺少 en 内容（en 是内容事实源）`);
    // Variant 页的表单文案（字段、按钮、错误）来自同一 Locale 的 Tool 内容
    for (const locale of Object.keys(content) as Locale[]) {
      if (!tools.get(variant.tool)?.[locale]) {
        errors.push(`Variant ${key} 有 ${locale} 内容，但 Tool ${variant.tool} 没有`);
      }
    }
  }

  // 同一 Tool、同一 Locale 下：每个 Variant 与 Tool 页和其他 Variant 比较
  for (const [toolId, toolContent] of tools) {
    const siblings = variants.filter((variant) => variant.tool === toolId);
    if (siblings.length === 0) continue;
    for (const locale of Object.keys(toolContent) as Locale[]) {
      const group = [
        { key: `Tool ${toolId}`, content: toolContent[locale], variant: false },
        ...siblings.map((variant) => ({
          key: `Variant ${variantKey(variant)}`,
          content: pages.get(variantKey(variant))?.[locale],
          variant: true,
        })),
      ].flatMap(({ content, ...rest }) =>
        content ? [{ ...rest, shingles: shingles(pageText(content)) }] : [],
      );
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const [a, b] = [group[i]!, group[j]!];
          if (!a.variant && !b.variant) continue;
          const score = jaccard(a.shingles, b.shingles);
          if (score > threshold) {
            errors.push(
              `${b.key}（${locale}）与 ${a.key} 的内容近似度 ${score.toFixed(2)} 超过阈值 ${threshold}，视为薄内容`,
            );
          }
        }
      }
    }
  }

  return errors;
};
