// 端侧 AI 的模型和超过 25 MiB 的 WASM 自托管在静态资源里（ADR-0018）：构建前由 scripts/fetch-models.ts
// 下载固定版本、校验 sha256，按 PART_SIZE 切片写进 public/models/；浏览器里按清单拼回原文件，存进 Cache API。
// 路径里带固定版本（模型 revision、npm 包版本），同一路径的内容永不变，缓存不需要失效机制。

export const MODELS_BASE = "/models/";

// Workers 静态资源单个文件上限 25 MiB，留 1 MiB 余量
export const PART_SIZE = 24 * 1024 * 1024;

export interface HostedFile {
  // 相对 MODELS_BASE 的路径
  path: string;
  size: number;
  sha256: string;
  // 构建时的来源：https URL，或相对仓库根目录的 node_modules 路径
  source: string;
}

// 不超过 PART_SIZE 的文件原样放置，否则切成 <path>.part0、<path>.part1 …
export const partPaths = (file: Pick<HostedFile, "path" | "size">): string[] => {
  const count = Math.ceil(file.size / PART_SIZE);
  return count <= 1
    ? [file.path]
    : Array.from({ length: count }, (_, index) => `${file.path}.part${index}`);
};

const CACHE_NAME = "models";

// 把响应体读进 target 的 offset 处，每收到一块就回报字节数（用于下载进度）；返回读到的字节数。
// 不用 Blob 拼接：WebKit 里由多个分片拼成的大 Blob（实测 114 MB）读取时报 "Blob loading failed"
const readInto = async (
  response: Response,
  target: Uint8Array,
  offset: number,
  onBytes?: (bytes: number) => void,
) => {
  const reader = response.body!.getReader();
  let length = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return length;
    if (offset + length + value.byteLength > target.byteLength) {
      throw new Error("model file is larger than its manifest size");
    }
    target.set(value, offset + length);
    length += value.byteLength;
    onBytes?.(value.byteLength);
  }
};

// Cache API 不可用（如部分隐私模式）或配额不足时照常下载，只是不缓存
const openCache = async () => {
  try {
    return await globalThis.caches?.open(CACHE_NAME);
  } catch {
    return undefined;
  }
};

const loadFile = async (
  url: string,
  file: HostedFile,
  signal: AbortSignal | undefined,
  onBytes: ((bytes: number) => void) | undefined,
): Promise<Response> => {
  const cache = await openCache();
  const cached = await cache?.match(url).catch(() => undefined);
  // 先把缓存的内容整个读出来再返回：读不出来或大小不对（缓存损坏）就删掉这条缓存，重新下载
  const bytes = await cached?.arrayBuffer().catch(() => undefined);
  const init = { headers: { "Content-Length": String(file.size) } };
  if (bytes?.byteLength === file.size) {
    onBytes?.(file.size);
    return new Response(bytes, init);
  }
  if (cached) await cache?.delete(url).catch(() => {});
  const joined = new Uint8Array(file.size);
  let length = 0;
  for (const path of partPaths(file)) {
    const response = await fetch(new URL(path, new URL(MODELS_BASE, location.origin)), { signal });
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    length += await readInto(response, joined, length, onBytes);
  }
  if (length !== file.size) {
    throw new Error(`${file.path}: expected ${file.size} bytes, got ${length}`);
  }
  await cache?.put(url, new Response(joined, init)).catch(() => {});
  return new Response(joined, init);
};

export interface ModelFetchOptions {
  signal?: AbortSignal;
  // 每读到一段数据（含缓存命中时的整个文件）回报字节数，总量是清单里各文件 size 之和
  onBytes?: (bytes: number) => void;
}

// 替换 Transformers.js 的 env.fetch：清单里的文件从分片拼回并走缓存，其他请求照常发出
export const createModelFetch = (
  files: readonly HostedFile[],
  options: () => ModelFetchOptions,
) => {
  const byUrl = new Map(
    files.map((file) => [new URL(file.path, new URL(MODELS_BASE, location.origin)).href, file]),
  );
  return (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = new URL(input instanceof Request ? input.url : input, location.href).href;
    const file = byUrl.get(url);
    if (!file) return fetch(input, init);
    const { signal, onBytes } = options();
    return loadFile(url, file, signal, onBytes);
  };
};

// 直接取一个清单文件的字节（例如交给 ORT 的 wasmBinary）
export const loadHostedFile = async (file: HostedFile, options: ModelFetchOptions = {}) => {
  const url = new URL(file.path, new URL(MODELS_BASE, location.origin)).href;
  const response = await loadFile(url, file, options.signal, options.onBytes);
  return response.arrayBuffer();
};
