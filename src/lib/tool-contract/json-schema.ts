import { toJsonSchema } from "@valibot/to-json-schema";

import type { AnyTool } from "./define-tool";

// WebMCP / 远程 MCP 的 inputSchema、outputSchema；v.metadata() 里的表单提示不对外暴露。
export const toolJsonSchemas = (tool: AnyTool) => ({
  input: toJsonSchema(tool.input, { typeMode: "input", ignoreActions: ["metadata"] }),
  output: toJsonSchema(tool.output, { typeMode: "output", ignoreActions: ["metadata"] }),
});
