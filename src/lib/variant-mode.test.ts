import { describe, expect, it } from "vitest";

import { configuredVariantMode, resolveVariantMode } from "./variant-mode";

describe("resolveVariantMode", () => {
  it("uses the configured mode unless overridden", () => {
    expect(configuredVariantMode).toBe("static");
    expect(resolveVariantMode(undefined)).toBe("static");
    expect(resolveVariantMode("")).toBe("static");
    expect(resolveVariantMode("on-demand")).toBe("on-demand");
  });

  it("rejects unknown modes", () => {
    expect(() => resolveVariantMode("ssr")).toThrow(/VARIANT_RENDER_MODE/);
  });
});
