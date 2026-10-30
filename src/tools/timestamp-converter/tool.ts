import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

const line = v.metadata<string, FieldMetadata>({ widget: "line" });

export default defineTool({
  id: "timestamp-converter",
  category: "developer",
  input: v.object({
    value: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.description(
        "A Unix timestamp (digits, optionally negative or with decimals) or a date such as 2024-02-29, 2024-02-29 12:30:00 or 2024-02-29T12:30:00+08:00. A date without a UTC offset or Z is read as UTC",
      ),
      line,
    ),
    unit: v.optional(
      v.pipe(
        v.picklist(["auto", "seconds", "milliseconds"]),
        v.description(
          "The unit of a numeric value. auto reads values of 100,000,000,000 or more as milliseconds and smaller ones as seconds. Ignored when the value is a date",
        ),
      ),
      "auto",
    ),
    timezone: v.optional(
      v.pipe(
        v.string(),
        v.description("IANA time zone name for the zoned output, such as Asia/Shanghai or UTC"),
        line,
      ),
      "UTC",
    ),
  }),
  output: v.object({
    seconds: v.pipe(v.string(), v.description("Unix time in whole seconds, rounded down"), line),
    milliseconds: v.pipe(v.string(), v.description("Unix time in milliseconds"), line),
    utc: v.pipe(v.string(), v.description("The moment as an ISO 8601 UTC time"), line),
    zoned: v.pipe(
      v.string(),
      v.description("The same moment as an ISO 8601 time with the offset of the chosen time zone"),
      line,
    ),
  }),
  examples: [
    {
      input: { value: "1700000000" },
      output: {
        seconds: "1700000000",
        milliseconds: "1700000000000",
        utc: "2023-11-14T22:13:20Z",
        zoned: "2023-11-14T22:13:20+00:00",
      },
    },
    {
      input: { value: "1700000000123" },
      output: {
        seconds: "1700000000",
        milliseconds: "1700000000123",
        utc: "2023-11-14T22:13:20.123Z",
        zoned: "2023-11-14T22:13:20.123+00:00",
      },
    },
    {
      input: { value: "2024-02-29 12:30:00+08:00", timezone: "America/New_York" },
      output: {
        seconds: "1709181000",
        milliseconds: "1709181000000",
        utc: "2024-02-29T04:30:00Z",
        zoned: "2024-02-28T23:30:00-05:00",
      },
    },
    {
      input: { value: "2000-01-01", timezone: "Asia/Kolkata" },
      output: {
        seconds: "946684800",
        milliseconds: "946684800000",
        utc: "2000-01-01T00:00:00Z",
        zoned: "2000-01-01T05:30:00+05:30",
      },
    },
  ],
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: true,
    description:
      "Convert between a Unix timestamp and a date. The value is either a Unix timestamp in seconds or milliseconds (unit auto treats values of 100,000,000,000 or more as milliseconds) or a date such as 2024-02-29T12:30:00+08:00; a date without an offset is read as UTC. Returns Unix seconds and milliseconds, the ISO 8601 UTC time, and the same moment in the chosen IANA time zone. Supports years 0001 to 9999. Fails with error code invalid_value when the value is neither a number nor a recognized date, invalid_timezone for an unknown time zone, and out_of_range when the moment is outside years 0001–9999.",
  },
  run: () => import("./core").then((m) => m.convertTimestamp),
});
