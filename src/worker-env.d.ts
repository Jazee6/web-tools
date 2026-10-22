// Worker 运行时的最小类型声明。完整的 `wrangler types` 运行时类型会和 DOM 类型冲突（同一个 tsconfig 里还有 island），
// 所以 worker-configuration.d.ts 用 --include-runtime=false 只生成 Env，这里补上服务端代码用到的部分。
interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

// oxlint-disable-next-line typescript/no-empty-object-type -- 由 worker-configuration.d.ts 生成的 ASSETS 绑定用到
interface Fetcher {}

declare module "cloudflare:workers" {
  export const env: Cloudflare.Env;
}
