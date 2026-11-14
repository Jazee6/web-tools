---
review: reviewed
updated: 2026-10-29
title: JSON Formatter – Format, Validate & Minify JSON Online
description: Paste JSON to pretty-print, validate, minify or sort its keys. Free, instant and private — your data is formatted in your browser and never uploaded.
name: JSON Formatter
answer: Paste your JSON, pick an indentation and press Format JSON — the tool validates it and returns neatly indented or minified JSON right in your browser.
action: Format JSON
fields:
  json:
    label: JSON
    placeholder: '{"name": "Ada", "langs": ["en", "fr"]}'
  indent:
    label: Indentation
    options:
      "2": 2 spaces
      "4": 4 spaces
      tab: Tabs
      minify: Minify (one line)
  sortKeys:
    label: Sort keys alphabetically
output:
  formatted:
    label: Formatted JSON
errors:
  invalid_json: This is not valid JSON. Check for trailing commas, single quotes, unquoted keys or comments, then try again.
steps:
  - Paste or type your JSON into the input box.
  - Choose an indentation — 2 spaces, 4 spaces, tabs, or Minify to put everything on one line.
  - Optionally turn on Sort keys alphabetically to order every object's keys, at every level.
  - Press Format JSON, then copy the result. If the JSON is invalid, the error tells you what the parser found and where.
faq:
  - q: Is my JSON uploaded to a server?
    a: No. Formatting runs entirely in your browser with the built-in JSON parser, so the data never leaves your device. You can even use the page offline once it has loaded.
  - q: What is the difference between formatting and minifying?
    a: Formatting (pretty-printing) adds line breaks and indentation so people can read the structure. Minifying removes all optional whitespace, producing the smallest valid JSON for storage or transfer. Both keep the data exactly the same.
  - q: Does sorting keys change my data?
    a: Only the order of keys inside objects changes; values, nesting and array order stay the same. JSON objects are unordered by definition, so sorted output is equivalent, and it makes two documents much easier to compare.
  - q: Why does the formatter say my JSON is invalid?
    a: Common causes are trailing commas, single quotes instead of double quotes, unquoted keys, comments, and values like NaN or undefined. Those are allowed in JavaScript but not in JSON. The error message shows what the parser rejected and where.
  - q: Are very large numbers kept exactly?
    a: Numbers are parsed as standard 64-bit floating point, so integers larger than 9,007,199,254,740,991 may lose precision. If you work with large IDs, store them as strings.
---

## What this JSON formatter does

It parses your input with the same strict JSON parser browsers use, so anything it accepts is valid JSON according to [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259). Valid input is re-serialized with the indentation you choose; invalid input is rejected with the parser's error message instead of being silently "fixed".

## Options and limits

- **Indentation:** 2 spaces, 4 spaces, tabs, or minified to a single line.
- **Sort keys:** recursive, alphabetical by code point; array order is never changed.
- **Size:** limited only by your device's memory.
- **Not supported:** JSON5 or JSONC extensions such as comments and trailing commas — remove them first.

## Privacy

Your JSON is processed only on your device. The page does not upload it, store it or use cookies.
