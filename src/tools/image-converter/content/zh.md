---
review: draft
updated: 2026-10-29
title: 图片格式转换 – 在线转换 HEIC、JPEG、PNG、WebP 和 AVIF
description: 把 iPhone 的 HEIC 照片，或 JPEG、PNG、WebP、AVIF 图片转换为 JPEG、PNG、WebP 或 AVIF。免费、私密——在你的浏览器中处理，不会上传到服务器。
name: 图片格式转换
answer: 选择一张图片，选好输出格式，然后点击"转换图片"——HEIC、JPEG、PNG、WebP 或 AVIF 文件会在你的设备上重新编码，之后即可下载转换后的副本。
action: 转换图片
fields:
  file:
    label: 图片（HEIC、JPEG、PNG、WebP 或 AVIF）
  format:
    label: 转换为
    options:
      jpeg: JPEG（兼容性最好）
      png: PNG（无损，保留透明）
      webp: WebP（体积小，需较新的浏览器）
      avif: AVIF（体积最小，速度较慢）
  quality:
    label: 质量（1–100）
output:
  file:
    label: 转换后的图片
errors:
  decode_failed: 无法读取这张图片。文件可能已损坏，使用了解码器不支持的 HEIC 变体，或者使用了浏览器无法解码的格式。请换一份图片副本，或用最新版 Chrome、Firefox、Safari 打开本页再试。
steps:
  - 选择一张不超过 50 MB 的 HEIC、JPEG、PNG、WebP 或 AVIF 图片。
  - 选择输出格式。JPEG 几乎在所有地方都能打开；PNG 无损并保留透明；WebP 和 AVIF 的文件更小。
  - 保持默认质量 85，或自行设置——数值越低，文件越小，压缩痕迹也越明显。PNG 会忽略这个设置。
  - 点击"转换图片"，然后下载转换后的文件。较大的图片，尤其是输出 AVIF 时，可能需要几秒钟。
faq:
  - q: 我的图片会上传到服务器吗？
    a: 不会。图片在你的浏览器中通过 WebAssembly 解码并重新编码，始终不会离开你的设备。页面加载完成后，离线也能使用。
  - q: 怎么把 iPhone 的 HEIC 照片转成 JPG？
    a: 选择 .heic 文件，保持选中 JPEG，然后点击"转换图片"。HEIC 由页面自己解码，所以在 Chrome、Firefox 这类打不开 HEIC 的浏览器里也能用。第一次转换 HEIC 时会下载约 2 MB 的解码器。
  - q: 可以转换成 HEIC 吗？
    a: 不可以。浏览器没有 HEIC 编码器，所以 HEIC 只能作为输入。输出格式有 JPEG、PNG、WebP 和 AVIF。
  - q: 应该选哪种输出格式？
    a: 分享和打印时，JPEG 最稳妥。截图、徽标和带透明的图片适合用 PNG。WebP 和 AVIF 生成的文件更小，适合网站，但一些较旧的应用打不开它们。
  - q: 透明区域会怎么处理？
    a: PNG、WebP 和 AVIF 会保留透明。JPEG 不支持透明，所以透明像素会填充为白色。
  - q: 照片的元数据会保留吗？
    a: 不会。EXIF 相机数据、GPS 位置等元数据不会复制到转换后的文件，这也保护了你的隐私。内嵌的色彩配置文件同样不会保留，所以广色域照片（例如 iPhone 的 Display P3 图片）看起来可能略微不够鲜艳。
---

## 转换是怎么进行的

HEIC 和 HEIF 文件用编译成 WebAssembly 的 [libheif](https://github.com/strukturag/libheif) 解码，只有在你选择这类文件时才会加载。JPEG、PNG、WebP 和 AVIF 文件由浏览器解码。之后像素会用 MozJPEG、libwebp 或 libaom（Google Squoosh 使用的编码器）重新编码；PNG 则先由浏览器的 PNG 编码器生成，再用 OxiPNG 做无损优化。这一切都在后台线程中运行，页面不会卡顿。

## 选项与限制

- **输入格式**：HEIC、HEIF、JPEG、PNG、WebP 和 AVIF。GIF、SVG、BMP 等其他格式不被接受。
- **输出格式**：JPEG、PNG、WebP 或 AVIF。输出的像素尺寸与输入相同。
- **大小**：每张图片最大 50 MB。特别大的图片需要大量内存，在手机上可能失败。
- **数量**：一次一张图片。
- **动画与多图**：只转换第一张图像或第一帧，所以动画 WebP、AVIF 文件，以及包含多张图像的 HEIC 文件，只会得到一张静态图片。
- **质量**：适用于 JPEG、WebP 和 AVIF；PNG 输出始终无损。
- **浏览器**：HEIC 在所有受支持的浏览器中都能用。其他输入格式由浏览器先行解码，所以浏览器无法显示的格式（例如旧版浏览器中的 AVIF）会被拒绝。

## 隐私

图片只在你的设备上处理。页面不会上传、保存你的图片，也不使用 Cookie。
