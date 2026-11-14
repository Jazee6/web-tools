import type { Token, Tokens } from "marked";
import { createHighlighterCore, type HighlighterCore, type ThemedToken } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { bundledLanguages } from "shiki/langs";

import type { HighlightTheme } from "./highlight-themes";

// shiki 细粒度用法：JavaScript 正则引擎（不需要 WASM）；主题和语法都按需动态 import，
// 语法按代码块里出现的语言加载，每种语言一个分块（ADR-0024）。只在 Web Worker 里用
const themeLoaders = {
  "github-light": () => import("shiki/themes/github-light.mjs"),
  "github-dark": () => import("shiki/themes/github-dark.mjs"),
  "one-dark-pro": () => import("shiki/themes/one-dark-pro.mjs"),
  "vitesse-light": () => import("shiki/themes/vitesse-light.mjs"),
} satisfies Record<HighlightTheme, unknown>;

export type { HighlightTheme };

let highlighter: Promise<HighlighterCore> | undefined;

const getHighlighter = () =>
  (highlighter ??= createHighlighterCore({
    themes: [],
    langs: [],
    // 固定 ES2018（u 标志）：默认 auto 按浏览器探测正则特性，Playwright 的 WebKit 上
    // `const a = 1;` 会把 1 和 ; 切成一个 token，各浏览器的高亮结果不一致
    engine: createJavaScriptRegexEngine({ target: "ES2018" }),
  }));

const languageOf = (lang: string | undefined) => {
  const id = lang?.trim().split(/\s+/)[0]?.toLowerCase();
  return id && Object.hasOwn(bundledLanguages, id)
    ? (id as keyof typeof bundledLanguages)
    : undefined;
};

export interface Highlight {
  // 未知语言或没标语言的返回 undefined（按纯文本输出）
  tokens: (code: string, lang: string | undefined) => ThemedToken[][] | undefined;
  // 主题的代码块底色和默认文字色；没有要高亮的代码块时为 undefined
  colors?: { bg: string; fg: string };
}

// marked 词法树里所有代码块的语言（含列表、引用里的）
export const codeLanguages = (tokens: Token[]): (string | undefined)[] => {
  const langs: (string | undefined)[] = [];
  const walk = (list: Token[]) => {
    for (const token of list) {
      if (token.type === "code") langs.push((token as Tokens.Code).lang);
      if (token.type === "list") for (const item of (token as Tokens.List).items) walk(item.tokens);
      else if ("tokens" in token && Array.isArray(token.tokens)) walk(token.tokens);
    }
  };
  walk(tokens);
  return langs;
};

// 先加载主题和这些代码块要用的语法，返回同步的高亮函数
export const prepareHighlight = async (
  langs: (string | undefined)[],
  theme: HighlightTheme = "github-light",
): Promise<Highlight> => {
  const ids = [...new Set(langs.map(languageOf).filter((id) => id !== undefined))];
  if (ids.length === 0) return { tokens: () => undefined };
  const instance = await getHighlighter();
  if (!instance.getLoadedThemes().includes(theme)) {
    await instance.loadTheme(themeLoaders[theme]());
  }
  const loaded = new Set(instance.getLoadedLanguages());
  await Promise.all(
    ids.filter((id) => !loaded.has(id)).map((id) => instance.loadLanguage(bundledLanguages[id])),
  );
  const { bg, fg } = instance.getTheme(theme);
  return {
    tokens: (code, lang) => {
      const id = languageOf(lang);
      return id ? instance.codeToTokens(code, { lang: id, theme }).tokens : undefined;
    },
    colors: { bg, fg },
  };
};
