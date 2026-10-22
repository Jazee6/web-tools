# Astro 7 + Cloudflare Workers 作为框架与部署平台

站点绝大部分是静态内容，只有一块是交互式 Tool，所以选择默认零 JS、按 island 水合的 Astro 7，交互部分用 React，部署在 Cloudflare Workers。这样能拿到最好的 Core Web Vitals，全球边缘分发、流量成本也低；Astro 7 的开发服务器直接运行 workerd，开发环境和生产环境一致。代价是锁定 Cloudflare 运行时：Cache API、`env.ASSETS`、R2、Analytics Engine、Rate Limiting、Turnstile 都会深入代码，迁移成本按季度计。

## Considered Options

- Next.js 16：React 生态最全，但页面 JS 基线更重，并且偏向绑定 Vercel。
- TanStack Start：和 TanStack 生态一致，但内容层和 SEO 工具链需要自建。
