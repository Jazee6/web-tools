# 单一 Tool 契约派生所有对外形态

每个 Tool 只用 `defineTool` 定义一次：纯逻辑核心（不依赖 UI、DOM 和 Astro）+ Valibot 输入输出 schema + 元数据 + 示例。页面表单、WebMCP 与远程 MCP 的 JSON Schema、JSON-LD、⌘K 索引、`_headers`、e2e 冒烟测试、Variant 预设校验都从这份定义派生。这样做是为了让 Agent Interface 和 SEO 结构化数据几乎零成本、不会和页面不一致。代价是每个 Tool 起步时要多守一些约束：核心不能直接操作 DOM，环境能力只能通过 `ctx` 注入。
