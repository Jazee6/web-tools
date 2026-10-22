import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { defaultLocale, hreflang, isLocale, localizePath, locales } from "./locales";

describe("locales", () => {
  it("matches project.inlang settings", () => {
    const settings = JSON.parse(readFileSync("project.inlang/settings.json", "utf8"));
    expect(settings.baseLocale).toBe(defaultLocale);
    expect(settings.locales).toEqual([...locales]);
  });

  it("has a message file for every locale", () => {
    const en = Object.keys(JSON.parse(readFileSync("messages/en.json", "utf8")));
    for (const locale of locales) {
      const keys = Object.keys(JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")));
      expect({ locale, keys }).toEqual({ locale, keys: en });
    }
  });

  it("maps zh to zh-Hans", () => {
    expect(hreflang.zh).toBe("zh-Hans");
  });

  it("guards locale ids", () => {
    expect(isLocale("ja")).toBe(true);
    expect(isLocale("zh-Hans")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("prefixes every locale except en", () => {
    expect(localizePath("en")).toBe("/");
    expect(localizePath("en", "/json-formatter")).toBe("/json-formatter");
    expect(localizePath("zh")).toBe("/zh");
    expect(localizePath("zh", "/json-formatter")).toBe("/zh/json-formatter");
  });
});
