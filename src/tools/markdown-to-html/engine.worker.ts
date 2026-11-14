import { exposeRun } from "@/lib/runtime/rpc";

// core 按需 import，原因同公众号排版：shiki 的语法分块不能反向 import Worker 入口（ADR-0024）
const loadCore = () => import("./core");

exposeRun(async (input: Parameters<typeof import("./core").markdownToHtml>[0], ctx) =>
  (await loadCore()).markdownToHtml(input, ctx),
);
