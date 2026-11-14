---
review: reviewed
updated: 2026-10-30
title: Image Converter – Convert HEIC, JPEG, PNG, WebP & AVIF Online
description: Convert HEIC photos from your iPhone, or JPEG, PNG, WebP and AVIF images, to JPEG, PNG, WebP or AVIF. Free and private — it runs in your browser and nothing is uploaded.
name: Image Converter
answer: Choose an image, pick the output format and press Convert image — a HEIC, JPEG, PNG, WebP or AVIF file is re-encoded on your device, then you download the converted copy.
action: Convert image
fields:
  file:
    label: Image (HEIC, JPEG, PNG, WebP or AVIF)
  format:
    label: Convert to
    options:
      jpeg: JPEG (works everywhere)
      png: PNG (lossless, keeps transparency)
      webp: WebP (small, modern browsers)
      avif: AVIF (smallest, slower)
  quality:
    label: Quality (1–100)
output:
  file:
    label: Converted image
errors:
  decode_failed: This image could not be read. It may be damaged, use a HEIC variant the decoder does not support, or use a format your browser cannot decode. Try another copy of the image, or open the page in the latest Chrome, Firefox or Safari.
steps:
  - Choose a HEIC, JPEG, PNG, WebP or AVIF image up to 50 MB.
  - Pick the output format. JPEG opens almost everywhere; PNG is lossless and keeps transparency; WebP and AVIF give smaller files.
  - Keep the default quality of 85 or set your own — lower values give smaller files with more visible artifacts. PNG ignores this setting.
  - Press Convert image, then download the converted file. Large images, and AVIF output in particular, can take several seconds.
faq:
  - q: Are my images uploaded to a server?
    a: No. The image is decoded and re-encoded inside your browser with WebAssembly, so it never leaves your device. You can even use the page offline once it has loaded.
  - q: How do I convert an iPhone HEIC photo to JPG?
    a: Choose the .heic file, keep JPEG selected and press Convert image. HEIC files are decoded by the page itself, so this works in browsers that cannot open HEIC, such as Chrome and Firefox. The first HEIC conversion downloads a decoder of about 2 MB.
  - q: Can I convert to HEIC?
    a: No. Browsers have no HEIC encoder, so HEIC can only be used as input. The output formats are JPEG, PNG, WebP and AVIF.
  - q: Which output format should I choose?
    a: JPEG is the safest choice for sharing and printing. PNG is best for screenshots, logos and anything with transparency. WebP and AVIF produce smaller files for websites, but some older apps cannot open them.
  - q: What happens to transparent areas?
    a: PNG, WebP and AVIF keep transparency. JPEG has no transparency, so transparent pixels are filled with white.
  - q: Is the photo's metadata kept?
    a: No. Metadata such as EXIF camera data and GPS location is not copied to the converted file, which also protects your privacy. Embedded color profiles are not carried over either, so wide-gamut photos, such as Display P3 images from iPhones, may look slightly less saturated.
---

## How the conversion works

HEIC and HEIF files are decoded with [libheif](https://github.com/strukturag/libheif), compiled to WebAssembly and loaded only when you choose such a file. JPEG, PNG, WebP and AVIF files are decoded by your browser. The pixels are then re-encoded with MozJPEG, libwebp or libaom — the codecs used by Google's Squoosh — or, for PNG, with the browser's PNG encoder followed by lossless OxiPNG optimization. All of this runs in a background thread, so the page stays responsive.

## Options and limits

- **Formats in:** HEIC, HEIF, JPEG, PNG, WebP and AVIF. Other formats such as GIF, SVG or BMP are not accepted.
- **Formats out:** JPEG, PNG, WebP or AVIF. The output has the same pixel dimensions as the input.
- **Size:** up to 50 MB per image. Very large images need a lot of memory and may fail on phones.
- **Quantity:** one image at a time.
- **Animation and multiple images:** only the first image or frame is converted, so animated WebP and AVIF files, and HEIC files that hold several images, give a single still picture.
- **Quality:** applies to JPEG, WebP and AVIF; PNG output is always lossless.
- **Browsers:** HEIC works in every supported browser. For the other input formats your browser decodes the image first, so a format it cannot display, such as AVIF in an older browser, is rejected.

## Privacy

Your image is processed only on your device. The page does not upload it, store it or use cookies.
