/// <reference types="bun" />
// 构建后生成平台文件和 OG 图（Astro 页面无法输出以 _ 开头的文件，takumi 是 Node 原生模块，不能在 workerd 预渲染中运行）：
// - _redirects：缺失翻译 302 到 en（ADR-0007）
// - _headers：不可索引页面的 .md 副本加 X-Robots-Tag: noindex
// - og/{locale}/{tool}.png
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { localizePath, locales } from "../src/lib/i18n/locales";
import { ogImagePath } from "../src/lib/og";
import { isIndexable, missingTranslationRedirects, renderRedirects } from "../src/lib/seo/indexing";
import { readCategoryContent, readToolContent, statusesByOwner, loadTools } from "./lib/content";
import { renderOgImage } from "./lib/og";

const root = process.argv[2] ?? "dist/client";

const tools = await loadTools();
const toolContent = await readToolContent();
const categoryContent = await readCategoryContent();
const toolStatuses = statusesByOwner(toolContent);
const categoryStatuses = statusesByOwner(categoryContent);
const pages = [...toolStatuses, ...categoryStatuses].map(([id, statuses]) => ({
  path: `/${id}`,
  statuses,
}));

const redirects = pages.flatMap((page) => missingTranslationRedirects(page.statuses, page.path));
writeFileSync(join(root, "_redirects"), renderRedirects(redirects));

const noindexMarkdown = pages.flatMap((page) =>
  locales
    .filter((locale) => page.statuses[locale] && !isIndexable(page.statuses, locale))
    .map((locale) => `${localizePath(locale, page.path)}.md`),
);
appendFileSync(
  join(root, "_headers"),
  noindexMarkdown.map((path) => `\n${path}\n  X-Robots-Tag: noindex\n`).join(""),
);

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

console.log(
  `postbuild：${redirects.length} 条重定向，${noindexMarkdown.length} 个 noindex .md，${images} 张 OG 图`,
);
