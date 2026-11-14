---
review: reviewed
updated: 2026-10-29
title: Hash Generator – Generate MD5, SHA-1, SHA-256 and SHA-512 Online
description: Generate an MD5, SHA-1, SHA-256, SHA-384 or SHA-512 hash of any text as hex or Base64. Free and private — it runs in your browser and nothing is uploaded.
name: Hash Generator
answer: Type or paste your text, choose an algorithm such as SHA-256 and an output format, then press Generate hash — the hash appears right in your browser.
action: Generate hash
fields:
  text:
    label: Text
    placeholder: Text to hash
  algorithm:
    label: Algorithm
    options:
      md5: MD5
      sha-1: SHA-1
      sha-256: SHA-256
      sha-384: SHA-384
      sha-512: SHA-512
  format:
    label: Output format
    options:
      hex: Hex (lowercase)
      hex-upper: Hex (uppercase)
      base64: Base64
output:
  hash:
    label: Hash
errors: {}
steps:
  - Type or paste the text you want to hash into the input box.
  - Choose an algorithm. SHA-256 is the default; MD5 and SHA-1 are only for checksums and compatibility.
  - Choose an output format — Hex (lowercase), Hex (uppercase) or Base64.
  - Press Generate hash, then copy the result.
faq:
  - q: Is my text uploaded to a server?
    a: No. The hash is computed entirely in your browser, so your text never leaves your device. You can even use the page offline once it has loaded.
  - q: Which algorithm should I use?
    a: Use SHA-256 unless something requires another. SHA-384 and SHA-512 produce longer hashes from the same family. MD5 and SHA-1 are broken for security purposes because attackers can create collisions, so keep them for checksums and compatibility with old systems.
  - q: Can I use this to hash passwords?
    a: No. These are fast general-purpose hashes, and a fast hash is easy to brute-force. To store passwords, use a slow, salted password-hashing function such as Argon2, scrypt or bcrypt on the server.
  - q: Why is the hash different from another tool's result?
    a: The text is hashed as UTF-8 bytes exactly as typed, so a trailing newline, extra space or different line endings changes the result. Another tool may also read the text in a different encoding.
  - q: Can I hash a file?
    a: Not with this tool, which hashes text only.
---

## What this hash tool does

It converts your text to UTF-8 bytes and computes the digest of those bytes. SHA-1, SHA-256, SHA-384 and SHA-512 use your browser's built-in Web Crypto API, which implements [FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final). MD5 is not part of Web Crypto, so the page includes its own implementation of [RFC 1321](https://www.rfc-editor.org/rfc/rfc1321), checked against the official test vectors.

## Options and limits

- **Algorithms:** MD5, SHA-1, SHA-256, SHA-384, SHA-512.
- **Output formats:** lowercase hex, uppercase hex or Base64.
- **Text only:** files are not supported, and the text is hashed exactly as entered, including spaces and line breaks.
- **Not for passwords:** the hashes are fast by design and unsalted, so they are unsuitable for storing passwords.
- **Size:** limited only by your device's memory.

## Privacy

Processing happens only on your device. The page does not upload your text, store it or use cookies.
