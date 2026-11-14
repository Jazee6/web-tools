import type { Locale } from "@/lib/i18n/locales";
import { site } from "@/lib/site";
import type { SitePageId } from "@/lib/site-pages";
import { m } from "@/paraglide/messages";

// 许可证库存由 postbuild 与 HTML 同源注入；Draft 永远不会调用此函数。
export const renderSiteMarkdown = (
  id: SitePageId,
  name: string,
  url: string,
  body: string,
  locale: Locale,
): string =>
  [
    `# ${name}`,
    url,
    body.trim(),
    id === "licenses"
      ? `## ${m.licenses_inventory({}, { locale })}\n\n<!-- third-party-notices -->`
      : "",
    `## ${m.site_contact({}, { locale })}\n\n[${m.site_github_issues({}, { locale })}](${site.repository}/issues)`,
  ]
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");
