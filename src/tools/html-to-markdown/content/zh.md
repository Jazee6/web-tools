---
review: reviewed
updated: 2026-11-14
title: HTML 转 Markdown – 在线把 HTML 和富文本转换成 Markdown
description: 粘贴 HTML 源码，或从网页、Word、Google 文档复制带格式的文字，得到带表格的干净 Markdown。免费、私密——在你的浏览器中运行。
name: HTML 转 Markdown
answer: 粘贴 HTML 代码，或从网页、文档复制带格式的文字后粘贴到"HTML"框中，Markdown 会立即出现；点击"复制"即可复制。
action: 转换
fields:
  html:
    label: HTML
    placeholder: "<h1>Title</h1>\n<p>Paste HTML, or copy formatted text from a page and paste it here.</p>"
output:
  markdown:
    label: Markdown
errors:
  empty: 没有可转换的内容。这段 HTML 里只有脚本、样式或其他会被去掉的内容——请粘贴页面中包含所需文字的部分。
steps:
  - 把 HTML 粘贴到"HTML"框中；或者在网页、Word、Google 文档里选中带格式的文字，复制后粘贴到框中。
  - 在"Markdown"框中查看生成的 Markdown。
  - 点击"复制"，复制 Markdown。
faq:
  - q: 能直接粘贴带格式的文字，而不是 HTML 代码吗？
    a: 能。从网页、Word、Google 文档或邮件复制时，剪贴板里还会带上格式背后的 HTML。粘贴到"HTML"框时插入的是这段 HTML 而不是纯文本，所以标题、链接、列表和表格都能保留。如果剪贴板里只有纯文本，就照常粘贴。
  - q: 表格是怎样转换的？
    a: 每个含有单元格的表格都会变成 Markdown 表格，第一行一律作为表头行，即使它用的是普通单元格（从 Word 和 Google 文档复制的表格就是这样）。单元格里的 | 会转义成 \|，同一单元格里的多个段落或换行用 <br> 连接，跨多列的单元格后面会补上空单元格。表头单元格上设置的左对齐、居中、右对齐会保留。
  - q: 哪些内容会被去掉？
    a: <script>、<style>、<noscript>、<iframe>、<template> 和页面的 <head>（包括标题）。其余内容都会转换，包括导航菜单和页脚，所以只粘贴你需要的那部分页面。
  - q: 输出的是哪种 Markdown 风格？
    a: GitHub Flavored Markdown：# 标题、- 列表、*斜体*、**粗体**、``` 围栏代码块（code 元素带 language-js 这类 class 时会写上语言）、内联链接、~~删除线~~，以及由复选框生成的 - [x] 任务列表项。风格是固定的，所以每次输出的样子都一样。
  - q: 为什么有些 HTML 元素消失得无影无踪？
    a: Markdown 没有表示颜色、字体、表单或布局的语法，所以只保留它们的文字。图片会保留地址和替代文字；指向你电脑上文件的地址在别处无法使用。
---

## HTML 转 Markdown 怎样工作

转换器用浏览器自带的 HTML 解析器读取你的 HTML，再用 [Turndown](https://github.com/mixmark-io/turndown) 转换成 Markdown，所以杂乱或不完整的 HTML 会按浏览器显示它的方式来读。表格、删除线和任务列表这几条 GitHub Flavored Markdown 规则是本站自己写的，所以没有表头单元格的表格也会被转换，而不是保留成 HTML。

## 选项与限制

- **输入：** HTML 片段或整个页面，最多 1,000,000 个字符。
- **粘贴：** 剪贴板里有带格式文字的 HTML 时粘贴 HTML；纯文本照常粘贴。
- **去掉的内容：** 脚本、样式、noscript、iframe、template 和页面的 head。导航、页眉和页脚会和其他内容一样被转换。
- **表格：** 第一行一律作为表头行；跨多行的单元格不会重复填充，单元格里嵌套的表格会变成该单元格里的文字。
- **列表：** HTML 列表（<ul> 和 <ol>）会变成 Markdown 列表。以项目符号或编号开头的段落（Word 常这样复制列表）仍是段落。
- **不支持：** 选择其他 Markdown 风格，例如 * 列表、Setext 标题或引用式链接。

## 隐私

处理只在你的设备上完成。页面不会上传、保存你的 HTML，也不使用 Cookie。
