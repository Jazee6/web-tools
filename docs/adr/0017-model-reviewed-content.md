# 内容由 Gemini 审核即算 Reviewed

修订 ADR-0011 中“由人改成 Reviewed”这一条：所有 Locale（含 en）的内容都用 pi 调用 `antigravity/gemini-3.8-flash`（thinking high）审核一遍，判定 PASS 即可由 agent 把 Review Status 改成 Reviewed，不再需要人工审核。审核用的是另一家模型而不是撰写者自审，判定写在输出最后一行，只能是 `PASS` 或 `FAIL`；FAIL 就修改后重新审核，直到 PASS。en 对照 Tool 的源码核对事实（限制、行为、隐私声明），非 en 对照 en 核对译文。en 改动后，各 Locale 译文要同步修改并重新审核。可索引规则（非 en 自身 Reviewed 且 en 也 Reviewed）不变。这样做是因为 7 个 Locale × 数千页的人工审核产能撑不住。

调用方式：

```sh
pi -p --no-session --model antigravity/gemini-3.8-flash --thinking high "<审核提示>" @<待审文件> @<对照文件...>
```
