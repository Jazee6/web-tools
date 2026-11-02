---
review: draft
updated: 2026-11-02
title: PDF to Image – Convert PDF to JPG, PNG or WebP Online
description: Turn PDF pages into JPG, PNG or WebP images at 72, 150 or 300 DPI. Free and private — pages are rendered in your browser, so your document is never uploaded.
name: PDF to Image
answer: Choose a PDF, pick JPEG, PNG or WebP and a resolution, and press Convert to images. Each page becomes its own image on your device; enter pages such as 1-3, 5 to convert only those.
action: Convert to images
fields:
  file:
    label: PDF file
  pages:
    label: Pages
    placeholder: All pages, or 1-3, 5, 8-
  format:
    label: Image format
    options:
      jpeg: JPEG (works everywhere)
      png: PNG (lossless, sharpest text)
      webp: WebP (small, modern browsers)
  dpi:
    label: Resolution
    options:
      "72": 72 DPI (screen, smallest)
      "150": 150 DPI (sharp on screen)
      "300": 300 DPI (print quality)
  quality:
    label: Quality (1–100)
output:
  files:
    label: Images
errors:
  encrypted: "This PDF is protected with a password. Remove the password and try again:"
  invalid_pdf: "This file could not be read as a PDF. It may be damaged. Export it again and try again:"
  invalid_pages: "Enter pages as numbers and ranges separated by commas, such as 1-3, 5, 8-. This part can't be read:"
  page_out_of_range: "That page doesn't exist. Number of pages in this PDF:"
  too_many_files: This would create more than 500 images. Enter a smaller page range, such as 1-100, and convert the rest in another run.
  too_large: "This page is too large at the chosen resolution: a side would exceed 10,000 pixels, or your browser can't hold that many pixels. Choose a lower resolution, or leave this page out. Page:"
steps:
  - Choose a PDF file up to 50 MB.
  - Leave Pages empty to convert every page, or enter pages such as 1-3, 5, 8-. Pages count from 1, and 8- runs to the last page.
  - Pick the Image format and the Resolution. 150 DPI is sharp on screen; 300 DPI is for printing and gives four times as many pixels.
  - For JPEG and WebP, keep the default quality of 85 or set your own. PNG ignores this setting.
  - Press Convert to images, then download each image or all of them as a ZIP file.
faq:
  - q: Is my PDF uploaded to a server?
    a: No. Pages are rendered inside your browser with PDFium compiled to WebAssembly, so the file never leaves your device.
  - q: Which format should I choose?
    a: JPEG opens almost everywhere and suits pages with photos. PNG is lossless and keeps text and lines sharpest, but files are larger. WebP gives smaller files than JPEG at similar quality and opens in current browsers.
  - q: How big will the images be?
    a: The size in pixels is the page size in points times the resolution divided by 72. An A4 page becomes 595 × 842 pixels at 72 DPI, 1240 × 1754 at 150 DPI and 2480 × 3508 at 300 DPI.
  - q: Can I convert just one page?
    a: Yes. Enter its number under Pages, such as 4. You can list several pages and ranges, such as 1, 3-5; each page is converted once, in the order you type them.
  - q: Why is the background white instead of transparent?
    a: Every page is drawn on white, the way PDF readers show it, so JPEG, PNG and WebP look the same. Transparent areas of the page are not kept.
  - q: Can I select or copy the text in the images?
    a: No. The images are pictures of the pages, so text becomes pixels. To keep text selectable, extract the pages as a PDF with Split PDF instead.
---

## How the conversion works

The tool uses PDFium — the PDF engine inside Google Chrome — compiled to WebAssembly. It draws each page you chose on a white background at the selected resolution, including annotations such as highlights and filled-in form fields as they are stored in the file, and turns pages that are set to display rotated the right way up. Each page is then encoded as JPEG or WebP with the chosen quality, or as lossless PNG. The work happens in a background thread, so the page stays responsive.

## Options and limits

- **Input:** one PDF file up to 50 MB.
- **Pages:** single pages and ranges separated by commas. Every page must exist in the file; a page listed twice is converted once.
- **Output:** up to 500 images per run, named after the file and page number, such as report-3.jpg.
- **Resolution:** 72, 150 or 300 DPI. No side of an image may exceed 10,000 pixels, so very large pages, such as posters and drawings, need a lower resolution.
- **Passwords:** files that need a password to open cannot be converted.
- **Memory:** the file and all images are held in memory, so long documents at 300 DPI may fail on phones. Convert them in smaller page ranges.

To keep pages as a PDF instead, use [Split PDF](/split-pdf); to change the format of the images afterwards, use [Image Converter](/image-converter).

## Privacy

Your document is processed only on your device. The page does not upload it, store it or use cookies.
