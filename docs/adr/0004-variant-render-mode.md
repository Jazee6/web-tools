# Tool Variant 渲染模式随 Cloudflare 计划切换

Tool Variant 的最终形态是按需渲染：上万个 Variant × 7 个 Locale 会超过 Cloudflare 每个 Worker 版本的静态文件上限（Free 2 万，Paid 10 万），构建时间也会随数量线性增长。届时 Worker 按需 SSR，内容在构建时按 Tool × Locale 打包成 JSON 静态资源，通过 `env.ASSETS` 读取，渲染结果写入缓存键带部署版本号的 Cache API。但在 Workers Free 上，每次 SSR（包括缓存命中）都要占用每天 10 万次的请求配额，而静态资源免费且不限量。所以 P0 阶段先把 Variant 预渲染成静态文件（static 模式），等文件数达到上限的 80% 或升级到 Paid 计划时，再用一个配置开关切到 on-demand 模式。两种模式下，sitemap、hreflang、llms.txt 和搜索索引都从数据生成，不扫描构建产物，所以切换模式不影响它们。
