import { describe, expect, it } from "vitest";

import { selectItems } from "./select-items";

describe("selectItems", () => {
  it("uses content labels in contract order", () => {
    expect(
      selectItems({ name: "mode", kind: "select", options: ["b", "a"] }, { a: "A", b: "B" }),
    ).toEqual([
      { value: "b", label: "B" },
      { value: "a", label: "A" },
    ]);
  });

  it("names language codes in the current locale, sorted after labelled options", () => {
    expect(
      selectItems(
        {
          name: "language",
          kind: "select",
          options: ["auto", "fr", "de", "en"],
          languageNames: true,
        },
        { auto: "Detect automatically" },
      ),
    ).toEqual([
      { value: "auto", label: "Detect automatically" },
      { value: "en", label: "English" },
      { value: "fr", label: "French" },
      { value: "de", label: "German" },
    ]);
  });
});
