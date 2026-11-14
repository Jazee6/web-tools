import type { HostedFile } from "@/lib/runtime/model-files";
import { ortWasmFile } from "@/lib/runtime/ort-wasm";

// 两个 BiRefNet_lite（MIT）的 ONNX 导出，权重相同，按后端各用一个，都固定到一个 commit（ADR-0022）：
// - WebGPU：1024 × 1024 输入。onnx-community 的原版导出在浏览器里跑不起来（有的着色器超过 WebGPU 保证的
//   8 个存储缓冲，int64 索引运算回退到 CPU 产生超大张量，实测 std::bad_alloc），用改写过计算图的版本。
// - WASM：1024 × 1024 的激活内存超过 ORT WASM 的 4 GB 上限（各版本实测都 std::bad_alloc），用 512 × 512 的导出。
// 两个文件都是 fp16 权重。预处理（缩放、ImageNet 归一化）由 core 自己做，preprocessor_config.json 不托管。
export interface SegmentationModel {
  id: string;
  revision: string;
  // 输入边长：图片缩放成 size × size
  size: number;
  files: HostedFile[];
}

const modelFile = (
  id: string,
  revision: string,
  name: string,
  size: number,
  sha256: string,
): HostedFile => ({
  path: `${id}/${revision}/${name}`,
  size,
  sha256,
  source: `https://huggingface.co/${id}/resolve/${revision}/${name}`,
});

const define = (
  id: string,
  revision: string,
  size: number,
  files: [name: string, size: number, sha256: string][],
): SegmentationModel => ({
  id,
  revision,
  size,
  files: files.map(([name, bytes, sha256]) => modelFile(id, revision, name, bytes, sha256)),
});

export const models = {
  webgpu: define(
    "wonfy/BiRefNet_lite-ONNX-webgpu",
    "c40eaa22fb1af9edcf75c7b79d25ed8a8e901140",
    1024,
    [
      ["config.json", 82, "ea376925bd57077446df1e74ffdc0742c2368b7e912dd176fd2aa877af0a7ddc"],
      [
        "onnx/model_fp16.onnx",
        123_210_389,
        "2290313b335cfdb867eefac47b46aa2b225793fc3deb4da8dbc86e71e9cff2d7",
      ],
    ],
  ),
  wasm: define("studioludens/birefnet-lite-512", "962e67969ec6acec9c19fab76acee4f5e22e990c", 512, [
    ["config.json", 81, "561965f7aa366c48b95ab1c24220d59a718df4025c2ecb359dd5736ceb49e912"],
    [
      "onnx/model_fp16.onnx",
      98_484_532,
      "eff9216bb2f9d3f023d9c2b7196845a7485739ab1f231593633e4d2344ffc516",
    ],
  ]),
} satisfies Record<"webgpu" | "wasm", SegmentationModel>;

export const hostedFiles: HostedFile[] = [
  ...models.webgpu.files,
  ...models.wasm.files,
  ortWasmFile,
];
