import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

import { locales, localizePath } from "../src/lib/i18n/locales";
import { sitePageIds } from "../src/lib/site-pages";

for (const locale of locales) {
  test(`Site Pages / ${locale}: static Reviewed HTML and footer`, async ({ page, request }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const id of sitePageIds) {
      const path = localizePath(locale, `/${id}`);
      const response = await request.get(path);
      expect(response.ok()).toBe(true);
      const html = await response.text();
      titles.add(/<title>([^<]+)<\/title>/.exec(html)![1]);
      descriptions.add(/<meta name="description" content="([^"]+)"/.exec(html)![1]);
      if (id === "privacy") {
        for (const policy of [
          "https://www.cloudflare.com/privacypolicy/",
          "https://www.cloudflare.com/turnstile-privacy-policy/",
          "https://developers.google.com/speed/public-dns/privacy",
        ])
          expect(html).toContain(`href="${policy}"`);
      }
      // 7 个 Locale 全部 Reviewed：可索引，互指 hreflang，并发布 .md 副本
      expect(html).not.toMatch(/<meta name="robots" content="noindex/);
      expect(html).toContain('hreflang="x-default"');
      expect(html).toContain(`type="text/markdown" href="${path}.md"`);
      expect(html).toContain("https://github.com/Jazee6/web-tools/issues");
      const footer = /<footer[\s\S]*?<\/footer>/.exec(html)![0];
      expect(footer).not.toContain("astro-island");
      for (const slug of sitePageIds)
        expect(footer).toContain(`href="${localizePath(locale, `/${slug}`)}"`);
      expect(readFileSync(`dist/client${path}.html`, "utf8")).toContain("<h1");
      expect((await request.get(`${path}.md`)).status()).toBe(200);
    }
    expect(titles.size).toBe(sitePageIds.length);
    expect(descriptions.size).toBe(sitePageIds.length);
    const llms = await (await request.get(localizePath(locale, "/llms.txt"))).text();
    for (const id of sitePageIds) expect(llms).toContain(`/${id}.md`);
    await page.goto(localizePath(locale, "/about"));
    await page.locator("footer a").filter({ hasText: /./ }).nth(1).click();
    await expect(page).toHaveURL(new RegExp(`${localizePath(locale, "/privacy")}$`));
    await expect(page.locator("main h1")).toBeVisible();
  });
}

test("license evidence and full English texts are served statically", async ({ request }) => {
  const inventory = await (await request.get("/third-party-notices/inventory.json")).json();
  const names = inventory.components.map((c: { name: string }) => c.name);
  for (const name of [
    "@embedpdf/pdfium",
    "@jsquash/avif",
    "@jsquash/jpeg",
    "@jsquash/webp",
    "@jsquash/oxipng",
    "libheif-js",
    "mediabunny",
    "@mediabunny/mp3-encoder",
    "LAME",
    "@huggingface/transformers",
    "onnxruntime-web",
    "fflate",
    "react",
    "@fontsource/noto-sans-sc",
    "@fontsource/noto-sans-jp",
    "tailwindcss",
    "tw-animate-css",
    "shadcn",
    "vite",
    "rolldown",
  ])
    expect(names).toContain(name);
  expect(names.some((name: string) => name.startsWith("@fontsource-variable/"))).toBe(false);
  for (const name of ["LAME", "libheif-js", "mediabunny", "@mediabunny/mp3-encoder"]) {
    const c = inventory.components.find((item: { name: string }) => item.name === name);
    expect(c.source).toMatch(/^https:/);
    expect(c.texts.length).toBeGreaterThan(0);
    const response = await request.get(c.texts[0].path);
    expect(response.ok()).toBe(true);
    expect((await response.text()).length).toBeGreaterThan(1000);
  }
});

test("license inventory wraps on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/licenses");
  await expect(page.locator("main h1")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});
