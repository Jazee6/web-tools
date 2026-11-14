---
review: reviewed
updated: 2026-11-14
title: Image to Text – Extract Text from Photos and Screenshots (OCR) Online
description: Copy the text out of a photo, screenshot or scan in English, Chinese, Japanese and other Latin-script languages. Free and private — the OCR runs in your browser.
name: Image to Text
answer: Choose an image and press Extract text to have AI models read the printed text on your device, then copy the plain text, with no language to pick first.
action: Extract text
fields:
  file:
    label: Image (HEIC, JPEG, PNG, WebP or AVIF)
output:
  text:
    label: Extracted text
errors:
  decode_failed: This file could not be read as an image. It may be damaged, or your browser can't decode its format. Export it again as JPEG or PNG and try again.
  too_large: This image may have more pixels than your browser can handle. Phone browsers allow fewer than computers; try a smaller image or a computer.
  no_text: No text was found in this image. Make sure the text is sharp and large enough to read, or crop the image to the part with text and try again.
steps:
  - Choose an image with printed text in Image (HEIC, JPEG, PNG, WebP or AVIF), up to 50 MB.
  - Press Extract text. The first time, the AI models and ONNX Runtime (about 60 MB) are downloaded, and stored in your browser when there is room.
  - Copy the extracted text. The text found is grouped into lines, and a blank line marks a larger gap such as a new paragraph.
faq:
  - q: Are my images uploaded to a server?
    a: No. The image is decoded and read inside your browser, so it never leaves your device. The only downloads are the AI models and the files that run them.
  - q: Which languages can it read?
    a: Chinese (simplified and traditional), Japanese and languages written in the Latin alphabet, such as English, Spanish, Portuguese, German and French, including accented letters. You don't choose a language, and one image can mix them. It can't read Korean, Cyrillic, Arabic, Hebrew, Thai or Devanagari script.
  - q: Does it work on photos taken with a phone?
    a: Yes. The text detector finds lines in photos as well as in screenshots and scans, including tilted lines. For the best result, use a sharp photo where the text is large and flat, and check the result before you use it.
  - q: Can it read handwriting?
    a: It isn't made for it. The tool is intended for printed text, so handwriting may be misread; check the result carefully.
  - q: Does it keep the layout, tables or formatting?
    a: No. You get plain text in reading order, top to bottom and left to right. Bold text, fonts and table cells are not kept, and on a page with several columns, lines at the same height are joined across the columns.
  - q: Why is the first run slower?
    a: The tool first downloads two PP-OCRv6 models and ONNX Runtime, about 60 MB in total, and stores them in your browser when there is room. Later runs can reuse the stored copy while your browser keeps it. After that, the time depends on the amount of text, because every line is read separately.
---

## How the text extraction works

The tool decodes the image with your browser's built-in image decoder, or with a WebAssembly build of libheif for HEIC, and runs two open-source models from PaddleOCR's PP-OCRv6 (Apache-2.0 license) with ONNX Runtime in a background thread. The detection model marks where text is; each region becomes a box, which may be tilted. The recognition model then reads each box, one line at a time: the box is cut from the full-resolution image and scaled to 48 pixels high (very long lines are squeezed to at most 3,200 pixels wide), and the lines are put in reading order: top to bottom, and left to right within a line.

## Options and limits

- **Input:** one HEIC, JPEG, PNG, WebP or AVIF image, up to 50 MB. Transparent areas are treated as white.
- **Output:** plain text, grouped into lines by their height in the image, with a blank line where the gap between two lines is larger than a line of text.
- **Languages:** Chinese (simplified and traditional), Japanese, English and other Latin-alphabet languages, with no language to choose. Korean, Cyrillic, Arabic, Hebrew, Thai and Devanagari script are not supported.
- **Orientation:** tilted text is straightened, and a line whose height is at least 1.5 times its width is rotated 90° counterclockwise before it is read; vertical writing may be misread. Upside-down text is not corrected and may be misread.
- **Layout:** columns, tables and formatting are not kept.
- **Size:** for finding text, the image is scaled so that its longer side is at most 2,048 pixels; very small text in a large image may be missed, so crop to the text first. At most 1,000 candidate areas are examined, so on a very busy image some text can be left out.
- **Browsers:** JPEG, PNG, WebP and AVIF are decoded by your browser, so they work where the browser supports them; HEIC uses libheif. The models run on the CPU, with several threads where the browser allows it.
- **Download:** about 60 MB on first use (two models of 10 MB and 21 MB, plus ONNX Runtime, which the site's other AI tools share).

## Privacy

Your images are processed only on your device. The page does not upload them, store them or use cookies.
