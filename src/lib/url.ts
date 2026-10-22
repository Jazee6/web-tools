// build.format: "file" 下预渲染时的 pathname 带 .html（/zh.html、/index.html），对外 URL 不带。
export const canonicalPath = (pathname: string): string =>
  pathname.replace(/(?:\/index)?\.html$/, "") || "/";
