import type * as v from "valibot";

import type { CategoryId } from "@/categories/categories";

// Tool 的输入输出都是对象 schema：字段即表单项、JSON Schema 的 properties。
export type ToolSchema = v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>;

export type Capability = "wasm" | "webgpu" | "webcodecs" | "opfs";

// 表单派生用的字段提示，写在 schema 的 v.metadata() 中；派生 JSON Schema 时会被忽略。
export type FieldMetadata = {
  // code：等宽多行；url：单行网址输入；默认是普通多行文本
  widget?: "code" | "url";
};

// 环境能力只能经 ctx 注入，core.ts 不能直接依赖 DOM / UI（ADR-0003）。
// fetch 只注入给 Server-assisted Tool：服务端传入带 SSRF 防护的 safeFetch，测试传入假实现。
export interface ToolContext {
  signal?: AbortSignal;
  onProgress?: (ratio: number) => void;
  fetch?: (url: URL, init?: RequestInit) => Promise<Response>;
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

// 示例输出里的文件只比较 MIME 类型和体积上限：编码产物的字节会随编码器版本变化
export interface ExampleFile {
  type: string;
  maxSize?: number;
}

export type ExampleOutput<T> = { [K in keyof T]: T[K] extends Blob ? ExampleFile : T[K] };

export interface ToolExample<TIn extends ToolSchema, TOut extends ToolSchema> {
  // 省略的字段取 schema 默认值；文件字段不写在这里，改用 files
  input: Partial<v.InferInput<TIn>>;
  // 文件字段 → 同目录 examples/ 下的样例文件名；多文件字段按顺序列出
  files?: Record<string, string | readonly string[]>;
  output: ExampleOutput<v.InferOutput<TOut>>;
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
    // 在 Dedicated Web Worker 里运行：同目录 engine.worker.ts 用 exposeRun 暴露 core
    worker?: boolean;
    crossOriginIsolated?: boolean;
    requires?: readonly Capability[];
  };
  agent: {
    webmcp: boolean;
    remote: boolean;
    // Agent Interface 的英文说明（WebMCP / 远程 MCP 的 description），和字段的 v.description() 一样写在契约里；
    // 页面文案在内容 frontmatter，按 Locale 翻译。说明 Tool 做什么、返回什么、有哪些错误码。
    description: string;
  };
  // 按需加载 core。Worker Tool 不写 run：它的 core 只由 engine.worker.ts 引用，
  // 不进主线程和服务端的模块图（编码器、WASM 不会被重复打包）
  run?: () => Promise<ToolRun<TIn, TOut>>;
}

// oxlint-disable-next-line typescript/no-explicit-any -- 注册表需要容纳任意 schema 的 Tool
export type AnyTool = ToolDefinition<any, any>;

export const loadRun = (tool: AnyTool): ReturnType<NonNullable<AnyTool["run"]>> => {
  if (!tool.run) throw new Error(`Tool ${tool.id} 在 Web Worker 里运行，没有 run`);
  return tool.run();
};

export const defineTool = <TIn extends ToolSchema, TOut extends ToolSchema>(
  definition: ToolDefinition<TIn, TOut>,
): ToolDefinition<TIn, TOut> => definition;
