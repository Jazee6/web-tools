# 客户端优先执行，重型 Tool 永不上服务端

Tool 默认在访客浏览器中运行（Web Worker + WASM / WebCodecs / WebGPU），"文件不离开设备"既是隐私卖点，也让服务器计算成本接近零。只有浏览器做不到的事（抓取远程 URL、DNS 查询等）才做成 Server-assisted Tool。因此远程 MCP 只暴露输入输出可 JSON 序列化、在 Workers CPU 预算内能跑完的轻量 Tool；图片、PDF、音视频、AI 这类重型 Tool 只通过页面内的 WebMCP，在访客的浏览器里被 agent 调用。以后如果有人提议"把压缩放到服务端，好让 MCP 也能用"，那就是推翻这条决策。
