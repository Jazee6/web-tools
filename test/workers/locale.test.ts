import { AsyncLocalStorage } from "node:async_hooks";

import { describe, expect, it } from "vitest";

import { m } from "@/paraglide/messages";
import { type Locale, overwriteServerAsyncLocalStorage } from "@/paraglide/runtime";

// 与 src/middleware.ts 相同的机制：并发处理不同 Locale 的请求时，各自的 m.*() 只读自己的 store
describe("per-request Paraglide locale", () => {
  it("keeps concurrent requests isolated across awaits", async () => {
    const storage = new AsyncLocalStorage<{ locale?: Locale }>();
    overwriteServerAsyncLocalStorage(storage);
    const render = (locale: Locale, delays: number[]) =>
      storage.run({ locale }, async () => {
        const seen: string[] = [];
        for (const delay of delays) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          seen.push(m.nav_home());
        }
        return seen;
      });
    const [en, zh, ja] = await Promise.all([
      render("en", [5, 0, 10]),
      render("zh", [0, 10, 0]),
      render("ja", [10, 5, 0]),
    ]);
    expect(en).toEqual(["Home", "Home", "Home"]);
    expect(zh).toEqual(["首页", "首页", "首页"]);
    expect(ja).toEqual(["ホーム", "ホーム", "ホーム"]);
  });
});
