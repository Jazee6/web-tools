import { createHighlighterCore, type HighlighterCore, type ThemedToken } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { bundledLanguages } from "shiki/langs";

// shiki 细粒度用法：JavaScript 正则引擎（不需要 WASM），只预载主题；
// 语法按代码块里出现的语言动态 import，每种语言一个分块（ADR-0024）
const THEME = "github-light";

let highlighter: Promise<HighlighterCore> | undefined;

const getHighlighter = () =>
  (highlighter ??= createHighlighterCore({
    themes: [import("shiki/themes/github-light.mjs")],
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

export type Highlight = (code: string, lang: string | undefined) => ThemedToken[][] | undefined;

// 先加载这些代码块要用的语法，返回同步的高亮函数；未知语言或没标语言的返回 undefined（按纯文本输出）
export const prepareHighlight = async (langs: (string | undefined)[]): Promise<Highlight> => {
  const ids = [...new Set(langs.map(languageOf).filter((id) => id !== undefined))];
  if (ids.length === 0) return () => undefined;
  const instance = await getHighlighter();
  const loaded = new Set(instance.getLoadedLanguages());
  await Promise.all(
    ids.filter((id) => !loaded.has(id)).map((id) => instance.loadLanguage(bundledLanguages[id])),
  );
  return (code, lang) => {
    const id = languageOf(lang);
    return id ? instance.codeToTokens(code, { lang: id, theme: THEME }).tokens : undefined;
  };
};
