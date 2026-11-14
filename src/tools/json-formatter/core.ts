import { ToolError } from "@/lib/tool-contract/define-tool";

export interface FormatJsonInput {
  json: string;
  indent: "2" | "4" | "tab" | "minify";
  sortKeys: boolean;
}

const INDENT = { "2": 2, "4": 4, tab: "\t", minify: undefined } as const;

// Object.fromEntries 用 CreateDataProperty，"__proto__" 键会保留为普通属性而不是改原型
const sortDeep = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.keys(value)
      .toSorted()
      .map((key) => [key, sortDeep((value as Record<string, unknown>)[key])]),
  );
};

export const formatJson = ({ json, indent, sortKeys }: FormatJsonInput) => {
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch (error) {
    throw new ToolError("invalid_json", {
      field: "json",
      detail: error instanceof Error ? error.message : undefined,
    });
  }
  return { formatted: JSON.stringify(sortKeys ? sortDeep(value) : value, null, INDENT[indent]) };
};
