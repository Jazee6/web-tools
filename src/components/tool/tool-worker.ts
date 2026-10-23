import { callWorker } from "@/lib/runtime/rpc";
import { type AnyTool, type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

// runtime.worker 为真的 Tool 在同目录 engine.worker.ts 里运行；每个 Tool 一个 Worker，
// 首次调用时创建并保留（WASM 只初始化一次）。崩溃或出现意外错误（不是 ToolError、也不是用户取消）后丢弃，
// 下次调用重建：引擎内部状态可能已经坏掉，例如 WebGPU 初始化失败后 Transformers.js 无法再创建任何 session。
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
      instance.addEventListener("error", () => discardWorker(id, worker!));
      return instance;
    });
    workers.set(id, worker);
  }
  return worker;
};

// 只丢弃出问题的那个 Worker；同一个 Tool 已经换了新 Worker 时不动新的
const discardWorker = (id: string, worker: Promise<Worker>) => {
  if (workers.get(id) === worker) workers.delete(id);
  void worker.then((instance) => instance.terminate());
};

export const warmWorker = (tool: AnyTool) => void getWorker(tool.id);

export const runInWorker = async (
  tool: AnyTool,
  input: unknown,
  ctx?: ToolContext,
): Promise<Record<string, unknown>> => {
  const worker = getWorker(tool.id);
  try {
    return await callWorker(await worker, input, ctx);
  } catch (error) {
    if (!(error instanceof ToolError) && !ctx?.signal?.aborted) discardWorker(tool.id, worker);
    throw error;
  }
};
