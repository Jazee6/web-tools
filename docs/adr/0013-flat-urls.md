# 扁平 URL，Category 不进路径

URL 采用扁平结构：Tool 是 `/{tool}`，Tool Variant 是 `/{tool}/{variant}`，Category 是 `/{category}`；Tool 和 Category 共用一个 slug 命名空间，构建期校验不冲突。Tool 的主 Category 只体现在面包屑和 `BreadcrumbList` 中，不进入 URL。这样 URL 更短，关键词更靠前；以后调整某个 Tool 的主 Category，也不用做 301，不会损失权重。代价是从 URL 里看不出站点的层级关系。

## Considered Options

- 嵌套 `/{category}/{tool}/{variant}`：URL 能体现层级，但 URL 更长，调整 Category 时必须重定向。
- Variant 放在顶层 `/{variant}`：长尾关键词就是完整路径，但 Variant 和 Tool 共用命名空间，从 URL 里看不出所属关系。
