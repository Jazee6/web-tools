// Site Page 与 Tool / Category 共用顶层 slug 命名空间。
export const sitePageIds = ["about", "privacy", "licenses"] as const;
export type SitePageId = (typeof sitePageIds)[number];
