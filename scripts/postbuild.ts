/// <reference types="bun" />
// 构建后生成平台文件和 OG 图（Astro 页面无法输出以 _ 开头的文件，takumi 是 Node 原生模块，不能在 workerd 预渲染中运行）：
// - _redirects：缺失翻译 302 到 en（ADR-0007）
// - _headers：.md 副本用一条规则声明 canonical 指向 HTML 页面（ADR-0019）；需要跨源隔离的 Tool 页加 COOP/COEP
// - og/{locale}/{tool}.png（Variant 复用所属 Tool 的图）
// - icons/*.png（manifest 图标）、sw.js（Service Worker，注入离线页资源清单）
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { locales } from "../src/lib/i18n/locales";
import { ogImagePath } from "../src/lib/og";
import {
  isolatedPaths,
  isolationHeaders,
  renderHeaderRules,
  workerScriptPaths,
} from "../src/lib/runtime/isolation";
import { missingTranslationRedirects, renderRedirects } from "../src/lib/seo/indexing";
import { canonicalMarkdownRule } from "../src/lib/seo/markdown";
import { site } from "../src/lib/site";
import { resolveVariantMode } from "../src/lib/variant-mode";
import {
  readCategoryContent,
  readToolContent,
  readVariantContent,
  statusesByOwner,
  loadTools,
} from "./lib/content";
import { renderOgImage } from "./lib/og";
import { buildServiceWorker, icons, renderIcon } from "./lib/pwa";

const root = process.argv[2] ?? "dist/client";

const tools = await loadTools();
const toolContent = await readToolContent();
const categoryContent = await readCategoryContent();
const toolStatuses = statusesByOwner(toolContent);
const categoryStatuses = statusesByOwner(categoryContent);
// Variant 的 owner 是 "<tool>/<variant>"，即它的路径。on-demand 模式下缺失翻译由 Worker 返回 302（ADR-0004）
const variantStatuses =
  resolveVariantMode(process.env.VARIANT_RENDER_MODE) === "static"
    ? statusesByOwner(await readVariantContent())
    : new Map();
const pages = [...toolStatuses, ...variantStatuses, ...categoryStatuses].map(([id, statuses]) => ({
  path: `/${id}`,
  statuses,
}));

const redirects = pages.flatMap((page) => missingTranslationRedirects(page.statuses, page.path));
writeFileSync(join(root, "_redirects"), renderRedirects(redirects));

appendFileSync(join(root, "_headers"), canonicalMarkdownRule(site.url));

const isolated = tools
  .filter((tool) => tool.runtime.crossOriginIsolated)
  .flatMap((tool) => isolatedPaths(tool.id));
appendFileSync(join(root, "_headers"), renderHeaderRules(isolated, isolationHeaders));
if (isolated.length > 0) {
  appendFileSync(
    join(root, "_headers"),
    renderHeaderRules(workerScriptPaths, {
      "Cross-Origin-Embedder-Policy": isolationHeaders["Cross-Origin-Embedder-Policy"],
    }),
  );
}

const siteNames = Object.fromEntries(
  await Promise.all(
    locales.map(async (locale) => {
      const messages = (await Bun.file(`messages/${locale}.json`).json()) as { site_name: string };
      return [locale, messages.site_name] as const;
    }),
  ),
);
let images = 0;
for (const file of toolContent) {
  const tool = tools.find((candidate) => candidate.id === file.owner)!;
  const category = categoryContent.find(
    (entry) => entry.owner === tool.category && entry.locale === file.locale,
  );
  const png = await renderOgImage({
    locale: file.locale,
    siteName: siteNames[file.locale]!,
    category: category?.data.name ?? "",
    title: file.data.name,
    summary: String(file.data.answer),
  });
  const out = join(root, ogImagePath(file.locale, tool.id));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, png);
  images++;
}

for (const icon of icons) {
  const out = join(root, icon.path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, await renderIcon(icon.size, icon.glyph));
}
const sw = await buildServiceWorker(root);

console.log(
  `postbuild：${redirects.length} 条重定向，${isolated.length} 条跨源隔离规则，${images} 张 OG 图，${icons.length} 个图标，sw.js 预缓存 ${sw.assets.length} 个离线页资源`,
);
