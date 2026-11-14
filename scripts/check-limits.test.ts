import { describe, expect, it } from "vitest";

import {
  countRedirects,
  evaluateLimits,
  MAX_FILE_BYTES,
  MAX_FILES,
  MAX_DYNAMIC_REDIRECTS,
  MAX_HEADER_RULES,
  MAX_STATIC_REDIRECTS,
  WARN_FILES,
  WARN_HEADER_RULES,
  WARN_STATIC_REDIRECTS,
} from "./check-limits";

const files = (count: number, size = 1) =>
  Array.from({ length: count }, (_, i) => ({ path: `f${i}.html`, size }));

const at = (count: number, dynamic = 0) => evaluateLimits(files(1), 0, { static: count, dynamic });

describe("evaluateLimits", () => {
  it("passes under the warning threshold", () => {
    expect(evaluateLimits(files(WARN_FILES))).toEqual({
      count: WARN_FILES,
      errors: [],
      warnings: [],
    });
  });

  it("warns above 80% of the file limit", () => {
    const report = evaluateLimits(files(WARN_FILES + 1));
    expect(report.errors).toEqual([]);
    expect(report.warnings).toHaveLength(1);
  });

  it("fails above the file limit", () => {
    expect(evaluateLimits(files(MAX_FILES + 1)).errors).toHaveLength(1);
  });

  it("warns and fails on too many _headers rules", () => {
    expect(evaluateLimits(files(1), WARN_HEADER_RULES + 1).warnings).toHaveLength(1);
    expect(evaluateLimits(files(1), MAX_HEADER_RULES + 1).errors).toHaveLength(1);
  });

  it("counts static and dynamic redirects separately", () => {
    expect(countRedirects("# c\n/fr/x /x 302\n/old/* /new/:splat 301\n/a/:id /b 302\n")).toEqual({
      static: 1,
      dynamic: 2,
    });
  });

  it("warns and fails on too many redirects", () => {
    expect(at(WARN_STATIC_REDIRECTS + 1).warnings).toHaveLength(1);
    expect(at(MAX_STATIC_REDIRECTS + 1).errors).toHaveLength(1);
    expect(at(0, MAX_DYNAMIC_REDIRECTS + 1).errors).toHaveLength(1);
  });

  it("fails on a file larger than 25 MiB", () => {
    const report = evaluateLimits([{ path: "big.wasm", size: MAX_FILE_BYTES + 1 }]);
    expect(report.errors).toEqual([expect.stringContaining("big.wasm")]);
  });
});
