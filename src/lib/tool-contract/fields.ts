import * as v from "valibot";

import type { FieldMetadata, ToolSchema } from "./define-tool";
import { acceptOf as acceptOfTypes, type FileTypes } from "./file-type";

// 表单派生只支持轻量 Tool 用到的基本类型；遇到其他类型直接报错，避免静默渲染成错误控件。
// table 是对象数组（每列是字符串或数字），只用于输出；file 是 v.file()，accept 取自 fileType()（MIME 类型和扩展名）；
// files 是 v.array(v.file())，有顺序，只用于输入。
export type FieldSpec =
  | { name: string; kind: "text" | "code" | "url" | "line" }
  | { name: string; kind: "number" }
  | { name: string; kind: "boolean" }
  | { name: string; kind: "select"; options: string[]; languageNames?: boolean }
  | { name: string; kind: "table"; columns: string[] }
  | { name: string; kind: "file" | "files"; accept: string[] };

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

const fileTypesIn = (schema: AnySchema) =>
  schema.pipe?.find((item) => item.type === "file_type")?.requirement as FileTypes | undefined;

const acceptOf = (schema: AnySchema) => {
  const types = fileTypesIn(schema);
  return types ? acceptOfTypes(types) : [];
};

// 文件字段（file / files）用 fileType() 声明的类型表；不是文件字段或没有声明时返回 undefined
export const fileTypesOf = (schema: ToolSchema, name: string): FileTypes | undefined => {
  const entry = schema.entries[name] as AnySchema | undefined;
  if (!entry) return undefined;
  const base = unwrap(entry);
  if (base.type === "file") return fileTypesIn(base);
  if (base.type === "array" && base.item!.type === "file") return fileTypesIn(base.item!);
  return undefined;
};

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
      case "file":
        return { name, kind: "file", accept: acceptOf(base) };
      case "picklist": {
        const metadata = v.getMetadata(base) as FieldMetadata;
        const spec: FieldSpec = { name, kind: "select", options: [...base.options!] };
        return metadata.languageNames ? { ...spec, languageNames: true } : spec;
      }
      case "array": {
        const item = base.item!;
        if (item.type === "file") return { name, kind: "files", accept: acceptOf(item) };
        const columns = item.type === "object" ? Object.entries(item.entries!) : [];
        if (columns.length > 0 && columns.every(([, column]) => isScalar(unwrap(column)))) {
          return { name, kind: "table", columns: columns.map(([column]) => column) };
        }
        throw new Error(`字段 ${name} 的数组元素必须是文件，或字符串 / 数字列组成的对象`);
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
            : field.kind === "table" || field.kind === "files"
              ? []
              : field.kind === "file"
                ? undefined
                : ""),
    ]),
  );
};

// 记作本地偏好的字段（architecture §13）：选项类字段，不含文件和自由文本
export const isPreferenceField = (spec: FieldSpec): boolean =>
  spec.kind === "number" || spec.kind === "boolean" || spec.kind === "select";
