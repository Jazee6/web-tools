import type { AnyTool } from "@/lib/tool-contract/define-tool";
import type { AnyVariant } from "@/lib/tool-contract/define-variant";
import { createRegistry } from "@/lib/tool-contract/registry";
import { createVariantRegistry } from "@/lib/tool-contract/variant-registry";

// 自动发现 src/tools/*/tool.ts（只在服务端 / 构建期使用，不要从 island 引入）
export const tools = createRegistry(
  import.meta.glob<{ default: AnyTool }>("./*/tool.ts", { eager: true }),
);

// 自动发现 src/tools/*/variants/*/variant.ts，准入门槛 1–3 在这里校验（构建期）
export const variants = createVariantRegistry(
  tools,
  import.meta.glob<{ default: AnyVariant }>("./*/variants/*/variant.ts", { eager: true }),
);

export const getTool = (id: string): AnyTool | undefined => tools.find((tool) => tool.id === id);
