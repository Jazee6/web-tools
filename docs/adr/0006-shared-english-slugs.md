# 各 Locale 共用英文 slug

所有 Locale 的 URL 都使用 Tool 的英文 id 作为 slug（例如 `/zh/image-compressor`），slug 就是 Tool 的永久 ID。这样 hreflang 映射非常简单，修改译名不会影响 URL，也避免了 CJK slug 被百分号编码。代价是小语种的 URL 里没有当地语言的关键词信号。我们接受这个代价，因为 URL 关键词对排名的权重很小，而维护各语言 slug 映射表和重定向的成本是长期的。
