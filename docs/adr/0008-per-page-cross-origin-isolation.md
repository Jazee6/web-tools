# 只在需要的 Tool 页开启跨源隔离

多线程 WASM 和 ONNX 依赖 SharedArrayBuffer，而 SharedArrayBuffer 需要 COOP/COEP。但全站开启会让广告和第三方 iframe 基本无法使用。所以由 Tool 契约声明 `crossOriginIsolated`，构建时生成 `_headers`，只对这些页面（含其 Variant 和各 Locale 版本）加 `COOP: same-origin` 和 `COEP: credentialless`；模型和大文件 WASM 从 R2 自定义域名以 CORS 模式加载，满足 COEP 的要求。已知代价：这些页面暂时不能放第三方广告。
