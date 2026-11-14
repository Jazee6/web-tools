---
review: reviewed
updated: 2026-10-29
title: Base64 Encode & Decode – Convert Text to Base64 Online
description: Encode text to Base64 or decode Base64 back to text, with URL-safe output and full UTF-8 support. Free and private — it runs in your browser and nothing is uploaded.
name: Base64 Encode/Decode
answer: Paste your text or Base64 string, choose Encode or Decode and press Convert — the result appears right in your browser, with full support for non-English characters.
action: Convert
fields:
  text:
    label: Text or Base64
    placeholder: Hello, 世界!
  mode:
    label: Mode
    options:
      encode: Encode text to Base64
      decode: Decode Base64 to text
  urlSafe:
    label: URL-safe output (- and _, no padding)
output:
  result:
    label: Result
errors:
  invalid_base64: This is not valid Base64. Remove any characters other than letters, digits, + / - _ and = (spaces and line breaks are fine), check that nothing was cut off, then try again.
  invalid_utf8: The Base64 is valid, but the bytes it contains are not UTF-8 text. It probably holds binary data such as an image or a file, which this tool cannot show as text.
steps:
  - Paste or type your text, or the Base64 string you want to decode, into the input box.
  - Choose a mode — Encode text to Base64, or Decode Base64 to text.
  - When encoding, turn on URL-safe output if the result will go into a URL, a filename or a JWT.
  - Press Convert, then copy the result. If decoding fails, the error tells you whether the Base64 or the text inside it is the problem.
faq:
  - q: Is my text uploaded to a server?
    a: No. Encoding and decoding run entirely in your browser, so your text never leaves your device. You can even use the page offline once it has loaded.
  - q: Does it work with emoji and non-English characters?
    a: Yes. Text is converted to UTF-8 bytes before it is encoded, and decoded bytes are read back as UTF-8, so characters such as 世界 or 😀 survive a round trip.
  - q: What is URL-safe Base64?
    a: Standard Base64 uses + and /, which have special meaning in URLs, plus = for padding. The URL-safe variant from RFC 4648 swaps them for - and _ and drops the padding, so the result can be used in URLs, filenames and JWTs without escaping.
  - q: Why does decoding say the bytes are not UTF-8 text?
    a: Base64 can hold any bytes, not only text. If the string comes from an image, a PDF or encrypted data, its bytes are not valid UTF-8 and cannot be shown as text. This tool decodes text only.
  - q: Is Base64 a form of encryption?
    a: No. Anyone can decode Base64 without a key, so it hides nothing. It only turns bytes into plain characters that survive systems built for text, such as email, JSON and URLs. Do not use it to protect secrets.
---

## What this Base64 tool does

Encoding turns your text into UTF-8 bytes and writes them with the 64-character alphabet defined in [RFC 4648](https://www.rfc-editor.org/rfc/rfc4648), adding = padding. Decoding does the reverse and reads the bytes back as UTF-8 text. Decoding is forgiving: it accepts both the standard and the URL-safe alphabet, ignores spaces and line breaks, and works when the padding is missing.

## Options and limits

- **Modes:** encode text to Base64, or decode Base64 to text.
- **URL-safe output:** applies to encoding only — it uses - and _ and leaves out the = padding. Decoding needs no setting.
- **Text only:** files and binary data are not supported. Base64 that decodes to bytes that are not valid UTF-8 is rejected instead of being shown as garbled text.
- **Size:** limited only by your device's memory.

## Privacy

Processing happens only on your device. The page does not upload your text, store it or use cookies.
