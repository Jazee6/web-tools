# 内容风格指南

适用于 Tool、Tool Variant、Category 的全部 Locale 内容（`src/tools/<tool>/content/{locale}.md`、`src/tools/<tool>/variants/<variant>/{locale}.md`、`src/categories/<category>/{locale}.md`）。术语以 [GLOSSARY.md](../../GLOSSARY.md) 为准，各 Locale 的固定译法见 [glossary/](./glossary/)。schema 在 `src/content.config.ts`，`bun run check:content` 和 `astro build` 会拦截违规。

内容的事实源是 **Tool 的源码**（`tool.ts`、`core.ts`、`variant.ts`），不是常识。限制、行为、隐私声明都要和代码一致。

## 1. 原则

1. **答案优先**：读者（和 AI 引用）在第一句话就拿到答案，不靠铺垫。
2. **只写代码里真的存在的东西**：数字、格式、限制必须能在源码里找到。不确定就不写，不要用"通常""一般"填充。
3. **如实说明局限**：不支持的、浏览器相关的、可能失败的都写明（例如 Firefox 没有 AAC 编码器）。局限写清楚比功能写满更有信用。
4. **隐私承诺要对应实现**：客户端 Tool 才能写"文件不离开设备"。Server-assisted Tool 必须写清楚发了什么、给谁、是否保存。
5. **不堆关键词，不凑篇幅**：每个 Tool 页是为这个意图写的，不是模板填空。FAQ 问的是读者真的会问的事。
6. 用"你"称呼读者（ja 用です・ます体，de 用 du，es/pt/fr 见各术语表）。语气平实、不夸张，不用"最好的""强大的""一键搞定"之类词。

## 2. 文件结构

### Tool

frontmatter 字段（长度见 schema）：

| 字段 | 要求 |
|---|---|
| `review` | 写入时一律 `draft`；只在 Gemini 审核 PASS 后改成 `reviewed`（ADR-0017） |
| `updated` | 内容实际改动的日期（`YYYY-MM-DD`），每次改内容都更新 |
| `title` | 10–70 字符。格式：`<Tool 名> – <动作 1>、<动作 2>、<动作 3> Online/在线`。含主关键词，末尾不加站名 |
| `description` | 50–170 字符。说清做什么 + "免费、私密、在浏览器里处理"这类真实卖点 |
| `name` | H1、面包屑、卡片、⌘K、OG 图用的名称；用该 Locale 的术语表译名 |
| `answer` | 30–300 字符。一句话回答"这个工具怎么用/做什么"，以动作开头，点名按钮文案 |
| `action` | 提交按钮文案，动词开头 |
| `fields` | 与 `tool.ts` 的 `input` 字段一一对应；select 的 `options` 覆盖全部取值（语言代码取值除外，由 `Intl.DisplayNames` 生成） |
| `output` | 与 `output` 字段一一对应；表格输出还要给 `columns` |
| `errors` | `ToolError` 的每个 `code` 一条，说明原因和下一步 |
| `steps` | ≥ 2 条，每条一个动作，提到的按钮名与 `action`、字段 `label` 完全一致 |
| `faq` | ≥ 3 条，建议 4–6 条；`q` 用读者的口吻，`a` 先给结论再解释 |

正文（Markdown）至少一个 `## ` 小节，固定三块，顺序如下：

1. `## <这个工具做什么/怎么工作>`：实现方式、依据（RFC、规范、库名）。
2. `## 选项与限制`：用列表，每项加粗一个标签。必须含：输入大小/数量上限、不支持的情况；Tool 在浏览器里运行且能力因浏览器而异时（编解码器、WebGPU、跨源隔离），还要写浏览器差异。Server-assisted Tool 和行为与浏览器无关的 Tool 不写这一项，不要为凑齐而编造。
3. `## 隐私`：一两句话。客户端 Tool 固定表达为"处理只在你的设备上完成，不上传、不保存、不用 Cookie"，不要换成别的承诺。

页面标题（H1）、"使用方法""常见问题""相关工具""最后更新"由站点从 `messages/{locale}.json` 渲染，**正文里不要重复**。

### Variant

沿用 Tool 的 `title`/`description`/`name`/`answer`/`steps`/`faq`/正文规则，另有：

- `table`：`caption`、`columns`（与 `variant.ts` 的列一一对应）、`terms`（恰好覆盖表格里用到的 `{ term }`）。表格的行在 `variant.ts`，内容文件里不写数据。
- 表单文案（字段、按钮、错误）不写，沿用同一 Locale 的 Tool 内容。
- **不得与 Tool 页或兄弟 Variant 雷同**：近似度（3 词元 shingle 的 Jaccard）上限 0.3。Variant 要写的是这个意图独有的内容：为什么需要转换、哪些情况不同、独有数据的解读。把 Tool 页改几个词不会通过，也不应该这样写。
- `answer` 要点名预设已经选好（如"MP4 已选中"），步骤从"选文件"开始。

### Category

`intro`（30–300 字符）概括这一类 Tool 的共同点和隐私特性；`title`、`description`、`name` 同上。正文留空。

## 3. 标题与描述

- `title` 的主关键词用读者会搜的说法，而不是内部名称。例：`MOV to MP4 Converter`，不是 `Video Converter (mov preset)`。
- `description` 不重复 `title`，不超过 170 字符（中日文约 80 字符内更稳）。
- 同一 Locale 里，不同页面的 `title` 和 `description` 不能相同。

## 4. 内链

- 正文里的链接只能指向**可索引**页面（有 `.md` 副本）和已存在的页面，`check:content` 会拦截。用站内绝对路径，**按本页 Locale 带前缀**（en 无前缀，其余 `/{locale}`，与 `localizePath` 一致）：en 写 `[Merge PDF](/merge-pdf)`，zh 写 `[PDF 合并](/zh/merge-pdf)`；指向 `.md` 副本的链接以 `.md` 结尾，同样要求目标可索引。
- 站外链接只给权威来源（RFC、MDN、规范、库的官方文档），用于佐证正文里的事实，不为外链而加。
- "相关 Tool"由站点生成，不手写。

## 5. 数字、日期、单位

- 数字格式遵循该 Locale 习惯（见术语表），但**代码里的取值原样写**（`500 MB`、`9,007,199,254,740,991`）。
- 字节单位统一 `KB / MB / GB`（与 `check:limits` 一致），不混用 KiB。
- 日期用 `YYYY-MM-DD`（`updated`）。正文里避免写"最新""目前"，带上具体版本或日期。
- 文件格式、编码名、协议名保持原写法：`MP4`、`H.264`、`HTTP`，不翻译。

## 6. 翻译规则（`translate-content`）

- **en 是事实源**。非 en 内容对照 en 逐段翻译，结构、字段、FAQ 顺序、列表项数量保持一致。
- 不翻译：frontmatter 的键、`fields`/`output`/`errors` 的键、`options` 的键、`terms` 的键、链接路径、代码、占位符样例（如 `placeholder` 里的 JSON）。
- 翻译：`title`、`description`、`name`、`answer`、`action`、所有 `label` 与选项文案、`errors`、`steps`、`faq`、`table` 文案、正文。
- 术语必须用该 Locale 术语表里的译法，术语表没有的新术语先加进术语表再用。
- 按目标语言重写，不逐词硬译；`title` 要符合该语言的搜索习惯，长度仍受 schema 约束（CJK 的字符数更少，注意下限 10、`description` 下限 50）。
- `pt` 按巴西葡语写，`zh` 按简体中文写，`es` 用 tú 的中性表达（拉美与西班牙都能读）。
- 译文的 `review` 一律先写 `draft`，`updated` 写翻译日期。en 改了内容，所有译文要同步改并重新审核。
- 不要在译文里增加 en 没有的事实，也不要漏掉 en 的限制说明。

## 7. 审核（ADR-0017）

撰写者不得自审。用另一家模型审核，判定写在输出最后一行，只能是 `PASS` 或 `FAIL`：

```sh
pi -p --no-session --model antigravity/gemini-3.8-flash --thinking high "<审核提示>" @<待审文件> @<对照文件...>
```

- **en**：对照 Tool 源码（`tool.ts`、`core.ts`，Variant 再加 `variant.ts`）核对事实：限制、支持的格式、浏览器差异、隐私声明、FAQ 回答是否有依据。同时检查本指南的结构规则和语气。
- **非 en**：对照 en 核对：有无漏译、误译、添加事实；术语是否符合术语表；语言是否自然。
- 审核提示要写明"最后一行只能是 PASS 或 FAIL"，并让它先列出问题。FAIL 就修改后重审，PASS 后把 `review` 改成 `reviewed`（同时更新 `updated`）。
- **先 en 后译文**：非 en 页面要等 en 也是 Reviewed 才能被索引。
