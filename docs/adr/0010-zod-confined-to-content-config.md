# Zod 只能出现在 content.config.ts

Tool 契约、表单、API 校验和 JSON Schema 派生一律使用 Valibot（体积小，也是 UI 规则指定的表单方案）。但 Astro Content Collections 的 schema 按框架要求使用 `astro/zod`。我们接受两者共存，同时划定硬边界：Zod 只能出现在 `src/content.config.ts`，只在构建期使用，不进入任何客户端包，也不用于其他地方。
