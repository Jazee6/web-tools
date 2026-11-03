---
review: draft
updated: 2026-11-03
title: Split PDF – Extract Pages or Split a PDF Online for Free
description: Split a PDF into several files or extract the pages you need. Free and private — splitting runs in your browser, so your document is never uploaded.
name: Split PDF
answer: Choose a PDF, enter the pages you want — such as 1-3, 5, 8- — and press Split PDF. Each range becomes its own file on your device, or leave the pages empty to split every page.
action: Split PDF
fields:
  file:
    label: PDF file
  pages:
    label: Pages
    placeholder: 1-3, 5, 8-
  mode:
    label: Output
    options:
      separate: One PDF per range
      combined: All listed pages in one PDF
output:
  files:
    label: PDF files
errors:
  encrypted: "This PDF is protected with a password. Remove the password and try again:"
  invalid_pdf: "This file could not be read as a PDF. It may be damaged. Export it again and try again:"
  invalid_pages: "Enter pages as numbers and ranges separated by commas, such as 1-3, 5, 8-. This part can't be read:"
  page_out_of_range: "That page doesn't exist. Number of pages in this PDF:"
  pages_required: Enter the pages to put in the PDF, such as 1-3, 5.
  too_many_files: This would create more than 500 files. Enter fewer ranges, or use larger ranges such as 1-100, 101-200.
steps:
  - Choose a PDF file up to 50 MB.
  - Enter the pages, such as 1-3, 5, 8-. Pages count from 1, and 8- runs to the last page. Leave Pages empty to split every page.
  - Under Output, choose One PDF per range to get a separate file for each part between commas, or All listed pages in one PDF to extract them into a single file.
  - Press Split PDF, then download each file or all of them as a ZIP file.
faq:
  - q: Is my PDF uploaded to a server?
    a: No. The file is read and split inside your browser with PDFium compiled to WebAssembly, so it never leaves your device.
  - q: How do I extract just a few pages?
    a: Enter them under Pages, such as 2, 5-7, and choose All listed pages in one PDF. You get one file with those pages.
  - q: How do I split a PDF into single pages?
    a: Leave Pages empty, keep One PDF per range selected and press Split PDF. Every page becomes its own file. Files per run are limited to 500, so for longer documents use ranges instead.
  - q: Can I reorder or repeat pages?
    a: Yes, when you put them in one PDF. Pages come out in the order you type them, so 5, 1-2, 1 gives page 5, pages 1 and 2, then page 1 again.
  - q: Does splitting reduce the quality?
    a: No. Pages are copied as they are — text stays selectable and images are not recompressed.
  - q: Are bookmarks and form fields kept?
    a: The pages come across with their text and images unchanged, but bookmarks are not added to the new files. Fillable form fields keep their content but may no longer be editable.
---

## How the splitting works

The tool uses PDFium — the PDF engine inside Google Chrome — compiled to WebAssembly. It opens your file, copies the pages you asked for into a new document for each output file and saves the result. The work happens in a background thread, so the page stays responsive.

## Options and limits

- **Input:** one PDF file up to 50 MB.
- **Pages:** single pages and ranges separated by commas. A range must go from a lower page to a higher one, and every page must exist in the file.
- **Output:** up to 500 PDF files per run.
- **Passwords:** files that need a password to open cannot be split.
- **File size:** each file can hold resources shared by the whole document, such as fonts, so the parts together may be larger than the original.
- **Memory:** the file and all results are held in memory, so very large documents may fail on phones.

To combine the parts again, or to join other documents, use [Merge PDF](/merge-pdf).

To reorder, rotate or delete pages within one document, use [Organize PDF](/organize-pdf).

## Privacy

Your document is processed only on your device. The page does not upload it, store it or use cookies.
