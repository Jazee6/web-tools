---
review: reviewed
updated: 2026-11-16
title: QR Code Generator – Make QR Codes with Logo and Colors Online
description: Turn a link or any text into a QR code as PNG or SVG, with your own colors, size and a logo in the center. Free and private — it runs in your browser.
name: QR Code Generator
answer: Type or paste a link or text and the QR code appears as you write — choose PNG or SVG, the size, colors and an optional logo, then press Download to save the image.
action: Generate QR code
fields:
  text:
    label: Text or URL
    placeholder: https://example.com/
  format:
    label: Format
    options:
      png: PNG
      svg: SVG
  size:
    label: Size (pixels)
  errorCorrection:
    label: Error correction
    options:
      L: L – about 7%
      M: M – about 15%
      Q: Q – about 25%
      H: H – about 30%
  margin:
    label: Margin (modules)
  foreground:
    label: Foreground color
  background:
    label: Background color
  logo:
    label: Logo (PNG, JPEG or WebP, optional)
output:
  file:
    label: QR code
errors:
  too_long: This text is too long for a QR code at this error correction level. Shorten it, or choose a lower level — L holds the most.
  too_long_high: This text is too long for a QR code at error correction level H. Shorten it or choose a lower level. With a logo, level H is always used, so remove the logo first to use a lower level.
  too_small: This size is too small for this much text — each module would be less than one pixel. Choose a larger size or shorten the text.
  logo_decode_failed: This file could not be read as an image. It may be damaged, or your browser can't decode its format. Export it again as PNG and try again.
steps:
  - Type or paste a link or any text into Text or URL. The QR code updates as you write.
  - Pick the Format, Size (pixels), Error correction and Margin (modules) you need.
  - Optionally change the Foreground color and Background color, or add a Logo (PNG, JPEG or WebP, optional) for the center.
  - Scan the QR code with your phone to check that it works.
  - Press Download to save the image.
faq:
  - q: Do the QR codes expire?
    a: No. The text is stored in the pattern itself, so the code works for as long as the link or text in it is valid. Nothing goes through a redirect service, and there is no scan limit or tracking.
  - q: Should I download PNG or SVG?
    a: PNG is a normal image at the size you choose, for documents, slides and websites. SVG is a vector image that stays sharp at any size, which suits print and design tools. Some apps can't open SVG files; use PNG for those.
  - q: Which error correction level should I choose?
    a: M, the default, suits most uses. A higher level lets the code be read even when part of it is dirty, damaged or covered, but the pattern gets denser for the same text. The percentages are the share of the code's data that can be restored, not a guarantee for any covered area. L fits the most text and gives the largest modules, which helps for small printed codes. With a logo, H is always used.
  - q: Will my QR code still work with a logo?
    a: It should. The logo covers about a quarter of the code's width at the center, and error correction level H can restore up to about 30% of the code's data. Scan the result with a phone or two before you print it, especially with long text or light colors.
  - q: Can I use any colors?
    a: "Any #RRGGBB colors work, but scanners need strong contrast. Use a dark foreground on a light background; light modules on a dark background, or two similar colors, may not scan in every app."
  - q: How much text fits in one QR code?
    a: It depends on the characters and the error correction level. At level L a code holds up to 7,089 digits, 4,296 uppercase letters and digits, 2,953 bytes of other text, or about 984 Chinese or Japanese characters. Level H holds less than half of that.
---

## How the QR code is made

The text is encoded with [uqr](https://github.com/unjs/uqr), an open-source QR code encoder that follows ISO/IEC 18004. It picks the smallest QR code version (1 to 40) that holds the text at the chosen error correction level. Text made only of digits uses numeric mode, text made only of uppercase letters, digits, spaces and $%*+-./: uses alphanumeric mode, and all other text is stored as UTF-8 bytes. The pattern is then drawn in a background thread: as a PNG with every module edge on a whole pixel, so there are no blurred gray edges, or as an SVG with a single path for all dark modules.

## Options and limits

- **Text:** up to 7,089 characters, and in practice limited by what a QR code can hold — at level L, 2,953 bytes of text such as a URL, at level H, 1,273 bytes.
- **Formats:** PNG or SVG. The SVG uses the same width and height as the PNG, and you can scale it without losing sharpness.
- **Size:** 128 to 4,096 pixels for the whole image, margin included. The default is 512. Each module needs at least one pixel, so a long text at a small size is rejected.
- **Margin:** 0 to 16 modules of background color around the code; the default of 4 is the quiet zone the standard asks for. Without a margin, a scanner may not find the code on a busy background.
- **Error correction:** L, M, Q or H can restore about 7%, 15%, 25% or 30% of the code's data. The default is M.
- **Colors:** any #RRGGBB foreground and background color.
- **Logo:** an optional PNG, JPEG or WebP image up to 5 MB. It is placed on a square of the background color that covers about 24% of the code's width, and level H is used. In an SVG, the logo is embedded as a copy of the original file.
- **Browsers:** the PNG is drawn with OffscreenCanvas in a background thread, and a logo is read with your browser's image decoder. Current versions of the major browsers support both; an older browser may fail to make the image.
- **Not included:** the tool makes standard QR codes only. Rounded modules, gradients and other barcode types are not supported.

## Privacy

Your text and logo are processed only on your device. The page does not upload them, store them or use cookies.
