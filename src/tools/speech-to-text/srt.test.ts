import { describe, expect, it } from "vitest";

import { formatSrt, formatSrtTime } from "./srt";

describe("formatSrtTime", () => {
  it("formats hours, minutes, seconds and milliseconds", () => {
    expect(formatSrtTime(0)).toBe("00:00:00,000");
    expect(formatSrtTime(3723.4567)).toBe("01:02:03,457");
  });
});

describe("formatSrt", () => {
  it("numbers cues, trims text and fills a missing end time with the duration", () => {
    expect(
      formatSrt(
        [
          { timestamp: [0, 2.5], text: " Hello." },
          { timestamp: [2.5, 3], text: "  " },
          { timestamp: [3, null], text: " Goodbye." },
        ],
        4.25,
      ),
    ).toBe(
      "1\n00:00:00,000 --> 00:00:02,500\nHello.\n\n2\n00:00:03,000 --> 00:00:04,250\nGoodbye.\n",
    );
  });

  it("never ends a cue before it starts", () => {
    expect(formatSrt([{ timestamp: [5, 4], text: "x" }], 10)).toBe(
      "1\n00:00:05,000 --> 00:00:05,000\nx\n",
    );
  });
});
