import { describe, expect, it } from "vitest";

import { convertTimestamp, type TimestampInput } from "./core";

const run = (value: string, timezone = "UTC", unit: TimestampInput["unit"] = "auto") =>
  convertTimestamp({ value, unit, timezone });

describe("convertTimestamp", () => {
  it("reads numbers as seconds or milliseconds depending on their size", () => {
    expect(run("1700000000").milliseconds).toBe("1700000000000");
    expect(run("1700000000000").seconds).toBe("1700000000");
    expect(run("99999999999").utc).toBe("5138-11-16T09:46:39Z");
    expect(run("100000000000").utc).toBe("1973-03-03T09:46:40Z");
  });

  it("honours an explicit unit", () => {
    expect(run("1700000000", "UTC", "milliseconds").utc).toBe("1970-01-20T16:13:20Z");
    expect(run("100000000000", "UTC", "seconds").utc).toBe("5138-11-16T09:46:40Z");
  });

  it("handles negative and fractional timestamps", () => {
    expect(run("-1").utc).toBe("1969-12-31T23:59:59Z");
    expect(run("1700000000.5").utc).toBe("2023-11-14T22:13:20.500Z");
    // 秒数向下取整，负数也是
    expect(run("-1500", "UTC", "milliseconds").seconds).toBe("-2");
    expect(run("+0").utc).toBe("1970-01-01T00:00:00Z");
  });

  it("parses dates with an offset, with Z, or without a zone (UTC)", () => {
    expect(run("2024-02-29T12:30:00+08:00").utc).toBe("2024-02-29T04:30:00Z");
    expect(run("2024-02-29 12:30:00-0530").utc).toBe("2024-02-29T18:00:00Z");
    expect(run("2024-02-29t12:30:00z").utc).toBe("2024-02-29T12:30:00Z");
    expect(run("2024-02-29 12:30").utc).toBe("2024-02-29T12:30:00Z");
    expect(run("2024-02-29").utc).toBe("2024-02-29T00:00:00Z");
    expect(run("2024-02-29T12:30:00.1234Z").milliseconds).toBe("1709209800123");
    expect(run("2024-02-29T12:30:00+08").utc).toBe("2024-02-29T04:30:00Z");
  });

  it("supports the whole year 0001 to 9999 range", () => {
    expect(run("0001-01-01").seconds).toBe("-62135596800");
    expect(run("0099-12-31T00:00:00Z").utc).toBe("0099-12-31T00:00:00Z");
    expect(run("9999-12-31T23:59:59.999Z").utc).toBe("9999-12-31T23:59:59.999Z");
  });

  it("converts to an IANA time zone, including half-hour zones and DST", () => {
    expect(run("1700000000", "Asia/Kolkata").zoned).toBe("2023-11-15T03:43:20+05:30");
    expect(run("2024-07-01T12:00:00Z", "America/New_York").zoned).toBe("2024-07-01T08:00:00-04:00");
    expect(run("2024-01-01T12:00:00Z", "America/New_York").zoned).toBe("2024-01-01T07:00:00-05:00");
    expect(run("1700000000123", "Asia/Shanghai").zoned).toBe("2023-11-15T06:13:20.123+08:00");
    expect(run("1700000000", "utc").zoned).toBe("2023-11-14T22:13:20+00:00");
    expect(run("1700000000", " UTC ").zoned).toBe("2023-11-14T22:13:20+00:00");
  });

  it("falls back to UTC for an empty time zone", () => {
    expect(run("1700000000", "").zoned).toBe("2023-11-14T22:13:20+00:00");
  });

  it("throws invalid_value for anything that is not a number or a valid date", () => {
    for (const value of [
      "abc",
      "1e9",
      "12:30",
      "2024-02-30",
      "2023-02-29",
      "2024-13-01",
      "2024-00-10",
      "2024-02-29T24:00:00Z",
      "2024-02-29T12:60:00Z",
      "2024-02-29T12:30:60Z",
      "2024-02-29T12:30:00+24:00",
      "0000-01-01",
      "29/02/2024",
    ]) {
      expect(() => run(value)).toThrow(
        expect.objectContaining({ code: "invalid_value", field: "value" }),
      );
    }
  });

  it("throws out_of_range outside years 0001 to 9999", () => {
    for (const value of ["253402300800", "-62135596801", "9999-12-31T23:59:59-01:00"]) {
      expect(() => run(value, "UTC", "seconds")).toThrow(
        expect.objectContaining({ code: "out_of_range", field: "value" }),
      );
    }
    expect(() => run("253402300800000", "UTC", "milliseconds")).toThrow(
      expect.objectContaining({ code: "out_of_range" }),
    );
  });

  it("throws invalid_timezone for an unknown time zone", () => {
    for (const timezone of ["Mars/Base", "GMT+8x", "Z"]) {
      expect(() => run("1700000000", timezone)).toThrow(
        expect.objectContaining({ code: "invalid_timezone", field: "timezone" }),
      );
    }
  });
});
