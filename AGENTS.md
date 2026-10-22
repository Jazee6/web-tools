## Agent skills

### Domain docs

Single-context: root `GLOSSARY.md` and `docs/adr/`. See `docs/agents/domain.md`.

## 项目规则

- 功能尽量满足Cloudflare Free Tier使用
- 1.0版本之前为开发阶段，无需考虑线上和向后兼容
## 开发

- 包管理与脚本用 Bun：`bun run dev | build | check | lint | fmt | test | test:e2e | check:limits`
- Astro 在 agent 环境下会自动把 `dev` / `preview` 放到后台，用 `astro dev status|logs|stop` 管理；需要前台运行时加 `--ignore-lock`
- Locale 唯一事实源：`src/lib/i18n/locales.ts`（路径代码即 Locale id），`project.inlang/settings.json` 须与之一致
- UI 文案在 `messages/{locale}.json`，`src/paraglide/` 是编译产物，不要手改
