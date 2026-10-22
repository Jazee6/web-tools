import type * as v from "valibot";

import type { CategoryId } from "@/categories/categories";

// Tool 的输入输出都是对象 schema：字段即表单项、JSON Schema 的 properties。
export type ToolSchema = v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>;

export type Capability = "wasm" | "webgpu" | "webcodecs" | "opfs";

// 表单派生用的字段提示，写在 schema 的 v.metadata() 中；派生 JSON Schema 时会被忽略。
export type FieldMetadata = {
  widget?: "code";
};

// 环境能力只能经 ctx 注入，core.ts 不能直接依赖 DOM / UI（ADR-0003）。
export interface ToolContext {
  signal?: AbortSignal;
  onProgress?: (ratio: number) => void;
}

// core 抛出的可预期错误：code 对应内容 frontmatter 里 errors 的文案键，
// field 指明由哪个输入字段引起（表单在该字段下行内显示），detail 是附加的原始信息。
export class ToolError extends Error {
  readonly code: string;
  readonly field?: string;
  readonly detail?: string;

  constructor(code: string, options: { field?: string; detail?: string } = {}) {
    super(options.detail ? `${code}: ${options.detail}` : code);
    this.name = "ToolError";
    this.code = code;
    this.field = options.field;
    this.detail = options.detail;
  }
}

export type ToolRun<TIn extends ToolSchema, TOut extends ToolSchema> = (
  input: v.InferOutput<TIn>,
  ctx: ToolContext,
) => v.InferOutput<TOut> | Promise<v.InferOutput<TOut>>;

export interface ToolExample<TIn extends ToolSchema, TOut extends ToolSchema> {
  // 省略的字段取 schema 默认值
  input: Partial<v.InferInput<TIn>>;
  output: v.InferOutput<TOut>;
}

export interface ToolDefinition<
  TIn extends ToolSchema = ToolSchema,
  TOut extends ToolSchema = ToolSchema,
> {
  // 即英文 slug，全站唯一且永久，与 Category id、Locale 代码共用顶层命名空间（ADR-0013）
  id: string;
  category: CategoryId;
  alsoListedIn?: readonly CategoryId[];
  // 默认值写在 schema 里（v.optional(schema, default)），表单和 JSON Schema 都从这里取
  input: TIn;
  output: TOut;
  examples: readonly [ToolExample<TIn, TOut>, ...ToolExample<TIn, TOut>[]];
  runtime: {
    where: "client" | "server";
    worker?: boolean;
    crossOriginIsolated?: boolean;
    requires?: readonly Capability[];
  };
  agent: { webmcp: boolean; remote: boolean };
  run: () => Promise<ToolRun<TIn, TOut>>;
}

// oxlint-disable-next-line typescript/no-explicit-any -- 注册表需要容纳任意 schema 的 Tool
export type AnyTool = ToolDefinition<any, any>;

export const defineTool = <TIn extends ToolSchema, TOut extends ToolSchema>(
  definition: ToolDefinition<TIn, TOut>,
): ToolDefinition<TIn, TOut> => definition;
