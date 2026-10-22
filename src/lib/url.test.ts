import { describe, expect, it } from "vitest";

import { canonicalPath } from "./url";

describe("canonicalPath", () => {
  it.each([
    ["/index.html", "/"],
    ["/zh.html", "/zh"],
    ["/zh/json-formatter.html", "/zh/json-formatter"],
    ["/json-formatter", "/json-formatter"],
    ["/", "/"],
  ])("%s → %s", (input, expected) => {
    expect(canonicalPath(input)).toBe(expected);
  });
});
