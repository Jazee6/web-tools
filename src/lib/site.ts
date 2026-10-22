export const site = {
  url: "https://tools.jaze.top",
  // Turnstile 的 site key 是公开的；当前是官方测试 key（不可见、总是通过），
  // 上线前换成 Cloudflare 后台创建的 widget，并用 wrangler secret put TURNSTILE_SECRET_KEY 配对应的 secret。
  turnstileSiteKey: "1x00000000000000000000BB",
} as const;
