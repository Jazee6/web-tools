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
  - ~~创建 R2 bucket，绑定 assets 子域，并配置 CORS~~：不再需要，模型切片后放进静态资源（ADR-0018）。

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

- ✅ WebMCP 适配层（`src/lib/agent/webmcp.ts`）：特性探测 `document.modelContext` 和 `navigator.modelContext`，渐进增强；e2e 用桩对象验证注册与调用。⏳ 在 Chrome origin trial（149+）中实测。
- ✅ 远程 MCP：`/mcp` 改用官方 `@modelcontextprotocol/server` v2 的 `createMcpHandler`（ADR-0014），工具列表由 `agent.remote` 自动生成；Agent Interface 的说明写在契约的 `agent.description`。
- 防滥用：
  - ✅ Rate Limiting binding（每 IP 每 Tool、每目标主机、`/mcp` 每 IP）：2026-10-22 在 Free 计划上实测可用（部署成功，并发突发时返回 429）。计数是近似的：阈值为每分钟 30 次时，顺序发 39 次全部放行，80 个并发里只拒绝了 5 个，所以阈值只能防大规模滥用，不能当作精确配额。
  - ✅ Turnstile：正式 widget 与 secret 已配置（生产拒绝测试 token）；本地开发用 `.dev.vars` 里的官方测试 key，CI 的 e2e 打桩。⏳ 在浏览器里实际提交一次 HTTP Header Checker。
- ✅ 第一个 Server-assisted Tool 改为 **HTTP Header Checker**（DNS Lookup 可以直接在浏览器里查询 DoH，不需要服务端，见 ADR-0002；改为后续的客户端 Tool）。包括 SSRF 防护（`src/lib/server/safe-fetch.ts`）、只发 HEAD、按目标主机限流，且不开放远程 MCP（ADR-0015）。CPU 实测（`wrangler tail`）：`/mcp` 中位数约 3ms，`/api/tools` 约 5ms；新 isolate 首次请求有 16–42ms 的尖峰（加载约 1 MB 的 MCP 模块），outcome 均为 ok，持续观察是否出现 CPU 超限。
- ✅ Paraglide 的 Locale 改为按请求隔离：middleware 用 AsyncLocalStorage（`nodejs_als`），去掉 `globalVariable` 策略；workerd 中有并发不同 Locale 的测试。

**退出条件**：MCP 客户端能列出并调用所有轻量 Tool；WebMCP 能在页面内调用 Tool；超过限流阈值后能正确拒绝。本地（workers 测试 + e2e）与生产（MCP 调用、限流 429）均已验证；真实 Chrome 中的 WebMCP 待确认。

### M3 重型客户端运行时 + PWA

- ✅ 类型化的 Web Worker RPC（`src/lib/runtime/rpc.ts`，Transferable、取消、进度、ToolError 还原）、能力探测（水合后探测，缺失时用 Empty 代替表单，e2e 覆盖）。Worker Tool 不写 `run`，core 只由 `engine.worker.ts` 引用，编码器不进主线程和服务端包。
- ✅ 由注册表生成 `_headers`，按页开启 COOP/COEP，Locale 用 `:locale` 占位符（每个 Tool 固定 4 条规则）；Worker 脚本需要自身的 COEP，所以 `/_astro/*` 也加（ADR-0008 补充）。e2e 验证 Chromium、Firefox 隔离、WebKit 不隔离（不支持 `credentialless`），未隔离时 jSquash 自动退回单线程。`check:limits` 统计 `_headers` 规则数（上限 100）。⏳ 推送后在生产核对响应头，并在真实 Safari 里确认单线程回退。
- ✅ 契约支持文件字段：`v.file()` + `fileType()` 派生文件输入和下载输出；examples 用 `files` 指向样例文件，输出文件只比较 MIME 类型和体积上限。WebMCP 只支持 JSON，文件型 Tool 暂不注册 Agent Interface（ADR-0016）。
- 每个引擎先做一个样板 Tool：
  - ✅ 图片：jSquash（Image Compressor，新增 Category `image`，7 个 Locale 内容为 Draft）。JPEG / PNG / WebP / AVIF 四个样例在 Chromium、Firefox、WebKit 上都通过：Vitest Browser Mode 跑未隔离的单线程路径，页面级 e2e 在 Chromium、Firefox 上跑隔离后的多线程路径、在 WebKit 上跑单线程回退。
  - ✅ PDF：PDFium WASM（`@embedpdf/pdfium`，替代原定的 pdf.js + pdf-lib fork，见 ADR-0009 补充）做 Merge PDF，新增 Category `pdf`，7 个 Locale 内容为 Draft。WASM 约 4.6 MB，走同源静态资源，不需要跨源隔离。契约支持有序的多文件输入 `v.array(v.file())`。Browser Mode 在 Chromium、Firefox、WebKit 上核对页序、加密 PDF 和损坏文件报错，e2e 覆盖合并、排序和数量校验。
  - ✅ 音视频：Mediabunny + WebCodecs（`mediabunny`，纯 TypeScript）做 Video Converter，新增 Category `media`，7 个 Locale 内容为 Draft。输入 MP4 / MOV / WebM / MKV（≤ 500 MB，输出整体在内存里），输出 MP4 / WebM / MOV / MKV；新容器能装下的流直接复制，否则转码到浏览器能编码的第一个 codec（MP4 / MOV 优先 H.264 + AAC，Firefox 没有 AAC 编码器时用 Opus）；任何主轨无法转换都报错，不输出缺声音或画面的文件。Worker Tool 页面新增进度条和取消按钮。Browser Mode 在 Chromium、Firefox、WebKit 上核对输出 codec、直接复制、错误码和取消，e2e 覆盖四个样例和缺少 WebCodecs 时的 Empty。macOS 本机和 CI 的 Linux 容器（Playwright 镜像）上，三个引擎都能通过，没有跳过任何用例。⏳ 真实 Safari 待确认。Firefox、Safari 选中 .mkv 时 `File.type` 是空字符串，Chrome 报的是 `video/matroska`，所以文件字段改用 `fileType()` 声明可接受的类型：MIME 类型不在表里时按扩展名判断，通过后把 type 改成表里的 MIME 类型；表单的 accept 同时列出 MIME 类型和扩展名。三个文件型 Tool 都已改用它。
  - ✅ 端侧 AI：Transformers.js（`@huggingface/transformers`）做 Speech to Text，7 个 Locale 内容为 Draft。模型是 Whisper base（MIT，onnx-community 的 ONNX 版，固定 commit）。不用 R2：构建前由 `scripts/fetch-models.ts` 下载、校验 sha256、切成 ≤ 24 MiB 的分片放进静态资源，浏览器里拼回并存进 Cache API（ADR-0018）；ORT 改用 extern-wasm 构建，26.9 MB 的 `.wasm` 也走分片。
    - 推理：有真实 GPU 且支持 `shader-f16` 时，encoder 用 WebGPU fp16，decoder 用 WASM int8，下载约 125 MB；否则全部用 WASM int8，约 107 MB。页面开启跨源隔离，让 WASM 多线程。实测 52 秒英文音频（M 系列 Mac）：Safari 混合方案 3.7 s，纯 WASM 单线程 8.6 s；Chromium、Firefox 隔离后多线程约 5–11 s。WebGPU 跑量化的 decoder 反而比 WASM 慢；headless Chromium 只有 SwiftShader（`isFallbackAdapter`），跑 WebGPU 比 WASM 慢 20 倍，所以排除回退 adapter。
    - 输入音频或视频（≤ 1 GB、≤ 60 分钟），由 Mediabunny 解码、混成单声道、重采样到 16 kHz；输出纯文本和 SRT 字幕。语言默认自动识别（Transformers.js 不指定语言时一律按英语转录，所以由 core 自己识别：前 30 秒只解码一步，取语言 token 中 logit 最高的），也可以选 Whisper 支持的 99 种语言，选项名由 `Intl.DisplayNames` 按 Locale 生成（字段 metadata `languageNames`）。进度分"下载模型"和"处理中"两个阶段（`ctx.onProgress` 的 `stage`）。
    - Browser Mode 在三个浏览器上跑 WASM 路径，在有可用 GPU 的浏览器上（本机 macOS 的 WebKit）另跑 WebGPU 路径，两条路径的转录文本一致；德语样例用 WAV，因为各浏览器的 AAC 解码结果略有不同，会让识别结果不同。e2e 覆盖样例转录。⏳ CI 的 Linux 容器里大概率没有可用的 GPU，WebGPU 路径会跳过；真实 Chrome（硬件 adapter + 跨源隔离）的速度待实测。
- ✅ 本地状态（`lib/runtime/local-store.ts`，自写的 IndexedDB 薄封装，不引入 idb）：
  - 收藏和最近使用放在 ⌘K 对话框里（2026-10-23 确认），没输入搜索词时显示；每行行尾有星标按钮（鼠标、触屏用），在 Tool 页打开时第一项是"收藏 / 取消收藏当前 Tool"（键盘用）。成功运行一次 Tool 记一次最近使用，最多保留 20 条，对话框列前 5 条。
  - 每个 Tool 自动记住上次的选项：只记 select、开关、数字字段，不记文件和文本；水合后按需加载并恢复，只覆盖用户还没改过的字段，值不再满足 schema 时丢弃。Variant 上线后，预设应优先于本地偏好（M4 处理）。
  - "清除本地数据"在全站页脚，AlertDialog 二次确认：删除 IndexedDB、OPFS、全部 Cache API 缓存（含模型和 SW 的页面缓存）并注销 Service Worker，然后重新加载页面。
  - OPFS 目前没有 Tool 写入中间产物（Video Converter 的输出仍整体在内存里），只做了清除；等有 Tool 需要时再加读写。
  - Browser Mode 覆盖收藏、最近使用、偏好和清除（Playwright 的 WebKit 是临时会话，没有 OPFS，跳过 OPFS 断言）；e2e 覆盖偏好恢复、⌘K 的收藏与最近使用、页脚清除。
- ✅ 手写 Service Worker（`src/sw.ts`，postbuild 用 `Bun.build` 打包成 classic 脚本 `/sw.js`，只在生产构建注册）：
  - 只接管同源 GET：页面网络优先，失败时用缓存，没有缓存就显示该 Locale 的离线页（`/offline`、`/{locale}/offline`，noindex，安装时连同它引用的 CSS、脚本一起预缓存）；`/_astro/` 缓存优先；其他不带哈希的文件网络优先。`/api/*`、`/mcp`、`/models/*`（模型由 `model-files.ts` 自己缓存）、跨源请求和 Range 请求一律放行，分流规则是纯函数（`lib/runtime/sw-routes.ts`）并有单元测试。
  - 缓存的是原始网络响应，COOP/COEP 原样保留；只缓存同源 200，跳转不缓存。缓存不分版本，新 SW 直接 `skipWaiting` + `clients.claim()`。
  - 第一次访问时页面在 SW 接管前已加载完：页面用 PerformanceObserver 把没经过 SW 的资源（`workerStart` 为 0，含接管时还在路上的请求）和当前 URL 报给 SW 补缓存。在 SW 接管前就创建的引擎 Worker 不受 SW 控制，它加载的 WASM 要等下次使用时才会被缓存；SW 通常在首次交互之前就已接管。
  - manifest 每个 Locale 一份（从该 Locale 首页启动，scope 是整站），图标（192、512、maskable、apple-touch-icon）由 postbuild 用 takumi 从 `favicon.svg` 生成。
  - e2e（`e2e/offline.spec.ts`，由注册表生成）：4 个 Worker Tool 各跑一次 example 后断网，新开页面仍能打开并再跑一次（Speech to Text 的模型来自 `models` 缓存），隔离页在 Chromium 上仍是跨源隔离；没访问过的页面显示对应 Locale 的离线页。本机 Playwright WebKit 跑完 Speech to Text 后 reload 页面会崩溃（不开 SW、不断网也一样），所以用例关掉原页面后新开一页。其他用例默认禁用 SW（`page.route` 拦不到经 SW 处理的请求）。Chromium、WebKit 通过；Firefox 下 Playwright 的离线模拟不作用于 SW 的请求，跳过。⏳ 在真实 Firefox、Safari 里手动确认离线使用。
- ✅ Vitest Browser Mode 覆盖 WASM、WebCodecs、WebGPU 三条路径（`*.browser.test.ts`，Chromium / Firefox / WebKit）。WebGPU 只在有真实 GPU 的浏览器上跑（本机 macOS 的 WebKit）。

**退出条件**：4 个样板 Tool 在最新版 Chrome、Safari、Firefox 上都能运行（能力缺失时显示 Empty），用过一次后可以离线使用。

### M4 Tool Variant 体系

- ✅ 契约：`defineVariant(tool, { id, preset, accept?, table, demand })`（`lib/tool-contract/define-variant.ts`），`src/tools/<tool>/variants/<variant>/variant.ts` 由注册表自动发现。`accept` 把文件字段收窄到 Tool `fileType()` 表里的部分类型，表达"A 转 B"的来源格式：只影响文件选择器，校验仍接受全部类型（ADR-0020，2026-10-23 确认）。独有数据是语言无关的表格（数字、codec 名，词语类取值写 `{ term }`），表格标题、列标题和 term 文案写在各 Locale frontmatter（2026-10-23 确认）。
- ✅ 准入门槛，任一条不满足构建就失败：
  - 门槛 1–3 在加载注册表时校验（`variant-registry.ts`）：预设只能是非文件字段且满足 `v.partial(input)`；"预设 + 来源格式"不同于 Tool 默认配置和兄弟 Variant；表格非空、行与列一一对应；`demand` 有查询词、来源和日期。
  - 门槛 4–5 在 `lib/seo/variant-admission.ts`，`lib/catalog.ts`（构建）和 `check:content` 都调用：有 en 内容，Variant 的每个 Locale 都有 Tool 内容（表单文案沿用 Tool 的），与 Tool 页和兄弟 Variant 的近似度不超过 0.3。
  - 近似度：汉字、假名逐字，其他文字按词，3 个词元一组的 shingle 算精确 Jaccard（只在同一 Tool 内比较，规模小，不需要 MinHash）。阈值依据样本实测（en）：三个样板 Variant 之间、与 Tool 页之间都在 0.03–0.06，把 mkv-to-mp4 的格式名换成别的格式得到的薄内容 Variant 是 0.87。往 `variants/` 里放这样一个 Variant，`astro build` 报"近似度 0.87 超过阈值 0.3"并失败（已实测）。
- ✅ 样板 Variant：Video Converter 的 mov-to-mp4、mkv-to-mp4、mp4-to-webm，需求依据是 2026-10-23 的 Google Autocomplete（三个查询词都是第一条建议）。表格列出常见 codec 是直接复制还是重新编码，`video-converter/variants.test.ts` 用 `core.ts` 的 keep 列表和 Mediabunny 的容器支持核对每一行。内容只写了 en、zh（Draft），其他 Locale 302 到 en，用来覆盖缺失翻译的路径。
- ✅ static 模式渲染：构建期生成可序列化的 `VariantPageData`（`lib/variant-page.ts`），`VariantPage.astro` 只依赖它，不读 Content Collections，on-demand 模式可以直接复用。页面骨架：H1 + 答案 → 按预设配置好的 Tool → 步骤 → 独有数据表格（服务端渲染的 Data Table，不水合）→ 正文 → FAQ → 所属 Tool 和兄弟 Variant。面包屑四级（首页 › Category › Tool › Variant），JSON-LD 同 Tool 页，OG 图复用 Tool 的图。Tool 页（HTML 和 `.md`）列出自己的 Variant。sitemap（跟随 Tool 的主 Category）、llms.txt、⌘K 索引、`_redirects` 都包含 Variant。
- ✅ 预设优先于本地偏好：预设的字段不恢复也不保存偏好，Variant 页总是按预设打开，在 Variant 页运行也不改写 Tool 页记住的选项。Variant 页不注册 WebMCP（Variant 没有 Agent Interface）。
- ✅ e2e（`e2e/variants.spec.ts`，由 Variant 注册表生成）：各 Locale 渲染、预设已选中、accept 已收窄、表格行数、缺失翻译 302、Tool 页有链接，并用来源格式和预设都匹配的 example 跑一次；`local-state.spec.ts` 覆盖预设与偏好。
- 架构文档写的"Variant 的预设作为 Tool 描述里的调用示例"（Agent Interface）还没做：样板 Tool 是文件型，没有 Agent Interface。等第一个有 Variant 的轻量 Tool 出现时再加。
- ✅ on-demand 模式（默认关闭）：开关在 `src/lib/variant-mode.ts`，`astro.config.ts` 按模式用 `injectRoute` 注入 static 或 on-demand 的路由入口。on-demand 模式下 `VariantPageData` 按 Tool × Locale 打包成 `/variant-data/{locale}/{tool}.json`，Worker 经 `env.ASSETS` 读取、isolate 内缓存，SSR 同一个 `VariantPage.astro`；middleware 把结果写入 Cache API（键是路径加构建号），缺失翻译 302、不存在 404，隔离 Tool 的 COOP/COEP 和 `.md` 的 canonical 头由路由补上。
  - Worker 上传包：on-demand 模式第一次构建时 SSR 把 `engine.worker.ts` 连同编码器、WASM 一起打包，上传约 5.5 MB gzip（未压缩约 22 MB）；`tool-worker.ts` 在 SSR 构建里不再引用 Worker 后降到约 690 KiB gzip（static 模式约 410 KiB，差的是 React SSR 和 island 代码）。Free 已经不限压缩后大小，只限未压缩 64 MiB（2026-10 核实），22 MB 也不会超限；保留这个裁剪是因为 SSR 用不到这些代码，包越小冷启动越快，离 1 秒启动上限也越远。已确认内容文本不在 Worker 包里。
  - `bun run check:variant-modes`（加入 CI）：另建一份 on-demand 产物，启动它的 Worker 预览，与 static 模式逐字节对比 120 个其他静态文件、6 个 Variant 页的 SSR 输出（含 hreflang、canonical）、15 条缺失翻译跳转和 404。第一轮各 Locale 交错并发请求、全部未命中缓存，这就是经过真实 Astro SSR（流式渲染）的并发 Locale 测试；第二轮命中缓存。做过两次变异验证：SSR 页面改一个字段、去掉 middleware 的 Locale 隔离，都会被查出来（后者只有 zh 页面不一致）。
  - `test/workers/variant-ssr.test.ts`（`@cloudflare/vitest-plugin`）：查找、缺失翻译跳转、非法参数 404、存在的内容包每个 isolate 只读一次、缓存键忽略查询参数且能用于 Cache API。不存在的内容包不缓存：路径里的 Tool id 来自请求，缓存它们会让任意 slug 把内存撑大。

**退出条件**：样板 Variant 能通过准入门槛，故意构造的薄内容 Variant 会让构建失败；切换开关后两种模式的输出（HTML、sitemap、hreflang）一致。三条都已验证（2026-10-23），M4 完成。样板内容都是 Draft，hreflang、sitemap、llms.txt 和 `.md` 副本里本来没有 Variant；验证时临时把 mov-to-mp4 的 en、zh 改成 reviewed（没有提交，Review Status 只由审核模型决定，ADR-0017）：`check:seo` 通过，`check:variant-modes` 对比 8 个页面（6 个 HTML + 2 个 `.md`）和 20 条跳转（多出 `.md` 的缺失翻译跳转）全部一致，sitemap、hreflang（en、zh-Hans、x-default）和 llms.txt 都包含该 Variant，两种模式下 `.md` 的 Link canonical 头和 302 也相同。

### M5 内容生产

- ✅ 风格指南 `docs/content/style-guide.md`（frontmatter 字段表、正文三块、内链按 Locale 加前缀、翻译与审核规则），7 个 Locale 各一份术语表 `docs/content/glossary/{locale}.md`。术语表的译法取自已有内容和 `messages/*.json`，改译法要同步改已有内容。
- ✅ 项目内 skill（`.claude/skills/`）：`write-tool-content`、`translate-content`、`add-variant`。
- ✅ 审核流程试点：用 `pi` 调用 `antigravity/gemini-3.8-flash`（thinking high）审核 JSON Formatter 的 en，对照 `tool.ts`、`core.ts` 和风格指南，判定 PASS，另提两条建议（`errors.invalid_json` 缺下一步指引、隐私句式与其他 Tool 不一致）。只做了试点，没有改动任何 `review` 字段。
- ✅ 6 个已实现 Tool（JSON Formatter、HTTP Header Checker、Image Compressor、Merge PDF、Video Converter、Speech to Text）的 en 内容和 6 个 Locale 译文全部经 Gemini 审核 PASS，`review: reviewed`（2026-10-29）。en 审核补全了 errors 的下一步指引、真实的浏览器差异和限制，删掉了源码里没有的性能说法；译文对照 en 审核了两到三轮，修了漏译、术语和长度问题。审核结果有随机性，同一份文件可能一次 PASS 一次 FAIL，所以只按具体缺陷修改，不追求逐条采纳建议。
- ✅ 术语表按已有内容对齐：de 全站统一用敬称 Sie（`messages/de.json` 和 developer 分类同步改过），fr 的内容文件用直撇号和不换行空格，ja 用「デバイス」。
- ✅ 4 个 Category（developer、image、pdf、media）的 en 和 6 个 Locale 译文全部审核 PASS 并 Reviewed（2026-10-29）。原来的 Category 文案提到了还没实现的 Tool（拆分、转换、编码），developer 还写了「什么都不上传」，而 HTTP Header Checker 会把 URL 发到服务器；已按现有 Tool 重写。每次新增 Tool，要同步改所属 Category 的文案并重新审核。
- 内容产出（其余部分）：每个新 Tool 都走「en 内容 → 审核 → 翻译 → 审核」。3 个样板 Variant（mov-to-mp4、mkv-to-mp4、mp4-to-webm）已审核并翻译（2026-10-29）：en 对照 `variant.ts` 和 `core.ts` 审核，mkv-to-mp4 的 FAQ 修了「单轨 MP4」的错误说法并补上 Firefox 的 Opus 音频差异；另外 5 个 Locale 新译，6 个 Locale 全部 PASS 后 Reviewed。审核时**优先 en**，因为非 en 页面要等 en 也是 Reviewed 才能被索引。
- 首批 Variant：每个 Tool 挑需求依据最充分的几个，不追求数量。

**退出条件**：首发 Tool 的 en 内容全部 Reviewed，其他 Locale 的 Reviewed 覆盖率有报告。当前 6 个已实现 Tool、3 个 Variant 和 4 个 Category 在 7 个 Locale 全部 Reviewed（`check:content` 覆盖率表：每个 Locale 13 项，全部 Reviewed）；`check:seo` 显示可索引页面 98 个；M6 补齐的 Tool 按同一流程继续。

### M6 遥测、门禁收口与上线

- Cloudflare Web Analytics。
- `/api/e`：事件抽样 10%，错误全量上报并在同一会话内去重，写入 Analytics Engine。
- `@lhci/cli` 预算门禁全量开启（首屏 JS 按 architecture §15：Tool 页 ≤ 160 KB、其他页 ≤ 10 KB gzip，LCP ≤ 2.0s，CLS ≤ 0.05，TBT ≤ 150ms）。
- 补齐首发 Tool（见下方候选清单，2026-10-29 确认按清单推进；每个 Tool 走「core + 测试 → en 内容 → 审核 → 翻译 → 审核」）：
  - ✅ Base64 Encode/Decode（`base64-encode-decode`）：7 个 Locale 全部 Reviewed。只处理文本（加文件输入会失去 Agent Interface，ADR-0016）；解码接受标准和 URL 安全两种字母表、忽略空白、容忍缺失的 padding；非 UTF-8 字节单独报 `invalid_utf8`。
  - ✅ URL Encode/Decode（`url-encode-decode`）：core 与测试完成，en 和 zh/ja/es/pt/fr Reviewed。⏳ de 译文待审核（审核模型 2026-10-29 额度用完）。三种范围：URL 组成部分（`encodeURIComponent`）、完整 URL（`encodeURI`）、表单数据（空格转 +，在 `encodeURIComponent` 上改写，孤立代理项同样报错）。
  - ✅ Hash Generator（`hash-generator`）：core 与测试完成，en Reviewed。⏳ 6 个 Locale 译文待审核（同上）。SHA-1/256/384/512 用 Web Crypto；Web Crypto 没有 MD5，所以自写了 `md5.ts`（RFC 1321，用官方测试向量和 `md5` / `shasum` 交叉核对）。
  - ✅ JWT Decoder（`jwt-decoder`）：core 与测试完成，en 和 6 个 Locale 译文均为 Draft，⏳ 待审核（审核模型额度恢复后，与上面两项一起审）。只解码、不验证签名；输出头部、载荷、签名和 iat/nbf/exp 的 UTC 时间表（时间不与当前时刻比较，examples 才能精确匹配）；容忍 `Bearer ` 前缀，接受签名为空的未签名令牌，五段的 JWE 报 `encrypted_token`。
  - ✅ Image Converter（`image-converter`，图片 Category）：core、Browser Mode 测试和 e2e（含离线）完成，7 个 Locale 内容为 Draft，⏳ 待审核。输入 HEIC / HEIF / JPEG / PNG / WebP / AVIF（≤ 50 MB），输出 JPEG / PNG / WebP / AVIF。HEIC 用 `libheif-js`（2026-10-29 确认引入；libheif 是 LGPL-3.0，见开放项里的许可证声明）解码，选 HEIC 文件时才加载约 2 MB 的 `libheif-bundle`（WASM 内联在 JS 里，同源静态资源）；其余格式沿用浏览器解码和 jSquash 编码，PNG 输出用浏览器编码后再过 OxiPNG；JPEG 输出把透明区域铺白。没有 HEIC 编码器，所以 HEIC 只能作输入。Browser Mode 和 e2e 在 Chromium、Firefox、WebKit 上都通过。⏳ 用真实 iPhone 照片确认旋转（`irot`）被 libheif 正确应用；样例 `photo.heic` 由 macOS `sips` 从 JPEG 转出，没有旋转标记。⏳ 图片 Category 的文案要补上转换（已 Reviewed，等审核额度恢复后与新 Tool 一起重写重审）。
  - UUID Generator 暂缓：输出是随机的，而 examples 要求精确匹配输出，需要先让契约支持「按格式校验」的示例。
  - 开发者 Category 的文案要在这一批 Tool 做完后统一更新并重审（每批只改一次）。
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
| 开发者 / 文本 / 换算 | JSON Formatter（M1 样板）、Base64 Encode/Decode、URL Encode/Decode、Hash Generator、UUID Generator、JWT Decoder、Regex Tester、Timestamp Converter、Color Converter、Word Counter、Case Converter、Unit Converter、DNS Lookup | 全部可设 `agent.remote: true`；DNS Lookup 在浏览器里查询 DoH |
| 开发者 | HTTP Header Checker | M2 样板 Server-assisted Tool（已实现，`agent.remote: false`） |
| 图片 | Image Compressor（M3 样板）、Image Converter、Image Resizer、Image Cropper、Background Remover | Background Remover 用 Transformers.js，需核对模型许可证 |
| PDF / 文档 | Merge PDF（M3 样板）、Split PDF、PDF to Image、Image to PDF、Organize PDF（旋转、排序、删除页） | Image to PDF 的主 Category 是 PDF，同时列在图片下 |
| 音视频 + 端侧 AI | Video Converter（M3 样板）、Trim Video、Extract Audio、Audio Converter、Speech to Text（M3 样板）、Image to Text（OCR） | 两个 AI Tool 都需核对模型许可证 |

共 30 个。这些 Tool 都只用已确认的库；HEIC 解码、PDF 重压缩之类需要新依赖的 Tool 放到 P1，届时单独确认。

---

## P1 规模化扩充

- 根据 Search Console 和关键词数据，分批增加 Tool（目标 100–300 个）和 Variant。**每批放量后先观察收录率和排名，再放下一批**。
- 按 architecture.md §20 的触发条件升级到 Workers Paid：静态文件数超过 1.6 万、Worker 请求连续多日每天超过 7 万、出现 CPU 超限、需要内容协商。升级后：
  - Variant 切换到 on-demand 模式（ADR-0004）。
  - 启用 `Accept: text/markdown` 内容协商。
  - 事件抽样比例提高到 100%。
- 有新依赖的 Tool（PDF 压缩等）逐个确认依赖后再做；HEIC 解码已随 Image Converter 引入。
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
- Background Remover、OCR 所用模型的许可证（必须允许商用）。Speech to Text 用的 Whisper base 是 MIT。
- Speech to Text 识别普通话时常输出繁体字（Whisper 的已知行为）。Transformers.js 目前不支持 `prompt_ids`，没法用简体提示词引导；可选方案是加简繁转换（需要新依赖）或换更大的模型，内容里已写明这个限制。
- ~~Rate Limiting binding 在 Free 计划上是否可用~~：可用，但计数近似（见 M2）。
- `/mcp` 冷启动 CPU 尖峰（16–42ms）在 Free 计划上是否会触发 CPU 超限，需要持续观察。
- ~~takumi 的 CSS 支持是否满足 OG 模板（M1 验证）~~：已验证。zh/ja 能正确排版，CJK 字体用 fontsource 的 unicode-range 子集，按图上用到的字符按需加载。
- ~~首屏 JS 预算（≤ 50 KB gzip）与 React island 冲突~~：已决定调高预算并做瘦身（architecture §15）。⌘K 改为按需加载后，首页和 Category 页约 1 KB，Tool 页约 150 KB（M2 加入 WebMCP 与 Turnstile 后约 154 KB，M3 加入文件字段后约 156 KB，离 160 KB 上限只剩约 4 KB）。多文件控件按需加载，其他 Tool 页不受影响；Merge PDF 页约 158.5 KB，离上限只剩约 1.5 KB。M3 加入进度条和取消按钮后，用同一口径对比前后两次构建：在 Playwright 中加载页面直到网络空闲，把所有脚本逐个 gzip 后求和。JSON Formatter 页从 157.9 KB 增加到 158.3 KB，Merge PDF 页从 159.8 KB 增加到 160.2 KB。这个口径比上面的旧数字高约 1.3 KB（包含空闲时预取的 core），按它算 Merge PDF 页已经略超 160 KB。M6 接入 `@lhci/cli` 时要统一口径，继续往首屏加代码之前先瘦身。M3 加入 Speech to Text（语言名下拉选项、进度阶段）后用同一方法（Node zlib 默认级别 gzip）再测：JSON Formatter 157.6 KB，Merge PDF 159.5 KB，Speech to Text 157.8 KB；和前面的数字压缩级别可能不同，不能直接相减。另外试过把取消按钮也放进按需加载的分块，结果 Base UI 的公共模块被拆成单独的分块，首屏反而多了约 0.6 KB，所以没有采用。M3 加入本地状态后用同一方法（Playwright 加载到网络空闲、Node zlib 逐个 gzip 求和）前后对比：JSON Formatter 158.9 → 161.2 KB，Merge PDF 160.8 → 162.2 KB，Speech to Text 159.1 → 161.5 KB，首页 1.3 → 1.7 KB。增量主要是水合后按需加载的 local-store（0.76 KB）和偏好分块（0.28 KB），以及页脚脚本（0.4 KB）；它们不阻塞首次渲染，但这个口径会计入。M6 统一口径时要决定水合后的按需分块算不算首屏。
- ~~内容近似度阈值（M4 根据样本确定）~~：0.3，依据见 M4。
- 第三方许可证声明：站点会分发 libheif（LGPL-3.0，经 `libheif-js`，声明页要写明库名、版本、许可证全文和源码链接；现在 WASM 内联在 libheif-bundle 的 JS 里，是否满足 LGPL 对用户可替换的要求待确认，保守做法是改用独立的 `libheif.wasm` 文件）、PDFium（Apache-2.0，含它捆绑的第三方库）和 jSquash 编解码器的 WASM、Mediabunny（MPL-2.0）、Transformers.js（Apache-2.0）、ONNX Runtime Web（MIT）以及 Whisper base 的权重（MIT），上线前（M6）要补一个许可证声明页。
- Service Worker 的 `assets` 缓存不随部署清理（已打开的旧页面还可能按需加载旧分块），每次部署后用过的旧分块会一直留着，直到"清除本地数据"。需要时再加按时间或数量的清理。
- `_redirects` 最多 2,000 条静态规则（已核实，`check:limits` 统计并在 80% 时告警）。缺失翻译按"页面 × 缺失的 Locale"逐条生成，en 可索引后每条还多一条 `.md`：首发约 30 个 Tool × 每个约 20 个 Variant，只要大部分 Variant 没翻译完，就会超过上限。放量 Variant 之前要换方案，例如按 Tool 用 splat 规则（动态规则上限 100 条），或缺失翻译时干脆返回 404。
- ~~`_headers` 最多 100 条规则，不可索引页面 `.md` 副本的 noindex 逐条生成会超限~~：已改为只给可索引页面发布 `.md`，所有副本用一条 `/*.md` 规则声明 canonical（ADR-0019），规则数从 80 降到 11（2026-10-23）。剩下的主要是每个跨源隔离 Tool 固定 4 条，约 20 个隔离 Tool 时会再次接近上限。
