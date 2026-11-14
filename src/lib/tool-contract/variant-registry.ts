import * as v from "valibot";

import type { AnyTool } from "./define-tool";
import type { AnyVariant } from "./define-variant";
import { describeFields, fileTypesOf } from "./fields";

const VARIANT_PATH = /([^/]+)\/variants\/([^/]+)\/variant\.ts$/;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isDay = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

const stable = (value: unknown): string =>
  JSON.stringify(value, (_, inner: unknown) =>
    inner && typeof inner === "object" && !Array.isArray(inner)
      ? Object.fromEntries(Object.entries(inner).toSorted(([a], [b]) => a.localeCompare(b)))
      : inner,
  );

// Variant 打开后的实际配置：非文件字段取预设覆盖默认值，文件字段取收窄后的类型（排序后比较）。
// Tool 自身的配置是全部默认值、不收窄。
const configuration = (tool: AnyTool, variant?: AnyVariant) => {
  const fileFields = new Set(
    describeFields(tool.input)
      .filter((spec) => spec.kind === "file" || spec.kind === "files")
      .map((spec) => spec.name),
  );
  const defaults = Object.fromEntries(
    Object.entries(v.getDefaults(tool.input) as Record<string, unknown>).filter(
      ([name]) => !fileFields.has(name),
    ),
  );
  const accept = Object.fromEntries(
    Object.entries(variant?.accept ?? {}).map(([name, types]) => [
      name,
      [...(types as string[])].toSorted(),
    ]),
  );
  return stable({ values: { ...defaults, ...variant?.preset }, accept });
};

// 门槛 1–3（architecture §11）：预设有效且有差异、有独有数据、有搜索需求依据。
// 门槛 4–5（en 内容、近似度）依赖内容，见 lib/seo/variant-admission.ts。
const contractErrors = (tool: AnyTool, variant: AnyVariant): string[] => {
  const errors: string[] = [];
  const fields = describeFields(tool.input);
  const isFile = (name: string) =>
    fields.some((spec) => spec.name === name && (spec.kind === "file" || spec.kind === "files"));

  if (!KEBAB.test(variant.id)) errors.push("id 必须是 kebab-case");

  const presetEntries = Object.fromEntries(
    Object.entries(tool.input.entries as v.ObjectEntries).filter(([name]) => !isFile(name)),
  );
  for (const name of Object.keys(variant.preset)) {
    if (!(name in tool.input.entries)) errors.push(`preset.${name} 不是 input 字段`);
    else if (isFile(name)) errors.push(`preset.${name} 是文件字段，来源格式用 accept 声明`);
  }
  const parsed = v.safeParse(v.partial(v.object(presetEntries)), variant.preset);
  if (!parsed.success) {
    errors.push(
      `preset 不满足 input：${parsed.issues.map((issue) => `${v.getDotPath(issue)} ${issue.message}`).join("; ")}`,
    );
  }

  for (const [name, types] of Object.entries(variant.accept ?? {}) as [string, string[]][]) {
    const known = fileTypesOf(tool.input, name);
    if (!known) {
      errors.push(`accept.${name} 不是用 fileType() 声明的文件字段`);
      continue;
    }
    const unknown = types.filter((type) => !Object.hasOwn(known, type));
    if (unknown.length > 0) {
      errors.push(`accept.${name} 的 ${unknown.join(", ")} 不在 fileType 表里`);
    }
    if (types.length === 0 || new Set(types).size !== types.length) {
      errors.push(`accept.${name} 不能为空或重复`);
    } else if (types.length >= Object.keys(known).length) {
      errors.push(`accept.${name} 没有收窄 Tool 能接受的类型`);
    }
  }

  const { columns, rows } = variant.table;
  if (columns.length === 0 || new Set(columns).size !== columns.length) {
    errors.push("table.columns 不能为空或重复");
  }
  if (rows.length === 0) errors.push("table.rows 不能为空");
  rows.forEach((row, index) => {
    const keys = Object.keys(row);
    if (keys.length !== columns.length || !columns.every((column) => keys.includes(column))) {
      errors.push(`table.rows[${index}] 的键必须与 columns 一一对应`);
    }
    for (const cell of Object.values(row)) {
      const text = typeof cell === "object" ? cell.term : cell;
      if (typeof text === "string" && text.trim() === "") {
        errors.push(`table.rows[${index}] 有空单元格`);
      }
    }
  });

  const { demand } = variant;
  if (!demand.query.trim()) errors.push("demand.query 不能为空");
  if (!isDay(demand.checkedAt)) errors.push("demand.checkedAt 必须是 YYYY-MM-DD");
  if (demand.volume !== undefined && !(Number.isInteger(demand.volume) && demand.volume > 0)) {
    errors.push("demand.volume 必须是正整数");
  }
  return errors;
};

// 从 variant.ts 模块表建 Variant 注册表，任一门槛不满足就抛错，构建随之失败（ADR-0005）。
// 路径是 <tool>/variants/<variant>/variant.ts，两级目录名必须分别等于 tool 和 id。
export const createVariantRegistry = (
  tools: readonly AnyTool[],
  modules: Record<string, { default: AnyVariant }>,
): AnyVariant[] => {
  const errors: string[] = [];
  const variants = Object.entries(modules).flatMap(([path, module]) => {
    const variant = module.default;
    const [, toolDir, variantDir] = VARIANT_PATH.exec(path) ?? [];
    if (toolDir !== variant.tool || variantDir !== variant.id) {
      errors.push(`${path}：tool 和 id 必须与目录名一致`);
      return [];
    }
    const tool = tools.find((candidate) => candidate.id === variant.tool);
    if (!tool) {
      errors.push(`${path}：没有 Tool ${variant.tool}`);
      return [];
    }
    errors.push(...contractErrors(tool, variant).map((error) => `${path}：${error}`));
    return [variant];
  });

  // 预设要不同于 Tool 的默认配置，也不同于同一 Tool 下的其他 Variant
  for (const tool of tools) {
    const seen = new Map([[configuration(tool), `Tool ${tool.id} 的默认值`]]);
    for (const variant of variants.filter((candidate) => candidate.tool === tool.id)) {
      const key = configuration(tool, variant);
      const same = seen.get(key);
      if (same) errors.push(`Variant ${tool.id}/${variant.id}：预设与${same}相同`);
      else seen.set(key, `Variant ${tool.id}/${variant.id}`);
    }
  }

  if (errors.length > 0) throw new Error(`Variant 准入失败：\n${errors.join("\n")}`);
  return variants.toSorted((a, b) => `${a.tool}/${a.id}`.localeCompare(`${b.tool}/${b.id}`));
};
