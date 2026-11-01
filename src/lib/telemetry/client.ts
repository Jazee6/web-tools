import {
  durationBucket,
  ERROR_NAME_PATTERN,
  type ErrorKind,
  EVENT_SAMPLE_RATE,
  type TelemetryEvent,
} from "./protocol";

const ENDPOINT = "/api/e";
const SEEN_KEY = "telemetry-errors";
// 同一会话最多上报这么多种不同的错误，防止页面出错时持续占用 Worker 请求配额
const MAX_ERRORS_PER_SESSION = 20;

// 上报失败不影响页面，也不重试
const send = (event: TelemetryEvent) => {
  try {
    navigator.sendBeacon(ENDPOINT, JSON.stringify(event));
  } catch {
    // 忽略
  }
};

// <html lang> 是 hreflang（zh-Hans），第一段就是 Locale id
const currentLocale = () => document.documentElement.lang.split("-")[0] ?? "";

// 页面上的 Tool：全局错误事件拿不到 Tool id，由 Tool 表单挂载时设置
let activeTool: string | undefined;

export const setActiveTool = (id: string) => {
  activeTool = id;
};

// 只探测同步可得的能力，粒度粗，不足以识别访客
const capabilityFingerprint = (): string => {
  const available: Record<string, boolean> = {
    wasm: typeof WebAssembly === "object",
    webcodecs: "VideoEncoder" in globalThis,
    webgpu: "gpu" in navigator,
    opfs: typeof navigator.storage?.getDirectory === "function",
    isolated: globalThis.crossOriginIsolated === true,
    sw: "serviceWorker" in navigator,
  };
  return Object.keys(available)
    .filter((name) => available[name])
    .join(",");
};

// 本会话已上报的错误。存 sessionStorage，跨页面去重；不可用时退回内存，只在当前页面内去重
let seen: Set<string> | undefined;

const seenErrors = (): Set<string> => {
  if (seen) return seen;
  try {
    seen = new Set(JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]") as string[]);
  } catch {
    seen = new Set();
  }
  return seen;
};

const errorName = (error: unknown): string => {
  const name = (error as { name?: unknown } | null | undefined)?.name;
  return typeof name === "string" && ERROR_NAME_PATTERN.test(name) ? name : "Unknown";
};

export const reportError = (kind: ErrorKind, error: unknown, tool = activeTool) => {
  const name = errorName(error);
  const key = `${kind}:${tool ?? ""}:${name}`;
  const reported = seenErrors();
  if (reported.has(key) || reported.size >= MAX_ERRORS_PER_SESSION) return;
  reported.add(key);
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...reported]));
  } catch {
    // 忽略
  }
  send({
    type: "error",
    kind,
    name,
    ...(tool && { tool }),
    locale: currentLocale(),
    capabilities: capabilityFingerprint(),
  });
};

export const reportRun = (tool: string, result: string, ms: number) => {
  if (Math.random() >= EVENT_SAMPLE_RATE) return;
  send({
    type: "tool",
    tool,
    locale: currentLocale(),
    result,
    duration: durationBucket(ms),
  });
};

// 所有页面都安装（BaseLayout）。不是本站脚本抛出的错误（跨源脚本、浏览器扩展）不上报
export const installErrorReporting = () => {
  window.addEventListener("error", (event) => {
    if (event.filename?.startsWith(location.origin)) reportError("error", event.error);
  });
  window.addEventListener("unhandledrejection", (event) => {
    const stack = (event.reason as { stack?: unknown } | null | undefined)?.stack;
    if (typeof stack === "string" && stack.includes("-extension://")) return;
    reportError("rejection", event.reason);
  });
};
