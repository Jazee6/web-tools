import { env, pipeline } from "@huggingface/transformers";
import {
  ALL_FORMATS,
  type AudioSample,
  BlobSource,
  Conversion,
  Input,
  NullTarget,
  Output,
  WavOutputFormat,
} from "mediabunny";
// ORT 的 WASM 胶水代码（53 KB）照常打包；26.9 MB 的 .wasm 本体从分片拼回后经 wasmBinary 交给 ORT（ADR-0018）
import ortFactoryUrl from "onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url";

import {
  createModelFetch,
  loadHostedFile,
  type ModelFetchOptions,
} from "@/lib/runtime/model-files";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

import {
  configFiles,
  decoderFile,
  encoderFiles,
  hostedFiles,
  MODEL_ID,
  MODEL_REVISION,
  ortWasmFile,
} from "./model";
import { formatSrt, type TimedChunk } from "./srt";
import { MAX_DURATION_SECONDS, type whisperLanguages } from "./tool";

export interface TranscribeInput {
  file: File;
  language: "auto" | (typeof whisperLanguages)[number];
}

// Whisper 的输入：16 kHz 单声道；长音频切成 30 秒的窗口，相邻窗口各重叠 5 秒，拼接时按重叠部分对齐
const SAMPLE_RATE = 16_000;
const CHUNK_SECONDS = 30;
const STRIDE_SECONDS = 5;

// 解码占"处理中"进度的前 10%，转录占后 90%
const DECODE_SHARE = 0.1;

export type Backend = "webgpu" | "wasm";

// 本次加载模型用的中止信号和下载进度回调，由 env.fetch 读取
let fetchOptions: ModelFetchOptions = {};

env.allowLocalModels = false;
env.remoteHost = new URL("/models/", location.origin).href;
env.remotePathTemplate = `{model}/${MODEL_REVISION}/`;
// 缓存由 createModelFetch 统一做（Cache API），Transformers.js 自己的缓存关掉，避免存两份
env.useBrowserCache = false;
env.useWasmCache = false;
env.fetch = createModelFetch(hostedFiles, () => fetchOptions);
env.backends.onnx.wasm!.wasmPaths = { mjs: ortFactoryUrl };

interface GpuAdapter {
  features: ReadonlySet<string>;
  info?: { isFallbackAdapter?: boolean };
  requestDevice(descriptor: { requiredFeatures: string[] }): Promise<{ destroy(): void }>;
}

// 只有真实 GPU 且能创建支持 shader-f16 的设备时 encoder 才用 WebGPU（fp16）。headless 浏览器常见的 SwiftShader
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

type Transcriber = Awaited<ReturnType<typeof createTranscriber>>;

const createTranscriber = async (backend: Backend, { signal, onProgress }: ToolContext) => {
  const onnx = env.backends.onnx.wasm!;
  const files = [
    ...configFiles,
    encoderFiles[backend],
    decoderFile,
    ...(onnx.wasmBinary ? [] : [ortWasmFile]),
  ];
  const total = files.reduce((sum, file) => sum + file.size, 0);
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
    return await pipeline("automatic-speech-recognition", MODEL_ID, {
      device: { encoder_model: backend, decoder_model_merged: "wasm" },
      dtype: { encoder_model: backend === "webgpu" ? "fp16" : "q8", decoder_model_merged: "q8" },
    });
  } finally {
    fetchOptions = {};
  }
};

// 每种后端的模型只加载一次；加载失败（含取消）后丢弃，下次重新加载
const transcribers = new Map<Backend, Promise<Transcriber>>();

const getTranscriber = (backend: Backend, ctx: ToolContext): Promise<Transcriber> => {
  let transcriber = transcribers.get(backend);
  if (!transcriber) {
    transcriber = createTranscriber(backend, ctx);
    transcribers.set(backend, transcriber);
    transcriber.catch(() => transcribers.delete(backend));
  }
  return transcriber;
};

// 解码主音轨，混成单声道并重采样到 16 kHz。Worker 里没有 AudioContext，借用 Mediabunny 的转换管线：
// 输出到 NullTarget（WAV 容器 + PCM，基本不耗时），在 process 回调里拷出处理后的样本。
const decodeAudio = async (file: File, { signal, onProgress }: ToolContext) => {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    const track = await input.getPrimaryAudioTrack().catch(() => {
      throw new ToolError("invalid_audio", { field: "file" });
    });
    if (!track) throw new ToolError("no_audio", { field: "file" });
    const duration = await track.computeDuration();
    if (duration > MAX_DURATION_SECONDS) throw new ToolError("too_long", { field: "file" });

    // 按时长预分配，避免分段收集后再拼接时内存翻倍；时长估计偏小时扩容
    let samples = new Float32Array(Math.ceil(duration * SAMPLE_RATE) + SAMPLE_RATE);
    let length = 0;
    const append = (sample: AudioSample) => {
      const frames = sample.numberOfFrames;
      if (length + frames > samples.length) {
        const grown = new Float32Array(Math.max(samples.length * 2, length + frames));
        grown.set(samples.subarray(0, length));
        samples = grown;
      }
      sample.copyTo(samples.subarray(length, length + frames), {
        planeIndex: 0,
        format: "f32-planar",
      });
      length += frames;
      // 返回 null 会让 WAV 输出没有任何数据包，finalize 时报错
      return sample;
    };

    const conversion = await Conversion.init({
      input,
      output: new Output({ format: new WavOutputFormat(), target: new NullTarget() }),
      tracks: "primary",
      video: { discard: true },
      audio: { numberOfChannels: 1, sampleRate: SAMPLE_RATE, codec: "pcm-f32", process: append },
      showWarnings: false,
    });
    const discarded = conversion.discardedTracks.find((entry) => entry.track.isAudioTrack());
    if (!conversion.isValid || discarded) {
      const codec = await discarded?.track.getCodec();
      throw codec
        ? new ToolError("unsupported_codec", { field: "file", detail: codec })
        : new ToolError("invalid_audio", { field: "file" });
    }

    signal?.throwIfAborted();
    const abort = () => void conversion.cancel();
    signal?.addEventListener("abort", abort, { once: true });
    conversion.onProgress = (ratio) => onProgress?.(ratio * DECODE_SHARE);
    try {
      await conversion.execute();
    } catch (error) {
      signal?.throwIfAborted();
      throw error;
    } finally {
      signal?.removeEventListener("abort", abort);
    }
    return samples.subarray(0, length);
  } finally {
    input.dispose();
  }
};

// 与 Transformers.js 的 Whisper 分块逻辑一致：窗口每次前进 30 − 2 × 5 = 20 秒，直到覆盖结尾
const chunkCount = (length: number) => {
  const window = CHUNK_SECONDS * SAMPLE_RATE;
  const jump = window - 2 * STRIDE_SECONDS * SAMPLE_RATE;
  return length <= window ? 1 : 1 + Math.ceil((length - window) / jump);
};

const subtitleName = (name: string) => {
  const dot = name.lastIndexOf(".");
  return `${dot > 0 ? name.slice(0, dot) : name}.srt`;
};

// backend 只在测试里指定，用来分别覆盖 WebGPU 和 WASM 两条路径
export const transcribe = async (
  { file, language }: TranscribeInput,
  ctx: ToolContext,
  backend?: Backend,
) => {
  const { signal, onProgress } = ctx;
  // 先解码：文件有问题时立即报错，不用先下载模型
  const audio = await decodeAudio(file, ctx);
  const transcriber = await getTranscriber(backend ?? (await detectBackend()), ctx);
  signal?.throwIfAborted();

  // 每个窗口生成结束时（streamer.end）推进进度；每生成一个 token（streamer.put）检查是否已取消
  const chunks = chunkCount(audio.length);
  let done = 0;
  onProgress?.(DECODE_SHARE);
  const streamer = {
    put: () => signal?.throwIfAborted(),
    end: () => onProgress?.(DECODE_SHARE + (1 - DECODE_SHARE) * (++done / chunks)),
  };
  const result = (await transcriber(audio, {
    chunk_length_s: CHUNK_SECONDS,
    stride_length_s: STRIDE_SECONDS,
    return_timestamps: true,
    task: "transcribe",
    // Whisper 把爪哇语记作 jw
    ...(language !== "auto" && { language: language === "jv" ? "jw" : language }),
    streamer,
  } as Record<string, unknown>)) as { text: string; chunks?: TimedChunk[] };

  const text = result.text.trim();
  if (!text) throw new ToolError("no_speech", { field: "file" });
  const srt = formatSrt(result.chunks ?? [], audio.length / SAMPLE_RATE);
  return {
    text,
    subtitles: new File([srt], subtitleName(file.name), { type: "application/x-subrip" }),
  };
};
