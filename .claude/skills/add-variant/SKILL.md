---
name: add-variant
description: 为已有 Tool 新增一个 Tool Variant（长尾意图页，如 mov-to-mp4），包括预设、独有数据表格、需求依据和 en/其他 Locale 内容。用户要求新增 Variant 时使用。
---

# 新增 Tool Variant

Variant 不做自动展开，每一个都要显式声明并通过准入门槛（architecture §11、[ADR-0005](../../../docs/adr/0005-explicit-variant-admission.md)、[ADR-0020](../../../docs/adr/0020-variant-source-format.md)）。**一次只加少量，放量前观察收录率**（roadmap P1）。

## 先读

1. `docs/content/style-guide.md`（Variant 一节）和 `docs/content/glossary/en.md`
2. 所属 Tool 的 `tool.ts`、`core.ts`
3. 样板：`src/tools/video-converter/variants/*/{variant.ts,en.md}`、`variants.test.ts`

## 步骤

1. **确认需求依据**：查到真实的搜索需求（如 Google Autocomplete 的建议，或有量的关键词数据），记录 `demand: { query, source, checkedAt, volume? }`，日期用查询当天。查不到依据就不加。
2. **确定意图独有的数据**：表格必须是该意图独有且真实的事实（codec 的处理方式、规格限制、换算值等），能从源码或权威资料核实。没有独有数据就不是 Variant，不要加。
3. 建 `src/tools/<tool>/variants/<variant-id>/variant.ts`，用 `defineVariant(tool, { id, preset, accept?, table, demand })`：
   - `preset` 只能设非文件字段，且满足 `v.partial(tool.input)`；"预设 + 来源格式"不能与 Tool 默认配置或兄弟 Variant 相同。
   - `accept` 把文件字段收窄到 Tool `fileType()` 表里的部分类型，只影响文件选择器。
   - 表格单元格是语言无关事实；词语类取值写 `{ term: "key" }`。
   - 表格行要有测试核对（参照 `variants.test.ts`，对照 `core.ts` 的真实行为，而不是凭记忆写）。
4. 写 `en.md`（字段见风格指南）：`table.caption`、`table.columns`（与 `variant.ts` 的列一一对应）、`table.terms`（恰好覆盖用到的 term）。表单文案不写，沿用 Tool 的。内容要写这个意图独有的东西，不能是 Tool 页换几个词。
5. 跑 `bun run check:content` 和 `bun run build`：近似度超过 0.3 会失败，失败就重写内容，不要靠改词绕过。
6. 按 `write-tool-content` 的方法审核 en（对照 `tool.ts`、`core.ts`、`variant.ts`），PASS 后标 `reviewed`。
7. 用 `translate-content` 翻译到需要的 Locale。缺失的 Locale 会 302 到 en，但 `_redirects` 有 2,000 条上限（roadmap 开放项），放量前要留意 `check:limits`。
8. 跑 `bun run test`、`bun run test:e2e`（e2e 由 Variant 注册表自动生成）。

## 不要做

- 不要给多个 Tool 批量生成同构 Variant（规模化内容滥用风险）。
- 不要自己编造需求依据或独有数据。
- 不要把 Variant 注册为独立 Agent Interface（Variant 没有）。
