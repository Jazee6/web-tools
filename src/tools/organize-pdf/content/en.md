---
review: draft
updated: 2026-11-03
title: Organize PDF – Reorder, Rotate and Delete PDF Pages Online
description: Reorder, rotate and delete the pages of a PDF with page previews. Free and private — everything runs in your browser, so your document is never uploaded.
name: Organize PDF
answer: Choose a PDF, then use the buttons under each page preview to move, rotate or remove pages, and press Organize PDF. The new PDF is created on your device and is ready to download right away.
action: Organize PDF
fields:
  file:
    label: PDF file
  pages:
    label: Pages
    placeholder: 3, 1-2 r90, 5-
output:
  file:
    label: PDF
errors:
  encrypted: "This PDF is protected with a password. Remove the password and try again:"
  invalid_pdf: "This file could not be read as a PDF. It may be damaged. Export it again and try again:"
  invalid_pages: "Enter pages as numbers and ranges separated by commas, with r90, r180 or r270 to rotate, such as 3, 1-2 r90, 5-. This part can't be read:"
  page_out_of_range: "That page doesn't exist. Number of pages in this PDF:"
steps:
  - Choose a PDF file up to 50 MB. A preview of every page appears below Pages.
  - Use the arrows under a page to move it earlier or later, the rotate button to turn it 90° clockwise, and the cross to remove it.
  - Check the order in the Pages box, which updates as you edit. You can also type in it directly, for example 3, 1-2 r90, 5-.
  - Press Organize PDF and download the file.
faq:
  - q: Is my PDF uploaded to a server?
    a: No. The previews and the new PDF are both made inside your browser with PDFium compiled to WebAssembly, so your document never leaves your device.
  - q: Does rotating a page reduce the quality?
    a: No. Rotation only changes the page's rotation setting, so the text stays selectable and images are not recompressed. Moving and removing pages copies them as they are.
  - q: What do the numbers in the Pages box mean?
    a: They are the pages of the new PDF, in order. 3, 1-2 r90, 5- means page 3, then pages 1 and 2 turned 90° clockwise, then page 5 to the last page. Pages that are not listed are left out. Leave the box empty to keep every page as it is.
  - q: Can I put the same page in twice?
    a: Yes. Type its number twice in the Pages box, such as 1, 2, 1. Each copy can have its own rotation.
  - q: A page was already sideways. What does rotate do?
    a: Each turn adds 90° clockwise to the way the page is shown now, so the preview always matches the result. Turning a page four times brings it back to where it started.
  - q: Are bookmarks and form fields kept?
    a: The pages come across with their text and images unchanged, but bookmarks are not added to the new file. Fillable form fields keep their content but may no longer be editable.
---

## How the organizing works

The tool uses PDFium — the PDF engine inside Google Chrome — compiled to WebAssembly. When you choose a file, it draws a small preview of each page in a background thread, a few pages at a time. When you press Organize PDF, it copies the pages into a new document in the order you set, adds any rotation to each page and saves the result. The page stays responsive throughout.

## Options and limits

- **Input:** one PDF file up to 50 MB.
- **Pages:** single pages and ranges separated by commas, each optionally followed by r90, r180 or r270 for a clockwise turn. A range must go from a lower page to a higher one, and every page must exist in the file. At least one page must stay.
- **Output:** one PDF named after the original, ending in -organized.
- **Passwords:** files that need a password to open cannot be organized, and no previews are shown for them.
- **Memory:** the file is held in memory while you edit, so very large documents may fail on phones.

To take some pages out into separate files, use [Split PDF](/split-pdf). To add pages from other documents, use [Merge PDF](/merge-pdf).

## Privacy

Your document is processed only on your device. The page does not upload it, store it or use cookies.
