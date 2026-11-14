// 手写 Service Worker（architecture §13 PWA）：按需缓存访问过的页面和它们加载过的资源，不做全站预缓存。
// 由 scripts/postbuild.ts 用 Bun.build 打包成 /sw.js（classic 脚本），离线页用到的构建产物在打包时注入。
// 缓存的都是原始网络响应（clone），COOP/COEP 等响应头原样保留，隔离页和 Worker 脚本离线时仍满足跨源隔离。
import {
  ASSETS_CACHE,
  isCacheable,
  offlinePageFor,
  offlinePages,
  PAGES_CACHE,
  strategyFor,
} from "@/lib/runtime/sw-routes";

// 离线页引用的 /_astro/ 资源（CSS、脚本），由 postbuild 注入
declare const OFFLINE_ASSETS: string[];

// DOM lib 里没有 Service Worker 的事件类型，这里只声明用到的部分（同 rpc.ts 的 WorkerScope 做法）
interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<unknown>): void;
}

interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: Promise<Response>): void;
}

interface ExtendableMessageEvent extends ExtendableEvent {
  data: unknown;
}

interface ServiceWorkerScope {
  location: Location;
  skipWaiting(): Promise<void>;
  clients: { claim(): Promise<void> };
  addEventListener(type: "install" | "activate", listener: (event: ExtendableEvent) => void): void;
  addEventListener(type: "fetch", listener: (event: FetchEvent) => void): void;
  addEventListener(type: "message", listener: (event: ExtendableMessageEvent) => void): void;
}

const scope = self as unknown as ServiceWorkerScope;
const origin = scope.location.origin;

const put = async (cacheName: string, request: Request | string, response: Response) => {
  // 配额不足等写入失败不影响这次响应
  await (await caches.open(cacheName)).put(request, response).catch(() => {});
};

// HTML 网络优先：在线时总拿最新页面并更新缓存；断网时用缓存，没有缓存就显示该 Locale 的离线页
const page = async (event: FetchEvent): Promise<Response> => {
  try {
    const response = await fetch(event.request);
    if (isCacheable(response)) event.waitUntil(put(PAGES_CACHE, event.request, response.clone()));
    return response;
  } catch (error) {
    const cache = await caches.open(PAGES_CACHE);
    const cached =
      (await cache.match(event.request, { ignoreSearch: true, ignoreVary: true })) ??
      (await cache.match(offlinePageFor(new URL(event.request.url).pathname)));
    if (cached) return cached;
    throw error;
  }
};

// 带哈希的构建产物缓存优先
const asset = async (event: FetchEvent): Promise<Response> => {
  const cached = await (await caches.open(ASSETS_CACHE)).match(event.request, { ignoreVary: true });
  if (cached) return cached;
  const response = await fetch(event.request);
  if (isCacheable(response)) event.waitUntil(put(ASSETS_CACHE, event.request, response.clone()));
  return response;
};

// 其他不带哈希的文件网络优先，断网时退回缓存
const networkFirst = async (event: FetchEvent): Promise<Response> => {
  try {
    const response = await fetch(event.request);
    if (isCacheable(response)) event.waitUntil(put(PAGES_CACHE, event.request, response.clone()));
    return response;
  } catch (error) {
    const cached = await (
      await caches.open(PAGES_CACHE)
    ).match(event.request, {
      ignoreVary: true,
    });
    if (cached) return cached;
    throw error;
  }
};

const handlers = { page, asset, "network-first": networkFirst };

scope.addEventListener("fetch", (event) => {
  const { request } = event;
  const strategy = strategyFor(
    {
      url: new URL(request.url),
      method: request.method,
      mode: request.mode,
      range: request.headers.has("range"),
    },
    origin,
  );
  if (strategy) event.respondWith(handlers[strategy](event));
});

scope.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      await (await caches.open(PAGES_CACHE)).addAll(offlinePages);
      await (await caches.open(ASSETS_CACHE)).addAll(OFFLINE_ASSETS);
      // 缓存不分版本、策略对新旧页面都适用，新版本直接接管
      await scope.skipWaiting();
    })(),
  );
});

// 立即接管已打开的页面，之后按需加载的分块（引擎、WASM）就会经过这里被缓存
scope.addEventListener("activate", (event) => event.waitUntil(scope.clients.claim()));

// 第一次访问时，页面在 SW 接管之前已经加载完，由页面把当前 URL 和已加载的资源发过来补缓存（BaseLayout.astro）
const cacheVisited = async (pageUrl: string, resources: string[]) => {
  const targets: [string, string][] = [];
  const pageTarget = new URL(pageUrl, origin);
  if (strategyFor({ url: pageTarget, method: "GET", mode: "navigate", range: false }, origin)) {
    targets.push([pageTarget.href, PAGES_CACHE]);
  }
  for (const resource of resources) {
    const url = new URL(resource, origin);
    const strategy = strategyFor({ url, method: "GET", mode: "cors", range: false }, origin);
    if (strategy) targets.push([url.href, strategy === "asset" ? ASSETS_CACHE : PAGES_CACHE]);
  }
  await Promise.all(
    targets.map(async ([url, cacheName]) => {
      const cache = await caches.open(cacheName);
      if (await cache.match(url, { ignoreVary: true })) return;
      // 刚加载过，通常由 HTTP 缓存重新验证后直接返回
      const response = await fetch(url).catch(() => undefined);
      if (response && isCacheable(response)) await put(cacheName, url, response);
    }),
  );
};

scope.addEventListener("message", (event) => {
  const data = event.data as { type?: unknown; page?: unknown; resources?: unknown } | null;
  if (data?.type !== "cache" || typeof data.page !== "string" || !Array.isArray(data.resources)) {
    return;
  }
  const resources = data.resources.filter((item): item is string => typeof item === "string");
  event.waitUntil(cacheVisited(data.page, resources));
});
