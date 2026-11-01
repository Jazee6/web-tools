import type { WebMcpToolDescriptor } from "./webmcp";

interface ModelContext {
  registerTool(tool: WebMcpToolDescriptor, options?: { signal?: AbortSignal }): Promise<unknown>;
}

// WebMCP 的特性探测，从 webmcp.ts 拆出来：页面上没有 agent 时不加载适配层（architecture §15）
export const getModelContext = (): ModelContext | undefined => {
  const candidates = [
    (document as { modelContext?: ModelContext }).modelContext,
    (navigator as { modelContext?: ModelContext }).modelContext,
  ];
  return candidates.find((context) => typeof context?.registerTool === "function");
};
