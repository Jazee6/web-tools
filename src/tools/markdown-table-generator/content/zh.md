---
review: reviewed
updated: 2026-11-14
title: Markdown 表格生成器 – 在线把 CSV 和 Excel 转成 Markdown 表格
description: 把 CSV、从 Excel 或 Google 表格复制的单元格，或者排版混乱的 Markdown 表格，转换成列宽对齐的 Markdown 表格。免费、私密——在你的浏览器中运行。
name: Markdown 表格生成器
answer: 把 CSV、从电子表格复制的单元格或已有的 Markdown 表格粘贴到"表格数据"框中，对齐好的 Markdown 表格会立即出现；点击"复制"即可复制。
action: 生成表格
fields:
  data:
    label: 表格数据
    placeholder: "Name,Role\nAda,Engineer\nGrace,Admiral"
  from:
    label: 输入格式
    options:
      auto: 自动识别
      csv: CSV（逗号分隔）
      tsv: TSV（从 Excel 或 Google 表格复制）
      markdown: Markdown 表格
  header:
    label: 第一行是表头
  align:
    label: 对齐
    options:
      none: 不指定
      left: 左对齐
      center: 居中
      right: 右对齐
  pad:
    label: 补齐列宽
output:
  markdown:
    label: Markdown 表格
errors:
  empty: 没有找到任何单元格。请粘贴几行 CSV、从电子表格复制的单元格或一张 Markdown 表格。
steps:
  - 把数据粘贴到"表格数据"框中——CSV、从 Excel 或 Google 表格复制的单元格，或一张 Markdown 表格。
  - 如果表格不对，选择正确的"输入格式"。
  - 如果数据没有表头行，关闭"第一行是表头"。
  - 如果每一列都要用同一种对齐方式，选择"对齐"。
  - 点击"复制"，复制 Markdown 表格。
faq:
  - q: 怎样把 Excel 或 Google 表格里的一块区域转成 Markdown 表格？
    a: 选中单元格，复制后粘贴到"表格数据"框中。电子表格复制单元格时用的是制表符分隔的文本（TSV），生成器会根据第一行里的制表符识别出来。含有换行或引号的单元格会被电子表格加上引号，也能正确读取。
  - q: CSV 里的逗号、引号和换行会怎样处理？
    a: 生成器遵循 RFC 4180。用双引号括起来的字段可以包含逗号和换行，"" 表示一个引号。单元格里的 | 会转义成 \|，避免把列拆开；单元格内的换行会变成 <br>，因为 Markdown 表格的一行必须写在同一行里。
  - q: 能整理一张排版混乱的 Markdown 表格吗？
    a: 能。粘贴表格后，它会按统一的间距重新排版。除非你为整张表选择了"对齐"，每一列都保留 --- 行里原有的对齐方式；单元格内容，包括行内代码、链接和已转义的 \|，都按原样保留。
  - q: 为什么我的表格第一行是空的？
    a: Markdown 表格必须有表头行。关闭"第一行是表头"后，生成器会加一行空表头，让你的第一行留在表格正文里。有些渲染器会把这行空表头显示成一条细横条。
  - q: 为什么在我的编辑器里各列没有对齐？
    a: 打开"补齐列宽"后，会补上空格，让同一列的单元格在等宽字体下宽度相同。宽度按字符估算——中日韩文字、全角符号和 emoji 按两列计算（大多数代码编辑器就是这样显示的），其他字符按一列计算。使用比例字体的编辑器，或把某些字符显示成别的宽度的编辑器，仍可能参差不齐——但渲染出来的表格都一样。
---

## Markdown 表格生成器怎样工作

生成器把你的数据当作 CSV（遵循 [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180)）、制表符分隔的值或 [GitHub Flavored Markdown 表格](https://github.github.com/gfm/#tables-extension-)读取，然后输出一张 GitHub Flavored Markdown 表格。"输入格式"设为自动识别时：第一行以 | 开头，或第二行由 --- 单元格组成，就当作 Markdown；第一行有制表符就当作 TSV；其余都按 CSV 读取。列宽按读者看到的字符逐个估算，中日韩等宽字符和 emoji 按两列计算，所以大多数文本在代码编辑器里都能对齐。

## 选项与限制

- **表格数据：** 最多 200,000 个字符。空行会被跳过；单元格比最长一行少的行，会在末尾补上空单元格。
- **CSV：** 只有逗号是字段分隔符。用分号分隔的文件（某些欧洲版本的 Excel 常见）不会被拆分，请改用逗号保存，或者直接从电子表格复制单元格。
- **对齐：** 所有列使用同一种对齐方式；或选"不指定"，让 CSV 和 TSV 的列不设对齐、保留 Markdown 表格原有的对齐。
- **单元格：** 首尾空格会被去掉。CSV 和 TSV 的单元格只转义 |、把换行变成 <br>；其中的 Markdown 或 HTML（例如 **粗体**）都会保留并正常渲染。
- **不支持：** 合并单元格、为 CSV 和 TSV 逐列设置对齐，以及把 Markdown 表格转回 CSV。

## 隐私

处理只在你的设备上完成。页面不会上传、保存你的数据，也不使用 Cookie。
