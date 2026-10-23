/// <reference types="bun" />
// 两种 Variant 渲染模式的输出一致（ADR-0004，roadmap M4 退出条件）：先 bun run build 得到 static 模式的 dist/，
// 这里用 VARIANT_RENDER_MODE=on-demand 另建一份 dist-on-demand/，启动它的 Worker 预览后逐项对比：
// - 除 Variant 页外的静态产物（其他页面、sitemap、llms.txt、⌘K 索引、_headers）逐字节相同；
// - 每个 Variant 页和 .md 副本的 SSR 响应与 static 模式的文件逐字节相同（HTML 里含 hreflang、canonical）；
//   第一轮并发请求不同 Locale 的页面，缓存都未命中，验证按请求隔离的 Locale；第二轮应命中缓存；
// - static 模式 _redirects 里的 Variant 缺失翻译跳转，SSR 返回同样的 302；不存在的 Variant 返回 404。
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { localizePath, locales } from "../src/lib/i18n/locales";
import { readVariantContent } from "./lib/content";

const staticDir = "dist";
const onDemandDir = "dist-on-demand";
const port = 4398;
const origin = `http://localhost:${port}`;
const env = { ...process.env, VARIANT_RENDER_MODE: "on-demand" };
// 本机预览不走代理（开发机上可能设置了 HTTP(S)_PROXY）
process.env.NO_PROXY = ["localhost", process.env.NO_PROXY].filter(Boolean).join(",");

const errors: string[] = [];

const run = async (cmd: string[]) => {
  const proc = Bun.spawn(cmd, { env, stdout: "ignore", stderr: "inherit" });
  if ((await proc.exited) !== 0) throw new Error(`${cmd.join(" ")} 失败`);
};

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const variantContent = await readVariantContent();
const variantPaths = variantContent.map((file) => localizePath(file.locale, `/${file.owner}`));
const isVariantFile = (path: string) =>
  variantPaths.some((page) => path === `${page}.html` || path === `${page}.md`);

await run(["bunx", "astro", "build", "--outDir", onDemandDir]);
await run(["bun", "scripts/postbuild.ts", `${onDemandDir}/client`]);

// 静态产物：文本文件逐字节对比（Variant 页只在 static 模式里是文件，内容包只在 on-demand 模式里有）
const textFile = /\.(?:html|md|xml|txt|json|webmanifest)$|\/_headers$/;
const staticFiles = walk(`${staticDir}/client`)
  .map((path) => `/${relative(`${staticDir}/client`, path)}`)
  .filter((path) => textFile.test(path) && !isVariantFile(path));
for (const path of staticFiles) {
  let other: string;
  try {
    other = readFileSync(`${onDemandDir}/client${path}`, "utf8");
  } catch {
    errors.push(`${path}：on-demand 构建里没有这个文件`);
    continue;
  }
  if (other !== readFileSync(`${staticDir}/client${path}`, "utf8")) {
    errors.push(`${path}：两种模式的内容不同`);
  }
}

// _redirects：on-demand 模式下 Variant 的缺失翻译由 Worker 跳转，其余规则相同
const redirectLines = (dir: string) =>
  readFileSync(`${dir}/client/_redirects`, "utf8").split("\n").filter(Boolean);
const variantRedirects = redirectLines(staticDir).filter((line) =>
  variantPaths.some((page) => line.split(" ")[1] === page || line.split(" ")[1] === `${page}.md`),
);
const otherRedirects = redirectLines(staticDir).filter((line) => !variantRedirects.includes(line));
if (redirectLines(onDemandDir).join("\n") !== otherRedirects.join("\n")) {
  errors.push("_redirects：除 Variant 的缺失翻译外，两种模式的规则不同");
}

const preview = Bun.spawn(
  ["bunx", "astro", "preview", "--ignore-lock", "--outDir", onDemandDir, "--port", String(port)],
  { env, stdout: "ignore", stderr: "ignore" },
);
try {
  for (let attempt = 0; ; attempt++) {
    try {
      await fetch(origin);
      break;
    } catch {
      if (attempt > 120) throw new Error("on-demand 预览没有启动");
      await Bun.sleep(500);
    }
  }

  // 有 .md 副本的 Variant（可索引页面）也要逐字节一致
  const pages = variantPaths.flatMap((path) => {
    const files = [`${path}.html`];
    try {
      readFileSync(`${staticDir}/client${path}.md`);
      files.push(`${path}.md`);
    } catch {
      // Draft 页面没有 .md 副本（ADR-0019）
    }
    return files.map((file) => ({ file, url: file.replace(/\.html$/, "") }));
  });

  const compare = async (round: string, expectCache: string) => {
    const responses = await Promise.all(
      pages.map(async (page) => ({ page, response: await fetch(`${origin}${page.url}`) })),
    );
    for (const { page, response } of responses) {
      const where = `${round} ${page.url}`;
      if (response.status !== 200) {
        errors.push(`${where}：返回 ${response.status}`);
        continue;
      }
      if ((await response.text()) !== readFileSync(`${staticDir}/client${page.file}`, "utf8")) {
        errors.push(`${where}：SSR 输出与 static 模式的文件不同`);
      }
      if (response.headers.get("x-variant-cache") !== expectCache) {
        errors.push(
          `${where}：缓存应为 ${expectCache}，实际 ${response.headers.get("x-variant-cache")}`,
        );
      }
    }
  };
  // 第一轮：每个页面同时请求三次，各 Locale 交错并发渲染，全部未命中缓存
  const firstRound = await Promise.all(
    [0, 1, 2].map(() =>
      Promise.all(
        pages.map(async (page) => ({
          page,
          html: await (await fetch(`${origin}${page.url}`)).text(),
        })),
      ),
    ),
  );
  for (const { page, html } of firstRound.flat()) {
    if (html !== readFileSync(`${staticDir}/client${page.file}`, "utf8")) {
      errors.push(`并发 ${page.url}：SSR 输出与 static 模式的文件不同（Locale 串了？）`);
    }
  }
  // 第二轮：命中缓存（写入在 waitUntil 里，稍等一下），内容仍然一致
  await Bun.sleep(500);
  await compare("缓存", "hit");

  for (const line of variantRedirects) {
    const [from, to] = line.split(" ");
    const response = await fetch(`${origin}${from}`, { redirect: "manual" });
    if (response.status !== 302 || response.headers.get("location") !== to) {
      errors.push(
        `${from}：应 302 到 ${to}，实际 ${response.status} ${response.headers.get("location")}`,
      );
    }
  }
  for (const path of ["/video-converter/no-such-variant", "/no-such-tool/x", "/zh/no-such-page"]) {
    const response = await fetch(`${origin}${path}`, { redirect: "manual" });
    if (response.status !== 404) errors.push(`${path}：应返回 404，实际 ${response.status}`);
  }

  console.log(
    `对比 ${staticFiles.length} 个静态文件、${pages.length} 个 Variant 页面（${locales.length} 个 Locale 中已发布的）、${variantRedirects.length} 条缺失翻译跳转`,
  );
} finally {
  preview.kill();
}

for (const error of errors) console.error(`✗ ${error}`);
if (errors.length > 0) process.exit(1);
console.log("✓ check:variant-modes 通过：static 与 on-demand 模式的输出一致");
