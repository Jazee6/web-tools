// @tanstack/form-core 在生产环境也会打包 TanStack Devtools 的事件客户端（约 1 KB gzip），本站不用 Devtools。
// astro.config.ts 把这个包指向这里，节省首屏 JS（architecture §15）。
export class EventClient {
  emit() {}

  on() {
    return () => {};
  }
}
