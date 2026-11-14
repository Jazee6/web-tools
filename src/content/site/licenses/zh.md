---
review: reviewed
updated: 2026-11-09
title: "第三方许可证 – 软件、模型与字体声明"
description: "查看 Web Tools 使用的软件、模型和字体的许可证全文与源码链接，了解 libheif 和 LAME 编码器等组件各自适用的许可条款。"
name: "第三方许可证"
---

下面的清单在网站构建时自动生成，涵盖网站中使用的第三方代码、模型和字体。包版本在构建时读取。许可证全文保留英文原文，LGPL 和 MPL 组件附有源码链接。

本清单仅供参考，不是法律意见，也不是完整履行许可义务的证明。部分捆绑原生依赖和模型转换产物的许可条款仍在核实中。

## 需要单独说明的组件

- **PDFium：**封装层使用 MIT；随包的 PDFium 声明包含 BSD 风格条款和 Apache-2.0 原文，以及捆绑库的声明。
- **jSquash：**除了封装层的 Apache-2.0 条款，处理库还各有自己的许可证。
- **libheif 和 libde265：**使用 LGPL-3.0，打包在 JavaScript 中。许可条款包含修改和替换所涵盖组件的权利。
- **LAME：**MP3 编码器使用 GNU Library GPL 第 2 版或后续版本，独立于 Mediabunny 及其 MP3 封装层的 MPL-2.0 条款。编码器同样打包在 JavaScript 中。

对于 libheif、libde265 和 LAME，我们尚未提供替换或重新链接这些捆绑组件的机制。相应的 LGPL 要求仍是发布前待解决事项；仅提供源码链接并不表明这些要求已经得到满足。

This software is based in part on the work of the Independent JPEG Group.
