import { expect, type Page, type Request, test } from "@playwright/test";

// 遥测（architecture §16）：Tool 使用事件和客户端错误经 sendBeacon 发到 /api/e。
// 请求发到真实的本地 Worker（Analytics Engine 在本地不落地），用例同时核对响应状态。

const beacon = (page: Page) =>
  page.waitForRequest((request) => new URL(request.url()).pathname === "/api/e");

const payload = async (request: Request) => {
  const response = await request.response();
  expect(response?.status()).toBe(204);
  return request.postDataJSON() as Record<string, unknown>;
};

const runJsonFormatter = async (page: Page, json: string) => {
  await page.goto("/zh/json-formatter");
  await page.waitForSelector("[data-hydrated]");
  await page.locator('[data-field="json"] textarea').fill(json);
  await page.locator('button[type="submit"]').click();
};

test("a sampled run reports the Tool, Locale, result and duration bucket", async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  const sent = beacon(page);
  await runJsonFormatter(page, '{"a":1}');
  expect(await payload(await sent)).toEqual({
    type: "tool",
    tool: "json-formatter",
    locale: "zh",
    result: "ok",
    duration: expect.stringMatching(/^(lt|gte)/),
  });
});

test("a ToolError is reported as a result category, not as an error", async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  const requests: Request[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/e") requests.push(request);
  });
  const sent = beacon(page);
  await runJsonFormatter(page, "{not json");
  expect(await payload(await sent)).toMatchObject({ type: "tool", result: "invalid_json" });
  expect(requests.map((request) => request.postDataJSON().type)).toEqual(["tool"]);
});

test("an unsampled run sends nothing", async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.99;
  });
  const requests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/e") requests.push(request.url());
  });
  await runJsonFormatter(page, '{"a":1}');
  await expect(page.locator('[data-output="formatted"]')).toBeVisible();
  expect(requests).toEqual([]);
});

test("an unhandled rejection is reported once per session, without its message", async ({
  page,
}) => {
  const SECRET = "user-input-secret";
  const requests: Request[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/e") requests.push(request);
  });
  await page.goto("/");

  const raise = () =>
    page.evaluate((secret) => {
      void Promise.reject(new RangeError(secret));
    }, SECRET);

  const sent = beacon(page);
  await raise();
  const report = await payload(await sent);
  expect(report).toMatchObject({
    type: "error",
    kind: "rejection",
    name: "RangeError",
    locale: "en",
  });
  expect(report.capabilities).toMatch(/^[a-z,]*$/);
  expect(JSON.stringify(report)).not.toContain(SECRET);

  // 换一个页面（同一会话）再抛一次，不再上报
  await page.goto("/developer");
  await raise();
  await page.waitForTimeout(200);
  expect(requests).toHaveLength(1);
});

test("a global error is reported only when it comes from this site's scripts", async ({ page }) => {
  await page.goto("/");
  const dispatch = (filename: string) =>
    page.evaluate((file) => {
      dispatchEvent(new ErrorEvent("error", { filename: file, error: new TypeError("secret") }));
    }, filename);

  const requests: Request[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/e") requests.push(request);
  });
  // 浏览器扩展和跨源脚本
  await dispatch("chrome-extension://abc/content.js");
  await dispatch("");
  await page.waitForTimeout(200);
  expect(requests).toEqual([]);

  const sent = beacon(page);
  await dispatch(new URL("/_astro/app.js", page.url()).href);
  expect(await payload(await sent)).toMatchObject({
    type: "error",
    kind: "error",
    name: "TypeError",
  });
});
