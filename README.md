# Web Tools

多语言、搜索优先的在线工具站，Tool 在访客浏览器内运行。线上地址：https://tools.jaze.top

- 架构：[docs/architecture.md](docs/architecture.md)
- 路线图：[docs/roadmap.md](docs/roadmap.md)
- 术语：[GLOSSARY.md](GLOSSARY.md)

## 开发

```sh
bun install
bun run dev        # 本地开发（workerd）
bun run build      # 构建
bun run test       # Vitest
bun run test:e2e   # Playwright（本地构建后用 astro preview）
```
