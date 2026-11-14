import * as v from "valibot";
import { describe, expect, it } from "vitest";

import {
  describeFields,
  initialValues,
  isPreferenceField,
  withBlankNumbersOmitted,
} from "./fields";
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

  it("links a page arrangement to its PDF field", () => {
    const file = v.pipe(v.file(), fileType({ "application/pdf": [".pdf"] }));
    const pages = v.pipe(v.string(), v.metadata({ widget: "pages", pagesOf: "file" }));
    expect(describeFields(v.object({ file, pages }))[1]).toEqual({
      name: "pages",
      kind: "pages",
      source: "file",
    });
    expect(() => describeFields(v.object({ pages }))).toThrow(/单文件字段/);
  });

  it("links a crop area to its image field", () => {
    const file = v.pipe(v.file(), fileType({ "image/png": [".png"] }));
    const crop = v.pipe(v.string(), v.metadata({ widget: "crop", cropOf: "file" }));
    expect(describeFields(v.object({ file, crop }))[1]).toEqual({
      name: "crop",
      kind: "crop",
      source: "file",
    });
    expect(() => describeFields(v.object({ crop }))).toThrow(/单文件字段/);
  });

  it("leaves fields marked remember: false out of the preferences", () => {
    const keep = { remember: false } as const;
    const fields = describeFields(
      v.object({
        turn: v.pipe(v.picklist(["0", "90"]), v.metadata(keep)),
        mirror: v.pipe(v.boolean(), v.metadata(keep)),
        quality: v.number(),
      }),
    );
    expect(fields.map(isPreferenceField)).toEqual([false, false, true]);
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

describe("withBlankNumbersOmitted", () => {
  const blankable = v.object({
    width: v.optional(v.number()),
    quality: v.optional(v.number(), 80),
    value: v.number(),
    note: v.optional(v.string()),
  });

  it.each(["", Number.NaN])("drops a blank optional number without a default (%s)", (blank) => {
    const result = withBlankNumbersOmitted(blankable, {
      width: blank,
      quality: 5,
      value: 1,
      note: "",
    });
    expect(result).toEqual({ width: undefined, quality: 5, value: 1, note: "" });
    expect(v.safeParse(blankable, result).success).toBe(true);
  });

  it("keeps a blank number that has a default or is required, so validation reports it", () => {
    const values = { width: 1, quality: Number.NaN, value: "" };
    expect(withBlankNumbersOmitted(blankable, values)).toBe(values);
  });
});
