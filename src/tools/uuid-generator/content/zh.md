---
review: reviewed
updated: 2026-11-09
title: "UUID 生成器 – 在线批量生成随机 UUID v4 标识符"
description: "一次生成最多 1,000 个随机 UUID v4 标识符，可选小写或大写。免费、私密，生成过程完全在你的浏览器中完成。"
name: "UUID 生成器"
answer: '选择数量并点击"生成 UUID"，即可在浏览器中创建随机 UUID v4 标识符，每行一个，方便复制。'
action: "生成 UUID"
fields:
  count:
    label: "数量"
  uppercase:
    label: "大写"
output:
  uuids:
    label: "UUID"
errors: {}
steps:
  - '把"数量"设为 1 到 1,000 之间的整数；默认是 1。'
  - '按需开启"大写"；默认使用小写。'
  - '点击"生成 UUID"并复制结果，每行一个标识符。'
faq:
  - q: "生成的是哪个 UUID 版本？"
    a: "只生成版本 4，使用平台提供的密码学安全 randomUUID API。不生成 v1、v5 或 v7 这类基于时间或名称的 UUID。"
  - q: "一次能生成多少个 UUID？"
    a: "每次 1 到 1,000 个。每个 UUID 独占一行，不含大括号或 URN 前缀。"
  - q: "大写会改变 UUID 吗？"
    a: "不会。它只改变十六进制字母的大小写，不改变标识符的值。两种形式都保留连字符。"
  - q: "生成的标识符会被上传或保存吗？"
    a: "不会。生成在你的设备上完成，页面不会上传或保存生成的标识符。离开页面前，请复制你想保留的结果。"
---

## UUID 如何生成

每个标识符都由平台的 Web Crypto `crypto.randomUUID()` API 生成。结果是格式为 `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` 的 UUID v4，其中小写形式的 `y` 为 8、9、a 或 b。每次点击都会生成新的一批；没有文本或种子输入。

## 选项与限制

- **数量**：1 到 1,000 之间的整数，默认是 1。
- **大小写**：默认小写，也可使用大写，连字符格式不变。
- **不支持**：v4 以外的 UUID 版本、自定义种子、大括号和 URN 前缀。

## 隐私

生成只在你的设备上完成。页面不会上传、保存生成的 UUID，也不使用 Cookie。
