import { getModelContext } from "./model-context";

// WebMCP 适配层（architecture §10）：Tool island 挂载时把当前 Tool 注册给页面内的 agent。
// API 仍在 origin trial（Chrome 149+，chrome://flags/#enable-webmcp-testing），名字未稳定：
// 现行文档是 document.modelContext，早期草案是 navigator.modelContext，这里两者都探测，业务代码只依赖本模块。
// 参考：https://developer.chrome.com/docs/ai/webmcp/imperative-api

export interface WebMcpToolDescriptor {
  // 1–128 个 ASCII 字母数字、_、-、.
  name: string;
  description: string;
  inputSchema: object;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  // 返回值会被 JSON 序列化后交给 agent；调用方看不到 reject 的原因，所以可预期错误应作为结果返回
  execute: (input: Record<string, unknown>, options?: { signal?: AbortSignal }) => Promise<string>;
}

// signal 中止即注销（不会打断正在执行的调用）；API 不存在时什么都不做
export const registerWebMcpTool = async (tool: WebMcpToolDescriptor, signal: AbortSignal) => {
  const context = getModelContext();
  if (!context || signal.aborted) return;
  try {
    await context.registerTool(tool, { signal });
  } catch (error) {
    // 同名重复注册（InvalidStateError）或权限不足时不影响页面本身
    console.warn("WebMCP registerTool failed", error);
  }
};
