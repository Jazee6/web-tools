import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { describeFields, initialValues } from "./fields";

const schema = v.object({
  text: v.pipe(v.string(), v.nonEmpty()),
  code: v.pipe(v.string(), v.metadata({ widget: "code" })),
  url: v.pipe(v.string(), v.metadata({ widget: "url" })),
  count: v.optional(v.number(), 3),
  flag: v.optional(v.boolean(), true),
  mode: v.optional(v.picklist(["a", "b"]), "b"),
});

describe("describeFields", () => {
  it("derives widgets from the schema", () => {
    expect(describeFields(schema)).toEqual([
      { name: "text", kind: "text" },
      { name: "code", kind: "code" },
      { name: "url", kind: "url" },
      { name: "count", kind: "number" },
      { name: "flag", kind: "boolean" },
      { name: "mode", kind: "select", options: ["a", "b"] },
    ]);
  });

  it("derives tables from arrays of flat objects", () => {
    const rows = v.array(v.object({ name: v.string(), ttl: v.optional(v.number()) }));
    expect(describeFields(v.object({ rows }))).toEqual([
      { name: "rows", kind: "table", columns: ["name", "ttl"] },
    ]);
  });

  it("derives file inputs with accepted MIME types", () => {
    const file = v.pipe(v.file(), v.mimeType(["image/png", "image/jpeg"]));
    expect(describeFields(v.object({ file, any: v.file() }))).toEqual([
      { name: "file", kind: "file", accept: ["image/png", "image/jpeg"] },
      { name: "any", kind: "file", accept: [] },
    ]);
    expect(initialValues(v.object({ file }))).toEqual({ file: undefined });
  });

  it("rejects unsupported types", () => {
    expect(() => describeFields(v.object({ list: v.array(v.string()) }))).toThrow(/数组元素/);
    expect(() => describeFields(v.object({ when: v.date() }))).toThrow(/不支持/);
  });

  it("fills initial values from schema defaults", () => {
    expect(initialValues(schema)).toEqual({
      text: "",
      code: "",
      url: "",
      count: 3,
      flag: true,
      mode: "b",
    });
  });
});
