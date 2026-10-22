# Web Tools Roadmap

> 依据：[architecture.md](./architecture.md)（§19 分期路线）与 [docs/adr/](./adr/)。术语以 [GLOSSARY.md](../GLOSSARY.md) 为准。
> 各阶段以**退出条件**推进，不绑定日期。

## 总览

```
P0 平台 + 首发（Workers Free，Variant static 模式）
  M0 工程基座
   └▶ M1 Tool 契约 + 第一个 Tool 端到端
        ├▶ M2 Agent Interface 与 Server-assisted Tool ┐
        ├▶ M3 重型客户端运行时 + PWA                   ├▶ M6 遥测、门禁收口与上线
        ├▶ M4 Tool Variant 体系                       │
        └▶ M5 内容生产（可在 M1 后持续进行）            ┘
P1 规模化扩充（按数据扩充 Tool/Variant，按触发条件升级 Paid）
P2 扩展（更多 Locale 含 RTL、启用广告）
P3 视情况（账号、同步、付费能力）
```

M2、M3、M4 只依赖 M1，可以并行推进。M5 在 M1 的内容 schema 定稿后就能开始，持续到上线。

---

## P0 平台 + 首发

**目标**：约 30 个 Tool 覆盖 4 个 Category、7 个 Locale，全部基础设施跑通，部署在 Workers Free。

### M0 工程基座

- Astro 7 + `@astrojs/cloudflare`、React 19、Bun、TypeScript strict。
- Tailwind CSS v4 + shadcn（Base UI），落地 UI 规则（主题变量、gap、variants）。
- Astro i18n routing（en 无前缀，`zh/ja/es/pt/de/fr` 用短代码）+ Paraglide。
- 代码质量：oxlint、oxfmt、`astro check`。
- 测试：Vitest（含 `@cloudflare/vitest-plugin`）、Playwright 骨架。
- CI/CD：
  - GitHub Actions：PR 上跑门禁，并用 `wrangler versions upload` 部署预览版本；合并到 main 后用 `wrangler deploy` 发布生产。
  - `check:limits`：静态文件数和单文件大小。
- Cloudflare 后台：
  - 绑定域名。
  - 关闭"屏蔽 AI 爬虫"的默认设置。
  - 创建 R2 bucket，绑定 assets 子域，并配置 CORS。

**退出条件**：空站点的 7 个 Locale 首页已部署到生产，PR 预览可用，全部门禁在 CI 中运行。

### M1 Tool 契约 + 第一个 Tool 端到端

用一个轻量 Tool（建议 JSON Formatter）贯通整条链路：

- 契约与注册：`defineTool`、`registry.ts` 自动发现。
- 由契约派生：表单（TanStack Form + Valibot）、JSON Schema（`@valibot/to-json-schema`）。
- 内容：`content.config.ts`（Zod 仅限此处），固定"答案优先"骨架，`review` 字段。
- Category 定义、扁平 URL，以及 Tool id 与 Category id 冲突校验。
- 页面产物：
  - JSON-LD（`schema-dts`）：WebApplication + BreadcrumbList + FAQPage。
  - `.md` 副本。
  - 自写的 sitemap、hreflang、llms.txt 生成器（数据驱动，含 en Reviewed 才可索引的规则）。
  - 缺失翻译时的 `_redirects`。
- OG 图：先用 takumi 跑一个 CJK 模板验证 CSS 支持是否够用（不够就回退 satori，需重新确认依赖）。
- 校验脚本：`check:seo`、`check:content`。
- ⌘K 搜索（shadcn Command + 构建期索引）。
- 由 `examples` 自动生成的 Playwright 冒烟测试。

**退出条件**：该 Tool 在 7 个 Locale 下完整渲染；Draft 和 Reviewed 两种状态对 robots、hreflang、sitemap 的影响都通过 `check:seo` 验证；Lighthouse 预算达标。

### M2 Agent Interface 与 Server-assisted Tool

- WebMCP 适配层：特性探测 `document.modelContext` 和 `navigator.modelContext`，渐进增强；在 Chrome 试验环境中实测。
- 远程 MCP：在 `/mcp` 用 `agents` 的 `createMcpHandler` 实现，工具列表由 `agent.remote` 自动生成。
- 防滥用：
  - Rate Limiting binding，**在 Free 计划上实测是否可用**；不可用就退回 KV 计数。
  - Turnstile。
- 第一个 Server-assisted Tool（建议 DNS Lookup），包括 SSRF 防护和 10ms CPU 验证。
- Paraglide 的 Locale 改为按请求隔离（例如 AsyncLocalStorage）：M0 用的 `globalVariable` 策略只适合逐页预渲染，Worker 并发处理请求时会串 Locale。

**退出条件**：MCP 客户端能列出并调用所有轻量 Tool；WebMCP 能在页面内调用 Tool；超过限流阈值后能正确拒绝。

### M3 重型客户端运行时 + PWA

- 类型化的 Web Worker RPC（Transferable）、能力探测和 Empty 状态。
- 由注册表生成 `_headers`，按页开启 COOP/COEP；未隔离时退回单线程。
- 每个引擎先做一个样板 Tool：
  - 图片：jSquash（Image Compressor）。
  - PDF：pdf.js + pdf-lib fork（Merge PDF）。
  - 音视频：Mediabunny + WebCodecs（Video Converter）。
  - 端侧 AI：Transformers.js + WebGPU，模型从 R2 assets 子域加载（Speech to Text），并带 Progress。
- 本地状态：IndexedDB（收藏、最近使用、偏好）、OPFS（中间产物）、"清除本地数据"。
- 手写 Service Worker：按需缓存、保留 COOP/COEP 响应头、离线兜底页；manifest。
- Vitest Browser Mode 覆盖 WASM、WebCodecs、WebGPU 三条路径。

**退出条件**：4 个样板 Tool 在最新版 Chrome、Safari、Firefox 上都能运行（能力缺失时显示 Empty），用过一次后可以离线使用。

### M4 Tool Variant 体系

- `variant.ts` 的 schema：预设、独有数据、`demand` 字段。
- 准入门槛：预设校验、差异校验、独有数据非空、内容近似度检测（自写 shingling / MinHash，阈值根据样本确定）。
- static 模式渲染、Variant 内链和面包屑、OG 图复用所属 Tool 的图。
- **on-demand 模式同步实现，但默认关闭**：Variant 内容按 Tool × Locale 打包成 JSON，Worker 通过 `env.ASSETS` 读取后 SSR，写入带部署版本号的 Cache API。用 `@cloudflare/vitest-plugin` 测试，确保随时可以切换。前提是 Paraglide Locale 已按请求隔离（见 M2），并有并发不同 Locale 请求的测试，否则错 Locale 的页面会被写进缓存。

**退出条件**：样板 Variant 能通过准入门槛，故意构造的薄内容 Variant 会让构建失败；切换开关后两种模式的输出（HTML、sitemap、hreflang）一致。

### M5 内容生产

- 风格指南写在 `docs/content/`，并为 7 个 Locale 各建一份术语表。
- 项目内 skill：`write-tool-content`、`translate-content`、`add-variant`。
- 用 CODEOWNERS 约束 Review Status 改成 `reviewed` 的权限。
- 内容产出：首发 Tool 的 en 内容 → 人工审核 en → 翻译 6 个 Locale → 抽检审核。审核时**优先 en**，因为非 en 页面要等 en 也是 Reviewed 才能被索引。
- 首批 Variant：每个 Tool 挑需求依据最充分的几个，不追求数量。

**退出条件**：首发 Tool 的 en 内容全部 Reviewed，其他 Locale 的 Reviewed 覆盖率有报告。

### M6 遥测、门禁收口与上线

- Cloudflare Web Analytics。
- `/api/e`：事件抽样 10%，错误全量上报并在同一会话内去重，写入 Analytics Engine。
- `@lhci/cli` 预算门禁全量开启（首屏 JS 按 architecture §15：Tool 页 ≤ 160 KB、其他页 ≤ 10 KB gzip，LCP ≤ 2.0s，CLS ≤ 0.05，TBT ≤ 150ms）。
- 补齐首发 Tool（见下方候选清单）。
- 上线清单：
  - Search Console 与 Bing Webmaster 验证，提交 sitemap。
  - IndexNow 推送接入 CI。
  - robots.txt 放行全部爬虫，并核对 Cloudflare 后台设置。
  - 准备关于页和隐私说明页（E-E-A-T）。
  - 确认配额监控：每天的 Worker 请求数、Analytics Engine 数据点数。

**退出条件**：约 30 个 Tool 上线，CI 全绿，en 页面开始被收录。

### 首发 Tool 候选清单（提案，待确认）

| Category | Tool | 备注 |
|---|---|---|
| 开发者 / 文本 / 换算 | JSON Formatter（M1 样板）、Base64 Encode/Decode、URL Encode/Decode、Hash Generator、UUID Generator、JWT Decoder、Regex Tester、Timestamp Converter、Color Converter、Word Counter、Case Converter、Unit Converter | 全部可设 `agent.remote: true` |
| 开发者 | DNS Lookup | M2 样板 Server-assisted Tool |
| 图片 | Image Compressor（M3 样板）、Image Converter、Image Resizer、Image Cropper、Background Remover | Background Remover 用 Transformers.js，需核对模型许可证 |
| PDF / 文档 | Merge PDF（M3 样板）、Split PDF、PDF to Image、Image to PDF、Organize PDF（旋转、排序、删除页） | Image to PDF 的主 Category 是 PDF，同时列在图片下 |
| 音视频 + 端侧 AI | Video Converter（M3 样板）、Trim Video、Extract Audio、Audio Converter、Speech to Text（M3 样板）、Image to Text（OCR） | 两个 AI Tool 都需核对模型许可证 |

共 29 个。这些 Tool 都只用已确认的库；HEIC 解码、PDF 重压缩之类需要新依赖的 Tool 放到 P1，届时单独确认。

---

## P1 规模化扩充

- 根据 Search Console 和关键词数据，分批增加 Tool（目标 100–300 个）和 Variant。**每批放量后先观察收录率和排名，再放下一批**。
- 按 architecture.md §20 的触发条件升级到 Workers Paid：静态文件数超过 1.6 万、Worker 请求连续多日每天超过 7 万、出现 CPU 超限、需要内容协商。升级后：
  - Variant 切换到 on-demand 模式（ADR-0004）。
  - 启用 `Accept: text/markdown` 内容协商。
  - 事件抽样比例提高到 100%。
- 有新依赖的 Tool（HEIC、PDF 压缩等）逐个确认依赖后再做。
- 把远程 MCP 提交到 MCP registry 等可被发现的渠道。

**退出条件**：Tool 数达到 100 个以上，Variant 的收录率稳定，没有出现规模化内容滥用相关的人工处罚。

## P2 扩展

- 增加 Locale：ko、ru、it、id、tr、vi、pl，以及 RTL 语言（ar 等），届时需要 RTL 布局支持。
- 启用广告：
  - 先在非 COI 页面启用 AdSlot。
  - 引入 CMP 同意弹窗，这和当前"无需同意弹窗"的定位冲突，届时另写 ADR。
  - 广告对 CWV 的影响要纳入预算门禁。

## P3 视情况

- 账号、跨设备同步收藏和偏好、付费能力（更大文件、批处理、API 额度），届时另写 ADR。

---

## 开放项

- 首发 Tool 候选清单需要确认。
- Background Remover、Speech to Text、OCR 所用模型的许可证（必须允许商用）。
- Rate Limiting binding 在 Free 计划上是否可用（M2 实测）。
- ~~takumi 的 CSS 支持是否满足 OG 模板（M1 验证）~~：已验证。zh/ja 能正确排版，CJK 字体用 fontsource 的 unicode-range 子集，按图上用到的字符按需加载。
- ~~首屏 JS 预算（≤ 50 KB gzip）与 React island 冲突~~：已决定调高预算并做瘦身（architecture §15）。⌘K 改为按需加载后，首页和 Category 页约 1 KB，Tool 页约 150 KB。
- 内容近似度阈值（M4 根据样本确定）。
