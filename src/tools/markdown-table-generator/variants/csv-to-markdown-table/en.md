---
review: reviewed
updated: 2026-11-14
title: CSV to Markdown Table Converter – Free Online
description: Paste a CSV file's contents and get a GitHub Markdown table. Quoted fields with commas, quotes and line breaks are handled. Free, and nothing is uploaded.
name: CSV to Markdown Table
answer: Paste the contents of your CSV file into the Table data box — CSV is already selected, so the Markdown table appears at once; press Copy to copy it.
steps:
  - Open the .csv file in a text editor, select everything and copy it.
  - Paste it into the Table data box; CSV is already selected as the Input format.
  - Press Copy and paste the table into your README, wiki or notes.
faq:
  - q: My CSV has commas inside some values. Will the columns break?
    a: Not if those values are in double quotes, as CSV exports from spreadsheets, databases and most programs write them. "Smith, Ada" stays one cell. A comma outside quotes always starts a new column.
  - q: My file uses semicolons instead of commas. What can I do?
    a: Semicolons are not treated as separators, so each line ends up in a single column. Re-export the file with commas, or open it in your spreadsheet and copy the cells instead — the Excel to Markdown table preset reads them directly.
  - q: Why is there <br> in some cells?
    a: A quoted CSV field can span several lines, but a Markdown table row cannot. Each line break inside a field becomes <br>, which GitHub and most Markdown renderers show as a line break inside the cell.
  - q: Can I convert a CSV file with thousands of rows?
    a: Up to 200,000 characters of CSV, which is a few thousand short rows. A Markdown table that large is hard to read, so consider linking to the CSV file for big data sets.
table:
  caption: How CSV fields end up in Markdown table cells
  columns:
    field: Field in the CSV
    cell: Markdown cell
    rule: Why
  terms:
    quotedComma: A comma inside quotes stays in the cell
    doubledQuote: Two quotes inside quotes stand for one
    lineBreak: A line break inside quotes becomes <br>
    pipe: "| is escaped so it does not split the column"
    trimmed: Spaces around the value are removed
    semicolon: Semicolons do not separate fields
---

## Reading CSV the way RFC 4180 defines it

CSV looks simple until a value contains a comma, a quote or a line break. The converter follows [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180), the format most programs write: fields are separated by commas, a field wrapped in double quotes may contain commas and line breaks, and a quote inside a quoted field is written twice. Lines may end in CRLF, LF or CR, so files from Windows, macOS and Linux all work.

## Options and limits

- **CSV size:** up to 200,000 characters of CSV.
- **Header:** the first CSV row becomes the header row; with First row is the header off, an empty header row is added instead.
- **Ragged files:** rows with fewer fields than the longest row get empty cells at the end, and empty lines are skipped.
- **Separators:** commas only. Semicolon- and tab-separated files are not split by this preset.
- **Unclosed quotes:** a field whose closing quote is missing runs to the end of the file, so check the source if the last cell swallows several rows.
- **Not supported:** reading a header from a separate file, skipping columns, and converting back to CSV.

## Privacy

Your CSV is processed only on your device. The page does not upload it, store it or use cookies.
