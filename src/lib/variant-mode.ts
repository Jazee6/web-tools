// Variant 渲染模式开关（ADR-0004，architecture §7）。
// static：预渲染成静态文件，访问不经过 Worker，适合 Workers Free。
// on-demand：Variant 内容按 Tool × Locale 打包成 JSON，Worker 经 env.ASSETS 读取后 SSR，结果写入 Cache API。
// 切换条件见 architecture §20：静态文件数到上限的 80%，或升级到 Workers Paid。
export type VariantRenderMode = "static" | "on-demand";

export const configuredVariantMode: VariantRenderMode = "static";

// 构建时可以用环境变量 VARIANT_RENDER_MODE 临时覆盖（check:variant-modes 用它构建 on-demand 版本做对比）
export const resolveVariantMode = (override: string | undefined): VariantRenderMode => {
  if (override === undefined || override === "") return configuredVariantMode;
  if (override !== "static" && override !== "on-demand") {
    throw new Error(`VARIANT_RENDER_MODE 只能是 static 或 on-demand，收到 ${override}`);
  }
  return override;
};

// astro.config.ts 按模式注入的路由
export const variantRoutes = {
  page: "/[...locale]/[slug]/[variant]",
  markdown: "/[...locale]/[slug]/[variant].md",
  // on-demand 模式的内容包，每个 Tool × Locale 一个
  data: "/variant-data/[locale]/[tool].json",
} as const;

export const variantDataPath = (locale: string, toolId: string): string =>
  `/variant-data/${locale}/${toolId}.json`;
