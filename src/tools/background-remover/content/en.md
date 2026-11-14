---
review: reviewed
updated: 2026-11-14
title: Background Remover – Remove Image Backgrounds Online Free
description: Remove the background from a photo and get a transparent PNG or WebP, or a solid color. Free and private — the AI runs in your browser, so photos aren't uploaded.
name: Background Remover
answer: Choose a photo, keep PNG for a transparent background or enter a background color, and press Remove background to have an AI model on your device remove the background for download.
action: Remove background
fields:
  file:
    label: Image (HEIC, JPEG, PNG, WebP or AVIF)
  format:
    label: Output format
    options:
      png: PNG (transparent)
      webp: WebP (transparent)
      jpeg: JPEG (needs a background color)
  background:
    label: Background color (hex)
    placeholder: "Transparent, or a color such as #ffffff"
  quality:
    label: Quality (1–100)
output:
  file:
    label: Image without background
errors:
  decode_failed: This file could not be read as an image. It may be damaged, or your browser can't decode its format. Export it again as JPEG or PNG and try again.
  too_large: Your browser can't hold this many pixels. Phone browsers allow fewer than computers; try a smaller image or a computer.
  background_required: "JPEG has no transparency, so it needs a background color. Enter one, such as #ffffff for white, or choose PNG or WebP to keep the background transparent."
  invalid_color: "Enter the background color as a hex code with three or six digits, such as #fff or #ffffff, or leave it empty. This could not be read:"
steps:
  - Choose a HEIC, JPEG, PNG, WebP or AVIF image, up to 50 MB.
  - Choose a format in Output format. PNG and WebP keep the background transparent; JPEG needs a background color.
  - "To put the subject on a solid color, enter it in Background color (hex), such as #ffffff."
  - Press Remove background. The first time, the AI model and its runtime (about 125–150 MB) are downloaded, and stored in your browser when there is room.
  - Download the image without background.
faq:
  - q: Are my photos uploaded to a server?
    a: No. The image is decoded, analyzed by the model and encoded again inside your browser. The tool downloads the AI model and its runtime, but your photo never leaves your device.
  - q: How do I get a white background, for example for a product photo?
    a: "Enter #ffffff as the background color. The subject is placed on white and the result has no transparency, so you can also save it as JPEG."
  - q: Why is the first run slower?
    a: The tool first downloads the BiRefNet model and its runtime, about 125–150 MB depending on your device, and stores them in your browser when there is room. Later runs can reuse the stored copy while your browser keeps it.
  - q: Can I choose which object to keep?
    a: No. The model picks the main subject on its own, and there is no way to mark an object by hand. Check the edges of the result before you use it.
  - q: Can I remove the background from several images at once?
    a: Not in this tool, which handles one image at a time. Once the model is loaded, each further image is processed without downloading it again.
  - q: Is the photo's EXIF data kept?
    a: No. The image is encoded again from its pixels, so EXIF data such as the camera model and GPS location is not in the result. For JPEG, PNG, WebP and AVIF, the EXIF orientation is applied first, so the result is the right way up.
---

## How the background removal works

The tool decodes the image with your browser's built-in image decoder, or with a WebAssembly build of libheif for HEIC, and passes a copy to BiRefNet_lite, an open-source segmentation model (MIT license). The model runs with ONNX Runtime in a background thread and outputs, for every pixel, how likely it is to belong to the subject. That mask is scaled back to the full size of your image and becomes its transparency: the subject stays, and the background becomes transparent or is filled with the color you entered. The result is encoded as PNG (then optimized with OxiPNG), WebP or JPEG.

## Options and limits

- **Input:** one HEIC, JPEG, PNG, WebP or AVIF image, up to 50 MB. Areas that are already transparent stay transparent, unless you enter a background color.
- **Output:** PNG and WebP keep the background transparent; JPEG has no transparency and needs a background color. The image keeps its width and height.
- **Background color:** a hex code such as #ffffff or #fff. Leave it empty for a transparent background.
- **Quality:** applies to WebP and JPEG, with a default of 90. PNG is always lossless.
- **Browsers:** with WebGPU and a GPU that supports 16-bit floats, the model runs on the GPU and analyzes the image at 1024 × 1024 pixels. Otherwise it runs on the CPU at 512 × 512 pixels, so edges on large images can be less precise. The CPU path uses several threads where the browser allows it.
- **Download:** the model and its runtime are about 150 MB with WebGPU or about 125 MB without, downloaded on first use.
- **Accuracy:** the model finds the main subject automatically; you can't choose which object to keep.

## Privacy

Your images are processed only on your device. The page does not upload them, store them or use cookies.
