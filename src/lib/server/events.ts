import * as v from "valibot";

import { isLocale } from "@/lib/i18n/locales";
import {
  CAPABILITIES_PATTERN,
  durationBuckets,
  ERROR_NAME_PATTERN,
  errorKinds,
  EVENT_SAMPLE_RATE,
  RESULT_PATTERN,
  type TelemetryEvent,
} from "@/lib/telemetry/protocol";
import { isToolId } from "@/tools/tool-ids";

import { clientIp } from "./execute";

// POST /api/e：Tool 使用事件和客户端错误（architecture §16），写入 Analytics Engine。
// 这是匿名端点，所有字段都按白名单或固定格式校验，不符合就拒绝，防止往数据集里写任意内容。
export interface EventsEnv {
  EVENT_RATE_LIMITER: RateLimit;
  EVENTS: EventSink;
}

interface DataPoint {
  blobs: string[];
  doubles: number[];
  indexes: string[];
}

// Analytics Engine binding 里用到的部分
interface EventSink {
  writeDataPoint(point: DataPoint): void;
}

const MAX_BODY_BYTES = 1024;

const toolId = v.pipe(v.string(), v.check(isToolId));
const locale = v.pipe(
  v.string(),
  v.check((value: string) => isLocale(value)),
);

const eventSchema = v.variant("type", [
  v.strictObject({
    type: v.literal("tool"),
    tool: toolId,
    locale,
    result: v.pipe(v.string(), v.regex(RESULT_PATTERN)),
    duration: v.picklist(durationBuckets),
  }),
  v.strictObject({
    type: v.literal("error"),
    kind: v.picklist(errorKinds),
    name: v.pipe(v.string(), v.regex(ERROR_NAME_PATTERN)),
    tool: v.optional(toolId),
    locale,
    capabilities: v.pipe(v.string(), v.regex(CAPABILITIES_PATTERN)),
  }),
]);

// 列的含义：blob1 类型、blob2 Tool id、blob3 Locale、blob4 结果类别或错误名、
// blob5 耗时区间或错误来源、blob6 能力指纹；double1 是抽样权重，SUM(double1) 就是估算的真实次数。
// index 决定 Analytics Engine 自身的抽样分组，按 Tool 分。
const toDataPoint = (event: TelemetryEvent): DataPoint =>
  event.type === "tool"
    ? {
        blobs: ["tool", event.tool, event.locale, event.result, event.duration, ""],
        doubles: [Math.round(1 / EVENT_SAMPLE_RATE)],
        indexes: [event.tool],
      }
    : {
        blobs: [
          "error",
          event.tool ?? "",
          event.locale,
          event.name,
          event.kind,
          event.capabilities,
        ],
        doubles: [1],
        indexes: [event.tool ?? "site"],
      };

const empty = (status: number, headers: Record<string, string> = {}) =>
  new Response(null, { status, headers });

export const handleEvents = async (request: Request, env: EventsEnv): Promise<Response> => {
  if (request.method !== "POST") return empty(405, { allow: "POST" });

  // sendBeacon 同源发送时一定带 Origin；其他网站的页面不能往这里写
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin) return empty(403);

  const { success } = await env.EVENT_RATE_LIMITER.limit({ key: clientIp(request) });
  if (!success) return empty(429, { "retry-after": "60" });

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return empty(413);
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return empty(413);

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return empty(400);
  }
  const parsed = v.safeParse(eventSchema, body);
  if (!parsed.success) return empty(400);

  env.EVENTS.writeDataPoint(toDataPoint(parsed.output as TelemetryEvent));
  return empty(204);
};
