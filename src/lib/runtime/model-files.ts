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

// 读完响应体，每收到一块就回报字节数（用于下载进度）
const readBlob = async (response: Response, onBytes?: (bytes: number) => void) => {
  const reader = response.body!.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return new Blob(chunks);
    chunks.push(value);
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
  if (cached) {
    onBytes?.(file.size);
    return cached;
  }
  const parts: Blob[] = [];
  for (const path of partPaths(file)) {
    const response = await fetch(new URL(path, new URL(MODELS_BASE, location.origin)), { signal });
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    parts.push(await readBlob(response, onBytes));
  }
  const blob = new Blob(parts);
  if (blob.size !== file.size) {
    throw new Error(`${file.path}: expected ${file.size} bytes, got ${blob.size}`);
  }
  const init = { headers: { "Content-Length": String(file.size) } };
  await cache?.put(url, new Response(blob, init)).catch(() => {});
  return new Response(blob, init);
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
