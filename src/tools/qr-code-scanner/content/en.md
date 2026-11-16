---
review: reviewed
updated: 2026-11-16
title: QR Code Scanner – Scan QR Codes and Barcodes from Images Online
description: Read QR codes and barcodes from a screenshot, a photo or your camera and copy what they say. Free and private — the scanning runs in your browser.
name: QR Code Scanner
answer: Choose an image with a QR code or barcode, or press Use camera and point it at the code — the decoded text appears right away with the code type, ready to copy.
action: Scan
fields:
  file:
    label: Image (JPEG, PNG, WebP, GIF, BMP or AVIF)
output:
  codes:
    label: Codes found
    columns:
      text: Content
      format: Type
errors:
  decode_failed: This file could not be read as an image. It may be damaged, or your browser can't decode its format. Export it again as JPEG or PNG and try again.
  too_large: This image may have more pixels than your browser can handle. Phone browsers allow fewer than computers; try a smaller image or a computer.
  not_found: No QR code or barcode was found in this image. Make sure the whole code is in the picture, sharp and not too small, or crop the image to the code and try again.
steps:
  - Choose an image in Image (JPEG, PNG, WebP, GIF, BMP or AVIF), such as a screenshot or a photo of a code. The image is scanned as soon as you choose it.
  - Or press Use camera, allow camera access and hold the code in front of the camera. The camera turns off as soon as a code is read.
  - Read the Content and Type of every code found, and copy the text you need.
faq:
  - q: Is it safe to open the link in a QR code?
    a: Check it first. The tool only shows the text stored in the code and never opens links by itself, so you can see where a link leads before you visit it. Be careful with short links and addresses that imitate a known site.
  - q: Can it read barcodes too?
    a: Yes. Besides QR codes it reads Micro QR, rMQR, Data Matrix, Aztec, PDF417 and MaxiCode, and barcodes such as EAN-13, EAN-8, UPC-A, UPC-E, Code 39, Code 93, Code 128, Codabar, ITF and DataBar. The Type column shows which kind each code is.
  - q: What happens with several codes in one image?
    a: All of them are listed, each with its content and type, up to 255 codes per image.
  - q: Why does the camera not work?
    a: Your browser has to allow the page to use the camera; if you blocked it, allow camera access in the site settings and press Use camera again. The button is not available in browsers without camera support. You can always take a photo or screenshot of the code and choose it as an image instead.
  - q: Why was no code found?
    a: The code may be blurred, too small, cut off at the edge of the image, or have too little contrast. Use a sharper image, crop it to the code, or move the camera closer. Codes with light modules on a dark background are also tried.
---

## How the scanning works

The image is decoded by your browser's built-in image decoder and searched by [zxing-cpp](https://github.com/zxing-cpp/zxing-cpp), an open-source barcode library, compiled to WebAssembly and run in a background thread. It looks for every supported code type at once, also tries rotated, mirrored and inverted codes, and returns the decoded text of each code it can read completely. In camera mode, frames from the camera are scaled to at most 1,280 pixels on the longer side and scanned one after another; the first frame with a code is kept as the image and its codes are shown.

## Options and limits

- **Input:** one JPEG, PNG, WebP, GIF, BMP or AVIF image, up to 20 MB, or the camera. Only the first frame of an animated GIF is scanned. HEIC images are not supported; convert them with the [Image Converter](/image-converter) first.
- **Output:** a table with the text and type of every code found, up to 255 per image. Binary content that is not text may not display correctly.
- **Code types:** QR Code, Micro QR, rMQR, Data Matrix, Aztec, PDF417, MaxiCode, EAN-13, EAN-8, UPC-A, UPC-E, Code 39, Code 93, Code 128, Codabar, ITF, DataBar and others supported by zxing-cpp.
- **Camera:** asks for the rear camera when there is one and stops after the first successful scan; press Use camera again to scan another code. It needs a browser with camera support and your permission.
- **Browsers:** JPEG, PNG, GIF and BMP work in every current browser; AVIF works where the browser supports it.
- **Download:** the WebAssembly scanner, about 950 KB, is downloaded the first time you scan.

## Privacy

Your images and camera frames are processed only on your device. The page does not upload them, store them or use cookies.
