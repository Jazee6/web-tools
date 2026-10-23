# 只在需要的 Tool 页开启跨源隔离

多线程 WASM 和 ONNX 依赖 SharedArrayBuffer，而 SharedArrayBuffer 需要 COOP/COEP。但全站开启会让广告和第三方 iframe 基本无法使用。所以由 Tool 契约声明 `crossOriginIsolated`，构建时生成 `_headers`，只对这些页面（含其 Variant 和各 Locale 版本）加 `COOP: same-origin` 和 `COEP: credentialless`；模型和大文件 WASM 从 R2 自定义域名以 CORS 模式加载，满足 COEP 的要求。已知代价：这些页面暂时不能放第三方广告。

2026-10-23 补充：隔离页创建的 Dedicated Worker 由 Worker 脚本自身的响应头决定 COEP，缺少时浏览器会拦截脚本，所以构建产物目录 `/_astro/*` 也加 `COEP: credentialless`。这个头对普通脚本、样式和 WASM 没有影响。
