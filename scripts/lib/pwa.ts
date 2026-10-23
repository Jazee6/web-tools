/// <reference types="bun" />
// 构建期 PWA 产物（architecture §13）：manifest 图标和 Service Worker 脚本。
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { Renderer } from "@takumi-rs/core";

import { offlinePages } from "../../src/lib/runtime/sw-routes";

// favicon.svg 用 prefers-color-scheme 切换描边色；图标是位图，固定为浅色背景 + 深色描边
const iconSvg = () =>
  readFileSync("public/favicon.svg", "utf8")
    .replace(/<style>[\s\S]*?<\/style>/, "")
    .replace(/<!--[\s\S]*?-->/, "")
    .replace("<svg ", '<svg stroke="#171717" ');

// glyph 是图形占边长的比例；maskable 图标的安全区是中心 80% 的圆，glyph 再缩小一些
export const icons = [
  { path: "icons/192.png", size: 192, glyph: 0.625 },
  { path: "icons/512.png", size: 512, glyph: 0.625 },
  { path: "icons/maskable-512.png", size: 512, glyph: 0.5 },
  { path: "icons/apple-touch-icon.png", size: 180, glyph: 0.625 },
] as const;

const renderer = new Renderer();

export const renderIcon = (size: number, glyph: number): Promise<Buffer> =>
  renderer.render(
    {
      type: "container",
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      },
      children: [
        {
          type: "image",
          src: iconSvg(),
          style: { width: `${glyph * 100}%`, height: `${glyph * 100}%` },
        },
      ],
    },
    { width: size, height: size },
  );

// 离线页（各 Locale）引用的 /_astro/ 资源，Service Worker 安装时连同离线页一起预缓存
export const offlineAssets = (root: string): string[] => {
  const assets = new Set<string>();
  for (const page of offlinePages) {
    const html = readFileSync(join(root, `${page}.html`), "utf8");
    for (const [, path] of html.matchAll(/(?:href|src)="(\/_astro\/[^"]+)"/g)) assets.add(path!);
  }
  return [...assets].toSorted();
};

// 打包成 classic 脚本（不依赖 module Service Worker 的支持情况），注入离线页资源清单
export const buildServiceWorker = async (root: string): Promise<{ assets: string[] }> => {
  const assets = offlineAssets(root);
  const result = await Bun.build({
    entrypoints: ["src/sw.ts"],
    target: "browser",
    format: "iife",
    minify: true,
    define: { OFFLINE_ASSETS: JSON.stringify(assets) },
  });
  if (!result.success) throw new AggregateError(result.logs, "sw.ts 打包失败");
  await Bun.write(join(root, "sw.js"), result.outputs[0]!);
  return { assets };
};
