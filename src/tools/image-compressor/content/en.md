---
review: draft
updated: 2026-10-23
title: Image Compressor – Compress JPEG, PNG, WebP & AVIF Online
description: Shrink JPEG, PNG, WebP and AVIF images without uploading them. Free and private — compression runs in your browser with the same codecs as Squoosh.
name: Image Compressor
answer: Choose an image, adjust the quality if you like and press Compress image — the file is re-encoded on your device in the same format, then you download the smaller copy.
action: Compress image
fields:
  file:
    label: Image (JPEG, PNG, WebP or AVIF)
  quality:
    label: Quality (1–100)
output:
  file:
    label: Compressed image
errors:
  decode_failed: This image could not be read. It may be damaged or use a format your browser cannot decode.
steps:
  - Choose a JPEG, PNG, WebP or AVIF image up to 50 MB.
  - Keep the default quality of 75 or set your own — lower values give smaller files with more visible artifacts. PNG ignores this setting because it is always compressed losslessly.
  - Press Compress image and wait a moment; large AVIF files can take several seconds.
  - Check the new file size, then download the compressed image.
faq:
  - q: Are my images uploaded to a server?
    a: No. The image is decoded and re-encoded inside your browser with WebAssembly codecs, so it never leaves your device.
  - q: Which quality setting should I use?
    a: 75 is a good default for photos — the difference is hard to see while the file is usually much smaller. Use 85–90 for images with fine text or sharp edges, and 50–65 when size matters more than detail, such as thumbnails.
  - q: Why is my PNG only slightly smaller?
    a: PNG compression here is lossless — every pixel stays exactly the same and only the encoding is optimized. Files that were already saved by an optimizing tool may shrink very little. For photos, converting to JPEG, WebP or AVIF saves far more.
  - q: Does compression change the dimensions or format?
    a: No. The output keeps the original format and pixel dimensions. If re-encoding would make the file larger, you get the original bytes back unchanged.
  - q: Is the photo's metadata kept?
    a: For JPEG, WebP and AVIF, metadata such as EXIF camera data and GPS location is removed, which also protects your privacy. The image is rotated according to its EXIF orientation first, so it still displays the right way up.
---

## How the compression works

JPEG files are re-encoded with MozJPEG, WebP with libwebp and AVIF with libaom — the codecs used by Google's Squoosh, compiled to WebAssembly. PNG files are optimized losslessly with OxiPNG. All of them run in a background thread, so the page stays responsive while a large image is processed.

## Limits

- **Formats:** JPEG, PNG, WebP and AVIF in; the same format out.
- **Size:** up to 50 MB per image. Very large images need a lot of memory and may fail on phones.
- **One image at a time.** Animated WebP and AVIF files are reduced to their first frame.
- **Speed:** AVIF encoding is the slowest. In browsers that allow multithreading it uses several CPU cores.

## Privacy

Your image is processed only on your device. The page does not upload it, store it or use cookies.
