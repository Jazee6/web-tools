import type { AnyTool } from "@/lib/tool-contract/define-tool";
import { createRegistry } from "@/lib/tool-contract/registry";

// 自动发现 src/tools/*/tool.ts（只在服务端 / 构建期使用，不要从 island 引入）
export const tools = createRegistry(
  import.meta.glob<{ default: AnyTool }>("./*/tool.ts", { eager: true }),
);

export const getTool = (id: string): AnyTool | undefined => tools.find((tool) => tool.id === id);
