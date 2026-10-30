---
review: draft
updated: 2026-10-30
title: 颜色转换器 – 在线转换 HEX、RGB、HSL、HWB 和 OKLCH 颜色
description: 在 HEX、RGB、HSL、HWB 和 OKLCH 之间转换 CSS 颜色，支持透明度（alpha）。免费、私密——在你的浏览器中处理，不会上传任何内容。
name: 颜色转换器
answer: 粘贴 HEX、RGB、HSL、HWB 或 OKLCH 格式的颜色并点击"转换"——同一颜色的五种格式会直接在浏览器中显示，可以随时复制。
action: 转换
fields:
  value:
    label: 颜色
    placeholder: "#ff5733 或 rgb(255 87 51) 或 hsl(11 100% 60%)"
output:
  hex:
    label: HEX
  rgb:
    label: RGB
  hsl:
    label: HSL
  hwb:
    label: HWB
  oklch:
    label: OKLCH
errors:
  invalid_color: "无法识别这个颜色。请使用 #ff5733 这样的十六进制颜色（3、4、6 或 8 位），或带三个值的 rgb()、hsl()、hwb()、oklch()，例如 rgb(255 87 51) 或 hsl(11, 100%, 60%)。不支持 red 这样的颜色名称。"
steps:
  - "在输入框中输入或粘贴一个颜色，例如 #ff5733、rgb(255 87 51)、hsl(11 100% 60%)、hwb(11 20% 0%) 或 oklch(0.68 0.21 34)。"
  - 点击"转换"。
  - 复制需要的格式——HEX、RGB、HSL、HWB 或 OKLCH。
faq:
  - q: 我输入的内容会上传到服务器吗？
    a: 不会。转换完全在你的浏览器中进行，输入的内容不会离开你的设备。页面加载完成后，你甚至可以离线使用。
  - q: 可以输入哪些颜色格式？
    a: 3、4、6 或 8 位的十六进制颜色，以及 CSS 函数 rgb()、rgba()、hsl()、hsla()、hwb() 和 oklch()。每个函数都支持逗号写法 rgb(255, 87, 51)，也支持空格写法 rgb(255 87 51 / 0.5)，斜杠后面是透明度（alpha）。色相可以是纯数字（单位为度），也可以带 deg、grad、rad 或 turn 单位。
  - q: 可以输入 red 这样的颜色名称吗？
    a: "不可以。工具只读取十六进制颜色和上面五个函数，颜色名称会被报错拒绝。请改用 #ff0000 或 rgb(255 0 0)。"
  - q: 透明度是怎么处理的？
    a: 透明度会保留在每一个结果中。HEX 会多出一组数字（#ff573380），其他格式会带斜杠和数值（rgb(255 87 51 / 0.5)）。透明度四舍五入到三位小数，完全不透明的颜色不会写出透明度。
  - q: 为什么转换后的值和我输入的略有不同？
    a: RGB 和 HEX 的通道是 0 到 255 的整数，所以以 HSL、HWB 或 OKLCH 给出的颜色会先四舍五入到最接近的 8 位值，再由这个取整后的颜色计算其他格式，这样五个结果彼此一致。HSL 和 HWB 的数值最多显示一位小数，OKLCH 的明度和色度最多显示四位小数。
  - q: 超出 sRGB 色域的 OKLCH 颜色会怎样？
    a: OKLCH 可以描述标准屏幕显示不出来的颜色。这类颜色会逐个通道夹紧到最接近的 sRGB 值，所以结果是与你输入的颜色接近、但不如它鲜艳的颜色。
---

## 这个颜色工具做什么

工具先把输入换算成 sRGB 色彩空间中的颜色，再写成五种 CSS 格式。HSL 和 HWB 按 [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) 中的公式由 RGB 计算得出。OKLCH 是 [Oklab](https://bottosson.github.io/posts/oklab/) 的极坐标形式；sRGB 与 Oklab 之间的换算使用 Björn Ottosson 公布的矩阵。结果采用现代的空格分隔 CSS 写法，例如 `rgb(255 87 51)`、`hsl(10.6 100% 60%)` 和 `oklch(0.6804 0.21 33.7)`。

## 选项与限制

- **输入**：一次一个颜色。首尾空格会被忽略，函数名和十六进制数字不区分大小写。
- **支持的格式**：3、4、6 或 8 位十六进制、`rgb()`、`rgba()`、`hsl()`、`hsla()`、`hwb()` 和 `oklch()`。不支持颜色名称、`color()`、`lab()`、`lch()`、`oklab()` 和 `var()`。
- **超出范围的值**：RGB 通道、饱和度、亮度、白度、黑度和透明度会被夹紧到有效范围。色相会循环，所以 `hsl(-120 100% 50%)` 与 `hsl(240 100% 50%)` 是同一种蓝色。
- **精度**：HEX 和 RGB 是 8 位。色相、饱和度、亮度、白度和黑度最多显示一位小数；OKLCH 的明度和色度最多显示四位小数。
- **灰色**：没有色相的颜色，色相显示为 0。

## 隐私

处理只在你的设备上完成。页面不会上传、保存你的输入，也不使用 Cookie。
