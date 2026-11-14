import type { APIRoute, GetStaticPaths } from "astro";

import { defaultLocale, hreflang, type Locale, localizePath, locales } from "@/lib/i18n/locales";
import { m } from "@/paraglide/messages";

// Web App Manifest（architecture §13 PWA）：每个 Locale 一份，从该 Locale 的首页启动；scope 是整站，
// 安装后仍能切换 Locale。图标由 scripts/postbuild.ts 从 favicon.svg 生成。
export const getStaticPaths = (() =>
  locales.map((locale) => ({
    params: { locale: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const locale = props.locale as Locale;
  return new Response(
    JSON.stringify({
      id: localizePath(locale),
      name: m.site_name({}, { locale }),
      short_name: m.site_name({}, { locale }),
      description: m.home_description({}, { locale }),
      lang: hreflang[locale],
      dir: "ltr",
      start_url: localizePath(locale),
      scope: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      icons: [
        { src: "/icons/192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/512.png", sizes: "512x512", type: "image/png" },
        {
          src: "/icons/maskable-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    }),
    { headers: { "Content-Type": "application/manifest+json" } },
  );
};
