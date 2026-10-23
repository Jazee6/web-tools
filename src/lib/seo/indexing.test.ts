import { describe, expect, it } from "vitest";

import {
  alternates,
  isIndexable,
  markdownHref,
  missingTranslationRedirects,
  publishedLocales,
  renderRedirects,
} from "./indexing";

describe("isIndexable", () => {
  it("needs the locale and en to be reviewed", () => {
    expect(isIndexable({ en: "reviewed" }, "en")).toBe(true);
    expect(isIndexable({ en: "draft" }, "en")).toBe(false);
    expect(isIndexable({ en: "reviewed", zh: "reviewed" }, "zh")).toBe(true);
    expect(isIndexable({ en: "reviewed", zh: "draft" }, "zh")).toBe(false);
    // en 还是 Draft 时整组按 Draft 处理
    expect(isIndexable({ en: "draft", zh: "reviewed" }, "zh")).toBe(false);
    expect(isIndexable({ en: "reviewed" }, "ja")).toBe(false);
  });
});

describe("alternates", () => {
  const statuses = { en: "reviewed", zh: "reviewed", ja: "draft" } as const;

  it("links only indexable versions plus x-default", () => {
    expect(alternates(statuses, "zh", "/json-formatter")).toEqual([
      { hreflang: "en", path: "/json-formatter" },
      { hreflang: "zh-Hans", path: "/zh/json-formatter" },
      { hreflang: "x-default", path: "/json-formatter" },
    ]);
  });

  it("is reciprocal between indexable versions", () => {
    expect(alternates(statuses, "en", "/json-formatter")).toEqual(
      alternates(statuses, "zh", "/json-formatter"),
    );
  });

  it("emits nothing for a noindex page", () => {
    expect(alternates(statuses, "ja", "/json-formatter")).toEqual([]);
    expect(alternates({ en: "draft", zh: "reviewed" }, "zh", "/json-formatter")).toEqual([]);
  });
});

describe("markdownHref", () => {
  it("links the .md copy only when the page is indexable", () => {
    expect(markdownHref({ en: "reviewed", zh: "reviewed" }, "zh", "/x")).toBe("/zh/x.md");
    expect(markdownHref({ en: "draft", zh: "reviewed" }, "zh", "/x")).toBe("/zh/x");
  });
});

describe("missingTranslationRedirects", () => {
  it("redirects every locale without content to en, including the .md copy", () => {
    const redirects = missingTranslationRedirects(
      { en: "reviewed", zh: "draft", ja: "reviewed", es: "draft", pt: "draft", de: "draft" },
      "/json-formatter",
    );
    expect(redirects).toEqual([
      { from: "/fr/json-formatter", to: "/json-formatter" },
      { from: "/fr/json-formatter.md", to: "/json-formatter.md" },
    ]);
    expect(renderRedirects(redirects)).toBe(
      "/fr/json-formatter /json-formatter 302\n/fr/json-formatter.md /json-formatter.md 302\n",
    );
  });

  it("does not redirect draft content, nor to a .md copy en does not have", () => {
    expect(missingTranslationRedirects({ en: "draft" }, "/x")).toHaveLength(6);
    expect(publishedLocales({ en: "draft", fr: "reviewed" })).toEqual(["en", "fr"]);
  });
});
