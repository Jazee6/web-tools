// 检查部署产物是否在 Workers Free 静态资源限额内（architecture §20）。
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export const MAX_FILES = 20_000;
export const WARN_FILES = 16_000;
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

// 这些是平台配置文件，不作为静态资源上传
const CONFIG_FILES = new Set(["_headers", "_redirects", ".assetsignore"]);

export interface AssetFile {
  path: string;
  size: number;
}

export interface LimitsReport {
  count: number;
  errors: string[];
  warnings: string[];
}

export const evaluateLimits = (files: AssetFile[]): LimitsReport => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (files.length > MAX_FILES) {
    errors.push(`静态文件数 ${files.length} 超过上限 ${MAX_FILES}`);
  } else if (files.length > WARN_FILES) {
    warnings.push(
      `静态文件数 ${files.length} 超过上限的 80%（${WARN_FILES}），见 architecture §20 升级条件`,
    );
  }

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      errors.push(`${file.path} 大小 ${(file.size / 1024 / 1024).toFixed(1)} MiB 超过 25 MiB`);
    }
  }

  return { count: files.length, errors, warnings };
};

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

export const collectAssets = (root: string): AssetFile[] => {
  let ignored: string[] = [];
  try {
    ignored = readFileSync(join(root, ".assetsignore"), "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  } catch {
    // 没有 .assetsignore 时全部计入
  }

  return walk(root)
    .map((path) => relative(root, path))
    .filter((path) => !CONFIG_FILES.has(path) && !ignored.includes(path))
    .map((path) => ({ path, size: statSync(join(root, path)).size }));
};

if (import.meta.main) {
  const root = process.argv[2] ?? "dist/client";
  const report = evaluateLimits(collectAssets(root));

  console.log(`静态文件数：${report.count} / ${MAX_FILES}`);
  for (const warning of report.warnings) console.warn(`⚠ ${warning}`);
  for (const error of report.errors) console.error(`✗ ${error}`);
  if (report.errors.length > 0) process.exit(1);
}
