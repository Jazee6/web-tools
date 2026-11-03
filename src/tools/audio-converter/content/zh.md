---
review: draft
updated: 2026-11-03
title: 音频格式转换 – 在线免费把 WAV、M4A、OGG、FLAC 转成 MP3
description: 免费在 MP3、M4A、WAV 和 OGG 之间转换音频，支持 MP3、M4A、AAC、WAV、OGG、Opus 和 FLAC 文件。在浏览器中运行，不上传任何文件，私密又快速。
name: 音频格式转换
answer: 选择一个音频文件，选好 MP3、M4A、WAV 或 OGG 以及码率，然后点击"转换音频"——文件会在你的设备上转换好，随即可以下载。默认是 192 kbps 的 MP3，在任何设备上都能播放。
action: 转换音频
fields:
  file:
    label: 音频（MP3、M4A、AAC、WAV、OGG、Opus 或 FLAC）
  format:
    label: 输出格式
    options:
      mp3: MP3
      m4a: M4A（AAC）
      wav: WAV（无压缩）
      ogg: OGG（Opus）
  bitrate:
    label: 码率
    options:
      "128": 128 kbps（体积更小）
      "192": 192 kbps（推荐）
      "320": 320 kbps（最高）
output:
  file:
    label: 转换后的音频
errors:
  invalid_audio: 无法把这个文件读取为音频。文件可能已损坏，或者是本工具不支持的格式。请重新导出为 MP3 或 WAV 再试。
  unsupported_codec: "当前浏览器无法解码或编码这段音频。请换一种输出格式，或使用最新版 Chrome。编码格式："
  aac_unavailable: 当前浏览器无法编码 AAC（例如 Firefox 就没有 AAC 编码器）。请选择 MP3、WAV 或 OGG，或改用 Chrome 或 Safari。
steps:
  - 选择一个不超过 500 MB 的 MP3、M4A、AAC、WAV、OGG、Opus、FLAC 或 WebM 音频文件。
  - 选择输出格式。MP3 在任何设备上都能播放，M4A（AAC）适合 iPhone 和 Mac，WAV 无压缩、便于编辑，OGG（Opus）在同样体积下音质最好。
  - 为 MP3、M4A 或 OGG 选择码率。192 kbps 适合大多数音乐，128 kbps 文件更小，320 kbps 是最高档。WAV 会忽略码率。
  - 点击"转换音频"。进度条会显示进度，随时可以取消。
  - 下载转换后的文件。
faq:
  - q: 我的音频会被上传到服务器吗？
    a: 不会。文件的解码和编码都在你的浏览器中完成，不会离开你的设备。
  - q: 怎样把 WAV 转成 MP3？
    a: 选择 WAV 文件，输出格式保持 MP3，选好码率，然后点击"转换音频"。一分钟的立体声 WAV 约 10 MB，同样一分钟的 192 kbps MP3 只有约 1.4 MB。
  - q: 应该选哪种码率？
    a: 对大多数音乐来说，192 kbps 很难听出与原声的差别。128 kbps 适合语音和播客，文件更小。320 kbps 是 MP3 的最高档，适合不在乎文件大小的时候。
  - q: 转成更高的码率能改善音质吗？
    a: 不能。把 128 kbps 的 MP3 转成 320 kbps 只会让文件变大，第一次编码时丢失的细节不会回来。从一种有损格式转成另一种有损格式总会损失一点音质，所以尽量从 WAV 或 FLAC 开始转换。
  - q: 可以改变 MP3 的码率吗？
    a: 可以。选择 MP3 文件，输出格式保持 MP3，再选另一个码率。声音会按这个码率重新编码，这是把大 MP3 变小的简单办法。
  - q: 可以转换 FLAC 文件吗？
    a: 可以，在 Chrome、Edge 和 Firefox 中都行。Safari 无法解码 FLAC，所以在 Safari 中本工具会给出提示。FLAC 可以转成 MP3、M4A、OGG 或 WAV；本工具不能输出 FLAC。
  - q: 环绕声会怎样处理？
    a: MP3、M4A 和 OGG 最多写入 2 个声道，所以环绕声会混缩为立体声。WAV 会保留所有声道。
---

## 转换原理

本工具用开源媒体库 Mediabunny 读取文件，用浏览器内置的 WebCodecs API 解码声音，再按你选的格式重新编码。浏览器无法编码 MP3，所以选择 MP3 时，本工具使用一个基于开源 MP3 编码器 LAME 构建的编码器。处理在后台线程中进行，页面不会卡顿。

如果要从视频中取出声音，请使用[视频提取音频](/zh/extract-audio)。

## 选项与限制

- **输入：** MP3、M4A、AAC、WAV、OGG、Opus、FLAC 和 WebM 音频文件，不超过 500 MB。只转换主音轨。
- **MP3：** 128、192 或 320 kbps，最多 2 个声道。不常见的采样率会转换为 48 kHz。
- **M4A：** 按所选码率编码的 AAC，最多 2 个声道，采样率为 44.1 或 48 kHz。Firefox 没有 AAC 编码器，所以在 Firefox 中无法输出 M4A。
- **OGG：** 按所选码率编码的 Opus，最多 2 个声道，采样率始终为 48 kHz。单声道最高按 256 kbps 编码。
- **WAV：** 16 位无压缩声音，保留原来的声道和采样率，立体声每分钟约 10 MB。
- **重新编码：** MP3、M4A 和 OGG 总是按你选的码率编码，即使源文件已经是同一种格式。本来就是 16 位的 WAV 会原样复制。
- **浏览器：** Safari 无法解码 FLAC 和 Vorbis。如果文件无法解码或编码，本工具会停下并给出提示。
- **内存：** 转换后的文件在你下载之前一直保存在内存中，所以很长的录音在手机上可能会失败。

## 隐私

你的音频只在你的设备上处理。页面不会上传或保存音频，也不使用 Cookie。
