---
review: reviewed
updated: 2026-11-14
title: Excel to Markdown Table – Paste Spreadsheet Cells Online
description: Copy cells from Excel or Google Sheets and paste them to get a Markdown table, with no CSV export needed. Free, and your data never leaves your device.
name: Excel to Markdown Table
answer: Select the cells in Excel or Google Sheets, copy them and paste them into the Table data box — TSV is already selected, so the Markdown table appears at once; press Copy to copy it.
steps:
  - In Excel, Google Sheets, Numbers or LibreOffice Calc, select the range of cells you need, header row included.
  - Copy the cells and paste them into the Table data box; TSV is already selected as the Input format.
  - Press Copy and paste the table into GitHub, GitLab, Notion, Obsidian or any Markdown editor.
faq:
  - q: Do I need to save my sheet as CSV first?
    a: No. When you copy cells, the spreadsheet puts them on the clipboard as tab-separated text, one row per line and a tab between cells. That text is exactly what this preset reads, so copying and pasting is enough.
  - q: Why are numbers with thousands separators kept as one cell?
    a: In tab-separated text only tabs split cells, so 1,234.50 or a list such as "red, green" stays in one cell. This is the main reason pasting from a spreadsheet is more reliable than exporting CSV in a language where the comma is the decimal separator.
  - q: Are formulas, colors and merged cells copied?
    a: No. The clipboard holds the values the cells display, so you get the results of formulas, not the formulas themselves. Formatting such as bold, colors and borders is not part of the text, and a merged cell arrives as one value followed by empty cells.
  - q: A cell with several lines broke my table. How do I fix it?
    a: Spreadsheets wrap a cell that contains line breaks in double quotes when they copy it, and the preset turns each line break into <br>. If a line break still splits a row, the program you copied from did not quote the cell; remove the line breaks in the sheet and copy again.
table:
  caption: How copied spreadsheet cells end up in Markdown table cells
  columns:
    clipboard: Cell as copied (TSV)
    cell: Markdown cell
    rule: Why
  terms:
    commaKept: Commas never split cells in tab-separated text
    lineBreak: A quoted line break becomes <br>
    doubledQuote: Two quotes inside quotes stand for one
    pipe: "| is escaped so it does not split the column"
    trimmed: Spaces around the value are removed
---

## Why copying cells works better than exporting

A Markdown table needs plain text, and the clipboard already has it. Spreadsheet apps copy a range as tab-separated values: each row on its own line and a tab between cells. Because tabs never appear inside normal cell values, numbers like 1,234.50, addresses and comma-separated lists stay intact — something a CSV export can get wrong when the sheet uses a comma as the decimal separator or the export uses semicolons.

## Options and limits

- **Range size:** up to 200,000 characters of copied cells, which covers thousands of short cells.
- **What is copied:** displayed values only, so set number formats, dates and rounding in the sheet before you copy.
- **Blank rows:** skipped; a row shorter than the others gets empty cells at the end.
- **Numbers:** pick Right as the Alignment when the table is mostly numbers, so they line up in the rendered table.
- **Not supported:** formulas, formatting such as bold or colors, merged cells, images and comments.

## Privacy

The copied cells are processed only on your device. The page does not upload them, store them or use cookies.
