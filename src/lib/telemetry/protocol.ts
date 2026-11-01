// /api/e 的上报协议（architecture §16），客户端和 Worker 共用。这里不引入任何依赖，客户端上报代码在首屏。

// Tool 使用事件的抽样比例。Free 计划下每次上报占一次 Worker 请求；错误不抽样。
export const EVENT_SAMPLE_RATE = 0.1;

export const durationBuckets = ["lt100ms", "lt1s", "lt10s", "lt60s", "gte60s"] as const;
export type DurationBucket = (typeof durationBuckets)[number];

export const durationBucket = (ms: number): DurationBucket => {
  if (ms < 100) return "lt100ms";
  if (ms < 1_000) return "lt1s";
  if (ms < 10_000) return "lt10s";
  if (ms < 60_000) return "lt60s";
  return "gte60s";
};

// error：全局 error 事件；rejection：未处理的 Promise 拒绝；tool：Tool 运行时的意外错误（不含 ToolError）
export const errorKinds = ["error", "rejection", "tool"] as const;
export type ErrorKind = (typeof errorKinds)[number];

// 结果类别：ok、cancelled、unexpected，或 ToolError 的错误码（小写下划线，由开发者定义，不含用户数据）
export const RESULT_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;
// 只上报错误类型名，不上报 message 和 stack：它们可能包含用户输入（比如 JSON.parse 的 SyntaxError）
export const ERROR_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{0,63}$/;
export const CAPABILITIES_PATTERN = /^[a-z,]{0,64}$/;

export type TelemetryEvent =
  | {
      type: "tool";
      tool: string;
      locale: string;
      result: string;
      duration: DurationBucket;
    }
  | {
      type: "error";
      kind: ErrorKind;
      name: string;
      tool?: string;
      locale: string;
      capabilities: string;
    };
