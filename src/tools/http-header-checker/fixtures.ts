// 契约测试与单测用的假 fetch：按 URL 返回固定响应，不访问网络
const routes: Record<string, { status: number; headers: Record<string, string> }> = {
  "https://example.com/": { status: 301, headers: { location: "https://www.example.com/" } },
  "https://www.example.com/": {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "max-age=3600" },
  },
};

export const fetch = async (url: URL) => {
  const route = routes[url.href];
  if (!route) throw new TypeError(`fixture 中没有 ${url.href}`);
  return new Response(null, route);
};
