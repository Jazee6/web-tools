# 第三方声明的构建依据

`bun run build` 先构建真实的 `dist/client`，再由 `scripts/lib/licenses.ts` 生成静态许可证声明。本轮新增的 21 个说明页内容目前全部是 Draft；本清单不是法律意见或完整合规证明。开发模式显示页面说明、库存区域为空；真实库存需运行构建后通过 preview 查看，不在 dev 中模拟生产依赖。

## 库存与版本

- `scripts/lib/client-provenance.ts` 从 Vite 实际输出的浏览器和 Worker `chunk.modules` 采集仍有代码的包；不把完整 lockfile 的开发依赖当作浏览器分发清单。
- 实际输出中的 `vite/preload-helper.js`、`__vite-browser-external` 和 `rolldown/runtime.js` 虚拟模块分别归属已安装 Vite / Rolldown runtime，附包内原文（含 Rolldown 的 Rollup / esbuild 通知）。这不表示它们的整个构建工具依赖都进入浏览器；未知虚拟模块会令构建失败，要求人工归属。
- 构建中间文件 `.astro/client-modules.jsonl`；生成文件 `/third-party-notices/inventory.json` 记录组件、所属 chunk、许可全文路径、源码链接，以及 WASM、字体、模型、超过 100 KB 的 JS 的字节数和 SHA-256。独立 WASM / 字体按 SHA-256 反向匹配已安装文件；内联 libheif / LAME 按 Worker 模块归属。模型切片对应各 Tool `model.ts`（`speech-to-text`、`background-remover`、`image-to-text`）的固定下载清单；ORT 的 WASM 清单在 `src/lib/runtime/ort-wasm.ts`。
- 包版本从每个真实模块所属的 `node_modules/**/package.json` 读取，包括嵌套的 `onnxruntime-common` 和 `squoosh-oxipng` manifest。原生补充条目显示 `父包@版本`，不是声称该数值是原生库版本。LAME 版本从已安装 MP3 包 README 提取；模型显示固定 revision。硬编码的已核对版本只用于发现升级：版本漂移只发 warning（构建继续，postbuild 结束时汇总，读不到 LAME 版本时显示 unknown），提醒重新核对许可证文本和源码链接；缺失许可证全文或无法归属才让构建失败。硬编码版本不作为显示数据源。
- CSS 入口的第三方 `@import` 会被 Tailwind 合并，不能只靠 JS 模块图；构建另外读取实际 `src/**/*.css` 的包导入（Tailwind CSS、tw-animate-css、shadcn），归属到输出 CSS，并复制对应已安装包的 MIT 原文。`inventory.json` 也记录输出 CSS 的字节数和 SHA-256。
- 网页使用系统字体；fontsource Noto Sans SC / JP 是 OG 构建输入，只有栅格图分发，不把字体文件误列成浏览器下载。`src/sw.ts` 的 Bun 构建只含本站模块。
- 许可证正文从已安装包原样复制。包未包含的原生全文 / 通知收集在 `upstream/`，固定来源 URL、原始字节数、SHA-256 在 `upstream/sources.json`，构建验证其完整性。此目录排除自动格式化，不能重排或翻译原文。
- MPL 的 Mediabunny / MP3 wrapper 源码链接为对应已安装版本的 npm 源码包（包含 `src/`）；LAME 源码链接按 README 中的版本生成，读不到版本时指向上游目录、版本显示 unknown，缺失 README 时不附构建说明链接；当前安装包 README 含 Emscripten 构建 / 静态链接命令；libheif 与 libde265 提供固定原生源码链接。链接不等于替换 / 重新链接义务已履行。

## 主要组件与原生依据

| 分发组件                            | 许可 / 依据                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PDFium                              | `@embedpdf/pdfium` 的 MIT LICENSE 和 `LICENSE.pdfium`（BSD-style + Apache-2.0），非单一 Apache 许可。WASM SHA-256 `5e4cd023c3dad4a895b3571ca573d3fc51bac6de48360d95283134385b954eaa` 与 embed-pdf-viewer `4db40e21c91d7767fc0cce21802b83ccd68e48e2` 发布构建相符；其 PDFium 子模块 `73a041a5c1aaffa09ebb64f1981ff501cb91a41c` 的 DEPS / third_party 树用于收集通知。 |
| PDFium 原生通知（部分）             | FreeType FTL、OpenJPEG、Little CMS、LibTIFF、AGG、libjpeg-turbo、libpng、zlib。来源固定在 `sources.json`，嵌入字体等闭包仍未完成。                                                                                                                                                                                                                                   |
| jSquash                             | wrapper Apache-2.0；JPEG / WebP / OxiPNG 包附 codec 原文；原生配方用于补 MozJPEG 3.3.1 的 IJG README、libavif 1.0.1 LICENSE、libaom 3.7.0 LICENSE/PATENTS、libsharpyuv 的 WebP COPYING/PATENTS、WebP 包配方 commit 的 COPYING/PATENTS。                                                                                                                              |
| libheif-js                          | LGPL-3.0 原文及 wasm 目录的 LGPL/GPL/MIT 通知；配方指向 libheif `413e2a87e6a70b3eccc3a3adc5801179dd2d9e00` 与 libde265 1.0.15，后者亦有独立 COPYING。未改变打包。                                                                                                                                                                                                    |
| Mediabunny / MP3 wrapper            | MPL-2.0 全文与精确 npm 源码包；实际编码器 LAME 另为 GNU Library GPL 2-or-later（LGPL），`COPYING` 来自官方 3.100 压缩包。压缩包 SHA-256 记录于来源清单。                                                                                                                                                                                                             |
| Transformers.js / ONNX              | Apache-2.0 / MIT；ORT Web 固定源码 commit 的 LICENSE 与 ThirdPartyNotices，ORT common 用其 dev 版本号所含 commit 的文本（与 v1.30.0 tag 逐字节相同）；manifest 版本漂移时只告警，需重新核对这些固定原文。                                                                                                                                                            |
| Whisper base                        | 官方 Whisper README 明确代码与权重为 MIT；固定 onnx-community revision 的模型卡没有许可字段，未找到独立 LICENSE。附原始模型卡、官方 README 与上游 MIT 全文，转换产物的独立许可声明待核实。                                                                                                                                                                           |
| BiRefNet_lite（Background Remover） | 权重 MIT（上游 BiRefNet 固定 commit 的 LICENSE）；两个固定 revision 的社区 ONNX 导出各附 LICENSE 与模型卡。训练集 DIS5K 的使用条款只许非商用研究，风险与取舍见 ADR-0022。                                                                                                                                                                                            |
| PP-OCRv6 small（Image to Text）     | 检测与识别两个模型均为 PaddlePaddle 官方 Hugging Face 仓库发布的 ONNX，固定 revision，模型卡标注 Apache-2.0；仓库无独立 LICENSE，附 PaddleOCR v3.7.0 tag 的 Apache-2.0 全文与两份模型卡。见 ADR-0023。                                                                                                                                                               |
| fflate、React / React DOM 等        | 真实模块清单中的全部 JS 包逐项附本地原文，包括 TanStack、Base UI、Floating UI、Radix、Valibot、Lucide 等；不能仅限本表。                                                                                                                                                                                                                                             |
| Noto Sans SC / Noto Sans JP         | 两个 fontsource 包本地 OFL 原文，版本读 manifest。                                                                                                                                                                                                                                                                                                                   |

## 尚未证明的事项（保持开放）

1. PDFium 的嵌入字体、Emscripten 等完整二进制依赖闭包，以及收集的源码树是否可重现该 WASM。已匹配主 WASM 不代表所有链接库的构建参数和来源都已证明。
2. OxiPNG 目标 / feature 对应的 Rust 依赖闭包；不能把整个 Cargo.lock 无差别声明成实际分发。
3. ORT 宽泛 ThirdPartyNotices 中哪些组件实际链接进本站 WASM。
4. libheif 内联 WASM 的 LGPL 用户替换 / 重新链接要求（本轮范围外，保留原打包）；LAME 静态 / 内联编码器相应义务也未完成确认。
5. 固定 ONNX 转换仓库没有许可字段或独立 LICENSE。官方 Whisper README 明确代码和权重为 MIT，但不能据此声称转换仓库也作出了独立的 MIT 声明；当前 Hugging Face `openai/whisper-base` 模型卡另标 Apache-2.0，来源间的标注差异仍待澄清。
6. `react-remove-scroll-bar@2.3.8` 的包未附 LICENSE。npm 元数据声明 MIT，但其 gitHead 在上游不可访问；现附可访问上游固定 HEAD 的 MIT 原文，不能证明与发行版逐字一致。来源清单记录此 caveat。

上述项同时保留在 `docs/roadmap.md` 的上线前开放项中，声明页公开主要原生限制。许可证框架本地化，原文不翻译；所有页面继续 Draft / noindex，没有模型审核。
