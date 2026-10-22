// /api/tools/* 的约定，浏览器端与 Worker 共用（不要在这里引入注册表或服务端模块）
export const toolApiPath = (id: string) => `/api/tools/${id}`;

export const TURNSTILE_HEADER = "x-turnstile-token";

// 平台级错误码：文案在 messages/*.json，不在各 Tool 的内容 frontmatter
export type PlatformErrorCode = "rate_limited" | "verification_failed";
