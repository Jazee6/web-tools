---
review: draft
updated: 2026-10-30
title: Color Converter – HEX, RGB, HSL, HWB and OKLCH Online
description: Convert a CSS color between HEX, RGB, HSL, HWB and OKLCH, with alpha. Free and private — it runs in your browser and nothing is uploaded.
name: Color Converter
answer: Paste a color in HEX, RGB, HSL, HWB or OKLCH and press Convert — the same color appears in all five formats right in your browser, ready to copy.
action: Convert
fields:
  value:
    label: Color
    placeholder: "#ff5733 or rgb(255 87 51) or hsl(11 100% 60%)"
output:
  hex:
    label: HEX
  rgb:
    label: RGB
  hsl:
    label: HSL
  hwb:
    label: HWB
  oklch:
    label: OKLCH
errors:
  invalid_color: "This is not a color the tool can read. Use a hex code such as #ff5733 (3, 4, 6 or 8 digits), or rgb(), hsl(), hwb() or oklch() with three values, for example rgb(255 87 51) or hsl(11, 100%, 60%). Color names such as red are not supported."
steps:
  - "Type or paste a color into the field, for example #ff5733, rgb(255 87 51), hsl(11 100% 60%), hwb(11 20% 0%) or oklch(0.68 0.21 34)."
  - Press Convert.
  - Copy the format you need — HEX, RGB, HSL, HWB or OKLCH.
faq:
  - q: Is my input uploaded to a server?
    a: No. The conversion runs entirely in your browser, so what you type never leaves your device. You can even use the page offline once it has loaded.
  - q: Which color formats can I enter?
    a: Hex codes with 3, 4, 6 or 8 digits, and the CSS functions rgb(), rgba(), hsl(), hsla(), hwb() and oklch(). Each function works in the comma syntax, rgb(255, 87, 51), and in the space syntax, rgb(255 87 51 / 0.5), where the part after the slash is alpha. Hue can be a plain number of degrees or use deg, grad, rad or turn.
  - q: Can I type a color name like red?
    a: "No. The tool reads only hex codes and the five functions above, so color names are rejected with an error. Use #ff0000 or rgb(255 0 0) instead."
  - q: How is transparency handled?
    a: Alpha is kept in every result. HEX gets an extra pair of digits (#ff573380), and the other formats get a slash value (rgb(255 87 51 / 0.5)). Alpha is rounded to three decimals, and a color that is fully opaque is written without any alpha.
  - q: Why does the converted value differ slightly from what I entered?
    a: RGB and HEX channels are whole numbers from 0 to 255, so a color given as HSL, HWB or OKLCH is rounded to the nearest 8-bit value first. The other formats are then calculated from that rounded color, which keeps all five results consistent with each other. HSL and HWB values show up to one decimal, and OKLCH lightness and chroma up to four.
  - q: What happens to an OKLCH color outside the sRGB gamut?
    a: OKLCH can describe colors that a standard screen cannot show. Those are clamped channel by channel to the nearest sRGB values, so the result is a close but less vivid color than the one you entered.
---

## What this color tool does

The tool turns your input into a color in the sRGB color space and then writes it in five CSS formats. HSL and HWB are calculated from RGB with the formulas in the [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/). OKLCH is the polar form of [Oklab](https://bottosson.github.io/posts/oklab/); the tool converts between sRGB and Oklab with Björn Ottosson's published matrices. Results use the modern space-separated CSS syntax, for example `rgb(255 87 51)`, `hsl(10.6 100% 60%)` and `oklch(0.6804 0.21 33.7)`.

## Options and limits

- **Input:** one color at a time. Leading and trailing spaces are ignored, and function names and hex digits are not case-sensitive.
- **Supported formats:** hex with 3, 4, 6 or 8 digits, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hwb()` and `oklch()`. Color names, `color()`, `lab()`, `lch()`, `oklab()` and `var()` are not supported.
- **Values out of range:** RGB channels, saturation, lightness, whiteness, blackness and alpha are clamped to their valid range. Hue wraps around, so `hsl(-120 100% 50%)` is the same blue as `hsl(240 100% 50%)`.
- **Precision:** hex and RGB are 8-bit. Hue, saturation, lightness, whiteness and blackness show up to one decimal; OKLCH lightness and chroma show up to four.
- **Gray colors:** a color with no hue is shown with hue 0.

## Privacy

Processing happens only on your device. The page does not upload your input, store it or use cookies.
