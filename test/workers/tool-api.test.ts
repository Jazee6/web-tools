import { env } from "cloudflare:workers";
import { afterEach, describe, expect, it, vi } from "vitest";

import { handleToolApi } from "@/lib/server/tool-api";
import { TURNSTILE_HEADER } from "@/lib/tool-api";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

let ipCounter = 0;

// 每个用例用不同的 IP，互不占用限流额度（TOOL_RATE_LIMITER 在测试里是每分钟 3 次）
const call = (
  id: string,
  body: unknown,
  { token = "XXXX.DUMMY.TOKEN.XXXX", ip = `198.51.100.${++ipCounter}` } = {},
) =>
  handleToolApi(
    new Request(`https://tools.test/api/tools/${id}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cf-connecting-ip": ip,
        [TURNSTILE_HEADER]: token,
      },
      body: JSON.stringify(body),
    }),
    env,
    id,
  );

// 拦截对外请求：siteverify 按 token 返回结果，目标站点按 URL 返回固定响应头
const mockNetwork = (routes: Record<string, ResponseInit> = {}) => {
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url === SITEVERIFY) {
      const { response } = JSON.parse(String(init?.body)) as { response: string };
      return Response.json({ success: response === "XXXX.DUMMY.TOKEN.XXXX" });
    }
    const route = routes[url];
    if (!route) throw new TypeError(`unexpected fetch ${url}`);
    return new Response(null, route);
  });
  return fetch;
};

afterEach(() => vi.restoreAllMocks());

describe("POST /api/tools/{id}", () => {
  it("runs a Server-assisted Tool and follows redirects", async () => {
    const fetch = mockNetwork({
      "https://example.com/": { status: 301, headers: { location: "https://www.example.com/" } },
      "https://www.example.com/": { status: 200, headers: { "x-test": "1" } },
    });
    const response = await call("http-header-checker", { url: "example.com" });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      output: {
        status: 200,
        url: "https://www.example.com/",
        headers: [{ name: "x-test", value: "1" }],
        redirects: [{ status: 301, url: "https://example.com/" }],
      },
    });
    const target = fetch.mock.calls.find(([input]) => String(input) === "https://example.com/");
    expect(target?.[1]).toMatchObject({ method: "HEAD", redirect: "manual" });
    expect(new Headers(target?.[1]?.headers).get("user-agent")).toMatch(/^WebToolsBot\//);
  });

  it("only serves Server-assisted Tools", async () => {
    expect((await call("json-formatter", { json: "{}" })).status).toBe(404);
    expect((await call("nope", {})).status).toBe(404);
  });

  it("rejects other methods", async () => {
    const response = await handleToolApi(
      new Request("https://tools.test/api/tools/http-header-checker"),
      env,
      "http-header-checker",
    );
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
  });

  it("requires a valid Turnstile token", async () => {
    mockNetwork();
    const response = await call("http-header-checker", { url: "example.com" }, { token: "bad" });
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: { code: "verification_failed" } });
  });

  it("validates input against the Tool schema", async () => {
    mockNetwork();
    const response = await call("http-header-checker", { url: "" });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: "invalid_input", field: "url" } });
  });

  it("blocks private targets, including redirects into them", async () => {
    mockNetwork({
      "https://evil.example/": { status: 302, headers: { location: "http://169.254.169.254/" } },
    });
    const direct = await call("http-header-checker", { url: "http://127.0.0.1/" });
    expect(direct.status).toBe(422);
    expect(await direct.json()).toMatchObject({ error: { code: "blocked_url", field: "url" } });
    const redirected = await call("http-header-checker", { url: "https://evil.example/" });
    expect(await redirected.json()).toMatchObject({ error: { code: "blocked_url", field: "url" } });
  });

  it("rate-limits per IP before verifying Turnstile", async () => {
    const fetch = mockNetwork({ "https://example.org/": { status: 204 } });
    const ip = "203.0.113.200";
    const statuses: number[] = [];
    for (let i = 0; i < 5; i++) {
      statuses.push((await call("http-header-checker", { url: "example.org" }, { ip })).status);
    }
    expect(statuses.slice(0, 3)).toEqual([200, 200, 200]);
    expect(statuses.at(-1)).toBe(429);
    const rejected = await call("http-header-checker", { url: "example.org" }, { ip });
    expect(rejected.headers.get("retry-after")).toBe("60");
    const verifications = fetch.mock.calls.filter(([input]) => String(input) === SITEVERIFY);
    expect(verifications).toHaveLength(3);
  });
});
