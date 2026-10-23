import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearLocalData,
  getPreferences,
  listFavorites,
  listRecents,
  MAX_RECENTS,
  recordUse,
  savePreferences,
  setFavorite,
} from "./local-store";

// Browser Mode 的各测试文件同源：清除时只碰这里建的缓存，也不注销测试运行器可能用到的 Service Worker
const TEST_CACHE = "local-store-test";

const clearOwnData = () => {
  vi.spyOn(caches, "keys").mockResolvedValue([TEST_CACHE]);
  vi.spyOn(navigator.serviceWorker, "getRegistrations").mockResolvedValue([]);
  return clearLocalData().finally(() => vi.restoreAllMocks());
};

beforeEach(() => clearOwnData());

describe("local store", () => {
  it("adds and removes favorites, newest first", async () => {
    await setFavorite("json-formatter", true);
    await new Promise((resolve) => setTimeout(resolve, 5));
    await setFavorite("merge-pdf", true);
    expect((await listFavorites()).map((item) => item.id)).toEqual(["merge-pdf", "json-formatter"]);
    await setFavorite("merge-pdf", false);
    expect((await listFavorites()).map((item) => item.id)).toEqual(["json-formatter"]);
  });

  it("keeps the most recent uses and moves a reused tool to the top", async () => {
    for (let index = 0; index < MAX_RECENTS + 3; index++) {
      await recordUse(`tool-${index}`);
      await new Promise((resolve) => setTimeout(resolve, 2));
    }
    await recordUse("tool-5");
    const recents = (await listRecents()).map((item) => item.id);
    expect(recents).toHaveLength(MAX_RECENTS);
    expect(recents[0]).toBe("tool-5");
    expect(recents).not.toContain("tool-0");
  });

  it("stores preferences per tool", async () => {
    await savePreferences("image-compressor", { quality: 60 });
    expect(await getPreferences("image-compressor")).toEqual({ quality: 60 });
    expect(await getPreferences("merge-pdf")).toBeUndefined();
  });

  it("clears IndexedDB, caches and OPFS", async () => {
    await setFavorite("json-formatter", true);
    await (await caches.open(TEST_CACHE)).put("/models/x", new Response("x"));
    // Playwright 的 WebKit 是临时会话，没有 OPFS（getDirectory 抛 UnknownError），只验证其余部分
    const root = await navigator.storage.getDirectory().catch(() => undefined);
    await root?.getFileHandle("scratch.bin", { create: true });

    await clearOwnData();

    expect(await listFavorites()).toEqual([]);
    expect(await caches.has(TEST_CACHE)).toBe(false);
    const names: string[] = [];
    if (root) for await (const name of root.keys()) names.push(name);
    expect(names).toEqual([]);
  });
});
