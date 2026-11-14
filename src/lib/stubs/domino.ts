// turndown 的 Node 入口用 domino 解析 HTML（约 430 KB，gzip 后约 89 KB）。HTML to Markdown 只在浏览器主线程运行，
// 用浏览器自带的 DOMParser，不开放远程 MCP（ADR-0026），服务端永远不会执行它。
// astro.config.ts 把 @mixmark-io/domino 指向这里，免得把它打进 Worker 包；vitest 不用这个别名，Node 里的测试仍用真的 domino
export const createDocument = (): never => {
  throw new Error("domino is not bundled: see src/lib/stubs/domino.ts");
};
