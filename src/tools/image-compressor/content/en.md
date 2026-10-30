---
review: draft
updated: 2026-10-30
title: Image Compressor – Compress JPEG, PNG, WebP & AVIF Online
description: Shrink JPEG, PNG, WebP and AVIF images without uploading them. Free and private — compression runs in your browser with the same codecs as Squoosh.
name: Image Compressor
answer: Choose one or more images, adjust the quality if you like and press Compress images — each file is re-encoded on your device in the same format, then you download the smaller copies.
action: Compress images
fields:
  files:
    label: Images (JPEG, PNG, WebP or AVIF)
  quality:
    label: Quality (1–100)
output:
  files:
    label: Compressed images
errors:
  decode_failed: This image could not be read. It may be damaged or use a format your browser cannot decode. Try another copy of the image, or open the page in the latest Chrome, Firefox or Safari.
steps:
  - Choose up to 20 JPEG, PNG, WebP or AVIF images, each up to 50 MB. You can add files in several rounds, and click a thumbnail to enlarge it.
  - Keep the default quality of 75 or set your own — lower values give smaller files with more visible artifacts. PNG ignores this setting because it is always compressed losslessly.
  - Check the estimated size shown under each file; it updates when you change the quality.
  - Press Compress images and wait a moment; large AVIF files can take several seconds.
  - Compare each original with its compressed copy, then download the files one by one or all together as a ZIP.
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
  - q: How accurate is the estimated size?
    a: Images up to about 1 megapixel are really encoded once for the estimate, so the number matches the result. Larger images are estimated by encoding a few full-resolution patches and scaling up to the whole picture — usually close, but a photo with very uneven detail can differ more. The estimate never exceeds the original size, because the original is returned unchanged when re-encoding would make it larger.
---

## How the compression works

JPEG files are re-encoded with MozJPEG, WebP with libwebp and AVIF with libaom — the codecs used by Google's Squoosh, compiled to WebAssembly. PNG files are optimized losslessly with OxiPNG. All of them run in a background thread, so the page stays responsive while a large image is processed.

## Limits

- **Formats:** JPEG, PNG, WebP and AVIF in; the same format out. Other formats such as GIF, SVG or BMP are not accepted.
- **Size:** up to 50 MB per image. Very large images need a lot of memory and may fail on phones.
- **Quantity:** up to 20 images at once, processed one after another. Download the results one by one or as a single ZIP.
- **Animation:** animated WebP and AVIF files are reduced to their first frame.
- **Speed:** AVIF encoding is the slowest. In browsers that allow multithreading it uses several CPU cores.
- **Browsers:** your browser decodes the image first, so a format it cannot display, such as AVIF in an older browser, is rejected.

## Privacy

Your images are processed only on your device. The page does not upload them, store them or use cookies.
