# 抓取任意网址的 Server-assisted Tool 不开放远程 MCP

像 HTTP Header Checker 这样替访客请求任意网址的 Tool，本质上是一个开放的 HTTP 代理。SSRF 防护只保护我们自己的网络，挡不住别人借我们的 Worker 反复请求第三方网站。网页调用有 Turnstile 加按 IP、按目标主机的限流；而远程 MCP 是匿名的，只有按 IP 的近似限流（Rate Limiting binding 按节点计数），被滥用时会耗尽 Free 计划每天的请求配额，第三方的投诉也会落到我们的账号上。

所以这类 Tool 设 `agent.remote: false`，只通过需要 Turnstile 的网页和页面内 WebMCP（运行在访客浏览器里，同样经过 Turnstile）调用。对外请求还要满足：只发 HEAD、只允许 80/443 端口、按目标主机限流、带可识别的 User-Agent（`WebToolsBot`）。以后如果要给这类 Tool 开放远程 MCP，先要有比按 IP 限流更强的身份或配额机制。

DNS Lookup 虽然在访客的浏览器里查询公共 DoH 服务（ADR-0002），不经过我们的服务器，同样设 `agent.remote: false`：如果由 Worker 替匿名调用者去查 Cloudflare、Google 的解析器，就成了同样的代理，而且第三方看到的是 Worker 的出口 IP。
