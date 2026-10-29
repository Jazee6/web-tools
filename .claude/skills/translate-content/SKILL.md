---
name: translate-content
description: 把 en 内容（Tool、Variant、Category）翻译到指定 Locale（zh/ja/es/pt/de/fr）并审核。en 内容已定稿或更新后、或用户要求翻译/同步某个 Locale 时使用。
---

# 翻译内容到指定 Locale

流程见 [ADR-0017](../../../docs/adr/0017-model-reviewed-content.md)。非 en 页面要 en 也是 Reviewed 才能被索引，所以**先让 en 通过审核再翻译**（`write-tool-content` / `add-variant`）。

## 先读

1. `docs/content/style-guide.md` 第 6、7 节
2. `docs/content/glossary/<locale>.md`（目标 Locale 的语气和固定译法）
3. 待译的 `en.md`
4. 该 Locale 里已有的同类内容，保持措辞一致（如 `src/tools/json-formatter/content/<locale>.md`）

## 步骤

1. 确认 Locale 是 `zh | ja | es | pt | de | fr` 之一（`src/lib/i18n/locales.ts` 是唯一事实源）。
2. 新建 `<同目录>/<locale>.md`：结构、字段键、列表项数量、FAQ 顺序与 en 一致。`review: draft`，`updated` 写今天。
3. 不翻译：frontmatter 键、`fields`/`output`/`errors`/`options`/`terms` 的键、链接路径（但内链要按目标 Locale 加前缀，`/zh/merge-pdf`）、代码和 `placeholder` 样例。
4. 术语用术语表的固定译法；缺少的术语先补进该 Locale 的术语表（并告知用户，因为这会影响已有内容）。
5. 注意 schema 长度：`title` 10–70、`description` 50–170、`answer` 30–300 字符，CJK 字符数更少，要检查下限。
6. 跑 `bun run check:content`。
7. 审核：对照 en 核对，输出最后一行只能是 `PASS` 或 `FAIL`：

   ```sh
   pi -p --no-session --model antigravity/gemini-3.8-flash --thinking high "<审核提示>" @<待审 locale 文件> @<en 文件> @docs/content/glossary/<locale>.md
   ```

   审核提示要求：对照 en 找漏译、误译、擅自添加的事实；检查术语是否符合术语表、语气是否符合该 Locale 约定；先列问题，最后一行 PASS 或 FAIL。FAIL 就修改后重审。

8. PASS 后改 `review: reviewed`，更新 `updated`，再跑 `bun run check:content`。

## en 改了之后

en 的事实、限制或文案变了，所有已有译文都要同步修改、更新 `updated`、`review` 退回 `draft` 并重新审核；不要留着旧译文。

## 不要做

- 不要逐词硬译，也不要增删 en 没有的事实。
- 译文不要自审后直接标 `reviewed`。
- 不要翻译文件格式、协议、库名。
