import { callWorker } from "@/lib/runtime/rpc";
import type { AnyTool, ToolContext } from "@/lib/tool-contract/define-tool";

// runtime.worker 为真的 Tool 在同目录 engine.worker.ts 里运行；每个 Tool 一个 Worker，
// 首次调用时创建并保留（WASM 只初始化一次），崩溃后丢弃，下次调用重建。
// 本模块只在提交时按需加载，不进首屏。
const constructors = import.meta.glob<{ default: new () => Worker }>(
  "../../tools/*/engine.worker.ts",
  { query: "?worker" },
);

const workers = new Map<string, Promise<Worker>>();

const getWorker = (id: string): Promise<Worker> => {
  let worker = workers.get(id);
  if (!worker) {
    const load = constructors[`../../tools/${id}/engine.worker.ts`];
    if (!load) throw new Error(`Tool ${id} 声明了 runtime.worker，但缺少 engine.worker.ts`);
    worker = load().then(({ default: EngineWorker }) => {
      const instance = new EngineWorker();
      instance.addEventListener("error", () => {
        workers.delete(id);
        instance.terminate();
      });
      return instance;
    });
    workers.set(id, worker);
  }
  return worker;
};

export const warmWorker = (tool: AnyTool) => void getWorker(tool.id);

export const runInWorker = async (
  tool: AnyTool,
  input: unknown,
  ctx?: ToolContext,
): Promise<Record<string, unknown>> => callWorker(await getWorker(tool.id), input, ctx);
