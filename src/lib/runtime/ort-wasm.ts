import type { HostedFile } from "@/lib/runtime/model-files";

// ONNX Runtime Web 支持 WebGPU 的 WASM（asyncify 版）有 26.9 MB，超过静态资源单文件上限，同样切片托管（ADR-0018）。
// 各端侧 AI Tool 的 model.ts 都把它列进清单（按路径去重）。这个模块只有数据，构建脚本也会 import。
// 升级 onnxruntime-web 时这里的版本、大小和哈希要一起改，fetch-models 会校验。
const ORT_VERSION = "1.31.0-dev.20260914-8d85527a0";

export const ortWasmFile: HostedFile = {
  path: `onnxruntime-web/${ORT_VERSION}/ort-wasm-simd-threaded.asyncify.wasm`,
  size: 26_861_777,
  sha256: "49871f5a4409519797e127440868a6d1923339d9185907f301a5b2a1d90af082",
  source: "node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.asyncify.wasm",
};
