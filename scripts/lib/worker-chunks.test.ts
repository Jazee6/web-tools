import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { findWorkerEntryImporters } from "./worker-chunks";

describe("findWorkerEntryImporters", () => {
  let dir: string;
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it("lists chunks that import a Worker entry", () => {
    dir = mkdtempSync(join(tmpdir(), "worker-chunks-"));
    writeFileSync(join(dir, "engine.worker-Abc.js"), 'import{t}from"./shared-X.js";');
    writeFileSync(join(dir, "libheif-bundle-1.js"), 'import{t as e}from"./engine.worker-Abc.js";');
    writeFileSync(join(dir, "shared-X.js"), "export const t=1;");
    // 主线程用 new URL 引用 Worker 脚本，不算 import
    writeFileSync(
      join(dir, "tool.js"),
      'new Worker(new URL("./engine.worker-Abc.js",import.meta.url))',
    );
    expect(findWorkerEntryImporters(dir)).toEqual(["libheif-bundle-1.js"]);
  });
});
