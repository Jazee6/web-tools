// 契约测试、单测和 e2e 用的假 DoH 服务：按 URL 返回固定响应，不访问网络
export const hosts = ["cloudflare-dns.com", "dns.google"];

const json = (body: unknown) =>
  new Response(JSON.stringify(body), {
    headers: { "content-type": "application/dns-json", "access-control-allow-origin": "*" },
  });

const responses: Record<string, unknown> = {
  "https://cloudflare-dns.com/dns-query?name=example.com&type=A": {
    Status: 0,
    Answer: [
      { name: "example.com", type: 1, TTL: 167, data: "104.20.23.154" },
      { name: "example.com", type: 1, TTL: 167, data: "172.66.147.243" },
    ],
  },
  "https://dns.google/resolve?name=google.com&type=MX": {
    Status: 0,
    Answer: [{ name: "google.com.", type: 15, TTL: 99, data: "10 smtp.google.com." }],
  },
  "https://cloudflare-dns.com/dns-query?name=example.com&type=TXT": {
    Status: 0,
    Answer: [
      { name: "example.com", type: 16, TTL: 300, data: '"v=spf1 -all"' },
      { name: "example.com", type: 16, TTL: 300, data: '"first part, " "second part"' },
    ],
  },
  "https://cloudflare-dns.com/dns-query?name=no-such-host.example.com&type=A": { Status: 3 },
};

export const fetch = async (url: URL) => {
  const body = responses[url.href];
  if (!body) throw new TypeError(`fixture 中没有 ${url.href}`);
  return json(body);
};
