import type { AnyTool, ExampleFile } from "@/lib/tool-contract/define-tool";
import { describeFields } from "@/lib/tool-contract/fields";

// 契约测试共用：把实际输出转换成示例输出的形状再整体比较。
// 文件只保留 MIME 类型；示例写了 maxSize 时，体积不超过上限就记为上限本身，超过则保留实际体积，便于看出差异。
export const toExampleShape = (
  output: Record<string, unknown>,
  expected: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(output).map(([key, value]) => {
      if (!(value instanceof Blob)) return [key, value];
      const { maxSize } = (expected[key] ?? {}) as Partial<ExampleFile>;
      const shape: ExampleFile = { type: value.type };
      if (maxSize !== undefined) shape.maxSize = value.size <= maxSize ? maxSize : value.size;
      return [key, shape];
    }),
  );

// 有文件字段的 Tool 不能注册 Agent Interface：WebMCP 与远程 MCP 的输入输出都只有 JSON
export const hasFileFields = (tool: AnyTool) =>
  [...describeFields(tool.input), ...describeFields(tool.output)].some(
    (field) => field.kind === "file" || field.kind === "files",
  );
