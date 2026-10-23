import { hreflang } from "@/lib/i18n/locales";
import type { FieldSpec } from "@/lib/tool-contract/fields";
import { getLocale } from "@/paraglide/runtime";

export interface SelectItem {
  value: string;
  label: string;
}

// 下拉选项的显示名：优先用内容 frontmatter 的标签。languageNames 的字段里没有标签的选项是语言代码，
// 名称由 Intl.DisplayNames 按当前 Locale 生成并按名称排序，有标签的选项（如 auto）排在前面。
export const selectItems = (
  spec: Extract<FieldSpec, { kind: "select" }>,
  labels: Record<string, string> = {},
): SelectItem[] => {
  const items = spec.options.map((value) => ({ value, label: labels[value] ?? value }));
  if (!spec.languageNames) return items;
  const locale = hreflang[getLocale()];
  const names = new Intl.DisplayNames([locale], { type: "language", fallback: "code" });
  const languages = items
    .filter((item) => !labels[item.value])
    .map((item) => ({ value: item.value, label: names.of(item.value) ?? item.value }))
    .toSorted((a, b) => a.label.localeCompare(b.label, locale));
  return [...items.filter((item) => labels[item.value]), ...languages];
};
