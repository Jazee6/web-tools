# PDF 不使用 MuPDF.js（AGPL）

MuPDF.js 在 PDF 的渲染、编辑、压缩、修复上能力最强，但它是 AGPL 许可：要么开源整个站点代码，要么购买商业授权。我们选择 pdf.js（Apache-2.0）负责渲染和提取文字，pdf-lib 的活跃 fork（MIT）负责合并、拆分、编辑，接受重压缩和修复能力弱一些的代价。将来如果要重新引入 MuPDF，必须先解决许可问题。
