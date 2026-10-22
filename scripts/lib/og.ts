// 构建期 OG 图（architecture §9）：takumi 把节点树直接渲染成 PNG，CJK 字体按 Locale 传入。
import { readFileSync } from "node:fs";

import { type Font, Renderer } from "@takumi-rs/core";

import type { Locale } from "../../src/lib/i18n/locales";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// fontsource 把 CJK 字体按 unicode-range 拆成上百个子集；只加载这张图上用到的字符所在的子集
const cjkFamily: Partial<Record<Locale, { pkg: string; name: string }>> = {
  zh: { pkg: "noto-sans-sc", name: "Noto Sans SC" },
  ja: { pkg: "noto-sans-jp", name: "Noto Sans JP" },
};

const parseRanges = (value: string): [number, number][] =>
  value.split(",").map((part) => {
    const [start, end = start] = part.trim().replace(/^U\+/i, "").split("-");
    return [Number.parseInt(start!, 16), Number.parseInt(end!, 16)];
  });

const fontDir = (pkg: string) => `node_modules/@fontsource/${pkg}`;

const subsetsCache = new Map<string, { key: string; ranges: [number, number][] }[]>();

const subsets = (pkg: string) => {
  let list = subsetsCache.get(pkg);
  if (!list) {
    const unicode = JSON.parse(readFileSync(`${fontDir(pkg)}/unicode.json`, "utf8")) as Record<
      string,
      string
    >;
    list = Object.entries(unicode).map(([key, value]) => ({
      key: key.replace(/^\[(.+)\]$/, "$1"),
      ranges: parseRanges(value),
    }));
    subsetsCache.set(pkg, list);
  }
  return list;
};

const cjkFonts = (locale: Locale, text: string): Font[] => {
  const family = cjkFamily[locale];
  if (!family) return [];
  const codePoints = [...new Set([...text].map((char) => char.codePointAt(0)!))];
  return subsets(family.pkg)
    .filter(({ ranges }) =>
      codePoints.some((cp) => ranges.some(([start, end]) => cp >= start && cp <= end)),
    )
    .flatMap(({ key, ranges }) =>
      [400, 700].map((weight) => ({
        name: family.name,
        weight,
        unicodeRange: ranges,
        data: readFileSync(
          `${fontDir(family.pkg)}/files/${family.pkg}-${key}-${weight}-normal.woff2`,
        ),
      })),
    );
};

const latinFonts: Font[] = ["latin", "latin-ext"].map((subset) => ({
  name: "Inter",
  data: readFileSync(
    `node_modules/@fontsource-variable/inter/files/inter-${subset}-wght-normal.woff2`,
  ),
}));

export interface OgCard {
  locale: Locale;
  siteName: string;
  category: string;
  title: string;
  summary: string;
}

const renderer = new Renderer();

export const renderOgImage = async (card: OgCard): Promise<Buffer> => {
  const cjk = cjkFamily[card.locale]?.name;
  const fontFamily = ["Inter", ...(cjk ? [cjk] : []), "sans-serif"].join(", ");
  return renderer.render(
    {
      type: "container",
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: "#ffffff",
        color: "#171717",
        fontFamily,
      },
      children: [
        {
          type: "container",
          style: { display: "flex", flexDirection: "column", gap: 28 },
          children: [
            { type: "text", text: card.category, style: { fontSize: 32, color: "#737373" } },
            {
              type: "text",
              text: card.title,
              style: { fontSize: 84, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em" },
            },
            {
              type: "text",
              text: card.summary,
              style: { fontSize: 36, lineHeight: 1.4, color: "#525252", lineClamp: 3 },
            },
          ],
        },
        {
          type: "text",
          text: card.siteName,
          style: { fontSize: 32, fontWeight: 700 },
        },
      ],
    },
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [...latinFonts, ...cjkFonts(card.locale, Object.values(card).join(""))],
      lang: card.locale === "zh" ? "zh-Hans" : card.locale,
    },
  );
};
