# 内容由 agent 会话 + 项目内 skill 生产，不写流水线脚本

Tool、Variant、Category 内容的撰写和翻译都在 Claude Code 等 agent 会话中完成，不写调用 LLM API 的自动化流水线脚本，构建过程也不调用 LLM。可重复性由三件事保证：仓库内的 skill（风格指南 + 各 Locale 术语表）、每个 Locale 内容文件里的 Review Status 字段（agent 只写 Draft，由人改成 Reviewed）、构建期的 `check:content` 校验。
