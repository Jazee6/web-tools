---
review: draft
updated: 2026-10-29
title: JWT Decoder – Decode JSON Web Token Header & Claims Online
description: Decode a JWT to read its header, claims and signature, with exp, nbf and iat as UTC times. Free and private — it runs in your browser and nothing is uploaded.
name: JWT Decoder
answer: Paste your JSON Web Token and press Decode — the header, payload claims and signature appear right in your browser, with exp, nbf and iat converted to UTC. The signature is not verified.
action: Decode
fields:
  token:
    label: JWT
    placeholder: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature
output:
  header:
    label: Header
  payload:
    label: Payload
  signature:
    label: Signature (not verified)
  times:
    label: Time claims (UTC)
    columns:
      claim: Claim
      time: Time
errors:
  invalid_token: This is not a valid JWT. A token has three parts separated by dots, each written in base64url (letters, digits, - and _ only, no = padding) and decoding to UTF-8 text. Copy the whole token again and remove any quotes or line breaks inside it.
  invalid_json: The header or payload is not a JSON object. A JWT carries its header and claims as JSON objects; check that the token was not cut off or altered when you copied it.
  encrypted_token: This token has five parts, so it is an encrypted JWT (JWE) and its contents cannot be read without the decryption key. Only signed tokens with three parts can be decoded here.
steps:
  - Copy the token and paste it into the input box. A leading "Bearer " from an Authorization header is removed for you.
  - Press Decode.
  - Read the header (the algorithm and token type), the payload (the claims) and, if the token has exp, nbf or iat claims, the same moments converted to UTC.
  - Treat the result as unverified. Decoding only reads the token; it does not prove who issued it.
faq:
  - q: Is my token uploaded to a server?
    a: No. The token is decoded entirely in your browser, so it never leaves your device. You can even use the page offline once it has loaded. Still, avoid pasting tokens that are valid for production systems into any website you do not trust.
  - q: Does this tool verify the signature?
    a: No. It only decodes the three parts, and the signature is shown exactly as it appears in the token. Anyone can create a token with any claims, so verify the signature with the issuer's key in your own code before trusting a token.
  - q: What do exp, nbf and iat mean?
    a: They are registered time claims in RFC 7519, written as seconds since 1970-01-01 UTC. exp is when the token expires, nbf (not before) is when it starts being valid, and iat (issued at) is when it was created. The table converts each one to a readable UTC time; it does not say whether the token is expired now.
  - q: Why do I get an error for a token with five parts?
    a: A five-part token is an encrypted JWT (JWE). Its payload is encrypted, so there is nothing to read without the decryption key. Signed JWTs (JWS) have three parts.
  - q: Can it decode a token whose signature is empty?
    a: Yes. An unsecured token (with "alg":"none") ends with a dot and an empty signature. It decodes normally, but nothing protects its claims, so never trust it for access control.
---

## What this JWT tool does

A JSON Web Token ([RFC 7519](https://www.rfc-editor.org/rfc/rfc7519)) is three base64url-encoded parts joined by dots: a header with the signing algorithm, a payload with the claims, and a signature. The decoder splits the token, decodes the header and payload from base64url to UTF-8 and prints them as indented JSON. Of the claims, `iat`, `nbf` and `exp` are numeric dates, so they are also listed as UTC times.

## Options and limits

- **Decode only:** the signature is never checked, and the tool does not fetch keys or compare the token to the current time.
- **Signed tokens:** three-part tokens, including unsigned ones with an empty signature, can be decoded. Five-part encrypted tokens (JWE) are rejected.
- **Strict format:** the header and payload must be JSON objects. Standard Base64 characters (+, / and =) are not accepted in place of base64url.
- **Large numbers:** claim values are shown through JavaScript numbers, so integers above 9,007,199,254,740,991 may lose precision.
- **Size:** limited only by your device's memory.

## Privacy

Processing happens only on your device. The page does not upload your token, store it or use cookies.
