import type * as v from "valibot";

import type { ToolDefinition, ToolSchema } from "./define-tool";

// 搜索需求依据的来源（architecture §11 门槛 3）。只写真实查到的数据，查不到的字段不填。
export type DemandSource = "google-autocomplete" | "google-search-console" | "keyword-planner";

export interface VariantDemand {
  // 查询词（英文）
  query: string;
  source: DemandSource;
  // 查询日期 YYYY-MM-DD
  checkedAt: string;
  // 月搜索量；只有 keyword-planner、search-console 这类给出数字的来源才填
  volume?: number;
}

// 独有数据表格的单元格：数字或原样显示的字符串（codec 名、版本号这类各 Locale 一样的事实），
// 词语类取值写成 { term }，文案在各 Locale frontmatter 的 table.terms 里（与 fields 的 options 同理）
export type VariantCell = string | number | { term: string };

// 语言无关的结构化数据（门槛 2）：列的顺序即显示顺序，列标题在 frontmatter 的 table.columns
export interface VariantTable {
  columns: readonly [string, ...string[]];
  rows: readonly [Record<string, VariantCell>, ...Record<string, VariantCell>[]];
}

export interface VariantDefinition<TIn extends ToolSchema = ToolSchema> {
  // 即 URL 的第二段 /{tool}/{variant}，同一 Tool 内唯一且永久，等于目录名
  id: string;
  // 所属 Tool 的 id，等于上级目录名
  tool: string;
  // 预设的输入值（门槛 1）：只能是非文件字段，必须满足 v.partial(tool.input)
  preset: Partial<v.InferInput<TIn>>;
  // 把文件字段收窄到 Tool fileType 表里的部分 MIME 类型（"A 转 B"的来源格式）。
  // 只影响文件选择器的 accept 和页面内容，校验仍接受 Tool 支持的全部类型（2026-10-23 确认）
  accept?: Partial<Record<keyof v.InferInput<TIn> & string, readonly string[]>>;
  table: VariantTable;
  demand: VariantDemand;
}

// oxlint-disable-next-line typescript/no-explicit-any -- 注册表需要容纳任意 schema 的 Variant
export type AnyVariant = VariantDefinition<any>;

// variant.ts 写 defineVariant(tool, {...})：用 Tool 的 input 约束 preset 和 accept 的字段名
export const defineVariant = <TIn extends ToolSchema, TOut extends ToolSchema>(
  tool: ToolDefinition<TIn, TOut>,
  definition: Omit<VariantDefinition<TIn>, "tool">,
): VariantDefinition<TIn> => ({ ...definition, tool: tool.id });
