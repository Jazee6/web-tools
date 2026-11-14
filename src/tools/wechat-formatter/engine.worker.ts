import { exposeRun } from "@/lib/runtime/rpc";

// core 按需 import：shiki 的语法分块互相引用时会用到打包器的运行时辅助函数，
// 静态 import 会把它放进 Worker 入口，语法分块就会反向 import 入口（postbuild 会拦截，WebKit 会重复实例化入口）
const loadCore = () => import("./core");

exposeRun(async (input: Parameters<typeof import("./core").formatWechat>[0], ctx) =>
  (await loadCore()).formatWechat(input, ctx),
);
