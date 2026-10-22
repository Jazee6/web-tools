import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { describeFields, initialValues } from "./fields";

const schema = v.object({
  text: v.pipe(v.string(), v.nonEmpty()),
  code: v.pipe(v.string(), v.metadata({ widget: "code" })),
  count: v.optional(v.number(), 3),
  flag: v.optional(v.boolean(), true),
  mode: v.optional(v.picklist(["a", "b"]), "b"),
});

describe("describeFields", () => {
  it("derives widgets from the schema", () => {
    expect(describeFields(schema)).toEqual([
      { name: "text", kind: "text" },
      { name: "code", kind: "code" },
      { name: "count", kind: "number" },
      { name: "flag", kind: "boolean" },
      { name: "mode", kind: "select", options: ["a", "b"] },
    ]);
  });

  it("rejects unsupported types", () => {
    expect(() => describeFields(v.object({ list: v.array(v.string()) }))).toThrow(/不支持/);
  });

  it("fills initial values from schema defaults", () => {
    expect(initialValues(schema)).toEqual({ text: "", code: "", count: 3, flag: true, mode: "b" });
  });
});
