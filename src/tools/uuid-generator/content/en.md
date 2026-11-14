---
review: reviewed
updated: 2026-11-09
title: UUID Generator – Generate Random UUID v4 Identifiers Online
description: Generate up to 1,000 random UUID v4 identifiers at a time, in lowercase or uppercase. Free and private, with generation entirely in your browser.
name: UUID Generator
answer: Choose a count and press Generate UUIDs to create random UUID v4 identifiers in your browser, one per line, ready to copy.
action: Generate UUIDs
fields:
  count:
    label: Count
  uppercase:
    label: Uppercase
output:
  uuids:
    label: UUIDs
errors: {}
steps:
  - Set Count to a whole number from 1 to 1,000; the default is 1.
  - Optionally turn on Uppercase; lowercase is the default.
  - Press Generate UUIDs and copy the result, with one identifier per line.
faq:
  - q: Which UUID version does this generate?
    a: Only version 4, using the platform's cryptographically secure randomUUID API. It does not generate time-based or name-based UUIDs such as v1, v5 or v7.
  - q: How many UUIDs can I generate at once?
    a: From 1 to 1,000 per run. Each UUID is on its own line, without braces or a URN prefix.
  - q: Does uppercase change the UUID?
    a: No. It changes only the hexadecimal letters, not the identifier's value. Both forms keep the hyphens.
  - q: Are the generated identifiers uploaded or stored?
    a: No. Generation happens on your device, and the page does not upload or store the generated identifiers. Copy any results you want to keep before leaving the page.
---

## How UUID generation works

Each identifier comes from the platform's Web Crypto `crypto.randomUUID()` API. The result is a UUID v4 in the form `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`, where `y` is 8, 9, a or b in lowercase. Each press generates a new batch; there is no input text or seed.

## Options and limits

- **Count:** an integer from 1 to 1,000, defaulting to 1.
- **Letter case:** lowercase by default, or uppercase with the same hyphenated format.
- **Not supported:** UUID versions other than v4, custom seeds, braces and URN prefixes.

## Privacy

Generation happens only on your device. The page does not upload or store your generated UUIDs or use cookies.
