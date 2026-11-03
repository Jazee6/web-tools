---
review: draft
updated: 2026-11-03
title: Image Cropper – Crop, Rotate & Flip JPEG, PNG, WebP Online Free
description: Crop an image to any area or a ratio such as 1:1 or 16:9, and rotate or flip it first. Free and private — it all runs in your browser, so nothing is uploaded.
name: Image Cropper
answer: Choose an image, drag the crop box or pick a ratio, rotate or flip it if needed, and press Crop image — the image is cropped on your device, in the same format, and you download the result.
action: Crop image
fields:
  file:
    label: Image (JPEG, PNG, WebP or AVIF)
  rotate:
    label: Rotate clockwise
    options:
      "0": No rotation
      "90": 90°
      "180": 180°
      "270": 270°
  flipHorizontal:
    label: Flip horizontally
  flipVertical:
    label: Flip vertically
  aspect:
    label: Aspect ratio
    options:
      free: Free
      "1:1": 1:1 (square)
      "4:3": 4:3 (landscape)
      "3:4": 3:4 (portrait)
      "3:2": 3:2 (landscape)
      "2:3": 2:3 (portrait)
      "16:9": 16:9 (widescreen)
      "9:16": 9:16 (vertical)
  crop:
    label: Crop area (x, y, width, height in px)
    placeholder: Whole image, or centered at the aspect ratio
  quality:
    label: Quality (1–100)
output:
  file:
    label: Cropped image
errors:
  decode_failed: This file could not be read as an image. It may be damaged. Export it again and try again.
  too_large: Your browser can't hold this many pixels. Phone browsers allow fewer than computers; try a smaller crop area or a computer.
  crop_out_of_range: "The crop area goes past the edge of the image. Keep it within the image size after rotating, in pixels:"
  invalid_crop: "Enter the crop area as four whole numbers — x, y, width and height — such as 40, 0, 240, 240. This could not be read:"
steps:
  - Choose a JPEG, PNG, WebP or AVIF image, up to 50 MB.
  - If needed, choose how far to rotate it clockwise and whether to flip it. The preview shows the result, and the crop is measured on it.
  - Pick an aspect ratio, or keep Free. Drag the crop box to move it and drag its corners to resize it, or type the area as x, y, width, height.
  - Press Crop image, then download the cropped image.
faq:
  - q: Are my images uploaded to a server?
    a: No. The image is decoded, cropped and encoded again inside your browser, so it never leaves your device.
  - q: How do I crop an image to a square?
    a: Choose 1:1 (square) as the aspect ratio. The crop box becomes the largest square in the center of the image, and you can drag it to the part you want to keep before pressing Crop image.
  - q: How do I switch between landscape and portrait, such as 16:9 and 9:16?
    a: Pick the other ratio in the list, or press the switch button under the preview. Changing the ratio, rotation or flip resets the crop box to the centered area.
  - q: Does cropping reduce the quality?
    a: The pixels you keep are copied one to one, without scaling. JPEG, WebP and AVIF are then encoded again at the quality you set, 85 by default, which adds a little compression loss; PNG stays lossless.
  - q: Can I crop and resize at the same time?
    a: Not in this tool, which keeps the cropped pixels at their size. Crop first, then use the [Image Resizer](/image-resizer) to change the width and height.
  - q: Is the photo's EXIF data kept?
    a: No. The image is encoded again from its pixels, so EXIF data such as the camera model and GPS location is not in the result. The EXIF orientation is applied first, so the preview and the result are the right way up.
---

## How the cropping works

The tool decodes the image with your browser's built-in image decoder, which also applies the EXIF orientation. It rotates the image clockwise in steps of 90°, then flips the rotated image, and copies the pixels inside the crop area onto a canvas without smoothing, so no pixel is blended or shifted. The crop is measured on the image as you see it in the preview, after rotating and flipping. The result is encoded again with WebAssembly builds of MozJPEG, libwebp and libaom, and PNG output goes through OxiPNG. The work runs in a background thread.

## Options and limits

- **Input:** one JPEG, PNG, WebP or AVIF image, up to 50 MB. The output format is always the same as the input.
- **Crop area:** x and y are the top-left corner, in whole pixels, and the area must stay inside the image. Leave it empty to keep the whole image, or the largest centered area at the chosen aspect ratio. When you enter an area, the aspect ratio only guides the crop box.
- **Rotate and flip:** rotation is 90°, 180° or 270° clockwise; flipping mirrors the rotated image left to right or top to bottom.
- **Quality:** applies to JPEG, WebP and AVIF, with a default of 85. PNG is always lossless.
- **Transparency:** kept in PNG, WebP and AVIF.
- **Browsers:** phone browsers allow fewer total pixels than computers, so very large images may stop with a message. AVIF and PNG encoding use several threads where the browser allows it; WebKit-based browsers such as Safari use one, so those formats take longer there.

## Privacy

Your images are processed only on your device. The page does not upload them, store them or use cookies.
