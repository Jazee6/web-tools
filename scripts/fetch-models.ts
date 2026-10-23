/// <reference types="bun" />
// 构建前准备自托管的模型文件（ADR-0018）：收集各 Tool 的 model.ts 清单，从 Hugging Face（固定 commit）
// 或 node_modules 取得原文件、校验 sha256，按 PART_SIZE 切片写进 public/models/，并删除清单以外的旧文件。
// 下载的原文件按 sha256 缓存在 .cache/models/，CI 用 actions/cache 保留。public/models/ 不进 git。
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, rmdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

import { type HostedFile, PART_SIZE, partPaths } from "../src/lib/runtime/model-files";

export interface PrepareOptions {
  // 仓库根目录：node_modules 来源相对它解析
  root: string;
  outDir: string;
  cacheDir: string;
  log?: (message: string) => void;
}

const sha256 = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");

const partSize = (file: HostedFile, index: number, count: number) =>
  index < count - 1 ? PART_SIZE : file.size - PART_SIZE * (count - 1);

// 分片都在且大小正确就跳过；内容在写入前已经校验过
const isPlaced = async (file: HostedFile, outDir: string) => {
  const paths = partPaths(file);
  for (const [index, path] of paths.entries()) {
    const size = await stat(join(outDir, path)).then(
      (info) => info.size,
      () => -1,
    );
    if (size !== partSize(file, index, paths.length)) return false;
  }
  return true;
};

const verified = (file: HostedFile, bytes: Uint8Array, from: string) => {
  const actual = sha256(bytes);
  if (bytes.length !== file.size || actual !== file.sha256) {
    throw new Error(
      `${file.path} 校验失败（来源 ${from}）：期望 ${file.size} 字节 / ${file.sha256}，实际 ${bytes.length} 字节 / ${actual}`,
    );
  }
  return bytes;
};

const download = async (url: string, attempts = 3): Promise<Uint8Array> => {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return new Uint8Array(await response.arrayBuffer());
    } catch (error) {
      if (attempt >= attempts) throw new Error(`下载 ${url} 失败`, { cause: error });
    }
  }
};

const obtain = async (file: HostedFile, { root, cacheDir, log }: PrepareOptions) => {
  if (!file.source.startsWith("https://")) {
    return verified(file, await readFile(join(root, file.source)), file.source);
  }
  const cached = join(cacheDir, file.sha256);
  const hit = await readFile(cached).catch(() => undefined);
  if (hit && sha256(hit) === file.sha256) return hit;
  log?.(`下载 ${file.source}（${(file.size / 1024 / 1024).toFixed(1)} MB）`);
  const bytes = verified(file, await download(file.source), file.source);
  await mkdir(cacheDir, { recursive: true });
  await writeFile(cached, bytes);
  return bytes;
};

const walk = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
    ),
  );
  return nested.flat();
};

// 删除清单以外的文件（旧 revision、旧版本的 ORT）和随之变空的目录
const prune = async (outDir: string, keep: Set<string>, log?: (message: string) => void) => {
  for (const path of await walk(outDir)) {
    const name = relative(outDir, path);
    if (keep.has(name)) continue;
    log?.(`删除 ${name}`);
    await rm(path);
    for (let dir = dirname(path); dir !== outDir && dir.startsWith(outDir); dir = dirname(dir)) {
      if ((await readdir(dir)).length > 0) break;
      await rmdir(dir);
    }
  }
};

export const prepareModels = async (files: readonly HostedFile[], options: PrepareOptions) => {
  const { outDir, log } = options;
  for (const file of files) {
    if (await isPlaced(file, outDir)) continue;
    const bytes = await obtain(file, options);
    const paths = partPaths(file);
    for (const [index, path] of paths.entries()) {
      const target = join(outDir, path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, bytes.subarray(index * PART_SIZE, (index + 1) * PART_SIZE));
    }
    log?.(`写入 ${file.path}（${paths.length} 个文件）`);
  }
  await prune(outDir, new Set(files.flatMap(partPaths)), log);
};

// 各 Tool 目录下的 model.ts 导出 hostedFiles；同一个文件可能被多个 Tool 共用，按路径去重
export const collectHostedFiles = async (root: string): Promise<HostedFile[]> => {
  const files = new Map<string, HostedFile>();
  for await (const path of new Bun.Glob("src/tools/*/model.ts").scan(root)) {
    const manifest = (await import(join(root, path))) as { hostedFiles: HostedFile[] };
    for (const file of manifest.hostedFiles) files.set(file.path, file);
  }
  return [...files.values()];
};

if (import.meta.main) {
  const root = process.cwd();
  const files = await collectHostedFiles(root);
  await prepareModels(files, {
    root,
    outDir: join(root, "public/models"),
    cacheDir: join(root, ".cache/models"),
    log: (message) => console.log(message),
  });
  console.log(`✓ 模型文件就绪：${files.length} 个`);
}
