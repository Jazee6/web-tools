import { AutoModel, Tensor } from "@huggingface/transformers";

import { decodeImage } from "@/lib/image/decode";
import { encodeImage } from "@/lib/image/encode";
import {
  type Backend,
  configureTransformers,
  detectBackend,
  loadModel,
} from "@/lib/runtime/transformers";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

import { hostedFiles, models as modelsByBackend } from "./model";

export { type Backend, detectBackend };

export type OutputFormat = "png" | "webp" | "jpeg";

export interface RemoveBackgroundInput {
  file: File;
  format: OutputFormat;
  background: string;
  quality: number;
}

const OUTPUT = {
  png: { type: "image/png", extension: ".png" },
  webp: { type: "image/webp", extension: ".webp" },
  jpeg: { type: "image/jpeg", extension: ".jpg" },
} as const;

// BiRefNet 的输入：缩放到 size × size 的 RGB，按 ImageNet 的均值和标准差归一化（见模型的 preprocessor_config.json）
const MEAN = [0.485, 0.456, 0.406] as const;
const STD = [0.229, 0.224, 0.225] as const;

// 解码和预处理占"处理中"进度的前 10%，推理到 90%（推理本身没有进度），合成和编码占最后 10%
const PREPARE_SHARE = 0.1;
const INFER_SHARE = 0.9;

configureTransformers(hostedFiles);

type Model = Awaited<ReturnType<typeof AutoModel.from_pretrained>>;

// 两个文件都叫 model_fp16.onnx：按 fp32 加载、指定文件名，原样载入（与 WebGPU 版模型卡测试过的组合一致）
const createModel = (backend: Backend, ctx: ToolContext) => {
  const { id, revision, files } = modelsByBackend[backend];
  return loadModel(files, ctx, () =>
    AutoModel.from_pretrained(id, {
      revision,
      device: backend,
      dtype: "fp32",
      model_file_name: "model_fp16",
    }),
  );
};

// 每种后端的模型只加载一次；加载失败（含取消）后丢弃，下次重新加载
const models = new Map<Backend, Promise<Model>>();

const getModel = (backend: Backend, ctx: ToolContext): Promise<Model> => {
  let model = models.get(backend);
  if (!model) {
    model = createModel(backend, ctx);
    models.set(backend, model);
    model.catch(() => models.delete(backend));
  }
  return model;
};

// "#rgb" 或 "#rrggbb"（# 可省略），空字符串表示透明
export const parseColor = (text: string): [number, number, number] | undefined => {
  const value = text.trim().replace(/^#/, "");
  if (!value) return undefined;
  const hex = /^[\da-f]{3}$/i.test(value) ? value.replaceAll(/./g, "$&$&") : value;
  if (!/^[\da-f]{6}$/i.test(hex)) {
    throw new ToolError("invalid_color", { field: "background", detail: text.trim() });
  }
  return [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16)) as [
    number,
    number,
    number,
  ];
};

const canvasContext = (width: number, height: number) => {
  const context = new OffscreenCanvas(width, height).getContext("2d", {
    willReadFrequently: true,
  });
  if (!context) throw new Error("无法创建画布");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  return context;
};

// 缩放成 size × size（不保持比例，与模型的预处理一致），转成 [1, 3, size, size] 的 float32 张量。
// 透明像素按原样取 RGB：模型只看颜色，透明区域本来就会在输出里保持透明
const toInputTensor = (image: ImageData, size: number) => {
  const source = canvasContext(image.width, image.height);
  source.putImageData(image, 0, 0);
  const context = canvasContext(size, size);
  context.drawImage(source.canvas, 0, 0, size, size);
  const { data } = context.getImageData(0, 0, size, size);
  const plane = size * size;
  const values = new Float32Array(3 * plane);
  for (let i = 0; i < plane; i++) {
    for (let channel = 0; channel < 3; channel++) {
      values[channel * plane + i] = (data[i * 4 + channel]! / 255 - MEAN[channel]!) / STD[channel]!;
    }
  }
  return new Tensor("float32", values, [1, 3, size, size]);
};

// 模型输出 size × size 的 logits，sigmoid 后放大回原图尺寸，得到每个像素的前景概率（0–255）。
// 放在红色通道、不透明地缩放：画布按预乘 alpha 插值，直接缩放 alpha 通道会在边缘偏暗
const toMask = (logits: Float32Array, size: number, width: number, height: number) => {
  const small = new ImageData(size, size);
  for (let i = 0; i < logits.length; i++) {
    small.data[i * 4] = Math.round(255 / (1 + Math.exp(-logits[i]!)));
    small.data[i * 4 + 3] = 255;
  }
  const source = canvasContext(size, size);
  source.putImageData(small, 0, 0);
  const context = canvasContext(width, height);
  context.drawImage(source.canvas, 0, 0, width, height);
  return context.getImageData(0, 0, width, height).data;
};

// 前景概率乘到原有的透明度上；有背景色时把结果铺在背景色上，整张图不透明
const applyMask = (
  image: ImageData,
  mask: Uint8ClampedArray,
  background: [number, number, number] | undefined,
) => {
  const { data } = image;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = (data[i + 3]! * mask[i]!) / 255;
    if (!background) {
      data[i + 3] = alpha;
      continue;
    }
    const keep = alpha / 255;
    for (let channel = 0; channel < 3; channel++) {
      data[i + channel] = data[i + channel]! * keep + background[channel]! * (1 - keep);
    }
    data[i + 3] = 255;
  }
};

const outputName = (name: string, extension: string) => {
  const dot = name.lastIndexOf(".");
  return `${dot > 0 ? name.slice(0, dot) : name}-no-bg${extension}`;
};

// backend 只在测试里指定，用来分别覆盖 WebGPU 和 WASM 两条路径
export const removeBackground = async (
  input: RemoveBackgroundInput,
  ctx: ToolContext = {},
  backend?: Backend,
) => {
  const { file, format, quality } = input;
  const { signal, onProgress } = ctx;
  // 先检查选项和解码：有问题时立即报错，不用先下载模型
  const background = parseColor(input.background);
  if (format === "jpeg" && !background) {
    throw new ToolError("background_required", { field: "background" });
  }
  const image = await decodeImage(file, { reportTooLarge: true });
  signal?.throwIfAborted();
  const chosen = backend ?? (await detectBackend());
  const { size } = modelsByBackend[chosen];
  let pixels: Tensor;
  try {
    pixels = toInputTensor(image, size);
  } catch {
    // 浏览器的画布面积上限各不相同（手机上更小），超出时创建画布或读取像素会失败
    throw new ToolError("too_large", { field: "file" });
  }

  const model = await getModel(chosen, ctx);
  signal?.throwIfAborted();
  onProgress?.(PREPARE_SHARE);
  // 输出名在两个导出里不同（output_image / logits），都只有这一个输出
  const outputs = (await model({ input_image: pixels })) as Record<string, Tensor>;
  signal?.throwIfAborted();
  onProgress?.(INFER_SHARE);

  // fp16 模型的输出可能是 float16 张量，先转成 float32
  const [result] = Object.values(outputs) as [Tensor];
  const logits = result.type === "float32" ? result : result.to("float32");
  let mask: Uint8ClampedArray;
  try {
    mask = toMask(logits.data as Float32Array, size, image.width, image.height);
  } catch {
    throw new ToolError("too_large", { field: "file" });
  }
  applyMask(image, mask, background);
  const output = OUTPUT[format];
  const bytes = await encodeImage(image, output.type, quality);
  onProgress?.(1);
  return {
    file: new File([bytes], outputName(file.name, output.extension), { type: output.type }),
  };
};
