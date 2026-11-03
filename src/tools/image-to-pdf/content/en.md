---
review: draft
updated: 2026-11-03
title: Image to PDF – Convert JPG, PNG & WebP to PDF Online Free
description: Turn JPG, PNG, WebP and AVIF images into one PDF on A4, Letter or image-sized pages. Free and private — your images are never uploaded.
name: Image to PDF
answer: Choose your images, put them in order, pick a page size and press Create PDF — each image becomes one page of a single PDF, made on your device and ready to download.
action: Create PDF
fields:
  files:
    label: Images (JPEG, PNG, WebP or AVIF)
  pageSize:
    label: Page size
    options:
      a4: A4 (210 × 297 mm)
      letter: US Letter (8.5 × 11 in)
      fit: Same as the image
  orientation:
    label: Orientation
    options:
      auto: Automatic (follow each image)
      portrait: Portrait
      landscape: Landscape
  margin:
    label: Margin
    options:
      none: None
      small: Small (0.5 in)
      large: Large (1 in)
output:
  file:
    label: PDF
errors:
  decode_failed: "This file could not be read as an image. It may be damaged. Export it again or remove it from the list, then try again:"
  too_large: "This image has too many pixels for your browser to process. Make it smaller with Image Resizer, or remove it from the list, then try again:"
steps:
  - Choose up to 50 JPEG, PNG, WebP or AVIF images, up to 50 MB each. You can add more files in several rounds.
  - Use the up and down arrows to put the images in order. The first image becomes the first page.
  - Pick the Page size. A4 and US Letter suit documents you will print; Same as the image makes each page exactly as large as its picture.
  - For A4 and US Letter, keep Orientation on Automatic to turn the page sideways for wide images, or choose Portrait or Landscape for every page. Add a Margin if you want white space around the images.
  - Press Create PDF and download the file.
faq:
  - q: Are my images uploaded to a server?
    a: No. The PDF is built inside your browser with PDFium compiled to WebAssembly, so your images never leave your device.
  - q: Does converting to PDF reduce the image quality?
    a: Not for JPEG, PNG and lossless WebP. JPEG files are placed in the PDF byte for byte, without recompression, and PNG and lossless WebP images are stored losslessly. Lossy WebP and AVIF images without transparency are converted to JPEG at quality 90 to keep the file small, which can add slight compression artifacts.
  - q: My phone photo is sideways in other tools. Will it be upright here?
    a: Yes. Phones often save photos in sensor orientation with a rotation tag. The tool reads that tag and places the photo the right way up, without re-encoding it.
  - q: How are the images placed on A4 or Letter pages?
    a: Each image is scaled to fit inside the margins, keeping its proportions, and centred on the page. Small images are enlarged to fill the space, so very small pictures may look blurry when printed.
  - q: How large is a page with Same as the image?
    a: The page takes the size of the image at 96 pixels per inch, plus any margin. A 1920 × 1080 pixel screenshot becomes a 20 × 11.25 inch page.
  - q: Can I add HEIC photos from an iPhone?
    a: Not directly. Convert them to JPEG with Image Converter first, then add the JPEG files here.
---

## How the PDF is built

The tool uses PDFium — the PDF engine inside Google Chrome — compiled to WebAssembly, and creates one page per image in the order of your list. Each file is first decoded by your browser to make sure it is a readable image. JPEG files are then embedded unchanged, and their rotation tag is applied by turning the image on the page. PNG images, lossless WebP images, and any image with transparency are stored losslessly; transparent areas show the white page. Lossy WebP and AVIF images without transparency are converted to JPEG at quality 90. The work happens in a background thread, so the page stays responsive.

## Options and limits

- **Input:** 1 to 50 JPEG, PNG, WebP or AVIF images, up to 50 MB each. HEIC is not accepted; convert it with [Image Converter](/image-converter) first.
- **Pages:** A4 (210 × 297 mm), US Letter (8.5 × 11 in), or the size of each image at 96 pixels per inch. Margins are 0.5 in (12.7 mm) or 1 in (25.4 mm) on every side.
- **Placement:** images keep their proportions, are centred, and are scaled up or down to fit inside the margins. Nothing is cropped.
- **Output:** one PDF named after the first image. Text in the images is not searchable or selectable.
- **Memory:** losslessly stored images are held uncompressed until the PDF is saved, so many large screenshots may fail on phones. Create the PDF in smaller batches and combine them with [Merge PDF](/merge-pdf).

To shrink photos before you add them, use [Image Resizer](/image-resizer); to turn PDF pages back into pictures, use [PDF to Image](/pdf-to-image).

## Privacy

Your images are processed only on your device. The page does not upload them, store them or use cookies.
