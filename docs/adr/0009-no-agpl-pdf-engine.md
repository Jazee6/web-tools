# PDF 不使用 MuPDF.js（AGPL）

MuPDF.js 在 PDF 的渲染、编辑、压缩、修复上能力最强，但它是 AGPL 许可：要么开源整个站点代码，要么购买商业授权。我们选择 pdf.js（Apache-2.0）负责渲染和提取文字，pdf-lib 的活跃 fork（MIT）负责合并、拆分、编辑，接受重压缩和修复能力弱一些的代价。将来如果要重新引入 MuPDF，必须先解决许可问题。

2026-10-23 补充：PDF 引擎改为 PDFium 的 WASM 构建（`@embedpdf/pdfium`，封装层 MIT，PDFium 本身 Apache-2.0），不再用 pdf.js + pdf-lib fork。PDFium 就是 Chrome 的 PDF 引擎，渲染、提取文字、合并拆分（`FPDF_ImportPages`）、表单和注释都由同一个引擎完成，渲染保真度最高，只需要一个依赖。pdf-lib 原版 2021 年后停止维护，fork 分散；pdf.js 的 `extractPages` 能合并、重排页面，但出现时间较短，也不能编辑内容。代价有两点：WASM 约 4.6 MB（gzip 后约 2.1 MB），每个 PDF Tool 第一次使用时要下载，之后由浏览器缓存；另外要直接调用 C API，内存分配和释放由我们自己管理。加密 PDF 的处理不变：需要打开密码的文件直接报错。
