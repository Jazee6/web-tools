---
review: reviewed
updated: 2026-10-29
title: JWT 解码器 – 在线解码 JSON Web Token 的头部和声明
description: 解码 JWT，查看头部、载荷声明和签名，并把 exp、nbf、iat 转成 UTC 时间。免费、私密——在你的浏览器中处理，不会上传到服务器。
name: JWT 解码器
answer: 粘贴 JSON Web Token 并点击"解码"——头部、载荷声明和签名直接在浏览器中显示，exp、nbf、iat 会转成 UTC 时间。签名不会被验证。
action: 解码
fields:
  token:
    label: JWT
    placeholder: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature
output:
  header:
    label: 头部
  payload:
    label: 载荷
  signature:
    label: 签名（未验证）
  times:
    label: 时间声明（UTC）
    columns:
      claim: 声明
      time: 时间
errors:
  invalid_token: 这不是有效的 JWT。令牌由三部分组成，以点号分隔，每部分都用 base64url 编写（只含字母、数字、- 和 _，没有 = 填充），并能解码为 UTF-8 文本。请重新复制完整的令牌，并去掉其中的引号或换行。
  invalid_json: 头部或载荷不是 JSON 对象。JWT 的头部和声明都是 JSON 对象，请检查令牌在复制时是否被截断或改动。
  encrypted_token: 这个令牌有五个部分，是加密的 JWT（JWE），没有解密密钥就无法读取内容。这里只能解码由三部分组成的已签名令牌。
steps:
  - 复制令牌并粘贴到输入框中。Authorization 头里开头的"Bearer "会自动去掉。
  - 点击"解码"。
  - 查看头部（算法和令牌类型）、载荷（声明）；如果令牌带有 exp、nbf 或 iat 声明，还会显示转成 UTC 的对应时间。
  - 把结果当作未经验证的内容。解码只是读取令牌，并不能证明它由谁签发。
faq:
  - q: 我的令牌会被上传到服务器吗？
    a: 不会。令牌完全在你的浏览器里解码，不会离开你的设备。页面加载完成后，离线也能使用。不过，不要把仍在生产系统中有效的令牌粘贴到你不信任的网站。
  - q: 这个工具会验证签名吗？
    a: 不会。它只解码三个部分，签名按令牌中的原样显示。任何人都可以构造带有任意声明的令牌，所以在信任令牌之前，请在你自己的代码里用签发方的密钥验证签名。
  - q: exp、nbf 和 iat 是什么意思？
    a: 它们是 RFC 7519 中登记的时间声明，写作自 1970-01-01 UTC 起的秒数。exp 是令牌过期的时间，nbf（not before）是令牌开始有效的时间，iat（issued at）是令牌创建的时间。表格把它们转成易读的 UTC 时间，但不会告诉你令牌现在是否已经过期。
  - q: 五部分的令牌为什么会报错？
    a: 五部分的令牌是加密的 JWT（JWE），载荷已被加密，没有解密密钥就读不到内容。已签名的 JWT（JWS）只有三部分。
  - q: 签名为空的令牌能解码吗？
    a: 能。未签名的令牌（"alg":"none"）以一个点号结尾，签名为空。它能正常解码，但声明没有任何保护，千万不要用它做访问控制。
---

## 这个 JWT 工具做什么

JSON Web Token（[RFC 7519](https://www.rfc-editor.org/rfc/rfc7519)）由三段 base64url 编码的内容用点号连接而成：包含签名算法的头部、包含声明的载荷，以及签名。解码器会拆开令牌，把头部和载荷从 base64url 解码为 UTF-8，并以带缩进的 JSON 显示。声明中的 `iat`、`nbf` 和 `exp` 是数字形式的日期，所以也会以 UTC 时间列出。

## 选项与限制

- **仅解码**：不会检查签名，也不会获取密钥，或把令牌与当前时间比较。
- **已签名令牌**：可以解码三部分的令牌，包括签名为空的未签名令牌。五部分的加密令牌（JWE）会被拒绝。
- **格式严格**：头部和载荷必须是 JSON 对象。标准 Base64 的字符（+、/ 和 =）不能代替 base64url。
- **大数字**：声明的值按 JavaScript 数字显示，超过 9,007,199,254,740,991 的整数可能损失精度。
- **大小**：只受设备内存限制。

## 隐私

处理只在你的设备上完成。页面不会上传、保存你的令牌，也不使用 Cookie。
