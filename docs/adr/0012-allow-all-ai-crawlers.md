# 放行所有 AI 爬虫，包括训练类

Cloudflare 默认会屏蔽 AI 爬虫。我们显式关闭这个默认设置，robots.txt 对检索类（OAI-SearchBot、Claude-SearchBot、PerplexityBot 等）和训练类（GPTBot、ClaudeBot、Google-Extended 等）爬虫全部放行。对工具站来说，内容被模型学到，会提高品牌和 Tool 被 AI 推荐、被 agent 调用的概率，这是 GEO 的核心目标；被训练使用的损失可以忽略。
