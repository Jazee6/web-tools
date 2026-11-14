import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { renderSiteMarkdown } from "../../src/lib/site-markdown";
import {
  createVersionWarnings,
  injectLicenseMarkdown,
  packageRoot,
  printVersionWarnings,
  readLameMetadata,
  versionDrift,
} from "./licenses";

afterEach(() => vi.restoreAllMocks());

describe("distributed bundler runtimes", () => {
  it("attributes actual rendered virtual helpers to their installed packages", () => {
    expect(packageRoot("rolldown/runtime.js")).toBe(resolve("node_modules/rolldown"));
    expect(packageRoot("vite/preload-helper.js")).toBe(resolve("node_modules/vite"));
    expect(packageRoot("__vite-browser-external")).toBe(resolve("node_modules/vite"));
  });
});

describe("Reviewed license Markdown postbuild (synthetic content only)", () => {
  it("uses the same inventory instead of exposing the placeholder", () => {
    const source = renderSiteMarkdown(
      "licenses",
      "Synthetic licenses",
      "https://example.test/licenses",
      "Synthetic body",
      "en",
    );
    const inventory = "### Synthetic component\n\n[Full text](/third-party-notices/test.txt)";
    expect(source).toContain("<!-- third-party-notices -->");
    const result = injectLicenseMarkdown(source, inventory);
    expect(result).toContain(inventory);
    expect(result).not.toContain("<!-- third-party-notices -->");
    expect(result).toContain("https://github.com/Jazee6/web-tools/issues");
  });
  it("fails rather than silently emitting an incomplete Markdown copy", () => {
    expect(() => injectLicenseMarkdown("No marker", "Inventory")).toThrow(
      "缺少许可证 Markdown 注入点",
    );
  });
});

describe("version drift", () => {
  it("returns no warning when the installed version matches", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { warnings, checkVersion } = createVersionWarnings();
    checkVersion("libheif-js", "1.23.5", "1.23.5");
    printVersionWarnings([...warnings]);
    expect(versionDrift("libheif-js", "1.23.5", "1.23.5")).toBeUndefined();
    expect(warnings.size).toBe(0);
    expect(warn).not.toHaveBeenCalled();
  });
  it("only warns (never throws) on a changed or missing version", () => {
    let warning: string | undefined;
    expect(() => (warning = versionDrift("libheif-js", "1.23.5", "1.24.0"))).not.toThrow();
    expect(warning).toContain("libheif-js");
    expect(warning).toContain("1.23.5");
    expect(warning).toContain("1.24.0");
    expect(warning).toContain("许可证文本和源码链接");
    expect(() => versionDrift("LAME", "3.100", undefined)).not.toThrow();
    expect(versionDrift("LAME", "3.100", undefined)).toContain("未找到");
  });
  it("logs drift once and repeats all collected warnings in the postbuild summary", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { warnings, checkVersion } = createVersionWarnings();
    const cases: [string, string, string | undefined][] = [
      ["libheif-js", "1.23.5", "1.24.0"],
      ["@jsquash/avif", "2.1.1", undefined],
      ["onnxruntime-web", "1.31.0-dev.20260914-8d85527a0", "2.0.0"],
      ["onnxruntime-common", "1.30.0", "2.0.0"],
      ["react-remove-scroll-bar", "2.3.8", "3.0.0"],
      ["LAME", "3.100", "unknown"],
    ];
    for (const args of cases) {
      expect(() => checkVersion(...args)).not.toThrow();
      checkVersion(...args);
      const message = versionDrift(...args)!;
      expect(message).toContain(args[0]);
      expect(message).toContain(`期望 ${args[1]}`);
      expect(message).toContain(`实际 ${args[2] ?? "未找到"}`);
      expect(message).toContain("重新核对该组件的许可证文本和源码链接");
      expect(warn).toHaveBeenCalledWith(`⚠ 许可证版本漂移 ${message}`);
    }
    expect(warnings.size).toBe(cases.length);
    expect(warn).toHaveBeenCalledTimes(cases.length);
    printVersionWarnings([...warnings]);
    expect(warn).toHaveBeenCalledTimes(cases.length + 1);
    const summary = warn.mock.calls.at(-1)![0] as string;
    expect(summary).toContain(`版本漂移 ${cases.length} 项`);
    expect(summary).toContain("构建已继续");
    for (const warning of warnings) expect(summary).toContain(warning);
  });
});

describe("LAME version discovery", () => {
  it.each([
    ["LAME 3.100", "3.100"],
    ["LAME v3.101", "3.101"],
    ["No version in this README", "unknown"],
    [undefined, "unknown"],
  ])("handles README %s without blocking the build", (readme, expected) => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const dir = mkdtempSync(join(tmpdir(), "web-tools-lame-"));
    try {
      const path = join(dir, "README.md");
      if (readme !== undefined) writeFileSync(path, readme);
      const lame = readLameMetadata(path);
      expect(lame.version).toBe(expected);
      expect(lame.readmePath).toBe(readme === undefined ? undefined : path);
      expect(lame.source).toBe(
        expected === "unknown"
          ? "https://sourceforge.net/projects/lame/files/lame/"
          : `https://downloads.sourceforge.net/project/lame/lame/${expected}/lame-${expected}.tar.gz`,
      );
      const { warnings, checkVersion } = createVersionWarnings();
      expect(() => checkVersion("LAME", "3.100", lame.version)).not.toThrow();
      expect(warnings.size).toBe(expected === "3.100" ? 0 : 1);
      expect(warn).toHaveBeenCalledTimes(warnings.size);
      expect(warn.mock.calls.flat().join("\n")).toContain(
        expected === "3.100" ? "" : `实际 ${expected}`,
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
