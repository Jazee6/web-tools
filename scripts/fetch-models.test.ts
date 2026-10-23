import { createHash } from "node:crypto";
import { mkdtemp, readdir, readFile, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { type HostedFile, PART_SIZE, partPaths } from "../src/lib/runtime/model-files";
import { prepareModels } from "./fetch-models";

const sha256 = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");

describe("partPaths", () => {
  it("keeps files up to PART_SIZE whole", () => {
    expect(partPaths({ path: "a/b.onnx", size: PART_SIZE })).toEqual(["a/b.onnx"]);
  });

  it("splits larger files into numbered parts", () => {
    expect(partPaths({ path: "a/b.onnx", size: PART_SIZE * 2 + 1 })).toEqual([
      "a/b.onnx.part0",
      "a/b.onnx.part1",
      "a/b.onnx.part2",
    ]);
  });
});

describe("prepareModels", () => {
  let root: string;
  const options = () => ({
    root,
    outDir: join(root, "out"),
    cacheDir: join(root, "cache"),
  });

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "fetch-models-"));
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const localFile = async (name: string, size: number): Promise<HostedFile> => {
    const bytes = new Uint8Array(size).map((_, index) => index % 251);
    await mkdir(join(root, "node_modules"), { recursive: true });
    await writeFile(join(root, "node_modules", name), bytes);
    return { path: `pkg/1.0/${name}`, size, sha256: sha256(bytes), source: `node_modules/${name}` };
  };

  it("splits files into parts that join back to the original", async () => {
    const file = await localFile("big.wasm", PART_SIZE + 10);
    await prepareModels([file], options());
    const parts = await Promise.all(
      partPaths(file).map((path) => readFile(join(root, "out", path))),
    );
    expect(parts.map((part) => part.length)).toEqual([PART_SIZE, 10]);
    expect(sha256(Buffer.concat(parts))).toBe(file.sha256);
  });

  it("rejects a source whose hash does not match", async () => {
    const file = await localFile("small.json", 100);
    await expect(prepareModels([{ ...file, sha256: "0".repeat(64) }], options())).rejects.toThrow(
      "校验失败",
    );
  });

  it("removes files that are no longer in the manifest", async () => {
    const file = await localFile("small.json", 100);
    await mkdir(join(root, "out/pkg/0.9"), { recursive: true });
    await writeFile(join(root, "out/pkg/0.9/old.json"), "{}");
    await prepareModels([file], options());
    expect(await readdir(join(root, "out/pkg"))).toEqual(["1.0"]);
  });
});
