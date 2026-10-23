---
review: draft
updated: 2026-10-23
title: MP4 转 WebM – 免费在浏览器中转成 VP9 和 Opus
description: 免费把 MP4 转成 VP9 视频、Opus 音频的 WebM，适合网页和 HTML5 视频。文件在你的设备上编码，不会被上传。
name: MP4 转 WebM
answer: 选择一个 .mp4 文件，保持选中 WebM，点击"转换视频"。H.264 或 HEVC 视频会编码成 VP9，AAC 音频会编码成 Opus，这两种免版税格式在所有现代浏览器的 HTML5 video 元素里都能播放。
steps:
  - 选择一个不超过 500 MB 的 MP4 视频。
  - 确认输出格式是 WebM。
  - 点击"转换视频"，编码期间请保持页面打开。
  - 下载 WebM 文件，用在你的网页或应用里。
faq:
  - q: 什么时候该用 WebM 而不是 MP4？
    a: WebM 是为网页设计的格式。VP9 和 Opus 免版税，Chrome、Edge、Firefox 和 Safari 都支持，很适合 HTML5 视频、动态背景和网页应用。
  - q: 为什么 MP4 转 WebM 比其他转换慢？
    a: 大多数 MP4 里是 H.264 视频，而 WebM 装不下 H.264，每一帧都要解码后重新编码成 VP9。耗时取决于视频的时长、分辨率和你的设备。
  - q: 转出来的 WebM 会比 MP4 小吗？
    a: 要看原文件。同等画质下 VP9 比 H.264 更高效，但转换器使用较高的质量设置编码，所以文件可能变大也可能变小。
  - q: 本来就是 VP9 或 AV1 的 MP4 也会重新编码吗？
    a: 不会。WebM 可以直接装下 VP9、AV1 和 Opus，这些音视频流会原样复制，只换容器。
table:
  caption: MP4 文件中的各条音视频流在 WebM 里如何处理
  columns:
    track: 轨道
    source: MP4 中的编码格式
    result: 转成 WebM 时
    output: 输出编码格式
  terms:
    video: 视频
    audio: 音频
    copied: 原样复制，不重新编码
    reencoded: 重新编码
---

## 文件里发生了什么变化

WebM 只能装 VP8、VP9 或 AV1 视频，以及 Opus 或 Vorbis 音频。手机、录屏软件或剪辑软件导出的 MP4，通常是 H.264 或 HEVC 视频加 AAC 音频，所以两条轨道都要重新编码：视频编码成 VP9，音频编码成 Opus。编码使用 WebCodecs，浏览器支持时可以利用设备的硬件加速。

## 网页视频小贴士

- 保留原来的 MP4，作为很旧的浏览器的备用 `<source>`。
- 时长更短、分辨率更低的片段编码快得多，长录像可以先剪短。
- 重新编码是最慢的环节；本来就是 VP9 或 AV1 的 MP4 几秒钟就能转完。

## 隐私

MP4 在你的浏览器里本地解码和编码，不会上传任何内容，页面也不使用 Cookie。
