---
name: write-tool-content
description: 为一个 Tool 或 Category 撰写英文（en）内容并审核。新增 Tool 后、修改 Tool 行为后、或用户要求写/改某个 Tool 的 en 内容时使用。
---

# 撰写 en Tool 内容

en 是内容的事实源，其他 Locale 都从它翻译。流程见 [ADR-0011](../../../docs/adr/0011-agent-authored-content.md)、[ADR-0017](../../../docs/adr/0017-model-reviewed-content.md)。

## 先读

1. `docs/content/style-guide.md`（必读，含 frontmatter 字段表、正文三块、审核方式）
2. `docs/content/glossary/en.md`
3. 目标 Tool 的 `tool.ts`、`core.ts`（有 `engine.worker.ts` 时也读）。内容里的每个数字、格式、限制、浏览器差异都要能在这里找到。
4. 一个已有的同类 Tool 的 `content/en.md` 作样板（纯文本 Tool 看 `json-formatter`，文件型看 `video-converter`，Server-assisted 看 `http-header-checker`）。

## 步骤

1. 读 `tool.ts` 的 `input`/`output` 字段，列出每个字段名和 select 的全部取值，`errors` 对应 `core.ts` 里抛出的每个 `ToolError` code。
2. 写 `src/tools/<tool>/content/en.md`：`review: draft`，`updated` 写今天。frontmatter 的 `fields`、`output`、`errors` 必须与契约一一对应。
3. 正文三块：怎么工作、选项与限制、隐私。隐私声明要符合 Tool 的 `runtime.where`（`client` 才能写"不上传"）。
4. 内链只指向已存在且可索引的页面，en 无 Locale 前缀。
5. 新概念先加进 `docs/content/glossary/` 的 7 份术语表（en 先行，其他 Locale 给出译法）。
6. 跑 `bun run check:content`，再 `bun run build` 确认 schema 通过。
7. 审核：用 `pi` 调用 `antigravity/gemini-3.8-flash`（thinking high），对照 Tool 源码核对事实，输出最后一行只能是 `PASS` 或 `FAIL`：

   ```sh
   pi -p --no-session --model antigravity/gemini-3.8-flash --thinking high "<审核提示>" @src/tools/<tool>/content/en.md @src/tools/<tool>/tool.ts @src/tools/<tool>/core.ts @docs/content/style-guide.md
   ```

   审核提示要求：逐条核对 en.md 的事实（限制、格式、浏览器差异、隐私）与源码是否一致，检查是否违反风格指南，先列问题，最后一行 PASS 或 FAIL。FAIL 就修改后重审。

8. PASS 后把 `review` 改为 `reviewed`、更新 `updated`，再跑 `bun run check:content`。

## Category

`src/categories/<id>/en.md`：frontmatter 里的 `intro`（30–300 字符）+ `title`/`description`/`name`，正文留空。新增 Category 还要改 `categories.ts` 和各 Locale 的术语表。

## 不要做

- 不要自审后直接标 `reviewed`；审核必须由另一家模型完成。
- 不要为凑字数写通用废话；FAQ 写读者真会问的。
- 不要写代码里没有的功能或数字。
- 改了 en 的事实后，要通知用户其他 Locale 需要用 `translate-content` 同步。
