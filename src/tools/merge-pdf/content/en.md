---
review: draft
updated: 2026-10-23
title: Merge PDF – Combine PDF Files Online for Free
description: Combine several PDF files into one, in the order you choose. Free and private — merging runs in your browser, so your documents are never uploaded.
name: Merge PDF
answer: Add two or more PDF files, put them in the order you want and press Merge PDF — the pages are combined on your device into a single PDF that you can download right away.
action: Merge PDF
fields:
  files:
    label: PDF files
output:
  file:
    label: Merged PDF
errors:
  encrypted: "This PDF is protected with a password. Remove the password and try again:"
  invalid_pdf: "This file could not be read as a PDF. It may be damaged:"
steps:
  - Choose the PDF files you want to combine — between 2 and 20 files, up to 50 MB each. You can add more files in several rounds.
  - Use the up and down arrows to put the files in order, or remove a file you added by mistake.
  - Press Merge PDF. All pages of the first file come first, followed by the pages of the next file, and so on.
  - Download the merged PDF.
faq:
  - q: Are my PDF files uploaded to a server?
    a: No. The files are read and combined inside your browser with PDFium compiled to WebAssembly, so they never leave your device.
  - q: Can I change the order of the files?
    a: Yes. The list shows the files in the order they will be merged. Move a file up or down with the arrow buttons before you press Merge PDF.
  - q: Can I merge password-protected PDFs?
    a: Not when a password is needed to open the file. Open it in a PDF reader, save a copy without the password and add that copy instead.
  - q: Does merging reduce the quality?
    a: No. Pages are copied as they are — text stays selectable and images are not recompressed, so the merged file looks exactly like the originals.
  - q: Are bookmarks and form fields kept?
    a: The pages come across with their text and images unchanged, but the bookmarks of the original files are not added to the merged PDF. Fillable form fields keep their content but may no longer be editable.
---

## How the merging works

The tool uses PDFium — the PDF engine inside Google Chrome — compiled to WebAssembly. It opens each file, copies every page into a new document in the order of your list and saves the result. The work happens in a background thread, so the page stays responsive while large files are merged.

## Limits

- **Files:** 2 to 20 PDF files per merge, up to 50 MB each.
- **Whole files only:** every page of every file is included. To leave pages out, split or organize the PDF first.
- **Passwords:** files that need a password to open cannot be merged.
- **Memory:** all files are held in memory while merging, so very large merges may fail on phones.

## Privacy

Your documents are processed only on your device. The page does not upload them, store them or use cookies.
