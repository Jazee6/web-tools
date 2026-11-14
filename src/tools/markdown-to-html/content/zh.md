---
review: reviewed
updated: 2026-11-14
title: Markdown 转 HTML – 在线转换 Markdown 并预览 HTML
description: 把 Markdown 转换成干净的 HTML，自动生成标题 ID，可选输出完整 HTML 文档和语法高亮。免费、私密——在你的浏览器中运行。
name: Markdown 转 HTML
answer: 输入或粘贴 Markdown，HTML 会随输入实时生成——在预览和 HTML 源码之间切换，然后点击"复制 HTML"复制代码。
action: 转换
fields:
  markdown:
    label: Markdown
    placeholder: "# Title\n\nWrite **Markdown** here…"
  headingIds:
    label: 添加标题 ID
  document:
    label: 完整 HTML 文档
  highlight:
    label: 语法高亮
  theme:
    label: 高亮主题
    options:
      github-light: GitHub Light
      github-dark: GitHub Dark
      one-dark-pro: One Dark Pro
      vitesse-light: Vitesse Light
output:
  html:
    label: HTML
steps:
  - 把 Markdown 输入或粘贴到"Markdown"框中，HTML 会随输入实时更新。
  - 如果需要完整的页面而不是片段，打开"完整 HTML 文档"。
  - 打开"语法高亮"，为代码块着色。
  - 选择"高亮主题"。
  - 切换到"HTML"标签页查看源码，或留在"预览"查看效果。
  - 点击"复制 HTML"复制源码，或点击"复制富文本"，把排好版的结果粘贴到 Google 文档、Word 等编辑器中。
faq:
  - q: Markdown 里的 HTML 会保留吗？
    a: 会。<details>、<kbd> 或带宽度的 <img> 这类原始 HTML 会按 CommonMark 规范原样写进输出。预览运行在不允许脚本的沙盒框架里，所以 Markdown 里的 <script> 不会在本页面执行。但它仍是输出的一部分，发布 HTML 的地方可能会执行它，所以只转换你信任的 Markdown。
  - q: 标题 ID 是怎样生成的？
    a: 按 GitHub 生成锚点的规则。取标题去掉 Markdown 和 HTML 标签后的文字，转成小写；去掉标点、符号和 emoji，但保留连字符和 _ 这类连接标点；空格换成连字符。所以 "What's new in v2.0?" 会变成 id="whats-new-in-v20"。各种文字都会保留，中文或西里尔文标题仍保留原文。重复的标题会加上 -1、-2 等；什么都不剩的标题（例如只有 emoji）不加 ID。关闭"添加标题 ID"即可不生成。
  - q: HTML 片段和完整 HTML 文档有什么区别？
    a: 片段只有转换后的内容，适合粘贴进已经有自己的 <head> 和样式的页面、CMS 或模板。完整 HTML 文档会加上 <!doctype html>、一个 <head>（标题取第一个有文字的一级标题，没有时用 "Document"）和一份简单的默认样式表，可以直接存成 .html 文件在浏览器里打开。
  - q: 语法高亮是怎样工作的？
    a: 在开头的围栏后写明语言的代码块（例如 ```python）会用 Shiki 高亮器着色。每个颜色都写成内联样式，所以 HTML 不需要另外的样式表；不过会去掉内联样式的编辑器也会去掉这些颜色。没写语言或 Shiki 不认识的语言的代码保持原样。语法高亮默认关闭，此时写明语言的代码块输出 <pre><code class="language-…">，方便你使用自己的高亮器，其余代码块输出普通的 <pre><code>。
  - q: 我的 Markdown 会被保存吗？
    a: 会，前提是你的浏览器允许本站存储数据。停止输入片刻后，"Markdown"框的内容会保存在这台设备上，下次打开时自动恢复。它不会上传。清除本站的本地数据会把它删掉。
---

## Markdown 转 HTML 怎样工作

转换器用 [marked](https://marked.js.org/) 解析 Markdown，遵循 [CommonMark](https://commonmark.org/)，并支持 GitHub Flavored Markdown 的表格、任务列表、删除线和裸链接扩展。它输出和 marked 相同的 HTML，并加上 GitHub 风格的标题 ID；打开语法高亮后，代码由 [Shiki](https://shiki.style/) 高亮。转换在浏览器的后台线程中进行，而不是在页面本身上运行。

## 选项与限制

- **Markdown：** 最多 200,000 个字符。
- **原始 HTML：** 原样保留，不做清理。脚本不会在预览中运行，但它们是输出的一部分。
- **标题 ID：** 默认开启，按 GitHub 的锚点规则生成；重复的标题加 -1、-2，处理后什么都不剩的标题不加 ID。
- **完整 HTML 文档：** 默认关闭；加上 doctype、取自第一个一级标题的标题和一份默认样式表。
- **语法高亮：** 默认关闭；可选 GitHub Light、GitHub Dark、One Dark Pro 或 Vitesse Light，颜色写成内联样式。主题和每种语言的语法文件在第一次用到时下载，可能需要稍等；下载失败时（例如离线），代码块不高亮。
- **复制：** 两个按钮都使用浏览器的剪贴板，有些浏览器需要授权；"复制富文本"还需要浏览器支持复制带格式的 HTML。
- **不支持：** 脚注、数学公式和 Mermaid 之类的图表，它们会保留为普通文本或代码块。YAML front matter 不会被去掉，会和其余 Markdown 一样被转换。

## 隐私

处理只在你的设备上完成。页面不会上传你的 Markdown，不会把它存到服务器上，也不使用 Cookie。
