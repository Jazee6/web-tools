import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { describeFields, initialValues } from "./fields";
import { fileType } from "./file-type";

const schema = v.object({
  text: v.pipe(v.string(), v.nonEmpty()),
  code: v.pipe(v.string(), v.metadata({ widget: "code" })),
  url: v.pipe(v.string(), v.metadata({ widget: "url" })),
  line: v.pipe(v.string(), v.metadata({ widget: "line" })),
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
      { name: "line", kind: "line" },
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

  it("derives file inputs with accepted MIME types and extensions", () => {
    const file = v.pipe(
      v.file(),
      fileType({ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }),
    );
    expect(describeFields(v.object({ file, any: v.file() }))).toEqual([
      { name: "file", kind: "file", accept: ["image/png", "image/jpeg", ".png", ".jpg", ".jpeg"] },
      { name: "any", kind: "file", accept: [] },
    ]);
    expect(initialValues(v.object({ file }))).toEqual({ file: undefined });
  });

  it("derives ordered multi-file inputs from arrays of files", () => {
    const files = v.pipe(
      v.array(v.pipe(v.file(), fileType({ "application/pdf": [".pdf"] }))),
      v.minLength(2),
    );
    expect(describeFields(v.object({ files }))).toEqual([
      { name: "files", kind: "files", accept: ["application/pdf", ".pdf"] },
    ]);
    expect(initialValues(v.object({ files }))).toEqual({ files: [] });
  });

  it("rejects unsupported types", () => {
    expect(() => describeFields(v.object({ list: v.array(v.string()) }))).toThrow(/数组元素/);
    expect(() => describeFields(v.object({ when: v.date() }))).toThrow(/不支持/);
  });

  it("fills initial values from schema defaults", () => {
    expect(initialValues(schema)).toEqual({
      text: "",
      code: "",
      line: "",
      url: "",
      count: 3,
      flag: true,
      mode: "b",
    });
  });
});
