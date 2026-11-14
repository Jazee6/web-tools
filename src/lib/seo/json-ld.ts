import type {
  BreadcrumbList,
  CollectionPage,
  FAQPage,
  Organization,
  WebApplication,
  WebSite,
  WithContext,
} from "schema-dts";

import { site } from "@/lib/site";

const url = (path: string) => new URL(path, site.url).href;

export interface Crumb {
  name: string;
  path: string;
}

export const breadcrumbJsonLd = (crumbs: Crumb[]): WithContext<BreadcrumbList> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: url(crumb.path),
  })),
});

export const webApplicationJsonLd = (page: {
  name: string;
  description: string;
  path: string;
  lang: string;
  updated: Date;
  featureList: string[];
}): WithContext<WebApplication> => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: page.name,
  description: page.description,
  url: url(page.path),
  inLanguage: page.lang,
  dateModified: page.updated.toISOString().slice(0, 10),
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with JavaScript enabled.",
  isAccessibleForFree: true,
  featureList: page.featureList,
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
});

export const faqJsonLd = (faq: { q: string; a: string }[]): WithContext<FAQPage> => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

export const collectionJsonLd = (page: {
  name: string;
  description: string;
  path: string;
  lang: string;
  items: Crumb[];
}): WithContext<CollectionPage> => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: page.name,
  description: page.description,
  url: url(page.path),
  inLanguage: page.lang,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: page.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: url(item.path),
    })),
  },
});

export const websiteJsonLd = (page: {
  name: string;
  description: string;
  path: string;
  lang: string;
}): [WithContext<WebSite>, WithContext<Organization>] => [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: page.name,
    description: page.description,
    url: url(page.path),
    inLanguage: page.lang,
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: page.name,
    url: site.url,
    logo: url("/favicon.svg"),
  },
];

// 写进 <script type="application/ld+json">：转义 "<" 防止 "</script>" 提前闭合
export const serializeJsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, "\\u003c");
