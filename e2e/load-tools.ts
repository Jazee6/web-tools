import { globSync } from "node:fs";
import { resolve } from "node:path";

import type { AnyTool } from "../src/lib/tool-contract/define-tool";
import type { AnyVariant } from "../src/lib/tool-contract/define-variant";
import { createRegistry } from "../src/lib/tool-contract/registry";
import { createVariantRegistry } from "../src/lib/tool-contract/variant-registry";

// Playwright 跑在 Node 里，没有 import.meta.glob，改用文件系统扫描建注册表
export const loadTools = async (): Promise<AnyTool[]> => {
  const modules: Record<string, { default: AnyTool }> = {};
  for (const path of globSync("src/tools/*/tool.ts")) {
    modules[path] = await import(resolve(path));
  }
  return createRegistry(modules);
};

export const loadVariants = async (tools: readonly AnyTool[]): Promise<AnyVariant[]> => {
  const modules: Record<string, { default: AnyVariant }> = {};
  for (const path of globSync("src/tools/*/variants/*/variant.ts")) {
    modules[path] = await import(resolve(path));
  }
  return createVariantRegistry(tools, modules);
};

// 有内容的 Locale（{locale}.md 存在）
export const contentLocales = (dir: string): string[] =>
  globSync(`${dir}/*.md`).map((path) => path.split("/").at(-1)!.replace(/\.md$/, ""));
