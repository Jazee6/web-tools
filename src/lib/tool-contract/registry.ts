import { categoryIds } from "@/categories/categories";
import { locales } from "@/lib/i18n/locales";

import type { AnyTool } from "./define-tool";

// 顶层路径中 Tool / Category 之外已被占用的 slug（Locale 前缀、平台与构建产物）
export const reservedSlugs = [
  ...locales,
  "api",
  "mcp",
  "og",
  "search",
  "llms",
  "robots",
  "favicon",
  "index",
  "sitemap-index",
  "offline",
  "manifest",
  "icons",
  "sw",
] as const;

const TOOL_PATH = /([^/]+)\/tool\.ts$/;

// 从 tool.ts 模块表建注册表：目录名必须等于 id，id 不能与 Category / 保留 slug 冲突。
// 浏览器、Astro 用 import.meta.glob 传入模块表，Bun 脚本和 Playwright 用文件系统扫描传入。
export const createRegistry = (modules: Record<string, { default: AnyTool }>): AnyTool[] => {
  const tools = Object.entries(modules).map(([path, module]) => {
    const tool = module.default;
    const dir = TOOL_PATH.exec(path)?.[1];
    if (dir !== tool.id) throw new Error(`${path}: Tool id "${tool.id}" 必须与目录名一致`);
    return tool;
  });

  const taken = new Map<string, string>([
    ...categoryIds.map((id) => [id, "Category"] as const),
    ...reservedSlugs.map((id) => [id, "保留路径"] as const),
  ]);
  for (const tool of tools) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool.id)) {
      throw new Error(`Tool id "${tool.id}" 必须是 kebab-case`);
    }
    if (Boolean(tool.runtime.worker) === Boolean(tool.run)) {
      throw new Error(
        `Tool ${tool.id}：runtime.worker 与 run 必须二选一（Worker Tool 由 engine.worker.ts 运行）`,
      );
    }
    const owner = taken.get(tool.id);
    if (owner) throw new Error(`Tool id "${tool.id}" 与${owner}冲突`);
    taken.set(tool.id, "Tool");
  }

  return tools.toSorted((a, b) => a.id.localeCompare(b.id));
};
