// 公众号文章的样式常量：取自本站的 shadcn preset（base-luma / neutral，radius 0.625rem）和 typeset.css 的节奏。
// 公众号编辑器会清洗样式，旧版 WebView 不认 oklch，所以颜色写成 hex；字号、间距用 px，按 16px 正文换算。

export const accents = {
  neutral: "#171717",
  blue: "#155dfc",
  green: "#008236",
  orange: "#ca3500",
  red: "#e7000b",
  rose: "#ec003f",
  violet: "#7f22fe",
  yellow: "#a65f00",
} as const;

export type Accent = keyof typeof accents;

export const accentIds = Object.keys(accents) as [Accent, ...Accent[]];

// preset 的 neutral token（oklch → sRGB）
export const colors = {
  foreground: "#0a0a0a",
  muted: "#f5f5f5",
  mutedForeground: "#737373",
  border: "#e5e5e5",
};

// 公众号里加载不了网络字体，用系统字体栈；字体名用单引号，放进 style 属性不会截断
export const fonts = {
  body: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif",
  mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
};

// typeset.css：--typeset-flow 1.25em、radius 0.625rem
export const flow = 20;
export const radius = 10;
