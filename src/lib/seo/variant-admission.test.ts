import { describe, expect, it } from "vitest";

import type { Locale } from "@/lib/i18n/locales";
import type { AnyVariant } from "@/lib/tool-contract/define-variant";

import { jaccard, shingles } from "./similarity";
import { type PageContent, variantContentErrors } from "./variant-admission";

const variant = (id: string): AnyVariant =>
  ({ id, tool: "video-converter" }) as unknown as AnyVariant;

const page = (name: string, body: string): PageContent => ({
  name,
  answer: `Choose a file and press Convert video to get ${name}.`,
  steps: ["Choose a file.", "Press Convert video."],
  faq: [{ q: `Is ${name} free?`, a: "Yes, and nothing is uploaded." }],
  body,
});

const tool = page(
  "Video Converter",
  "Convert videos between MP4, WebM, MOV and MKV. Streams the target can hold are copied.",
);
const movToMp4 = page(
  "MOV to MP4",
  "MOV and MP4 both come from the QuickTime file format, so iPhone recordings with H.264 or HEVC video and AAC audio are repackaged in seconds. ProRes can't be decoded in browsers, and PCM audio is encoded to AAC.",
);
const mkvToMp4 = page(
  "MKV to MP4",
  "Matroska can hold almost any codec. H.264 and AAC tracks are remuxed without loss, while VP9, AV1, Opus, Vorbis or FLAC tracks are decoded and encoded again with WebCodecs. Subtitles and extra audio languages are dropped.",
);
// 薄内容：照抄 mkv-to-mp4，只把格式名换掉
const swap = (text: string) =>
  text.replaceAll("MKV", "WMV").replaceAll("Matroska", "Windows Media");
const thin: PageContent = {
  name: swap(mkvToMp4.name),
  answer: swap(mkvToMp4.answer),
  steps: mkvToMp4.steps,
  faq: mkvToMp4.faq.map(({ q, a }) => ({ q: swap(q), a: swap(a) })),
  body: swap(mkvToMp4.body),
};

const check = (
  pages: Record<string, Partial<Record<Locale, PageContent>>>,
  toolContent: Partial<Record<Locale, PageContent>> = { en: tool },
) =>
  variantContentErrors({
    variants: Object.keys(pages).map((key) => variant(key.split("/")[1]!)),
    tools: new Map([["video-converter", toolContent]]),
    pages: new Map(Object.entries(pages)),
  });

describe("similarity", () => {
  it("splits CJK text into characters and other scripts into words", () => {
    expect(shingles("把 MOV 转成 MP4", 2)).toEqual(
      new Set(["把 mov", "mov 转", "转 成", "成 mp4"]),
    );
  });

  it("scores identical text 1 and unrelated text near 0", () => {
    const a = shingles("one two three four five");
    expect(jaccard(a, shingles("one two three four five"))).toBe(1);
    expect(jaccard(a, shingles("six seven eight nine ten"))).toBe(0);
  });
});

describe("variantContentErrors", () => {
  it("admits distinct siblings", () => {
    expect(
      check({
        "video-converter/mov-to-mp4": { en: movToMp4 },
        "video-converter/mkv-to-mp4": { en: mkvToMp4 },
      }),
    ).toEqual([]);
  });

  it("fails a thin Variant that only swaps the format names", () => {
    const errors = check({
      "video-converter/mkv-to-mp4": { en: mkvToMp4 },
      "video-converter/wmv-to-mp4": { en: thin },
    });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(
      /^Variant video-converter\/wmv-to-mp4（en）与 Variant video-converter\/mkv-to-mp4 的内容近似度 0\.\d+ 超过阈值/,
    );
  });

  it("fails a Variant that copies its Tool page", () => {
    expect(check({ "video-converter/copy": { en: { ...tool, name: "Copy" } } })[0]).toMatch(
      /与 Tool video-converter 的内容近似度/,
    );
  });

  it("requires en content and Tool content in every Locale of the Variant", () => {
    expect(check({ "video-converter/mov-to-mp4": { zh: movToMp4 } })).toEqual([
      "Variant video-converter/mov-to-mp4 缺少 en 内容（en 是内容事实源）",
      "Variant video-converter/mov-to-mp4 有 zh 内容，但 Tool video-converter 没有",
    ]);
  });
});
