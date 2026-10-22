import { describe, expect, it } from "vitest";

import { formatJson } from "./core";

describe("formatJson", () => {
  it("indents with spaces or tabs", () => {
    expect(formatJson({ json: '{"a":[1]}', indent: "4", sortKeys: false }).formatted).toBe(
      '{\n    "a": [\n        1\n    ]\n}',
    );
    expect(formatJson({ json: '{"a":1}', indent: "tab", sortKeys: false }).formatted).toBe(
      '{\n\t"a": 1\n}',
    );
  });

  it("minifies", () => {
    expect(formatJson({ json: '[ 1, { "a" : 2 } ]', indent: "minify", sortKeys: false })).toEqual({
      formatted: '[1,{"a":2}]',
    });
  });

  it("sorts keys recursively without touching array order", () => {
    expect(
      formatJson({ json: '{"b":[{"z":1,"y":2}],"a":0}', indent: "minify", sortKeys: true })
        .formatted,
    ).toBe('{"a":0,"b":[{"y":2,"z":1}]}');
  });

  it("keeps a __proto__ key as data", () => {
    expect(
      formatJson({ json: '{"__proto__":{"x":1}}', indent: "minify", sortKeys: true }).formatted,
    ).toBe('{"__proto__":{"x":1}}');
  });

  it("formats top-level scalars", () => {
    expect(formatJson({ json: " 42 ", indent: "2", sortKeys: false }).formatted).toBe("42");
  });

  it("throws invalid_json on the json field with the parser message", () => {
    expect(() => formatJson({ json: "{a:1}", indent: "2", sortKeys: false })).toThrow(
      expect.objectContaining({
        name: "ToolError",
        code: "invalid_json",
        field: "json",
        detail: expect.any(String),
      }),
    );
  });
});
