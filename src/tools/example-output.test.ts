import { describe, expect, it } from "vitest";

import { examplePatternRegex, toExampleShape } from "./example-output";

describe("example output matching", () => {
  const expected = { id: { pattern: "[a-f0-9]{4}" } };

  it("accepts a complete string match", () => {
    expect(toExampleShape({ id: "a123" }, expected)).toEqual(expected);
  });

  it.each(["a123\n", "xa123", "a123x", "", 123, null])("rejects %j", (id) => {
    expect(toExampleShape({ id }, expected)).not.toEqual(expected);
  });

  it("supports multiline patterns and exact values together", () => {
    const output = { ids: { pattern: "a(?:\\nb){2}" }, count: 3 };
    expect(toExampleShape({ ids: "a\nb\nb", count: 3 }, output)).toEqual(output);
    expect(toExampleShape({ ids: "a\nb\nb", count: 2 }, output)).not.toEqual(output);
  });

  it("groups alternatives before anchoring", () => {
    expect(examplePatternRegex({ pattern: "a|b" }).test("ab")).toBe(false);
  });

  it("keeps exact strings, tables and file size assertions", () => {
    const fileExpected = {
      text: "hello",
      rows: [{ n: 1 }],
      file: { type: "text/plain", maxSize: 10 },
    };
    expect(
      toExampleShape(
        { text: "hello", rows: [{ n: 1 }], file: new Blob(["hi"], { type: "text/plain" }) },
        fileExpected,
      ),
    ).toEqual(fileExpected);
    expect(
      toExampleShape(
        {
          text: "hello",
          rows: [{ n: 1 }],
          file: new Blob(["x".repeat(11)], { type: "text/plain" }),
        },
        fileExpected,
      ),
    ).not.toEqual(fileExpected);
  });
});
