import { describe, expect, it } from "vitest";

import { formatTime, parseTime } from "./time";

describe("parseTime", () => {
  it.each([
    ["0", 0],
    ["90", 90],
    ["90.5", 90.5],
    ["1:30", 90],
    ["01:30.5", 90.5],
    ["1:02:03", 3723],
    ["01:02:03.250", 3723.25],
    ["  12  ", 12],
    ["100:00", 6000],
  ])("reads %s", (text, seconds) => {
    expect(parseTime(text)).toBe(seconds);
  });

  it.each(["", "abc", "1:", ":30", "1:60", "1:60:00", "1:2:3:4", "-5", "1,5", "1.2.3"])(
    "rejects %j",
    (text) => {
      expect(parseTime(text)).toBeUndefined();
    },
  );
});

describe("formatTime", () => {
  it.each([
    [0, "0:00:00"],
    [6, "0:00:06"],
    [90.5, "0:01:30.5"],
    [3723.25, "1:02:03.25"],
    [5.005, "0:00:05.005"],
    [59.9996, "0:01:00"],
  ])("writes %d as %s", (seconds, text) => {
    expect(formatTime(seconds)).toBe(text);
  });
});
