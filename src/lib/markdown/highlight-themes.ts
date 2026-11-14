// 高亮主题的 id：tool.ts 的 schema 要用，又不能 import highlight.ts（会把 shiki 带进主线程和服务端的模块图）
export const highlightThemes = [
  "github-light",
  "github-dark",
  "one-dark-pro",
  "vitesse-light",
] as const;

export type HighlightTheme = (typeof highlightThemes)[number];
