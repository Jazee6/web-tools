import * as v from "valibot";

import type { FieldMetadata, ToolSchema } from "./define-tool";

// 表单派生只支持轻量 Tool 用到的基本类型；遇到其他类型直接报错，避免静默渲染成错误控件。
// table 是对象数组（每列是字符串或数字），只用于输出；file 是 v.file()，accept 取自 v.mimeType()。
export type FieldSpec =
  | { name: string; kind: "text" | "code" | "url" }
  | { name: string; kind: "number" }
  | { name: string; kind: "boolean" }
  | { name: string; kind: "select"; options: string[] }
  | { name: string; kind: "table"; columns: string[] }
  | { name: string; kind: "file"; accept: string[] };

type AnySchema = v.GenericSchema & {
  wrapped?: AnySchema;
  item?: AnySchema;
  entries?: Record<string, AnySchema>;
  options?: readonly string[];
  pipe?: readonly { kind: string; type: string; requirement?: unknown }[];
};

const isScalar = (schema: AnySchema) => schema.type === "string" || schema.type === "number";

const unwrap = (schema: AnySchema): AnySchema =>
  schema.type === "optional" || schema.type === "nullish" ? unwrap(schema.wrapped!) : schema;

export const describeFields = (schema: ToolSchema): FieldSpec[] =>
  Object.entries(schema.entries).map(([name, entry]) => {
    const base = unwrap(entry as AnySchema);
    switch (base.type) {
      case "string": {
        const metadata = v.getMetadata(base) as FieldMetadata;
        return { name, kind: metadata.widget ?? "text" };
      }
      case "number":
        return { name, kind: "number" };
      case "boolean":
        return { name, kind: "boolean" };
      case "file": {
        const mimeType = base.pipe?.find((action) => action.type === "mime_type");
        return { name, kind: "file", accept: [...((mimeType?.requirement as string[]) ?? [])] };
      }
      case "picklist":
        return { name, kind: "select", options: [...base.options!] };
      case "array": {
        const item = base.item!;
        const columns = item.type === "object" ? Object.entries(item.entries!) : [];
        if (columns.length > 0 && columns.every(([, column]) => isScalar(unwrap(column)))) {
          return { name, kind: "table", columns: columns.map(([column]) => column) };
        }
        throw new Error(`字段 ${name} 的数组元素必须是字符串 / 数字列组成的对象`);
      }
      default:
        throw new Error(`字段 ${name} 的类型 ${base.type} 不支持表单派生`);
    }
  });

// 表单初始值：schema 默认值，没有默认值的字段按类型给空值（文件为 undefined）
export const initialValues = (schema: ToolSchema): Record<string, unknown> => {
  const defaults = v.getDefaults(schema) as Record<string, unknown>;
  return Object.fromEntries(
    describeFields(schema).map((field) => [
      field.name,
      defaults[field.name] ??
        (field.kind === "boolean"
          ? false
          : field.kind === "select"
            ? field.options[0]
            : field.kind === "table"
              ? []
              : field.kind === "file"
                ? undefined
                : ""),
    ]),
  );
};
