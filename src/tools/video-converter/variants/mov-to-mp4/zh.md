---
review: draft
updated: 2026-10-23
title: MOV 转 MP4 – 免费在线转换 QuickTime 视频
description: 在浏览器里免费把 MOV 转成 MP4。iPhone 和 QuickTime 视频通常不用重新编码，几秒钟就能转完，文件不会被上传。
name: MOV 转 MP4
answer: 选择一个 .mov 文件后点击"转换视频"，输出格式已经选好了 MP4。iPhone 和 Mac 录制的视频大多是 H.264 或 HEVC 视频加 AAC 音频，MP4 可以原样装下，所以几秒钟就能重新封装完，画质没有任何损失。
steps:
  - 选择 iPhone、Mac 或相机拍摄的 MOV 视频，不超过 500 MB。
  - 保持输出格式为 MP4，点击"转换视频"。
  - 下载 MP4 文件，在任何设备上播放或分享。
faq:
  - q: 为什么要把 MOV 转成 MP4？
    a: MOV 是苹果的 QuickTime 格式。Windows、安卓手机、智能电视和很多上传表单对 MP4 的支持更稳定，即使里面的视频完全一样。
  - q: iPhone 视频转换后画质会变差吗？
    a: 通常不会。iPhone 录制的是 H.264 或 HEVC 视频和 AAC 音频，这些音视频流会原样复制进 MP4，不重新编码，每一帧都和原来一样。
  - q: 为什么 ProRes 格式的 MOV 转换失败？
    a: Apple ProRes 是专业剪辑用的编码格式，浏览器无法解码。请先在剪辑软件里把片段导出为 H.264 或 HEVC，再到这里转换。
  - q: 未压缩的 PCM 音频会怎么处理？
    a: MP4 播放器通常需要压缩过的音频，所以 PCM 会被编码成 AAC。Firefox 没有 AAC 编码器，在 Firefox 里会编码成 Opus。
table:
  caption: MOV 文件中的各条音视频流在 MP4 里如何处理
  columns:
    track: 轨道
    source: MOV 中的编码格式
    result: 转成 MP4 时
    output: 输出编码格式
  terms:
    video: 视频
    audio: 音频
    copied: 原样复制，不重新编码
    reencoded: 重新编码
    unsupported: 浏览器不支持
---

## 为什么 MOV 转 MP4 通常一瞬间就完成

MOV 和 MP4 是近亲：两者都源自苹果的 QuickTime 文件格式，存放音视频流的方式相同。如果 MOV 里是 H.264 或 HEVC 视频加 AAC 音频，转换器只需要重写外面的容器，不解码也不重新编码任何一帧。所以即使是很长的 iPhone 视频，也能在几秒钟内变成 MP4，看起来和原片完全一样。

## 哪些 MOV 文件需要重新编码

录屏软件、老式相机和录音设备生成的文件有时带有 PCM 或 MP3 音频。这类音频会被编码成 AAC（在 Firefox 里是 Opus），视频仍然原样复制。Apple ProRes 视频在任何浏览器里都无法解码，遇到时工具会停止并提示，而不是输出一个损坏的文件。

## 隐私

MOV 文件在你的设备上读取并重新封装，不会上传，页面也不使用 Cookie。
