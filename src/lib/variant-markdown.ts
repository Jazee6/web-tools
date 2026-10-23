import { hreflang } from "@/lib/i18n/locales";
import { renderToolMarkdown } from "@/lib/seo/markdown";
import { site } from "@/lib/site";
import type { VariantPageData } from "@/lib/variant-page";
import { m } from "@/paraglide/messages";

// Variant 页的 .md 副本：与 HTML 同序（答案 → 步骤 → 独有数据表格 → 正文 → FAQ → 相关链接）
export const renderVariantMarkdown = (data: VariantPageData): string => {
  const options = { locale: data.locale };
  const updated = new Intl.DateTimeFormat(hreflang[data.locale], { dateStyle: "long" }).format(
    new Date(data.updated),
  );
  return renderToolMarkdown({
    name: data.name,
    answer: data.answer,
    url: new URL(data.path, site.url).href,
    updated,
    headings: {
      steps: m.tool_steps({}, options),
      faq: m.tool_faq({}, options),
      related: data.more.heading,
      updated: m.page_updated({ date: updated }, options),
    },
    steps: data.steps,
    table: {
      caption: data.table.caption,
      header: data.table.columns.map((column) => data.table.labels[column]!),
      rows: data.table.rows.map((row) => data.table.columns.map((column) => row[column]!)),
    },
    body: data.markdown,
    faq: data.faq,
    related: data.more.links.map((link) => ({
      name: link.name,
      path: link.markdown,
      summary: link.summary,
    })),
  });
};
