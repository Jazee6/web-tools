# zh（简体中文）术语表

## 语气

- 用"你"，不用"您"。简洁、平实，少用"可以…的"套话。
- 标点用全角中文标点（，。：；？！"…"），英文、数字与中文之间加一个空格（`2 个空格`、`JSON 格式化`）。按钮名等引用一律用英文直引号 `"…"`（与已有内容一致）。
- 按钮名在正文和步骤里用 `"…"` 括起，与 `action` / `label` 完全一致。
- 用简体字。技术词保留英文原写法（Cookie、WebCodecs、WASM）。

## 站点概念与界面词

| 概念 | 译法 | 避免 |
|---|---|---|
| Tool | 工具 | 应用、小工具 |
| Category | 分类 | 栏目、标签 |
| preset（Variant 页面上） | 预设 | 变体 |
| 在浏览器里运行 | 在浏览器中处理 / 在浏览器里完成 | 客户端处理、本地处理 |
| 不上传 | 不会上传到服务器 / 不会离开你的设备 | 不会发送到云端 |
| 复制 / 下载 / 取消 | 复制 / 下载 / 取消 | 保存 |
| 使用方法 / 常见问题 / 相关工具 | 使用方法 / 常见问题 / 相关工具 | 教程、帮助 |
| validate | 校验 | 验证、检查 |
| compress（体积） | 压缩 | 缩小 |
| minify | 压缩（JSON 里写"压缩为一行"） | 精简 |
| format（JSON） | 格式化（美化） | 美化代码 |
| transcribe | 转录（Tool 名用"语音转文字"；动词不用"识别"，"语音识别模型"可用） | 识别 |
| merge | 合并 | 拼接、组合 |
| device | 设备 | 机器 |
| model（AI） | 模型 | — |
| encode / decode / URL-safe / padding | 编码 / 解码 / URL 安全 / 填充（=） | 加密、转码 |
| percent-encoding / hash (digest) | 百分号编码 / 哈希 | URL 转义、散列、摘要 |
| JWT / header / payload / claim / signature | JWT / 头部 / 载荷 / 声明 / 签名 | 头信息、负载、有效载荷 |
| Unix timestamp / time zone | Unix 时间戳 / 时区 | 纪元时间、时间区 |
| alpha / hue / gamut | 透明度（alpha）/ 色相 / 色域 | 不透明度、色调、色彩范围 |
| word / character / sentence / paragraph / line / byte | 词 / 字符 / 句子 / 段落 / 行 / 字节 | 字数（单指词数时）、单词（中文语境） |
| uppercase / lowercase / title case / sentence case | 大写 / 小写 / 每个单词首字母大写 / 句首字母大写 | 大小写转换（作 Tool 名以外）、首字母大写（有歧义） |
| regular expression / pattern / flag / match / capture group | 正则表达式 / 模式 / 标志 / 匹配 / 捕获组 | 正则式、规则、标记、命中 |
| unit / metric / imperial / absolute zero | 单位 / 公制 / 英制 / 绝对零度 | 度量衡、计量单位 |

## Tool 与 Category 名称

| id | 名称 |
|---|---|
| json-formatter | JSON 格式化 |
| http-header-checker | HTTP 响应头检查 |
| image-compressor | 图片压缩 |
| image-converter | 图片格式转换 |
| merge-pdf | PDF 合并 |
| video-converter | 视频格式转换 |
| speech-to-text | 语音转文字 |
| base64-encode-decode | Base64 编码/解码 |
| url-encode-decode | URL 编码/解码 |
| hash-generator | 哈希生成器 |
| jwt-decoder | JWT 解码器 |
| timestamp-converter | 时间戳转换器 |
| color-converter | 颜色转换器 |
| word-counter | 字数统计 |
| case-converter | 大小写转换器 |
| regex-tester | 正则表达式测试器 |
| unit-converter | 单位换算器 |
| developer / image / pdf / media | 开发者与文本 / 图片 / PDF / 音视频 |
