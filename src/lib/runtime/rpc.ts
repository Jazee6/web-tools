import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

// 主线程 ↔ Dedicated Web Worker 的类型化 RPC（architecture §13）：每次调用一个 id，
// Worker 回传进度和结果；结果中的 ArrayBuffer / 类型化数组以 Transferable 零拷贝传回（File / Blob 本身克隆成本很低）。
// ToolError 跨线程会丢失类型，按字段序列化后在主线程还原。

type Request<TIn> = { id: number; type: "run"; input: TIn } | { id: number; type: "abort" };

interface SerializedError {
  name: string;
  message: string;
  code?: string;
  field?: string;
  detail?: string;
}

type Response<TOut> =
  | { id: number; type: "progress"; ratio: number }
  | { id: number; type: "done"; output: TOut }
  | { id: number; type: "error"; error: SerializedError };

// Worker 全局作用域里用到的部分（tsconfig 不含 WebWorker lib）
interface WorkerScope {
  addEventListener(type: "message", listener: (event: MessageEvent) => void): void;
  postMessage(message: unknown, transfer: Transferable[]): void;
}

type Run<TIn, TOut> = (input: TIn, ctx: ToolContext) => TOut | Promise<TOut>;

const transferables = (output: unknown): Transferable[] => {
  if (typeof output !== "object" || output === null) return [];
  const list: Transferable[] = [];
  for (const value of Object.values(output)) {
    if (value instanceof ArrayBuffer) list.push(value);
    else if (ArrayBuffer.isView(value) && value.buffer instanceof ArrayBuffer)
      list.push(value.buffer);
  }
  return list;
};

const serializeError = (error: unknown): SerializedError =>
  error instanceof ToolError
    ? {
        name: error.name,
        message: error.message,
        code: error.code,
        field: error.field,
        detail: error.detail,
      }
    : { name: "Error", message: error instanceof Error ? error.message : String(error) };

const deserializeError = (error: SerializedError): Error =>
  error.code ? new ToolError(error.code, error) : new Error(error.message);

// Worker 入口（engine.worker.ts）调用：把 core 暴露给主线程
export const exposeRun = <TIn, TOut>(run: Run<TIn, TOut>) => {
  const scope = self as unknown as WorkerScope;
  const controllers = new Map<number, AbortController>();
  const post = (message: Response<TOut>, transfer: Transferable[] = []) =>
    scope.postMessage(message, transfer);
  scope.addEventListener("message", async (event: MessageEvent<Request<TIn>>) => {
    const request = event.data;
    if (request.type === "abort") {
      controllers.get(request.id)?.abort();
      return;
    }
    const controller = new AbortController();
    controllers.set(request.id, controller);
    try {
      const output = await run(request.input, {
        signal: controller.signal,
        onProgress: (ratio) => post({ id: request.id, type: "progress", ratio }),
      });
      post({ id: request.id, type: "done", output }, transferables(output));
    } catch (error) {
      post({ id: request.id, type: "error", error: serializeError(error) });
    } finally {
      controllers.delete(request.id);
    }
  });
};

let nextId = 0;

// 主线程调用：signal 中止时通知 Worker 取消；Worker 崩溃（如 WASM 内存不足）时 reject
export const callWorker = <TIn, TOut>(
  worker: Worker,
  input: TIn,
  ctx: ToolContext = {},
): Promise<TOut> =>
  new Promise<TOut>((resolve, reject) => {
    const id = nextId++;
    const cleanup = () => {
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
      ctx.signal?.removeEventListener("abort", onAbort);
    };
    const onMessage = (event: MessageEvent<Response<TOut>>) => {
      const response = event.data;
      if (response.id !== id) return;
      if (response.type === "progress") {
        ctx.onProgress?.(response.ratio);
        return;
      }
      cleanup();
      if (response.type === "done") resolve(response.output);
      else reject(deserializeError(response.error));
    };
    const onError = (event: ErrorEvent) => {
      cleanup();
      reject(new Error(event.message || "Worker crashed"));
    };
    const onAbort = () => {
      // oxlint-disable-next-line unicorn/require-post-message-target-origin -- Worker.postMessage 没有 targetOrigin
      worker.postMessage({ id, type: "abort" } satisfies Request<TIn>);
      cleanup();
      reject(ctx.signal!.reason);
    };
    if (ctx.signal?.aborted) {
      reject(ctx.signal.reason);
      return;
    }
    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);
    ctx.signal?.addEventListener("abort", onAbort, { once: true });
    // oxlint-disable-next-line unicorn/require-post-message-target-origin -- 同上
    worker.postMessage({ id, type: "run", input } satisfies Request<TIn>);
  });
