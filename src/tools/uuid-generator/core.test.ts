import * as v from "valibot";
import { describe, expect, it, vi } from "vitest";

import { generateUuids } from "./core";
import tool from "./tool";

describe("UUID Generator", () => {
  it("uses the secure platform UUID generator once per identifier", () => {
    const uuid = "12345678-abcd-4123-8123-123456789abc";
    const spy = vi.spyOn(crypto, "randomUUID").mockReturnValue(uuid);
    try {
      expect(generateUuids({ count: 2, uppercase: true })).toEqual({
        uuids: [uuid.toUpperCase(), uuid.toUpperCase()].join("\n"),
      });
      expect(spy).toHaveBeenCalledTimes(2);
    } finally {
      spy.mockRestore();
    }
  });

  it("generates a maximum batch with correct version and variant bits", () => {
    const lines = generateUuids({ count: 1000, uppercase: false }).uuids.split("\n");
    expect(lines).toHaveLength(1000);
    for (const line of lines) {
      expect(line).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    }
    expect(new Set(lines).size).toBe(1000);
  });

  it("defaults to one lowercase UUID", () => {
    expect(v.parse(tool.input, {})).toEqual({ count: 1, uppercase: false });
  });

  it.each([0, -1, 1.5, 1001, Infinity, NaN, "2", null])("rejects invalid count %j", (count) => {
    expect(v.safeParse(tool.input, { count }).success).toBe(false);
  });
});
