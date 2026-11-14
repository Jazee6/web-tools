---
review: reviewed
updated: 2026-11-14
title: HTML to Markdown – Convert HTML and Rich Text to Markdown Online
description: Paste HTML source or copy formatted text from a web page, Word or Google Docs and get clean Markdown with tables. Free and private — it runs in your browser.
name: HTML to Markdown
answer: Paste HTML code, or copy formatted text from a web page or document and paste it into the HTML box — the Markdown appears right away; press Copy to copy it.
action: Convert
fields:
  html:
    label: HTML
    placeholder: "<h1>Title</h1>\n<p>Paste HTML, or copy formatted text from a page and paste it here.</p>"
output:
  markdown:
    label: Markdown
errors:
  empty: Nothing is left to convert. The HTML holds only scripts, styles or other content that is dropped — paste the part of the page with the text you want.
steps:
  - Paste HTML into the HTML box, or select formatted text on a web page, in Word or in Google Docs, copy it and paste it into the box.
  - Read the Markdown as it appears in the Markdown box.
  - Press Copy to copy the Markdown.
faq:
  - q: Can I paste formatted text instead of HTML code?
    a: Yes. When you copy from a web page, Word, Google Docs or an email, the clipboard also holds the HTML behind the formatting. Pasting into the HTML box inserts that HTML instead of plain text, so headings, links, lists and tables survive. If the clipboard holds only plain text, it is pasted as usual.
  - q: How are tables converted?
    a: Every table that has cells becomes a Markdown table, and its first row becomes the header row even when it uses ordinary cells, as tables copied from Word and Google Docs do. A | inside a cell is escaped as \|, several paragraphs or line breaks in one cell are joined with <br>, and a cell that spans several columns is followed by empty cells. Left, center and right alignment set on the header cells is kept.
  - q: What is removed?
    a: <script>, <style>, <noscript>, <iframe>, <template> and the page <head>, title included. Everything else is converted, including navigation menus and footers, so paste only the part of a page you need.
  - q: Which Markdown style does it write?
    a: "GitHub Flavored Markdown with # headings, - bullets, *italic*, **bold**, ``` fenced code blocks with the language when the code element has a class such as language-js, inline links, ~~strikethrough~~ and - [x] task list items from checkboxes. The style is fixed so the output looks the same every time."
  - q: Why do some HTML elements disappear without a trace?
    a: Markdown has no syntax for things like colors, fonts, forms or layout, so only their text is kept. Images keep their address and alt text; an address that points to a file on your computer does not work anywhere else.
---

## How the HTML to Markdown converter works

The converter reads your HTML with your browser's own HTML parser and turns it into Markdown with [Turndown](https://github.com/mixmark-io/turndown), so messy or incomplete HTML is read the way your browser would display it. The GitHub Flavored Markdown rules for tables, strikethrough and task lists are this site's own, so tables without header cells are converted instead of being left as HTML.

## Options and limits

- **Input:** HTML fragments or whole pages, up to 1,000,000 characters.
- **Pasting:** formatted text is pasted as its HTML when the clipboard has it; plain text is pasted unchanged.
- **Removed:** scripts, styles, noscript, iframes, templates and the page head. Navigation, headers and footers are converted like any other content.
- **Tables:** the first row is always the header row; a cell spanning several rows is not repeated, and a table inside a cell ends up as text in that cell.
- **Lists:** HTML lists (<ul> and <ol>) become Markdown lists. Lists that arrive as paragraphs starting with a bullet or number, as Word often copies them, stay paragraphs.
- **Not supported:** choosing another Markdown style, such as * bullets, setext headings or reference links.

## Privacy

Your HTML is processed only on your device. The page does not upload it, store it or use cookies.
