---
review: reviewed
updated: 2026-10-29
title: URL Encode & Decode – Percent-Encode URLs and Query Strings Online
description: Percent-encode text for a URL or query string, or decode %20-style sequences back to text. Free and private — it runs in your browser and nothing is uploaded.
name: URL Encode/Decode
answer: Paste your text or URL, choose Encode or Decode and a scope, then press Convert — the percent-encoded or decoded result appears right in your browser.
action: Convert
fields:
  text:
    label: Text or URL
    placeholder: https://example.com/search?q=café & tea
  mode:
    label: Mode
    options:
      encode: Encode (text to %XX)
      decode: Decode (%XX to text)
  scope:
    label: Scope
    options:
      component: URL component (query value, path segment)
      url: "Whole URL (keep : / ? # & =)"
      form: Form data (spaces as +)
output:
  result:
    label: Result
errors:
  invalid_encoding: This text cannot be converted. When decoding, look for a % that is not followed by two hex digits, or percent-encoded bytes that are not valid UTF-8. When encoding, look for broken characters such as a lone surrogate.
steps:
  - Paste or type your text, URL or percent-encoded string into the input box.
  - Choose a mode — Encode (text to %XX) or Decode (%XX to text).
  - Choose a scope. Use URL component for a single query value or path segment, Whole URL to leave the URL's own punctuation alone, or Form data for application/x-www-form-urlencoded values.
  - Press Convert, then copy the result. If it fails, the error explains what to look for.
faq:
  - q: Is my text uploaded to a server?
    a: No. Encoding and decoding run entirely in your browser, so your text never leaves your device. You can even use the page offline once it has loaded.
  - q: What is the difference between URL component and Whole URL?
    a: "URL component encodes everything except letters, digits and - _ . ! ~ * ' ( ), so characters such as / ? & = # are escaped. Use it for one value inside a URL. Whole URL leaves the characters that structure a URL (: / ? # & = and others) untouched and only escapes the rest, so an entire address keeps working."
  - q: When should I use Form data?
    a: Use it for application/x-www-form-urlencoded values, the format of HTML form submissions and many query strings. It encodes a space as + instead of %20 and also escapes ! ' ( ) ~. When decoding, + becomes a space.
  - q: Why does decoding fail with a % sequence?
    a: A percent sign must be followed by exactly two hexadecimal digits, and the bytes it spells must form valid UTF-8. A stray % in plain text, such as "100%", or a truncated sequence such as %E4%B8 is rejected. Encode a literal percent sign as %25.
  - q: Does Whole URL decoding turn %2F back into a slash?
    a: No. Decoding in Whole URL scope keeps escapes for reserved characters such as %2F, %3F and %23 as they are, because turning them into real separators would change what the URL means. Use URL component to decode them.
---

## What this URL tool does

It applies percent-encoding as defined in [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986): text is converted to UTF-8 bytes and each byte that is not allowed is written as %XX. The URL component and Whole URL scopes use the browser's built-in `encodeURIComponent` and `encodeURI`; Form data follows the rules of the [URL Standard](https://url.spec.whatwg.org/#application/x-www-form-urlencoded). The results match what the same functions return in your own JavaScript.

## Options and limits

- **Modes:** encode text to percent-encoding, or decode it back to text.
- **Scopes:** URL component, Whole URL, or Form data (spaces as +). The scope applies in both modes.
- **Text only:** it converts one string at a time; it does not parse a URL into parts or fetch it.
- **Size:** limited only by your device's memory.

## Privacy

Processing happens only on your device. The page does not upload your text, store it or use cookies.
