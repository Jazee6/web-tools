/// <reference types="bun" />
// 部署后把新增、变更、下线的 URL 推送给 IndexNow（architecture §9、§17）。
// 以 sitemap 为准：部署前抓线上 sitemap 存快照（snapshot），部署后与 dist/client 里的新 sitemap 对比再推送（submit）。
// 推送只是加快收录，失败不阻塞部署：抓取或推送出错时打印 GitHub Actions 警告，退出码仍为 0。
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { site } from "../src/lib/site";

export const ENDPOINT = "https://api.indexnow.org/indexnow";
// 单次请求最多 10,000 条 URL（IndexNow 协议）
export const MAX_URLS_PER_REQUEST = 10_000;
const SNAPSHOT_PATH = ".cache/indexnow-snapshot.json";

// loc → lastmod（没有 lastmod 时为空字符串）
export type SitemapEntries = Map<string, string>;

export const parseSitemapXml = (xml: string): { loc: string; lastmod: string }[] =>
  [...xml.matchAll(/<(?:url|sitemap)>([\s\S]*?)<\/(?:url|sitemap)>/g)].map(([, body]) => ({
    loc: /<loc>([^<]+)<\/loc>/.exec(body!)?.[1]?.trim() ?? "",
    lastmod: /<lastmod>([^<]+)<\/lastmod>/.exec(body!)?.[1]?.trim() ?? "",
  }));

// 读 sitemap-index.xml 及其中列出的每个子 sitemap；readText 按绝对 URL 取内容（线上 fetch 或本地文件）
export const loadSitemaps = async (
  readText: (url: string) => Promise<string>,
): Promise<SitemapEntries> => {
  const index = parseSitemapXml(await readText(new URL("/sitemap-index.xml", site.url).href));
  const entries: SitemapEntries = new Map();
  for (const { loc } of index) {
    for (const url of parseSitemapXml(await readText(loc))) entries.set(url.loc, url.lastmod);
  }
  return entries;
};

// 需要推送的 URL：新增的、lastmod 变化的、从 sitemap 中消失的（下线或变成 noindex，让搜索引擎重新抓取）
export const changedUrls = (before: SitemapEntries, after: SitemapEntries): string[] => [
  ...[...after].filter(([loc, lastmod]) => before.get(loc) !== lastmod).map(([loc]) => loc),
  ...[...before.keys()].filter((loc) => !after.has(loc)),
];

export interface SubmitResult {
  count: number;
  status: number;
  body: string;
}

export const submitUrls = async (
  urls: string[],
  fetchImpl: (url: string, init: RequestInit) => Promise<Response> = fetch,
): Promise<SubmitResult[]> => {
  const { host } = new URL(site.url);
  const results: SubmitResult[] = [];
  for (let i = 0; i < urls.length; i += MAX_URLS_PER_REQUEST) {
    const urlList = urls.slice(i, i + MAX_URLS_PER_REQUEST);
    const response = await fetchImpl(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: site.indexNowKey,
        keyLocation: new URL(`/${site.indexNowKey}.txt`, site.url).href,
        urlList,
      }),
      signal: AbortSignal.timeout(30_000),
    });
    results.push({ count: urlList.length, status: response.status, body: await response.text() });
  }
  return results;
};

// 200 已接收，202 表示已接收但 key 还在验证
export const isAccepted = (status: number) => status === 200 || status === 202;

const warn = (message: string) => console.log(`::warning title=IndexNow::${message}`);

const fetchText = async (url: string) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`${url} 返回 ${response.status}`);
  return response.text();
};

const readLocal = (root: string) => async (url: string) =>
  readFileSync(join(root, new URL(url).pathname), "utf8");

const snapshot = async (out: string) => {
  let entries: Record<string, string> | null = null;
  try {
    entries = Object.fromEntries(await loadSitemaps(fetchText));
    console.log(`线上 sitemap：${Object.keys(entries).length} 条 URL`);
  } catch (error) {
    warn(`抓取线上 sitemap 失败，部署后将推送全部 URL：${(error as Error).message}`);
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(entries));
};

const submit = async (snapshotPath: string, root: string, dryRun: boolean) => {
  let before: SitemapEntries = new Map();
  try {
    const saved = JSON.parse(readFileSync(snapshotPath, "utf8")) as Record<string, string> | null;
    if (saved) before = new Map(Object.entries(saved));
  } catch {
    warn(`没有读到快照 ${snapshotPath}，按全部 URL 推送`);
  }
  const after = await loadSitemaps(readLocal(root));
  const urls = changedUrls(before, after);
  console.log(`sitemap ${after.size} 条 URL，需要推送 ${urls.length} 条`);
  if (dryRun) {
    for (const url of urls) console.log(url);
    return;
  }
  if (urls.length === 0) return;
  try {
    for (const result of await submitUrls(urls)) {
      if (isAccepted(result.status))
        console.log(`已推送 ${result.count} 条（HTTP ${result.status}）`);
      else warn(`推送 ${result.count} 条失败：HTTP ${result.status} ${result.body.slice(0, 200)}`);
    }
  } catch (error) {
    warn(`推送失败：${(error as Error).message}`);
  }
};

if (import.meta.main) {
  const [command, ...rest] = process.argv.slice(2);
  const dryRun = rest.includes("--dry-run");
  if (command === "snapshot") await snapshot(SNAPSHOT_PATH);
  else if (command === "submit") await submit(SNAPSHOT_PATH, "dist/client", dryRun);
  else if (command === "plan") {
    // 本地预览：拿线上 sitemap 与本地构建产物对比，只打印不推送
    await snapshot(SNAPSHOT_PATH);
    await submit(SNAPSHOT_PATH, "dist/client", true);
  } else {
    console.error("用法：bun scripts/indexnow.ts snapshot | submit [--dry-run] | plan");
    process.exit(1);
  }
}
