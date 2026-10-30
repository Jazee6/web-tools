import type { AnyTool, ExampleFile } from "@/lib/tool-contract/define-tool";
import { describeFields } from "@/lib/tool-contract/fields";

// 契约测试共用：把实际输出转换成示例输出的形状再整体比较。
// 文件（含多文件字段里的每个文件）只保留 MIME 类型；示例写了 maxSize 时，体积不超过上限就记为上限本身，超过则保留实际体积，便于看出差异。
const fileShape = (file: Blob, expected: Partial<ExampleFile> = {}): ExampleFile => {
  const shape: ExampleFile = { type: file.type };
  if (expected.maxSize !== undefined) {
    shape.maxSize = file.size <= expected.maxSize ? expected.maxSize : file.size;
  }
  return shape;
};

export const toExampleShape = (
  output: Record<string, unknown>,
  expected: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(output).map(([key, value]) => {
      if (value instanceof Blob) return [key, fileShape(value, expected[key] as ExampleFile)];
      if (Array.isArray(value) && value.length > 0 && value.every((item) => item instanceof Blob)) {
        const expectedFiles = (expected[key] ?? []) as ExampleFile[];
        return [key, value.map((file, index) => fileShape(file, expectedFiles[index]))];
      }
      return [key, value];
    }),
  );

// 有文件字段的 Tool 不能注册 Agent Interface：WebMCP 与远程 MCP 的输入输出都只有 JSON
export const hasFileFields = (tool: AnyTool) =>
  [...describeFields(tool.input), ...describeFields(tool.output)].some(
    (field) => field.kind === "file" || field.kind === "files",
  );
