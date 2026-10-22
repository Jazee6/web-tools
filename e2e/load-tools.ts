import { globSync } from "node:fs";
import { resolve } from "node:path";

import type { AnyTool } from "../src/lib/tool-contract/define-tool";
import { createRegistry } from "../src/lib/tool-contract/registry";

// Playwright 跑在 Node 里，没有 import.meta.glob，改用文件系统扫描建注册表
export const loadTools = async (): Promise<AnyTool[]> => {
  const modules: Record<string, { default: AnyTool }> = {};
  for (const path of globSync("src/tools/*/tool.ts")) {
    modules[path] = await import(resolve(path));
  }
  return createRegistry(modules);
};
