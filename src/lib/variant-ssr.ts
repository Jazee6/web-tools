// on-demand 模式下 Variant 页的服务端查找（ADR-0004，architecture §7）。
// 只依赖内容包 JSON，不引用注册表和 Content Collections，内容不进 Worker 的代码包。
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/locales";
import { variantDataPath } from "@/lib/variant-mode";
import type { VariantPageData } from "@/lib/variant-page";

// 一个 Tool × Locale 的内容包：Variant id → 页面数据
export type VariantBundle = Record<string, VariantPageData>;

export type BundleLoader = (locale: Locale, toolId: string) => Promise<VariantBundle | undefined>;

// redirect 带上 en 的页面数据：.md 副本只有 en 可索引时才跟着跳转
export type VariantLookup =
  | { status: "found"; data: VariantPageData }
  | { status: "redirect"; location: string; target: VariantPageData }
  | { status: "not-found" };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// 从 env.ASSETS 读内容包，解析结果按 isolate 缓存（同一个部署里内容不变）；不存在的包也缓存
export const assetBundleLoader = (assets: Fetcher): BundleLoader => {
  const bundles = new Map<string, Promise<VariantBundle | undefined>>();
  return (locale, toolId) => {
    const path = variantDataPath(locale, toolId);
    let bundle = bundles.get(path);
    if (!bundle) {
      bundle = assets.fetch(new URL(path, "https://assets.local")).then(async (response) => {
        if (response.ok) return (await response.json()) as VariantBundle;
        // 读失败（非 404）不缓存，下次重试
        if (response.status !== 404) bundles.delete(path);
        return undefined;
      });
      bundles.set(path, bundle);
    }
    return bundle;
  };
};

// 路由参数来自 /[...locale]/[slug]/[variant]：rest 参数可能是任意多段，逐项严格校验。
// en 没有前缀，/en/... 不是合法路径；缺失翻译 302 到 en（与 static 模式的 _redirects 一致，ADR-0007）。
export const lookupVariant = async (
  load: BundleLoader,
  params: { locale?: string; slug?: string; variant?: string },
): Promise<VariantLookup> => {
  const { slug, variant } = params;
  const locale = params.locale ?? defaultLocale;
  if (!isLocale(locale) || params.locale === defaultLocale) return { status: "not-found" };
  if (!slug || !variant || !SLUG.test(slug) || !SLUG.test(variant)) return { status: "not-found" };

  const data = (await load(locale, slug))?.[variant];
  if (data) return { status: "found", data };
  const target =
    locale === defaultLocale ? undefined : (await load(defaultLocale, slug))?.[variant];
  if (target) return { status: "redirect", location: target.path, target };
  return { status: "not-found" };
};

// 渲染结果的缓存键：路径 + 构建号，部署后旧缓存自然失效；查询参数不进键，避免被随意绕过缓存
export const variantCacheKey = (url: URL, buildId: string): Request =>
  new Request(new URL(`${url.pathname}?build=${encodeURIComponent(buildId)}`, url.origin));

// 边缘缓存一天，过期后一周内先返回旧内容再后台刷新；浏览器每次都重新验证（与静态资源一致）
export const variantCacheControl =
  "public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=604800";
