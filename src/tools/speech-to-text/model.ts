import type { HostedFile } from "@/lib/runtime/model-files";

// Whisper base（MIT），onnx-community 转换的 ONNX 版本，固定到一个 commit。
// encoder 有两种精度：有 WebGPU（非软件回退且支持 shader-f16）时用 fp16 在 GPU 上跑，否则用 int8 在 WASM 上跑；
// decoder 始终是 int8、在 WASM 上跑（实测量化的 decoder 在 WebGPU 上反而比 WASM 慢）。
export const MODEL_ID = "onnx-community/whisper-base";
export const MODEL_REVISION = "1846881b6b3a3024392c1eea3ad983695bc23925";

const modelFile = (name: string, size: number, sha256: string): HostedFile => ({
  path: `${MODEL_ID}/${MODEL_REVISION}/${name}`,
  size,
  sha256,
  source: `https://huggingface.co/${MODEL_ID}/resolve/${MODEL_REVISION}/${name}`,
});

export const configFiles = [
  modelFile(
    "config.json",
    2243,
    "f4d0608f7d918166da7edb3e188de5ef1bfe70d9802e785d271fd88111e9cf4b",
  ),
  modelFile(
    "generation_config.json",
    3832,
    "61070cf8de25b1e9256e8e102ded49d8d24a8369ed36ef84fdf21549e68125a0",
  ),
  modelFile(
    "preprocessor_config.json",
    339,
    "a6a76d28c93edb273669eb9e0b0636a2bddbb1272c3261e47b7ca6dfdbac1b8d",
  ),
  modelFile(
    "tokenizer.json",
    2_480_466,
    "27fc476bfe7f17299480be2273fc0608e4d5a99aba2ab5dec5374b4482d1a566",
  ),
  modelFile(
    "tokenizer_config.json",
    282_682,
    "2e036e4dbacfdeb7242c7d4ec4149f4a16e86026048f94d1637e3a8ee9c6a573",
  ),
];

export const encoderFiles = {
  webgpu: modelFile(
    "onnx/encoder_model_fp16.onnx",
    41_332_612,
    "ffba51b20185377c1b89362b1128148d0132de936a32b200af973da2a11a5369",
  ),
  wasm: modelFile(
    "onnx/encoder_model_quantized.onnx",
    23_201_314,
    "5862993336bf33acd23736071aae2b32261d3b1b2f37780194460d4ef974dd46",
  ),
};

export const decoderFile = modelFile(
  "onnx/decoder_model_merged_quantized.onnx",
  53_693_315,
  "fa3ef9902734ce5ae6f9ef2bdb2ba9a6c4b5785b09f4f420ce036573dc9d090b",
);

// ONNX Runtime Web 支持 WebGPU 的 WASM（asyncify 版）有 26.9 MB，超过静态资源单文件上限，同样切片托管。
// 升级 onnxruntime-web 时这里的版本、大小和哈希要一起改，fetch-models 会校验。
const ORT_VERSION = "1.31.0-dev.20260914-8d85527a0";

export const ortWasmFile: HostedFile = {
  path: `onnxruntime-web/${ORT_VERSION}/ort-wasm-simd-threaded.asyncify.wasm`,
  size: 26_861_777,
  sha256: "49871f5a4409519797e127440868a6d1923339d9185907f301a5b2a1d90af082",
  source: "node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.asyncify.wasm",
};

export const hostedFiles: HostedFile[] = [
  ...configFiles,
  encoderFiles.webgpu,
  encoderFiles.wasm,
  decoderFile,
  ortWasmFile,
];
