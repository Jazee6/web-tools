import { decodeImage } from "@/lib/image/decode";
import { loadOrtModels, ort } from "@/lib/runtime/ort";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

import { boxesFromProbabilities, detectionInput } from "./detect";
import { cropQuad, flattenOnWhite } from "./image";
import { toText } from "./layout";
import { detectionFile, recognitionFile } from "./model";
import { decode, HEIGHT, recognitionInput } from "./recognize";

export interface ImageToTextInput {
  file: File;
}

// 检测占"处理中"进度的前 20%，逐行识别占其余部分
const DETECT_SHARE = 0.2;

interface Sessions {
  detection: ort.InferenceSession;
  recognition: ort.InferenceSession;
}

// 两个模型只加载一次；加载失败（含取消）后丢弃，下次重新加载
let sessions: Promise<Sessions> | undefined;

const createSessions = async (ctx: ToolContext): Promise<Sessions> => {
  const [detection, recognition] = await loadOrtModels([detectionFile, recognitionFile], ctx);
  // 只用 WASM：模型小（共 31 MB），CPU 上已经够快，也不必判断 WebGPU 是否可用
  const options = { executionProviders: ["wasm"] };
  return {
    detection: await ort.InferenceSession.create(new Uint8Array(detection!), options),
    recognition: await ort.InferenceSession.create(new Uint8Array(recognition!), options),
  };
};

const getSessions = (ctx: ToolContext) => {
  if (!sessions) {
    sessions = createSessions(ctx);
    sessions.catch(() => {
      sessions = undefined;
    });
  }
  return sessions;
};

// 每个模型只有一个输入 x 和一个输出
const run = async (session: ort.InferenceSession, data: Float32Array, dims: number[]) => {
  const outputs = await session.run({ x: new ort.Tensor("float32", data, dims) });
  const [output] = Object.values(outputs) as [ort.Tensor];
  return { data: output.data as Float32Array, dims: output.dims };
};

export const imageToText = async ({ file }: ImageToTextInput, ctx: ToolContext = {}) => {
  const { signal, onProgress } = ctx;
  // 先解码：读不出来时立即报错，不用先下载模型
  const image = flattenOnWhite(await decodeImage(file, { reportTooLarge: true }));
  signal?.throwIfAborted();
  const { detection, recognition } = await getSessions(ctx);
  signal?.throwIfAborted();
  onProgress?.(0);

  const input = detectionInput(image);
  const probabilities = await run(detection, input.planes, [1, 3, input.height, input.width]);
  const quads = boxesFromProbabilities(
    probabilities.data,
    input.width,
    input.height,
    image.width,
    image.height,
  );
  signal?.throwIfAborted();
  onProgress?.(DETECT_SHARE);

  // 一次识别一行：每行宽度不同，逐行跑省去补齐，结果也与批量大小无关
  const lines = [];
  for (const [index, quad] of quads.entries()) {
    const line = recognitionInput(cropQuad(image, quad));
    const output = await run(recognition, line.planes, [1, 3, HEIGHT, line.width]);
    lines.push({ quad, text: decode(output.data, output.dims[1]!, output.dims[2]!).text });
    signal?.throwIfAborted();
    onProgress?.(DETECT_SHARE + ((1 - DETECT_SHARE) * (index + 1)) / quads.length);
  }
  const text = toText(lines);
  if (!text) throw new ToolError("no_text", { field: "file" });
  onProgress?.(1);
  return { text };
};
