# 缺失翻译不发布，Draft 内容不进入 hreflang

某个 Locale 下如果没有 Tool 或 Variant 的内容，就不生成这个页面，访问时 302 到英文版，sitemap 和 hreflang 中都不出现，永远不出现"界面是本地语言、正文是英文"的半成品页面。有内容但 Review Status 是 Draft 的页面会发布，但设为 noindex，也不进入 hreflang 和 sitemap，因为 hreflang 指向 noindex 页面属于配置错误。只有 Reviewed 内容会参与索引。en 是事实源：非 en Locale 必须自身 Reviewed 并且 en 也 Reviewed 才算可索引，这样 `x-default`（指向 en）永远不会指向 noindex 页面。
