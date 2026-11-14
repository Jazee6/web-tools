---
review: reviewed
updated: 2026-10-30
title: Timestamp Converter – Unix Time to Date and Date to Unix Online
description: Convert a Unix timestamp to a readable date, or a date to Unix seconds, in any time zone. Free and private — it runs in your browser and nothing is uploaded.
name: Timestamp Converter
answer: Paste a Unix timestamp or a date, choose a time zone and press Convert — Unix seconds, milliseconds, the UTC time and the time in your zone appear right in your browser.
action: Convert
fields:
  value:
    label: Timestamp or date
    placeholder: 1700000000 or 2024-02-29 12:30:00+08:00
  unit:
    label: Timestamp unit
    options:
      auto: Auto-detect
      seconds: Seconds
      milliseconds: Milliseconds
  timezone:
    label: Time zone
    placeholder: Asia/Shanghai
output:
  seconds:
    label: Unix time (seconds)
  milliseconds:
    label: Unix time (milliseconds)
  utc:
    label: UTC time
  zoned:
    label: Time in the chosen time zone
errors:
  invalid_value: This is not a timestamp or a date the tool can read. Enter digits such as 1700000000, or a date such as 2024-02-29, 2024-02-29 12:30:00 or 2024-02-29T12:30:00+08:00. Month, day, hour, minute and second must be real values (no 2023-02-29, no 24:00).
  invalid_timezone: This time zone is not recognized. Use an IANA name such as Asia/Shanghai, America/New_York or Europe/Berlin, or UTC.
  out_of_range: This moment is outside the supported range of years 0001 to 9999. Check the number, or switch the unit between seconds and milliseconds.
steps:
  - Type or paste a Unix timestamp (for example 1700000000) or a date (for example 2024-02-29 12:30:00+08:00) into the first field.
  - If the value is a number, leave Timestamp unit on Auto-detect or pick Seconds or Milliseconds.
  - Enter the time zone you want to see the result in, such as Asia/Shanghai. UTC is the default.
  - Press Convert, then copy the value you need.
faq:
  - q: Is my input uploaded to a server?
    a: No. The conversion runs entirely in your browser, so what you type never leaves your device. You can even use the page offline once it has loaded.
  - q: Is my timestamp in seconds or milliseconds?
    a: A current Unix timestamp has 10 digits in seconds (1700000000) and 13 digits in milliseconds (1700000000000). Auto-detect reads values of 100,000,000,000 or more as milliseconds and smaller ones as seconds. That also means millisecond values before 1973-03-03 look like seconds, so pick Milliseconds yourself for those.
  - q: Which time zone is a date without an offset in?
    a: UTC. A date such as 2024-02-29 12:30:00 has no zone, so it is read as UTC rather than guessed from your device. To convert a local time, add its offset, for example 2024-02-29 12:30:00+08:00, or use Z for UTC.
  - q: What does the Time zone field change?
    a: Only the last result. Unix seconds, milliseconds and the UTC time stay the same; the zoned result shows that same moment as a wall-clock time with the offset of the zone on that date, so daylight saving time is applied where the zone has it.
  - q: Are negative timestamps and fractions supported?
    a: Yes. A negative number is a moment before 1970-01-01 UTC, and 1700000000.5 is half a second after 1700000000. The seconds result is rounded down to a whole second.
  - q: Why does a very large timestamp fail?
    a: Results are limited to the years 0001 to 9999 so the ISO 8601 output keeps four-digit years. A value outside it, such as a millisecond timestamp with Seconds selected as the unit, is rejected with an out-of-range error.
---

## What this timestamp tool does

Unix time counts the seconds since 1970-01-01 00:00:00 UTC, not counting leap seconds. The tool turns your input into that moment and then writes it as Unix seconds, Unix milliseconds, an [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) UTC time and an ISO 8601 time with the offset of the time zone you chose. Dates are read in the formats `YYYY-MM-DD`, `YYYY-MM-DD HH:MM[:SS[.fff]]` or `YYYY-MM-DDTHH:MM[:SS[.fff]]`, followed by an optional `Z` or offset such as `+08:00`. Time zone offsets come from your browser's built-in time zone data via `Intl.DateTimeFormat`.

## Options and limits

- **Input:** one timestamp or one date at a time. Dates are checked against the calendar, including leap years. Fractions of a second beyond milliseconds are dropped from dates and rounded in numbers.
- **Unit:** applies only to numbers. Auto-detect switches from seconds to milliseconds at 100,000,000,000.
- **Range:** moments from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59.999Z.
- **Time zones:** IANA names such as Asia/Shanghai, or UTC. Offsets for past dates follow your browser's built-in time zone data.
- **No current time:** the tool does not read your clock and does not compare the result with the present moment.

## Privacy

Processing happens only on your device. The page does not upload your input, store it or use cookies.
