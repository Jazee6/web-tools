---
review: draft
updated: 2026-10-31
title: "DNS 查询 – 在线查询 A、MX、TXT 等 DNS 记录"
description: "通过 Cloudflare 或 Google DNS 查询任意域名的 A、AAAA、CNAME、MX、TXT、NS、SOA 和 CAA 记录。免费——直接由你的浏览器发起查询。"
name: "DNS 查询"
answer: '输入域名，选择记录类型并点击"查询"——记录、TTL 和 DNS 响应码会直接在浏览器中显示。'
action: "查询"
fields:
  domain:
    label: "域名"
    placeholder: "example.com"
  type:
    label: "记录类型"
    options:
      A: "A – IPv4 地址"
      AAAA: "AAAA – IPv6 地址"
      CNAME: "CNAME – 指向另一个名称的别名"
      MX: "MX – 邮件服务器"
      TXT: "TXT – 文本记录"
      NS: "NS – 名称服务器"
      SOA: "SOA – 区域授权信息"
      CAA: "CAA – 允许签发证书的机构"
  resolver:
    label: "解析器"
    options:
      cloudflare: "Cloudflare (1.1.1.1)"
      google: "Google 公共 DNS (8.8.8.8)"
output:
  status:
    label: "响应码"
  records:
    label: "记录"
    columns:
      name: "名称"
      type: "类型"
      ttl: "TTL（秒）"
      data: "数据"
errors:
  invalid_domain: "这不是有效的域名。请输入 example.com 或 www.example.com 这样的名称，也可以粘贴完整的网址。名称可以使用字母、数字、连字符和下划线，点号之间的每一段最长 63 个字符。"
  lookup_failed: '无法连接解析器，或解析器没有给出可用的答复。请检查网络连接后重试，也可以把"解析器"换成另一个——有些网络会屏蔽其中一个。'
steps:
  - '在"域名"中输入域名，例如 example.com，也可以输入完整网址。'
  - '选择"记录类型"——A 是 IPv4 地址，MX 是邮件服务器，TXT 用于 SPF 和验证记录，依此类推。'
  - '选择"解析器"（Cloudflare 或 Google），然后点击"查询"。'
  - "查看响应码和记录表，表中给出每条记录以秒为单位的 TTL。"
faq:
  - q: "我输入的域名会被上传到服务器吗？"
    a: "域名由你的浏览器通过 HTTPS 直接发给你选择的解析器（Cloudflare 或 Google），不会经过我们的服务器，我们也不保存。解析器会看到域名和你的 IP 地址，并按各自的隐私政策处理。"
  - q: "为什么用 Cloudflare 或 Google，而不是域名自己的名称服务器？"
    a: "浏览器无法发送普通的 DNS 查询，只能发送网页请求。Cloudflare 和 Google 都提供 DNS over HTTPS（DoH），也就是公共解析器的网页接口。这些解析器会缓存答复，所以你看到的是普通访客看到的结果，可能落后于你刚做的修改。修改生效期间，两家的结果也可能不同。"
  - q: "各种记录类型是什么意思？"
    a: "A 和 AAAA 给出名称的 IPv4 和 IPv6 地址；CNAME 让名称成为另一个名称的别名；MX 列出邮件服务器及其优先级；TXT 保存 SPF、DKIM、网站验证值之类的自由文本；NS 列出域名的名称服务器；SOA 描述区域，包括主名称服务器、管理员联系方式和计时参数；CAA 指明允许签发证书的证书颁发机构。"
  - q: "NOERROR 和 NXDOMAIN 是什么意思？"
    a: "NOERROR 表示查询得到了答复。如果表格为空，说明该名称存在，但没有你所查类型的记录。NXDOMAIN 表示该名称根本不存在。SERVFAIL 和 REFUSED 表示解析器没能得到答复，常见原因是域名的名称服务器出了问题。"
  - q: "为什么每次查询的 TTL 都不一样？"
    a: "解析器会在记录的 TTL 时间内保留答复，并不断倒计时。如果 TTL 比记录配置的值小，说明这个答复是几秒前缓存下来的。"
  - q: "可以查询 IP 地址或内网主机名吗？"
    a: "不可以。不支持对 IP 地址做反向查询，而且解析器只知道公共 DNS，所以只存在于私有网络里的名称会返回 NXDOMAIN。"
---

## 这个 DNS 查询工具做什么

工具向你选择的解析器发出一次针对该域名和记录类型的 DNS 查询，使用它的 JSON 接口：[Cloudflare](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/) 或 [Google](https://developers.google.com/speed/public-dns/docs/doh/json)。请求由你的浏览器自己发出，所以得到的就是该解析器返回给你的答复。表格列出每条答复记录；如果有 CNAME 链，会先列出 CNAME 记录，再列出最终记录。解析器拆成多段的 TXT 值会合并成一段文本，CNAME、NS 和 MX 目标末尾的点会被去掉。

## 选项与限制

- **域名**：域名或网址，最多 2,048 个字符。协议、路径和端口会被忽略，国际化域名会转成 punycode（bücher.example 会变成 xn--bcher-kva.example）。
- **记录类型**：A、AAAA、CNAME、MX、TXT、NS、SOA 和 CAA。不支持反向查询（PTR）和 DNSSEC 记录。
- **解析器**：只有 Cloudflare 和 Google，不能输入自己的解析器。工具不显示答复是否通过了 DNSSEC 验证。
- **超时**：10 秒内没有得到答复的查询会失败。
- **网络**：查询需要联网，所以离线时无法使用。

## 隐私

你输入的域名由浏览器发给你选择的解析器（Cloudflare 或 Google），它会看到域名和你的 IP 地址。域名不会到达我们的服务器，页面也不会保存你的输入或使用 Cookie。
