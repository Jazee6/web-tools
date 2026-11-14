// 各端侧 AI Tool 共用的 Transformers.js / ONNX Runtime 设置：模型从自托管分片加载（ADR-0018），
// ORT 用 extern-wasm 版、.wasm 本体经 wasmBinary 交给 ORT，以及 WebGPU 是否可用的判断。
// 每个 Tool 在自己的 Web Worker 里运行，env 是 Worker 内的全局设置。
import { env } from "@huggingface/transformers";
// ORT 的 WASM 胶水代码（53 KB）照常打包；26.9 MB 的 .wasm 本体从分片拼回后经 wasmBinary 交给 ORT（ADR-0018）
import ortFactoryUrl from "onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url";

import {
  createModelFetch,
  type HostedFile,
  loadHostedFile,
  type ModelFetchOptions,
} from "@/lib/runtime/model-files";
import { ortWasmFile } from "@/lib/runtime/ort-wasm";
import type { ToolContext } from "@/lib/tool-contract/define-tool";

export type Backend = "webgpu" | "wasm";

interface GpuAdapter {
  features: ReadonlySet<string>;
  info?: { isFallbackAdapter?: boolean };
  requestDevice(descriptor: { requiredFeatures: string[] }): Promise<{ destroy(): void }>;
}

// 只有真实 GPU 且能创建支持 shader-f16 的设备时才用 WebGPU（fp16）。headless 浏览器常见的 SwiftShader
// 是软件回退，实测比 WASM 慢 20 倍，按 isFallbackAdapter 排除。这里必须判断准确：WebGPU 初始化失败后不能在同一个
// Worker 里改用 WASM（Transformers.js 串行创建 session，一次失败会让后续 session 全部失败），只能报错后换新 Worker。
export const detectBackend = async (): Promise<Backend> => {
  const gpu = (navigator as { gpu?: { requestAdapter(): Promise<GpuAdapter | null> } }).gpu;
  const adapter = await gpu?.requestAdapter().catch(() => null);
  if (!adapter || adapter.info?.isFallbackAdapter || !adapter.features.has("shader-f16")) {
    return "wasm";
  }
  const device = await adapter
    .requestDevice({ requiredFeatures: ["shader-f16"] })
    .catch(() => null);
  device?.destroy();
  return device ? "webgpu" : "wasm";
};

// 本次加载模型用的中止信号和下载进度回调，由 env.fetch 读取
let fetchOptions: ModelFetchOptions = {};

// 在 Worker 里调用一次：模型从 /models/<路径模板>读取，清单里的文件走分片和 Cache API。
// 默认模板 {model}/{revision}/ 要求加载时传固定的 revision。pipeline() 探测要加载哪些文件时不传 revision
// （Transformers.js 4.3.1 的 get_pipeline_files 按 main 请求），用 pipeline 的 Tool 要把 revision 写进模板
export const configureTransformers = (
  hostedFiles: readonly HostedFile[],
  pathTemplate = "{model}/{revision}/",
) => {
  env.allowLocalModels = false;
  env.remoteHost = new URL("/models/", location.origin).href;
  env.remotePathTemplate = pathTemplate;
  // 缓存由 createModelFetch 统一做（Cache API），Transformers.js 自己的缓存关掉，避免存两份
  env.useBrowserCache = false;
  env.useWasmCache = false;
  env.fetch = createModelFetch(hostedFiles, () => fetchOptions);
  env.backends.onnx.wasm!.wasmPaths = { mjs: ortFactoryUrl };
};

// 加载模型：files 是这次会下载的模型文件（用于计算下载进度），ORT 的 .wasm 还没加载时自动计入。
// load 里创建 pipeline / model，期间的下载按字节回报 "download" 阶段的进度
export const loadModel = async <T>(
  files: readonly HostedFile[],
  { signal, onProgress }: ToolContext,
  load: () => Promise<T>,
): Promise<T> => {
  const onnx = env.backends.onnx.wasm!;
  const total = [...files, ...(onnx.wasmBinary ? [] : [ortWasmFile])].reduce(
    (sum, file) => sum + file.size,
    0,
  );
  let loaded = 0;
  fetchOptions = {
    signal,
    onBytes: (bytes) => {
      loaded += bytes;
      onProgress?.(Math.min(1, loaded / total), "download");
    },
  };
  try {
    // wasmBinary 必须在创建第一个 session 之前给 ORT，之后各 session 共用
    onnx.wasmBinary ??= await loadHostedFile(ortWasmFile, fetchOptions);
    return await load();
  } finally {
    fetchOptions = {};
  }
};
