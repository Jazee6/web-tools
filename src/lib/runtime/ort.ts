// 不经 Transformers.js、直接用 ONNX Runtime Web 跑模型的 Tool 共用的设置。
// 与 Transformers.js 用同一个 onnxruntime-web/webgpu（astro.config 的别名换成 extern-wasm 版）和同一个
// 自托管的 .wasm（ADR-0018），所以 ORT 的 .wasm 在 Cache API 里只存一份。

import ortFactoryUrl from "onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url";
import * as ort from "onnxruntime-web/webgpu";

import { type HostedFile, loadHostedFile } from "@/lib/runtime/model-files";
import { ortWasmFile } from "@/lib/runtime/ort-wasm";
import type { ToolContext } from "@/lib/tool-contract/define-tool";

export { ort };

// 加载 ORT 的 .wasm（第一次时）和 files 里的模型，下载按字节回报 "download" 阶段的进度。
// 返回各模型文件的字节，顺序与 files 相同
export const loadOrtModels = async (
  files: readonly HostedFile[],
  { signal, onProgress }: ToolContext,
): Promise<ArrayBuffer[]> => {
  const wasm = ort.env.wasm;
  const total = [...files, ...(wasm.wasmBinary ? [] : [ortWasmFile])].reduce(
    (sum, file) => sum + file.size,
    0,
  );
  let loaded = 0;
  const options = {
    signal,
    onBytes: (bytes: number) => {
      loaded += bytes;
      onProgress?.(Math.min(1, loaded / total), "download");
    },
  };
  // wasmBinary 必须在创建第一个 session 之前设置，之后各 session 共用
  wasm.wasmPaths = { mjs: ortFactoryUrl };
  wasm.wasmBinary ??= await loadHostedFile(ortWasmFile, options);
  const result: ArrayBuffer[] = [];
  for (const file of files) result.push(await loadHostedFile(file, options));
  return result;
};
