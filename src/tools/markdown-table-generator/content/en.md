---
review: reviewed
updated: 2026-11-14
title: Markdown Table Generator – CSV and Excel to Markdown Table Online
description: Turn CSV, cells copied from Excel or Google Sheets, or a messy Markdown table into a neatly aligned Markdown table. Free and private — it runs in your browser.
name: Markdown Table Generator
answer: Paste CSV, cells copied from a spreadsheet or an existing Markdown table into the Table data box — the aligned Markdown table appears right away; press Copy to copy it.
action: Generate table
fields:
  data:
    label: Table data
    placeholder: "Name,Role\nAda,Engineer\nGrace,Admiral"
  from:
    label: Input format
    options:
      auto: Detect automatically
      csv: CSV (comma-separated)
      tsv: TSV (copied from Excel or Google Sheets)
      markdown: Markdown table
  header:
    label: First row is the header
  align:
    label: Alignment
    options:
      none: Not set
      left: Left
      center: Center
      right: Right
  pad:
    label: Pad columns
output:
  markdown:
    label: Markdown table
errors:
  empty: No cells were found. Paste rows of CSV, cells copied from a spreadsheet or a Markdown table.
steps:
  - Paste your data into the Table data box — CSV, cells copied from Excel or Google Sheets, or a Markdown table.
  - If the table looks wrong, choose the right Input format.
  - Turn off First row is the header if your data has no header row.
  - Pick an Alignment if every column should be aligned the same way.
  - Press Copy to copy the Markdown table.
faq:
  - q: How do I turn an Excel or Google Sheets range into a Markdown table?
    a: Select the cells, copy them and paste them into the Table data box. Spreadsheets copy cells as tab-separated text (TSV), which the generator detects from the tabs in the first line. Cells that contain line breaks or quotes are quoted by the spreadsheet and read correctly.
  - q: What happens to commas, quotes and line breaks in CSV?
    a: The generator follows RFC 4180. A field in double quotes can contain commas and line breaks, and "" stands for one quote. A | in a cell is escaped as \| so it does not split the column, and a line break inside a cell becomes <br>, because a Markdown table row has to stay on one line.
  - q: Can it fix a messy Markdown table?
    a: Yes. Paste the table and it is rewritten with consistent spacing. Each column keeps its alignment from the --- row unless you choose an Alignment for the whole table, and the cell contents, including inline code, links and escaped \| characters, are kept as written.
  - q: Why does my table have an empty first row?
    a: Markdown tables must have a header row. When First row is the header is off, the generator adds an empty header row so that your first row stays in the body. Some renderers show the empty row as a thin bar.
  - q: Why do the columns not line up in my editor?
    a: Pad columns adds spaces so every cell in a column is the same width in a monospaced font. Widths are estimated per character — Chinese, Japanese and Korean characters, full-width symbols and emoji count as two columns, as most code editors draw them, and everything else as one. Editors with a proportional font, or that draw some characters at another width, can still look ragged — the rendered table is the same either way.
---

## How the Markdown table generator works

The generator reads your data as CSV following [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180), as tab-separated values, or as a [GitHub Flavored Markdown table](https://github.github.com/gfm/#tables-extension-), and writes a GitHub Flavored Markdown table. When Input format is set to detect, a first line that starts with | or a second line made of --- cells means Markdown, tabs in the first line mean TSV, and anything else is read as CSV. Column widths are estimated per character as a reader sees it, counting wide East Asian characters and emoji as two columns, so most text lines up in a code editor.

## Options and limits

- **Table data:** up to 200,000 characters. Blank lines are skipped, and rows with fewer cells than the longest row are filled with empty cells.
- **CSV:** only commas separate fields. Semicolon-separated files, common in some European versions of Excel, are not split, so save them with commas or paste the cells from the spreadsheet instead.
- **Alignment:** one alignment for every column, or Not set to leave CSV and TSV columns unaligned and keep the alignment of a Markdown table.
- **Cells:** leading and trailing spaces are trimmed. In CSV and TSV cells only | is escaped and line breaks become <br>; any Markdown or HTML inside them, such as **bold**, is kept and renders.
- **Not supported:** merged cells, per-column alignment for CSV and TSV, and converting a Markdown table back to CSV.

## Privacy

Your data is processed only on your device. The page does not upload it, store it or use cookies.
