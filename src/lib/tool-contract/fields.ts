import * as v from "valibot";

import type { FieldMetadata, ToolSchema } from "./define-tool";

// 表单派生只支持轻量 Tool 用到的基本类型；遇到其他类型直接报错，避免静默渲染成错误控件。
export type FieldSpec =
  | { name: string; kind: "text" | "code" }
  | { name: string; kind: "number" }
  | { name: string; kind: "boolean" }
  | { name: string; kind: "select"; options: string[] };

type AnySchema = v.GenericSchema & {
  wrapped?: AnySchema;
  options?: readonly string[];
  pipe?: readonly { kind: string; type: string }[];
};

const unwrap = (schema: AnySchema): AnySchema =>
  schema.type === "optional" || schema.type === "nullish" ? unwrap(schema.wrapped!) : schema;

export const describeFields = (schema: ToolSchema): FieldSpec[] =>
  Object.entries(schema.entries).map(([name, entry]) => {
    const base = unwrap(entry as AnySchema);
    switch (base.type) {
      case "string": {
        const metadata = v.getMetadata(base) as FieldMetadata;
        return { name, kind: metadata.widget === "code" ? "code" : "text" };
      }
      case "number":
        return { name, kind: "number" };
      case "boolean":
        return { name, kind: "boolean" };
      case "picklist":
        return { name, kind: "select", options: [...base.options!] };
      default:
        throw new Error(`字段 ${name} 的类型 ${base.type} 不支持表单派生`);
    }
  });

// 表单初始值：schema 默认值，没有默认值的字段按类型给空值
export const initialValues = (schema: ToolSchema): Record<string, unknown> => {
  const defaults = v.getDefaults(schema) as Record<string, unknown>;
  return Object.fromEntries(
    describeFields(schema).map((field) => [
      field.name,
      defaults[field.name] ??
        (field.kind === "boolean" ? false : field.kind === "select" ? field.options[0] : ""),
    ]),
  );
};
