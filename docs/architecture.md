# Web Tools 架构方案

> 状态：已对齐（2026-10-22 grilling 会话产出）；§21 中的剩余默认假设需在实现时核实。
> 术语以 [GLOSSARY.md](../GLOSSARY.md) 为准；关键取舍见 [docs/adr/](./adr/)。

## 0. 目标与原则

一个大而全、多语言、搜索优先的在线工具站。

- **SEO/GEO 优先**：每个决策先问"对收录、排名、被 AI 引用和被 agent 调用是否更好"。
- **客户端优先**：Tool 默认在访客浏览器内运行，文件不离开设备；服务端只做浏览器做不到的事。
- **不考虑兼容性**：只面向各主流浏览器最新稳定版，自由使用 Baseline 新特性（View Transitions、Speculation Rules、Popover、Anchor Positioning、Container Queries、WebGPU、WebCodecs、OPFS 等），不做 polyfill；能力缺失时用 Empty 状态说明，不降级实现。
- **一处定义，多处派生**：一个 Tool 只定义一次，页面表单、Agent Interface、结构化数据、测试用例都从同一份定义派生。
- **静态优先**：能做成静态资源的就不经过 Worker（在 Cloudflare 上，静态资源请求免费且不限量）。

## 1. 决策总表

| # | 决策 | 结论 |
|---|---|---|
| Q1 | 目标市场 | 英文优先，架构从第一天支持多 Locale |
| Q2 | 执行位置 | 客户端为主，少量 Server-assisted Tool |
| Q3 | 变现 | 首期不变现，预留广告位 |
| Q4 | 规模 | 100–300 个核心 Tool + 程序化 Tool Variant（数千到数万页） |
| Q5 | 框架 | Astro 7 + React islands |
| Q6 | 部署 | Cloudflare（Workers + 静态资源 + R2 + Analytics Engine） |
| Q7 | GEO 深度 | 可引用 + Agent Interface（WebMCP + 远程 MCP） |
| Q8 | 内容存放 | 结构化内容文件放在仓库内，带类型校验（生产方式见 Q34/Q36） |
| Q9 | Tool 契约 | 统一契约，纯逻辑核心与 UI 分离，Valibot schema 为单一事实源 |
| Q10 | 远程 MCP 范围 | 只暴露轻量 Tool；重型媒体 Tool 只走页面内 WebMCP |
| Q11 | 渲染 | Tool 页预渲染；Tool Variant 最终按需渲染 + 边缘缓存（Free 阶段先预渲染，见 Q44） |
| Q12 | URL slug | 各 Locale 共用英文 slug |
| Q13 | Variant 门槛 | 显式准入 + 构建期校验；Draft 内容 noindex |
| Q14 | 仓库结构 | 单个 Astro 应用，每个 Tool 一个目录 |
| Q15 | 首发 Locale | en、zh-Hans、ja、es、pt（巴西）、de、fr |
| Q16 | 首发 Category | 开发者/文本/换算、图片、PDF/文档、音视频 + 端侧 AI |
| Q17 | 图片 | jSquash + 原生 API |
| Q18 | 音视频 | Mediabunny + WebCodecs（ffmpeg.wasm 按需回退） |
| Q19 | PDF | pdf.js + pdf-lib 活跃 fork（不用 MuPDF） |
| Q20 | 端侧 AI | Transformers.js + 自托管模型；浏览器内置 AI 可用时优先 |
| Q21 | 跨源隔离 | 只在声明需要的 Tool 页开启 COOP/COEP |
| Q22 | 用户状态 | 只存本地（IndexedDB + OPFS），无账号 |
| Q23 | 统计 | Cloudflare Web Analytics + Analytics Engine，无 Cookie |
| Q24 | PWA | 做，按需缓存访问过的 Tool |
| Q25 | UI 文案 i18n | Paraglide JS |
| Q26 | 站内搜索 | ⌘K（shadcn Command）+ 构建期索引 |
| Q27 | 校验库边界 | Zod 只在 `content.config.ts`；其余全部 Valibot |
| Q28 | 防滥用 | Web 用 Turnstile + 限流；远程 MCP 匿名 + 限流 |
| Q29 | Category | 一个主 Category + 可出现在多个 Category 列表 |
| Q30 | Variant 边界 | 只属于一个 Tool，没有独立的 Agent Interface |
| Q31 | 缺失翻译 | 不发布该 Locale 页面，跳转到英文版 |
| Q32 | 工具链 | Bun + oxlint/oxfmt + Vitest + `@cloudflare/vitest-plugin` + Playwright + Lighthouse 预算门禁 |
| Q33 | 首发范围 | 平台 + 约 30 个 Tool，覆盖 4 个 Category |
| Q34 | 内容生产 | 由 Claude Code / agent 会话生成和翻译，不写流水线脚本 |
| Q35 | 页面骨架 | 固定"答案优先"骨架 + `.md` 副本 + llms.txt |
| Q36 | 内容流程 | 项目内 skill + Review Status 字段 + 构建期校验 |
| Q37 | 错误监控 | 自建轻量上报到 Analytics Engine |
| Q38 | CI/CD | GitHub Actions 门禁 + wrangler 部署 |
| Q39 | AI 爬虫 | 全部放行（检索类和训练类），关闭 Cloudflare 默认屏蔽 |
| Q40 | URL 结构 | 扁平：`/{tool}`、`/{tool}/{variant}`、`/{category}`；主 Category 只体现在面包屑中 |
| Q41 | Cloudflare 计划 | 先用 Workers Free，触发 §20 中的条件后升级到 Paid |
| Q42 | Locale 路径代码 | 短代码 `/zh/`、`/pt/` 等 |
| Q43 | 性能预算 | 按 §15 的数值执行 |
| Q44 | Free 下的 Variant 渲染 | 先预渲染成静态文件，达到阈值再切换到按需 SSR |
| Q45 | 远程 MCP 实现 | 官方 `@modelcontextprotocol/server` v2 的 `createMcpHandler`（无状态，不引入 `agents`，见 ADR-0014） |
| Q46 | Service Worker / OG 图 | Service Worker 手写；OG 图用 takumi 在构建期输出 PNG |
| Q47 | 小依赖 | 引入 Tailwind CSS v4、`@valibot/to-json-schema`、`schema-dts`、`@lhci/cli`；sitemap 生成和内容近似度检测自己写 |

## 2. 系统总览

```
                         ┌──────────────── Cloudflare ────────────────┐
 Browser                 │                                            │
 ┌───────────────┐  HTML │ Static Assets（免费、不限量）                │
 │ Astro 页面     │◀──────┤  Tool / Category / Variant* 页、.md 副本、   │
 │  └ React island│       │  llms.txt、sitemap、OG 图、JS/WASM（≤25MiB） │
 │     └ Web Worker│      │  _headers 按页注入 COOP/COEP                 │
 │        WASM/WebGPU│    │                                            │
 │ WebMCP 适配层  │◀──────┤ Worker（Astro SSR，Free：10 万次/天）         │
 │ Service Worker │       │   ├ /api/tools/*  Server-assisted Tool       │
 │ IndexedDB/OPFS │       │   ├ /mcp          远程 MCP（轻量 Tool）        │
 └──────┬────────┘       │   ├ /api/e        事件（抽样）与错误上报        │
        │                │   └ Variant 按需 SSR*（Paid 后启用）           │
        │ CORS           │                                            │
        └───────────────▶│ R2 自定义域名（assets 子域）：模型、超过 25MiB 的 WASM │
  AI agent / 爬虫 ────────┤ Analytics Engine · Rate Limiting · Turnstile │
                         └────────────────────────────────────────────┘
   * Variant 的渲染模式见 §7
```

## 3. 领域模型

完整定义见 [GLOSSARY.md](../GLOSSARY.md)，这里只说明关系：

- **Category** 1 ── * **Tool**：每个 Tool 有且只有一个主 Category（决定面包屑和层级），可以额外列在其他 Category 页。
- **Tool** 1 ── * **Tool Variant**：Variant 是"一个 Tool + 一组预设 + 该意图独有的内容"，不跨 Tool。例如「PNG to PDF」属于 Image to PDF，不属于格式转换。
- **Tool** 1 ── 0..1 **Agent Interface**：Variant 没有自己的 Agent Interface，它的预设只作为调用示例出现。
- **Tool / Tool Variant** × **Locale** → 一份内容，带一个 **Review Status**（Draft / Reviewed）。
- **Server-assisted Tool** 是 Tool 的一种运行方式，不是一个独立的实体。

## 4. 技术栈

所有依赖均已确认（§1 Q17–Q20、Q25、Q32、Q45–Q47）；M2 起新增 `@modelcontextprotocol/server`、`@tanstack/react-table`（2026-10-22 确认）。

| 层 | 选型 |
|---|---|
| 框架 | Astro 7（`@astrojs/cloudflare` 适配器，dev/prerender/prod 都跑在 workerd） |
| 交互 | React 19 islands |
| UI | shadcn（Base UI 版）+ Tailwind CSS v4，遵循维护者的 UI 规则：使用主题变量、间距用 gap、组件只扩展 variants；表单用 Field + TanStack Form + Valibot，表格用 Data Table，加载用 Skeleton / Progress / Spinner，空状态和错误状态用 Empty，Dialog 在移动端展示为 Drawer |
| 表单 / 表格 | TanStack Form + Valibot / TanStack Table（Data Table） |
| 校验 | Valibot（Tool 契约、表单、API）+ `@valibot/to-json-schema`；Zod 只出现在 `content.config.ts` |
| UI 文案 i18n | Paraglide JS + Astro i18n routing |
| 图片 | jSquash（mozjpeg/oxipng/webp/avif/jxl，按格式按需加载）+ OffscreenCanvas / ImageDecoder |
| 音视频 | Mediabunny + WebCodecs；ffmpeg.wasm 只给小众格式按需回退 |
| PDF | pdf.js（渲染、提取文字）+ pdf-lib 活跃 fork（合并、拆分、编辑） |
| 端侧 AI | Transformers.js（ONNX Runtime Web + WebGPU）；有浏览器内置 AI 时优先用 |
| 远程 MCP | `@modelcontextprotocol/server` v2 的 `createMcpHandler`（无状态 Streamable HTTP，不使用 Durable Objects；ADR-0014） |
| SEO | `schema-dts`（JSON-LD 类型）、takumi（`@takumi-rs/core`，构建期生成 OG 图 PNG）、自写的 sitemap / hreflang / llms.txt 生成器 |
| 部署 | Cloudflare Workers Free（→ Paid）+ Static Assets、R2、Rate Limiting、Turnstile、Analytics Engine、Web Analytics |
| 工具链 | Bun（包管理、脚本）、oxlint + oxfmt、Vitest + `@cloudflare/vitest-plugin`、Playwright、`@lhci/cli` |
| CI/CD | GitHub Actions + wrangler |
| 自写（不引入依赖） | Service Worker、Web Worker 类型化 RPC、sitemap 生成、内容近似度检测、WebMCP 适配层、事件与错误上报 |

## 5. 仓库结构

```
/
├── GLOSSARY.md
├── docs/
│   ├── architecture.md
│   ├── adr/
│   └── content/                 # 内容风格指南、各 Locale 术语表（供 skill 引用）
├── .claude/skills/              # 内容生产 skill（见 §12）
├── messages/{locale}.json       # Paraglide UI 文案
├── public/
├── scripts/                     # 校验与生成脚本（check:content、check:seo、gen:*）
└── src/
    ├── content.config.ts        # 唯一允许使用 Zod 的文件
    ├── tools/
    │   ├── registry.ts          # import.meta.glob 自动发现所有 tool.ts
    │   └── <tool-id>/
    │       ├── tool.ts          # defineTool(...)：契约与元数据
    │       ├── core.ts          # 纯逻辑，可在浏览器 / Web Worker / Workers 运行
    │       ├── core.test.ts
    │       ├── engine.worker.ts # 重型 Tool 的 Web Worker 入口（可选）
    │       ├── ui.tsx           # React island
    │       ├── content/{locale}.md
    │       └── variants/<variant-id>/
    │           ├── variant.ts   # 预设、独有数据、搜索需求依据
    │           └── {locale}.md
    ├── categories/              # Category 定义与各 Locale 内容
    ├── lib/
    │   ├── tool-contract/       # defineTool、JSON Schema 派生、表单派生
    │   ├── agent/               # WebMCP 适配层（webmcp.ts）、远程 MCP（mcp.ts）
│   ├── server/              # /api/tools 入口、共用执行器、SSRF 防护（safe-fetch）、Turnstile 校验
    │   ├── seo/                 # JSON-LD、hreflang、sitemap、llms.txt、OG 图生成
    │   ├── runtime/             # Worker RPC、能力探测、OPFS、模型加载
    │   └── telemetry/
    ├── components/              # shadcn 组件与站点组件（AdSlot、ToolShell…）
    ├── layouts/
    ├── sw.ts                    # 手写 Service Worker
    └── pages/
        ├── [...locale]/…        # 见 §7 路由表
        ├── api/tools/[id].ts
        ├── api/e.ts
        └── mcp.ts
```

真正出现第二个代码消费方（例如独立 SDK）时，再拆成 monorepo。

## 6. Tool 模块契约

```ts
// src/tools/image-compressor/tool.ts（示意）
export default defineTool({
  id: 'image-compressor',              // 即英文 slug，全站唯一且永久（和 Category slug 共用命名空间）
  category: 'image',
  alsoListedIn: ['web'],
  // 默认值写在 schema 里（v.optional(schema, default)），表单初始值和 JSON Schema 的 default 都从这里取
  input: v.object({ file: vFile({ accept: ['image/*'] }), quality: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100)), 75) }),
  output: v.object({ file: vFile() }),
  examples: [/* 示例输入与期望输出，用于 e2e、MCP 文档和 JSON-LD */],
  runtime: {
    where: 'client',                   // 'client' | 'server'（Server-assisted Tool）
    worker: true,                      // 在 Web Worker 里运行
    crossOriginIsolated: true,         // 需要 SharedArrayBuffer → 该页开启 COOP/COEP
    requires: ['wasm'],                // 能力探测：'webgpu' | 'webcodecs' | ...
  },
  // description：Agent Interface 的英文说明，和字段的 v.description() 一样写在契约里
  agent: { webmcp: true, remote: false, description: 'Compress a JPEG, PNG, WebP or AVIF image…' },
  run: () => import('./core').then((m) => m.compress),
})
```

从这份定义派生出：

| 派生物 | 用到的字段 |
|---|---|
| 页面表单（TanStack Form + Valibot） | `input`（含默认值）；字段提示写在 `v.metadata()`，文案来自内容 frontmatter |
| JSON Schema（WebMCP / 远程 MCP 的 inputSchema、outputSchema，经 `@valibot/to-json-schema`） | `input`、`output` |
| WebMCP / 远程 MCP 的 description | `agent.description` |
| JSON-LD `WebApplication` | 元数据 + Locale 内容 |
| ⌘K 索引、sitemap、llms.txt | 注册表 + 内容 + Review Status |
| Playwright 冒烟测试 | `examples` |
| `_headers`（COOP/COEP） | `runtime.crossOriginIsolated` |
| Variant 预设校验 | `input`（Variant 预设必须满足 `v.partial(input)`） |

约束：

- `core.ts` 不能 import UI、DOM 或 Astro；需要的环境能力（进度、取消、OPFS）通过 `ctx` 参数注入。Server-assisted Tool 的对外请求只能用服务端注入的 `ctx.fetch`（带 SSRF 防护和按目标限流），契约测试用同目录 `fixtures.ts` 的假 fetch 跑 `examples`。
- `agent.remote: true` 要求输入输出都可以 JSON 序列化、不含文件，并且能在 Workers CPU 预算内跑完（Free 计划下每个请求只有 10ms）。
- 文件型输入在 WebMCP 中以 Blob 传递，所以只能在页面内调用。
- 契约里没有 `ui` 字段：页面表单从 `input` 派生，island 通过 `tool-loader` 按 id 懒加载 `tool.ts`（每个 Tool 一个分块）；服务端渲染前先加载好，客户端水合时挂起并保留服务端 HTML。
- `core` 的可预期错误抛 `ToolError(code, { field, detail })`：`code` 对应内容 frontmatter 的 `errors` 文案，`field` 指明在哪个字段下行内显示。

## 7. 渲染与路由

### URL 结构

URL 是扁平的：英文没有前缀，其他 Locale 用 `/{locale}/` 前缀（`zh`、`ja`、`es`、`pt`、`de`、`fr`）。Tool id 和 Category id 共用一个命名空间，构建时会校验两者不冲突。主 Category 只体现在面包屑和 `BreadcrumbList` 中，所以调整一个 Tool 的主 Category 不需要改 URL。

| 页面 | URL | 渲染 |
|---|---|---|
| 首页 | `/` | 预渲染 |
| Category | `/{category}` | 预渲染 |
| Tool | `/{tool}` | 预渲染 |
| Tool Variant | `/{tool}/{variant}` | 见下方"Variant 渲染模式" |
| Markdown 副本 | 上述任一 URL + `.md` | 跟随原页面 |
| llms.txt | `/llms.txt`、`/{locale}/llms.txt` | 预渲染 |
| Sitemap | `/sitemap-index.xml` → 按 Locale × Category 拆分 | 预渲染 |

### Variant 渲染模式

Variant 有两种渲染模式，由一个配置开关切换（路由的 `prerender` 导出跟着开关变）。无论哪种模式，sitemap、hreflang、llms.txt、⌘K 索引都**从注册表、Variant 数据和 Review Status 生成**，不扫描构建产物，所以切换模式时这些都不受影响。

**static 模式（当前，Workers Free）**

- Variant 和 Tool 页一样预渲染成静态文件，访问时不经过 Worker，不占用每天 10 万次的请求配额。
- 估算 P0 的静态文件数：约 30 个 Tool × 每个约 20 个 Variant × 7 个 Locale × 2（HTML + `.md`）≈ 8,400，再加上 Tool / Category 页、OG 图、JS/CSS/WASM 分块，远低于 Free 计划 2 万个文件的上限。
- CI 统计 `dist` 中的文件数，达到上限的 80%（16,000 个）时告警。

**on-demand 模式（升级到 Paid 后）**

- 构建时把 Variant 内容按 **Tool × Locale** 打包成 JSON 静态资源（约 300 × 7 ≈ 2,100 个文件），Worker 渲染时通过 `env.ASSETS.fetch` 读取，并在 isolate 内存里缓存解析结果。
- 渲染结果写入 Cache API，缓存键带部署版本号，部署后旧缓存自然失效；响应头使用 `s-maxage` + `stale-while-revalidate`。
- 不存在的 Variant 或未发布的 Locale 由 Worker 直接返回 404 或 302。
- 切换条件见 §20。

### 页面性能特性

- 工具区块用 `client:load` 水合（它就在首屏）；重型引擎在首次交互或拖入文件时才加载，并在 Web Worker 中运行。
- Speculation Rules：悬停在内链上时预渲染（prerender）同站 Tool 页。
- 跨页导航用 View Transitions。
- 字体自托管并做子集化；CJK Locale 按需加载对应字体子集。

## 8. 国际化

- Astro i18n routing：`prefixDefaultLocale: false`，路径代码映射到 hreflang 代码：`zh` → `zh-Hans`，`pt` → `pt`（内容按巴西葡语写），其余相同。以后如果增加繁体中文，新开 `/zh-hant/`，已有 URL 不变。
- 两类文案分开管理：
  - **UI 文案**放在 `messages/{locale}.json`，由 Paraglide 编译成可 tree-shake 的函数，island 只打包自己用到的文案。
  - **Tool / Variant / Category 内容**放在 Content Collections 的 `{locale}.md` 中。
- 页面是否发布、是否可索引：

| 某个 Locale 的内容状态 | 是否生成页面 | robots | 是否进入 hreflang / sitemap |
|---|---|---|---|
| 没有内容 | 不生成，跳转到英文版 | — | 否 |
| Draft | 生成 | `noindex` | 否 |
| Reviewed | 生成 | `index` | 是 |

- en 是内容的事实源，其他 Locale 都从它翻译而来。所以非 en Locale 要同时满足**自身 Reviewed** 和 **en 也 Reviewed**，才算可索引；en 还是 Draft 时，整组页面都按 Draft 处理。这样 `x-default` 永远不会指向 noindex 页面。
- hreflang 只在可索引的版本之间互相指向，`x-default` 指向 en。
- 缺失翻译时的跳转：static 模式下通过构建时生成的 `_redirects` 实现，on-demand 模式下由 Worker 返回 302。
- 不根据 `Accept-Language` 自动跳转（会干扰爬虫）；检测到语言不匹配时，只显示一个可关闭的切换提示。
- slug 永远使用英文 Tool id，翻译只改变页面内容，不改变 URL。

## 9. SEO

- **每页**：自引用 canonical、hreflang 集合、精确的 `<title>` 和 meta description（来自内容 frontmatter）、OG 图。
- **OG 图**：构建时用 takumi 把 JSX 模板直接渲染成 PNG，每个 Tool × Locale 一张，CJK 字体按 Locale 传入；Variant 复用所属 Tool 的图。takumi 是 Node 原生模块，不能在 workerd 预渲染中运行，所以 OG 图和 `_redirects`、`_headers` 一起由构建后脚本 `scripts/postbuild.ts` 生成。
- **JSON-LD**（用 `schema-dts` 约束类型）：
  - Tool / Variant 页：`WebApplication`（免费 `offers`、`featureList`）+ `BreadcrumbList`（按主 Category）+ `FAQPage`。
  - Category 页：`CollectionPage` + `ItemList`。
  - 首页：`WebSite` + `Organization`。
- **Sitemap**：自写生成器，按 Locale × Category 拆分，单个文件不超过 5 万条 URL；只收录可索引的页面，`lastmod` 取内容的实际更新时间。
- **IndexNow**：部署后把新增和变更的 URL 推送给 Bing / Yandex 等。
- **内链**：Category 页是内链中枢；Tool 页链接到同 Category 的 Tool 和它自己的热门 Variant；Variant 链回所属 Tool 和兄弟 Variant。
- **robots.txt**：所有爬虫全部放行，包括 AI 检索类和训练类爬虫，并在 Cloudflare 后台关闭"屏蔽 AI 爬虫"的默认设置。

## 10. GEO 与 Agent Interface

### 可被 AI 引用

- **答案优先的固定骨架**（由内容 schema 强制）：
  1. H1 + 一句话答案
  2. 首屏就是工具本身
  3. 使用步骤
  4. 规格、限制与隐私说明（"文件不离开设备"）
  5. FAQ
  6. 相关 Tool
- 页面上可见"最后更新"日期；关于页说明团队、方法和隐私承诺（E-E-A-T）。
- 每个页面都有静态的 `.md` 副本，通过 `<link rel="alternate" type="text/markdown">` 声明。基于 `Accept: text/markdown` 的内容协商需要 Worker 参与，所以只在 on-demand 模式下启用。
- 每个 Locale 都有 `llms.txt`：按 Category 列出 Tool，附一句话说明和 `.md` 链接。

### 可被 agent 调用

- **WebMCP（页面内）**：Tool island 挂载时，经 `lib/agent/webmcp.ts` 适配层注册当前 Tool：名称（Tool id）、`agent.description`、构建期从 Valibot 生成并作为 props 传入的 JSON Schema（浏览器不打包 `@valibot/to-json-schema`），执行时走和表单相同的调用入口（轻量 Tool 跑 `core`，Server-assisted Tool 经 Turnstile 调 `/api/tools`），结果同步显示在表单上；卸载时通过 `registerTool` 的 `signal` 注销。2026-10 的 Chrome 文档（origin trial，Chrome 149+）用的是 `document.modelContext.registerTool(tool, { signal })`，适配层同时探测 `navigator.modelContext`，以 developer.chrome.com 的最新文档为准。调用方看不到 `execute` reject 的原因，所以可预期错误以 `{ error: { code, … } }` 的 JSON 结果返回。
- **远程 MCP（`/mcp`）**：和站点在同一个 Worker 内，用官方 SDK v2 的 `createMcpHandler` 实现无状态 Streamable HTTP（ADR-0014），同时兼容 2025 与 2026-07-28 两版协议；工具列表由注册表里 `agent.remote: true` 的 Tool 自动生成，结果同时给 `structuredContent` 和 JSON 文本，`ToolError` 以 `isError` 结果返回；匿名可用，按 IP 限流；Free 计划下，每次调用都占用每天的请求配额，并受 10ms CPU 约束。抓取任意网址的 Server-assisted Tool 不开放远程 MCP（ADR-0015）。
- 重型媒体 Tool 不在服务端运行，只通过 WebMCP 在访客的浏览器里被调用。
- Tool Variant 不注册独立的 Agent Interface；它的预设作为 Tool 描述里的调用示例。

## 11. Tool Variant 准入门槛

为了应对 Google 的"规模化内容滥用"（scaled content abuse）政策：Variant 不做笛卡尔积自动展开，每一个都要在 `variant.ts` 里显式声明。构建期校验不过就直接失败：

1. **预设有效且有差异**：预设通过 `v.partial(tool.input)` 校验，并且不同于 Tool 的默认值，也不同于同一 Tool 下的其他 Variant。
2. **有独有数据**：结构化的数据块不能为空（例如格式对比表、换算表、规格限制），页面会把它渲染出来。
3. **有搜索需求依据**：`demand: { query, source, checkedAt, volume? }`。
4. **有英文内容**：Variant 必须有 en 内容；其他 Locale 按 §8 的规则处理。
5. **不重复**：同一 Tool 的兄弟 Variant 之间做内容近似度检测（自写的 shingling / MinHash），超过阈值视为薄内容，校验失败。

Variant 页打开就是已经按预设配置好的 Tool，可以直接用。

## 12. 内容生产流程

内容由 Claude Code 或其他 agent 会话生成和翻译，不写自动化流水线脚本。可重复性靠下面三件事保证：

- **项目内 skill**（`.claude/skills/`，后续创建）：
  - `write-tool-content`：撰写英文 Tool 内容
  - `translate-content`：把内容翻译到指定 Locale
  - `add-variant`：新增 Variant，包括数据和需求依据

  三个 skill 都引用 `docs/content/` 下的风格指南和各 Locale 术语表。
- **Review Status 字段**：每个 `{locale}.md` 的 frontmatter 里都有 `review: draft | reviewed`。agent 只写 `draft`，由人工审核后改成 `reviewed`。可以用 CODEOWNERS 约束谁能做这项修改。
- **校验脚本** `bun run check:content`：schema 完整性、骨架章节齐全、内链有效、Variant 门槛（§11）、各 Locale 覆盖率报告。

## 13. 客户端运行时

- **线程模型**：所有重型计算都在 Dedicated Web Worker 中进行，主线程只负责 UI。Worker 通信用一个很薄的、自写的类型化 RPC，传大数据时用 Transferable 零拷贝。
- **能力探测**：页面加载时检测 `runtime.requires`（WebGPU、WebCodecs、`crossOriginIsolated`、OPFS）；缺失时显示 Empty 状态说明原因，不做降级实现。
- **跨源隔离**：构建时根据注册表生成 `_headers`，只对 `crossOriginIsolated: true` 的 Tool 页（含其 Variant 和各 Locale 版本）加上 `COOP: same-origin` 和 `COEP: credentialless`；on-demand 模式下，SSR 的 Variant 页由 Worker 中间件补上同样的响应头。没有隔离时，多线程 WASM 自动退回单线程。
- **WASM 与模型**：
  - 不超过 25 MiB 的 WASM 走同源静态资源，文件名带哈希，设置 immutable 缓存。
  - 模型文件和超过 25 MiB 的 WASM（例如 ffmpeg core）放在 R2，通过 R2 自定义域名（assets 子域）直接提供，并配置 CORS。这样请求走 CDN 缓存，不经过 Worker、不占用请求配额；以 CORS 模式请求，同时满足 COEP 的要求。
  - 模型首次下载时显示 Progress，下载后缓存在本地。
- **本地状态**：
  - IndexedDB 保存收藏、最近使用、每个 Tool 的偏好参数。
  - OPFS 保存大文件的中间产物。
  - 设置里提供"清除本地数据"。
  - 用户的文件和输入永不上传（Server-assisted Tool 只发送必要的参数）。
- **PWA**：
  - 有 manifest，站点可安装。
  - Service Worker 手写（`src/sw.ts`），运行时按需缓存访问过的 Tool 的资源（含 WASM 和模型），不做全站预缓存。
  - HTML 网络优先，带离线兜底页。
  - Service Worker 返回缓存时必须保留原响应的 COOP/COEP 头。

## 14. Server-assisted Tool 与防滥用

- 统一入口 `POST /api/tools/{id}`（只接受 `runtime.where: 'server'` 的 Tool，避免变成轻量 Tool 的免费算力）：按 IP 限流 → 校验 Turnstile → 用该 Tool 的 Valibot schema 校验输入 → 执行它的 `core`。限流放在 Turnstile 之前，被拒的请求不再消耗 siteverify 子请求。
- 错误统一为 `{ error: { code, field?, detail? } }`：400 输入无效、403 Turnstile 失败、404、405、413 请求体超过 16 KB、422 `ToolError`、429 限流（带 `Retry-After`）。平台级错误码（`rate_limited`、`verification_failed`）的文案在 `messages/*.json`，Tool 自身的错误码文案在内容 frontmatter。
- 网页调用需要附带 Turnstile token（`x-turnstile-token` 头）：脚本在首次聚焦表单时按需加载，每次提交渲染一个 `execution: 'execute'`、`appearance: 'interaction-only'` 的 widget，拿到 token 后移除。site key 是 `wrangler.jsonc` 的 `vars.TURNSTILE_SITE_KEY`（构建期写进页面，为空时构建失败），secret 是 Worker secret `TURNSTILE_SECRET_KEY`（未配置时拒绝所有调用）；本地开发在 `.dev.vars` 里用官方测试 key 覆盖两者，CI 的 e2e 给 Turnstile 打桩。
- 限流用三个 Rate Limiting binding：`TOOL_RATE_LIMITER`（每 IP 每 Tool）、`TARGET_RATE_LIMITER`（每个对外请求的目标主机）、`MCP_RATE_LIMITER`（`/mcp` 每 IP），阈值见 `wrangler.jsonc`。
- 不记录请求体，只记录 Tool id、耗时、结果类别。
- 对外请求一律经 `lib/server/safe-fetch.ts`：只允许 http/https 和 80/443 端口，拒绝 IP 字面量中的内网和保留地址、`localhost`、单标签主机名、`.local` / `.internal` 等内网后缀以及本站；不自动跟随重定向，由 `core` 逐跳重新校验；主机名解析到内网的情况由 `global_fetch_strictly_public` 兜底；带 `WebToolsBot` User-Agent；总时长 8 秒。Free 计划下每个请求最多 50 个子请求。
- 抓取任意网址的 Tool 只发 HEAD、按目标主机限流、不开放远程 MCP（ADR-0015）。

## 15. 性能预算（CI 强制）

- 首屏 JS（gzip，不含按需加载的引擎，2026-10-22 调整）：
  - Tool / Variant 页 ≤ 160 KB。React island 是底线：React 运行时本身约 67 KB，原定的 50 KB 无法满足，M1 实测约 150 KB。
  - 没有 Tool island 的页面（首页、Category 页等）≤ 10 KB。⌘K 对话框在第一次打开时才加载 React。
  - 加新依赖或新组件时优先控制 island 体积，用户体验以 LCP、TBT、CLS 等指标为准。
- Lab 指标：LCP ≤ 2.0s、CLS ≤ 0.05、TBT ≤ 150ms（`@lhci/cli`，移动端配置）。
- Field 指标目标（Web Analytics 的 CWV）：p75 LCP ≤ 2.0s、INP ≤ 150ms、CLS ≤ 0.05。

## 16. 隐私、统计与监控

- **流量与 CWV**：Cloudflare Web Analytics，不用 Cookie，不需要同意弹窗。它的 beacon 不经过我们的 Worker，不占用请求配额。
- **Tool 使用事件**：通过 `sendBeacon` 发到 `/api/e`，写入 Analytics Engine，只包含 Tool id、Locale、结果类别和耗时区间。Free 计划下按比例抽样（初始 10%），节省请求配额。每次上报占一次 Worker 请求、写一个数据点，所以瓶颈是每天 10 万次的 Worker 请求，而不是 Analytics Engine 每天 10 万个数据点的额度。
- **客户端错误**：全局 `error` / `unhandledrejection` 加上 Tool 内部的捕获，走同一个通道全量上报（同一会话内相同的错误只报一次）：错误类型、Tool id、浏览器能力指纹，不带用户数据。
- **服务端**：Workers Observability 日志。
- **搜索表现**：Google Search Console + Bing Webmaster Tools。

## 17. 广告位预留

- 布局中预留 `<AdSlot>` 组件，位置在工具区下方，桌面端另有侧栏。
- 未启用时不渲染，也不占空白；启用时按固定尺寸预留高度，避免 CLS。
- **已知取舍**：开启跨源隔离（COEP）的 Tool 页，基本不能放第三方广告 iframe。在验证可行之前，这些页面的 AdSlot 一律禁用。

## 18. 测试与 CI/CD

| 层 | 工具 | 内容 |
|---|---|---|
| Tool 核心 | Vitest | 每个 `core.ts` 的单元测试；契约测试（`examples` 必须满足 schema） |
| 浏览器相关核心 | Vitest Browser Mode（Playwright provider） | WASM / WebCodecs / WebGPU 路径 |
| Worker 路由 | Vitest + `@cloudflare/vitest-plugin` | `/api/*`、`/mcp`；on-demand 模式下的 Variant SSR 与缓存键 |
| 端到端 | Playwright | 由注册表和 `examples` 自动生成每个 Tool 的冒烟测试 |
| 性能 | `@lhci/cli` | §15 预算 |
| SEO | `bun run check:seo` | JSON-LD 校验、hreflang 互指、canonical、sitemap URL 全部返回 200、noindex 与 sitemap 一致、Tool id 与 Category id 不冲突 |
| 内容 | `bun run check:content` | §12 |
| 平台限额 | `bun run check:limits` | 静态文件数（Free 上限 2 万，80% 时告警）、单文件 ≤ 25 MiB |
| 代码风格 | oxlint、oxfmt、`astro check` | — |

**GitHub Actions**：

- PR：跑全部门禁，用 `wrangler versions upload` 部署预览版本，在预览 URL 上跑 Playwright 和 Lighthouse。
- 合并到 main：`wrangler deploy` 到生产，推送 IndexNow；on-demand 模式下，部署版本号自动作为 Variant 缓存键的一部分。

## 19. 分期路线

- **P0 平台 + 首发（Workers Free）**：§5–§18 的全部基础设施，Variant 采用 static 模式；约 30 个 Tool，4 个 Category 都覆盖，每个 Category 至少有几个样板 Tool 来验证契约、Variant、WebMCP、远程 MCP、WASM、WebGPU 和 PWA；7 个 Locale。
- **P1 扩充**：根据 Search Console 和关键词数据，分批扩充 Tool（目标 100–300 个）和 Variant；触发 §20 的条件时升级到 Paid，并把 Variant 切换到 on-demand 模式。
- **P2 扩展**：增加 Locale（包括 RTL 语言），按需启用广告。
- **P3 视情况**：账号、跨设备同步、付费能力（届时另写 ADR）。

## 20. Cloudflare 计划与升级触发条件

当前使用 **Workers Free**，适用的限制如下：

- 经过 Worker 的请求每天 10 万次，UTC 零点重置，超出后返回 Error 1027；每分钟突发上限 1,000 次。
- 每个请求 10ms CPU。
- 每个版本最多 2 万个静态文件，单文件不超过 25 MiB。
- 每个请求最多 50 个子请求。
- 静态资源请求免费、不限量。
- Analytics Engine（已核实）：每天写入 10 万个数据点、读查询 1 万次；数据保留 3 个月；单次 Worker 调用最多写 250 个数据点。文档没说 Free 额度用完后会怎样。
- Rate Limiting binding：周期只能是 10 或 60 秒，按每个 Cloudflare 节点分别近似计数，可能短暂超出设定的上限；需要 Wrangler 4.36.0 及以上。

在这些限制下，Worker 只承担 `/api/tools/*`、`/mcp`、`/api/e`。路由配置中**不使用** `run_worker_first`；否则在 Free 计划下超出配额时，命中的静态请求会返回 429。

满足以下任一条件就升级到 **Workers Paid**：

- `check:limits` 报告静态文件数超过 16,000。
- 经过 Worker 的请求连续数天超过每天 7 万次。
- `/mcp` 或 `/api/tools/*` 出现 CPU 超限错误。
- 需要 on-demand 模式下才有的能力：`Accept: text/markdown` 内容协商，或者 Variant 数量的增长速度超过构建时间能承受的范围。

升级后要做的事：

- 把 Variant 切换到 on-demand 模式（ADR-0004）。
- 事件上报的抽样比例可以调到 100%。

## 21. 剩余默认假设（实现时核实）

- 首发 7 个 Locale 都是从左到右书写，首期不处理 RTL。
- hreflang 的 `x-default` 指向 en。
- Variant 内容近似度阈值的具体数值，实现时根据样本确定。
- **Workers Rate Limiting binding**：2026-10-22 已在 Free 计划上实测可用。计数按节点近似，实测明显超出设定阈值后才开始返回 429，只适合挡大规模滥用。
- **Analytics Engine 写入和 Rate Limiting 调用**：文档没说是否计入每个请求 50 次的子请求上限。按计费规则推断，它们不占用每天的 Worker 请求配额。
- takumi 的具体 API 与 CSS 支持程度，以实现时的官方文档为准（已在 M1 验证）。`/mcp` 与 `/api/tools` 的 CPU 实测中位数约 3–5ms，新 isolate 首次请求有 16–42ms 的尖峰（outcome 均为 ok），需持续观察。

## 22. 风险与开放问题

- **WebMCP 标准还在变化**：靠适配层隔离，定期对照 Chrome 文档。
- **规模化内容风险**：即使有准入门槛，扩充 Variant 时也应该分批上线，观察收录率和排名，不要一次性大量放量。
- **COEP 与第三方内容冲突**：影响广告、嵌入和外链图片，见 §17。
- **人工审核产能**：7 个 Locale × 数千页的 Reviewed 进度，决定了实际能被索引的页面数量。首发时，可索引的页面数不会超过 en 已 Reviewed 的数量，所以应该优先审核 en。
- **Free 计划配额被耗尽**：如果远程 MCP 被大量调用，会和 Server-assisted Tool 抢同一份每天的配额。限流阈值要按配额来定，并且要监控每天的请求量。
