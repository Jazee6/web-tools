# .md 副本只发布可索引页面，canonical 统一指向 HTML

原来每个已发布页面都有 `.md` 副本，不可索引页面的副本逐个加 `X-Robots-Tag: noindex`。这些规则按"页面 × Locale"写进 `_headers`，到 M3 结束时已有 70 条，而 `_headers` 最多只能有 100 条；首发约 30 个 Tool 再加上 Variant，规则数会远超上限。2026-10-23 改成：

- **只为可索引页面生成 `.md` 副本**。Draft 页面（含 en 仍是 Draft 的整组页面）没有副本，也不输出 `<link rel="alternate" type="text/markdown">`。站内链接到 Draft 页面时，Markdown 里链接的是它的 HTML 页面（`markdownHref`），`check:content` 拦截正文里指向不可索引页面的 `.md` 链接。缺失翻译跳转到 en 时，只有 en 有副本才跳转 `.md`。
- **所有副本只用一条规则声明 canonical**：`/*.md` 加 `Link: <https://…/:splat>; rel="canonical"`，指向同一路径的 HTML 页面。Cloudflare 的规则引擎把 splat 编译成 `.*`，后面可以接 `.md`，并在 header 值里替换 `:splat`（已在 miniflare 的 asset worker 源码中核实）。这样 `.md` 副本和 HTML 页面不会被当成重复内容分别收录。

这样 `.md` 相关的规则固定为 1 条，Draft 页面的静态文件数也减半。代价是 M5 审核通过之前，站点没有任何 `.md` 副本；agent 仍可以读取 HTML 页面，以及审核通过后的副本和 `llms.txt`。

## Considered Options

- 所有 `.md` 一律 noindex（一条规则）：Draft 副本照常发布，但 Reviewed 页面的副本也不能被收录。
- Draft 照常发布 `.md`，只加 canonical：Draft 副本的 canonical 指向 noindex 页面，两个信号互相矛盾。
