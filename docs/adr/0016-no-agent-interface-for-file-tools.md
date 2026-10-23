# 文件型 Tool 暂不注册 Agent Interface

原计划让文件型 Tool 通过 WebMCP 以 Blob 传入文件、只在页面内调用。2026-10-23 核实 Chrome 的 WebMCP 文档（imperative API，2026-10-16 更新）和 W3C 社区组规范草案：工具输入是从 JSON 字符串解析出的对象，`execute` 的结果会被序列化成 JSON 字符串，没有任何 Blob、File 或二进制内容的机制。远程 MCP 本来就要求输入输出可以 JSON 序列化。

所以输入或输出里有文件字段的 Tool 设 `agent.webmcp: false`、`agent.remote: false`，由契约测试强制。我们不改用 base64 字符串：大文件会让 agent 的上下文和 JSON 都很重，而且 JSON Schema 描述不了"这是一张图片"。等 WebMCP 支持二进制或资源引用后，再在适配层里给文件型 Tool 接上。
