// 检查部署产物是否在 Workers Free 静态资源限额内（architecture §20）。
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { countHeaderRules } from "../src/lib/runtime/isolation";

export const MAX_FILES = 20_000;
export const WARN_FILES = 16_000;
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
// _headers 最多 100 条规则（Cloudflare Workers static assets），80% 时告警
export const MAX_HEADER_RULES = 100;
export const WARN_HEADER_RULES = 80;

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

export const evaluateLimits = (files: AssetFile[], headerRules = 0): LimitsReport => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (files.length > MAX_FILES) {
    errors.push(`静态文件数 ${files.length} 超过上限 ${MAX_FILES}`);
  } else if (files.length > WARN_FILES) {
    warnings.push(
      `静态文件数 ${files.length} 超过上限的 80%（${WARN_FILES}），见 architecture §20 升级条件`,
    );
  }

  if (headerRules > MAX_HEADER_RULES) {
    errors.push(`_headers 规则数 ${headerRules} 超过上限 ${MAX_HEADER_RULES}`);
  } else if (headerRules > WARN_HEADER_RULES) {
    warnings.push(`_headers 规则数 ${headerRules} 超过上限的 80%（${WARN_HEADER_RULES}）`);
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
  let headers = "";
  try {
    headers = readFileSync(join(root, "_headers"), "utf8");
  } catch {
    // 没有 _headers 时规则数为 0
  }
  const headerRules = countHeaderRules(headers);
  const report = evaluateLimits(collectAssets(root), headerRules);

  console.log(`静态文件数：${report.count} / ${MAX_FILES}`);
  console.log(`_headers 规则数：${headerRules} / ${MAX_HEADER_RULES}`);
  for (const warning of report.warnings) console.warn(`⚠ ${warning}`);
  for (const error of report.errors) console.error(`✗ ${error}`);
  if (report.errors.length > 0) process.exit(1);
}
