import { env } from "cloudflare:workers";
import { describe, expect, it, vi } from "vitest";

import { type EventsEnv, handleEvents } from "@/lib/server/events";
import { EVENT_SAMPLE_RATE } from "@/lib/telemetry/protocol";
import { tools } from "@/tools/registry";
import { toolIds } from "@/tools/tool-ids";

const ORIGIN = "https://tools.test";

const toolEvent = {
  type: "tool",
  tool: "json-formatter",
  locale: "zh",
  result: "ok",
  duration: "lt100ms",
};

const errorEvent = {
  type: "error",
  kind: "rejection",
  name: "TypeError",
  tool: "merge-pdf",
  locale: "en",
  capabilities: "wasm,webgpu,sw",
};

let ipCounter = 0;

// 每个用例默认用不同的 IP，互不占用限流额度（EVENT_RATE_LIMITER 在测试里是每分钟 3 次）
const call = (body: unknown, { origin = ORIGIN, ip = `203.0.113.${++ipCounter}` } = {}) => {
  const writeDataPoint = vi.fn<EventsEnv["EVENTS"]["writeDataPoint"]>();
  const response = handleEvents(
    new Request(`${ORIGIN}/api/e`, {
      method: "POST",
      headers: { "cf-connecting-ip": ip, ...(origin && { origin }) },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    { EVENT_RATE_LIMITER: env.EVENT_RATE_LIMITER, EVENTS: { writeDataPoint } },
  );
  return { response, writeDataPoint };
};

describe("POST /api/e", () => {
  it("writes a Tool event weighted by the sample rate", async () => {
    const { response, writeDataPoint } = call(toolEvent);
    expect((await response).status).toBe(204);
    expect(writeDataPoint).toHaveBeenCalledExactlyOnceWith({
      blobs: ["tool", "json-formatter", "zh", "ok", "lt100ms", ""],
      doubles: [1 / EVENT_SAMPLE_RATE],
      indexes: ["json-formatter"],
    });
  });

  it("writes an error with weight 1", async () => {
    const { response, writeDataPoint } = call(errorEvent);
    expect((await response).status).toBe(204);
    expect(writeDataPoint).toHaveBeenCalledExactlyOnceWith({
      blobs: ["error", "merge-pdf", "en", "TypeError", "rejection", "wasm,webgpu,sw"],
      doubles: [1],
      indexes: ["merge-pdf"],
    });
  });

  it("indexes an error outside any Tool page under the site", async () => {
    const { tool: _, ...siteError } = errorEvent;
    const { response, writeDataPoint } = call(siteError);
    expect((await response).status).toBe(204);
    expect(writeDataPoint.mock.calls[0]?.[0]).toMatchObject({
      blobs: ["error", "", "en", "TypeError", "rejection", "wasm,webgpu,sw"],
      indexes: ["site"],
    });
  });

  it.each([
    ["unknown Tool", { ...toolEvent, tool: "not-a-tool" }],
    ["unknown Locale", { ...toolEvent, locale: "xx" }],
    ["unknown duration", { ...toolEvent, duration: "1234ms" }],
    ["free-form result", { ...toolEvent, result: "Unexpected token { at line 3" }],
    ["free-form error name", { ...errorEvent, name: "Error: secret input" }],
    ["unknown error kind", { ...errorEvent, kind: "other" }],
    ["free-form capabilities", { ...errorEvent, capabilities: "Mozilla/5.0" }],
    ["extra fields", { ...errorEvent, message: "secret input" }],
    ["unknown type", { ...toolEvent, type: "other" }],
    ["invalid JSON", "{"],
  ])("rejects %s without writing", async (_, body) => {
    const { response, writeDataPoint } = call(body);
    expect((await response).status).toBe(400);
    expect(writeDataPoint).not.toHaveBeenCalled();
  });

  it("rejects an oversized body", async () => {
    const { response, writeDataPoint } = call({ ...toolEvent, result: "a".repeat(2000) });
    expect((await response).status).toBe(413);
    expect(writeDataPoint).not.toHaveBeenCalled();
  });

  it("rejects other methods", async () => {
    const response = await handleEvents(new Request(`${ORIGIN}/api/e`), {
      EVENT_RATE_LIMITER: env.EVENT_RATE_LIMITER,
      EVENTS: { writeDataPoint: vi.fn<EventsEnv["EVENTS"]["writeDataPoint"]>() },
    });
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
  });

  it.each([
    ["another site", "https://example.com"],
    ["a missing Origin", ""],
  ])("rejects a request from %s", async (_, origin) => {
    const { response, writeDataPoint } = call(toolEvent, { origin });
    expect((await response).status).toBe(403);
    expect(writeDataPoint).not.toHaveBeenCalled();
  });

  it("rate limits per IP", async () => {
    const ip = "203.0.113.250";
    for (let i = 0; i < 3; i++) {
      expect((await call(toolEvent, { ip }).response).status).toBe(204);
    }
    const { response, writeDataPoint } = call(toolEvent, { ip });
    const limited = await response;
    expect(limited.status).toBe(429);
    expect(limited.headers.get("retry-after")).toBe("60");
    expect(writeDataPoint).not.toHaveBeenCalled();
  });
});

describe("toolIds", () => {
  it("matches the registry", () => {
    expect([...toolIds].toSorted()).toEqual(tools.map((tool) => tool.id).toSorted());
  });
});
