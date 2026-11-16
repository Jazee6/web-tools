import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { runInWorker } from "@/components/tool/tool-worker";

import { loadExampleFile } from "../example-files";
import generator from "../qr-code-generator/tool";
import scanner from "./tool";

// 生成器的输出交给识别器读回来：同时验证纠错级别、像素取整、UTF-8 编码、Logo 遮挡和配色。
// SVG 不在 Worker 里解码（createImageBitmap 不支持），只测 PNG
const roundTrip = async (input: Record<string, unknown>) => {
  const generated = await runInWorker(generator, v.parse(generator.input, input));
  const scanned = await runInWorker(
    scanner,
    v.parse(scanner.input, { file: (generated as { file: File }).file }),
  );
  return (scanned as { codes: { text: string; format: string }[] }).codes;
};

describe("QR Code Generator → QR Code Scanner", () => {
  it.each(["L", "M", "Q", "H"])("reads back error correction level %s", async (level) => {
    const codes = await roundTrip({ text: "https://example.com/?q=1", errorCorrection: level });
    expect(codes).toEqual([{ text: "https://example.com/?q=1", format: "QR Code" }]);
  });

  it("reads back Chinese, Japanese and emoji text", async () => {
    const text = "二维码 QR コード 🎉 café";
    expect(await roundTrip({ text })).toEqual([{ text, format: "QR Code" }]);
  });

  it("reads back a code with a logo, custom colors and an odd size", async () => {
    const logo = await loadExampleFile("qr-code-generator", "logo.png");
    const codes = await roundTrip({
      text: "https://example.com/with-logo",
      size: 333,
      margin: 2,
      foreground: "#1d4ed8",
      background: "#fef9c3",
      logo,
    });
    expect(codes).toEqual([{ text: "https://example.com/with-logo", format: "QR Code" }]);
  });

  it("reports text that does not fit", async () => {
    await expect(
      runInWorker(generator, v.parse(generator.input, { text: "x".repeat(3_000) })),
    ).rejects.toMatchObject({ code: "too_long", field: "text" });
  });

  it("reports a size too small for the modules", async () => {
    await expect(
      runInWorker(generator, v.parse(generator.input, { text: "x".repeat(1_000), size: 128 })),
    ).rejects.toMatchObject({ code: "too_small", field: "size" });
  });

  it("reports an image without codes", async () => {
    const logo = await loadExampleFile("qr-code-generator", "logo.png");
    await expect(runInWorker(scanner, { file: logo })).rejects.toMatchObject({
      code: "not_found",
      field: "file",
    });
  });
});
