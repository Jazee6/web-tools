---
review: draft
updated: 2026-11-02
title: Image Resizer – Resize JPEG, PNG, WebP & AVIF Online Free
description: Resize images to an exact width and height for free. Private and fast — resizing runs in your browser, so your photos are never uploaded.
name: Image Resizer
answer: Choose your images, enter a width, a height or both, and press Resize images — the images are resized on your device, in the same format, and you download the results.
action: Resize images
fields:
  files:
    label: Images (JPEG, PNG, WebP or AVIF)
  width:
    label: Width (px)
    placeholder: Auto
  height:
    label: Height (px)
    placeholder: Auto
  fit:
    label: When both sizes are set
    options:
      contain: Fit inside and keep the proportions
      cover: Fill the size and crop the excess
      stretch: Stretch to the exact size
  quality:
    label: Quality (1–100)
output:
  files:
    label: Resized images
errors:
  decode_failed: "This file could not be read as an image. It may be damaged. Export it again or remove it, then try again:"
  too_large: "The resized image would be too large: a side would exceed 10,000 pixels, or your browser can't hold that many pixels. Enter a smaller size and try again:"
  size_required: Enter a width, a height or both.
steps:
  - Choose up to 20 JPEG, PNG, WebP or AVIF images, up to 50 MB each.
  - Enter a width, a height or both, in pixels. If you enter only one, the other follows from the proportions of each image.
  - If you entered both, choose how the image should use that size. Fit inside keeps the whole image, Fill crops the excess evenly from both sides, and Stretch ignores the proportions.
  - Press Resize images, then download each image or all of them as a ZIP file.
faq:
  - q: Are my images uploaded to a server?
    a: No. The images are decoded, resized and encoded inside your browser, so they never leave your device.
  - q: How do I keep the proportions?
    a: Enter only a width or only a height, and the other side is calculated from each image's proportions. If you enter both, keep "Fit inside and keep the proportions" selected. The image then fits within that size, so one side may come out smaller than you entered.
  - q: How do I get an exact size without distorting the image?
    a: Enter both a width and a height and choose "Fill the size and crop the excess". The image is scaled until it covers the size, and whatever sticks out is cut off evenly from both sides.
  - q: Can I make an image bigger?
    a: Yes, up to 10,000 pixels per side. Enlarging only spreads the existing pixels over a bigger area, so the image gets softer and gains no new detail.
  - q: Can I resize HEIC photos from an iPhone?
    a: Not directly. Convert them with the [Image Converter](/image-converter) first, then resize the result.
  - q: Is the photo's EXIF data kept?
    a: No. The image is encoded again from its pixels, so EXIF data such as the camera model and GPS location is not in the result. The EXIF orientation is applied to the image first, so photos stay the right way up.
---

## How the resizing works

The tool decodes each image with your browser's built-in image decoder, which also applies the EXIF orientation. It draws the image at the new size on a canvas and shrinks large reductions in steps of at most half, which keeps fine detail from turning jagged. The result is encoded again with WebAssembly builds of MozJPEG, libwebp and libaom, and PNG output goes through OxiPNG. The work runs in a background thread, one image at a time.

## Options and limits

- **Input:** 1 to 20 JPEG, PNG, WebP or AVIF images, up to 50 MB each. The output format is always the same as the input.
- **Size:** 1 to 10,000 pixels per side. Phone browsers may allow fewer total pixels; the tool then stops with a message.
- **Quality:** applies to JPEG, WebP and AVIF, with a default of 85. PNG is always lossless.
- **Transparency:** kept in PNG, WebP and AVIF.
- **Browsers:** AVIF and PNG encoding use several threads where the browser allows it; WebKit-based browsers such as Safari use one, so those formats take longer there.

## Privacy

Your images are processed only on your device. The page does not upload them, store them or use cookies.
