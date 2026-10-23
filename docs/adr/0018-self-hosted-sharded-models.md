# 模型和大 WASM 切片放进静态资源，不用 R2

原计划把模型文件和超过 25 MiB 的 WASM 放在 R2，用 assets 子域提供。做 Speech to Text 时（2026-10-23）改成：构建前由 `scripts/fetch-models.ts` 下载固定版本，校验 sha256 后切成不超过 24 MiB 的分片，放进同源静态资源（`/models/`）。浏览器里按各 Tool 的 `model.ts` 清单把分片拼回原文件，存进 Cache API。

这样做的原因：
- **不超限**：Workers Free 的静态资源每个版本最多 2 万个文件、单文件不超过 25 MiB，总大小没有上限；请求免费、不计入每天 10 万次的配额。Whisper base 加上 ORT 的 WASM 只多出 13 个文件。
- **少一套基础设施**：不用新建 R2 bucket 和自定义域名、不用配 CORS、不用单独的上传流程。模型和代码一起部署、一起回滚，PR 预览也能用。
- **同源**：不需要处理 CORS 和 COEP 的交互，也不依赖第三方服务；用户的 IP 不会被 Hugging Face 或 jsDelivr 看到。
- **模型不进 git**：原文件按 sha256 缓存在 `.cache/models/`，CI 用 actions/cache 保留。构建依赖 Hugging Face 可以访问，但同一个 revision 只需要下载一次。

代价：
- 每个大文件要写进清单（路径、大小、sha256）。升级 `onnxruntime-web` 时，ORT 的 WASM 清单要一起改，否则构建会因校验失败而停下。
- 浏览器侧多了一个小的加载器（`src/lib/runtime/model-files.ts`），它替换 Transformers.js 的 `env.fetch`。Transformers.js 自带的缓存关掉了，由加载器统一用 Cache API 缓存，下载进度也由它回报。
- ORT 改用 extern-wasm 构建（Vite alias），`.wasm` 本体经 `wasmBinary` 交给 ORT，否则默认的 bundle 版会把 26.9 MB 的 `.wasm` 复制进构建产物。

等出现单个 Tool 的模型达到数百 MB、或文件数接近上限时，再考虑 R2。
