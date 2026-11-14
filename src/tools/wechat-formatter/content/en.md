---
review: reviewed
updated: 2026-11-14
title: WeChat Formatter – Format Markdown for WeChat Articles Online
description: Write your article in Markdown and copy it as rich text styled for the WeChat Official Account editor. Free and private — it runs in your browser.
name: WeChat Formatter
answer: Type or paste your article in Markdown, pick an accent color and press Copy rich text to paste a styled article into the WeChat Official Account editor — the preview updates as you write.
action: Format article
fields:
  markdown:
    label: Markdown
    placeholder: "# Title\n\nWrite your article in **Markdown**…"
  accent:
    label: Accent color
    options:
      neutral: Neutral
      blue: Blue
      green: Green
      orange: Orange
      red: Red
      rose: Rose
      violet: Violet
      yellow: Yellow
output:
  html:
    label: WeChat preview
steps:
  - Type or paste your article into the Markdown box. The WeChat preview updates as you write.
  - Choose an Accent color for the heading 2 bar, quote borders, inline code and reference numbers.
  - Press Copy rich text.
  - Paste into the body of your article in the WeChat Official Account editor.
  - To use the article in another editor or template, press Copy HTML instead to get the source with every style inline.
faq:
  - q: Why do my links turn into numbers?
    a: The WeChat Official Account editor does not let readers click links to other websites in the article body. The formatter keeps the link text, adds a number such as [1] after it and lists every address at the end, so readers can still find the source. Links to mp.weixin.qq.com articles stay clickable.
  - q: Why does the formatting disappear when I paste the HTML into the editor?
    a: Copy HTML puts the source code on the clipboard, which the editor shows as plain text. Use Copy rich text for the WeChat editor; it copies the formatted article, the same way copying from a web page does.
  - q: Can I add images from my computer?
    a: No. Images must be http or https web addresses, written as ![caption](https://…). The formatter does not upload files. An image that sits alone in a paragraph is centered with its alt text shown as a caption below it.
  - q: Which code languages are highlighted?
    a: Any language the Shiki highlighter knows, from JavaScript and Python to SQL and Bash. Write the language after the opening fence, for example ```python. Code without a language, or with one Shiki does not recognize, is shown as plain monospaced text.
  - q: Is my draft saved?
    a: Yes, when your browser allows the site to store data. The Markdown box is saved on this device shortly after you stop typing and restored when you come back, so leave a moment before closing the page. The draft is never uploaded. Clearing the site's local data deletes it.
  - q: Can I write HTML inside the Markdown?
    a: No. HTML tags are shown as text instead of being rendered, which also keeps the preview safe. Use Markdown for headings, lists, links, images and tables.
---

## How the WeChat formatter works

The WeChat Official Account editor removes style sheets and class names from pasted content, so all of the article's formatting is written as inline styles. The formatter reads your Markdown with [marked](https://marked.js.org/) and writes each heading, paragraph, list, table, quote and code block with the styles of this site's typography: 16 px text, a line height of 1.75, a neutral palette and system fonts, because the editor cannot load web fonts. Code blocks are highlighted with [Shiki](https://shiki.style/) using the GitHub Light colors.

## Options and limits

- **Markdown:** CommonMark plus GitHub tables, task lists and strikethrough, up to 200,000 characters. Task list items show ☑ or ☐ because the editor removes checkboxes.
- **Accent color:** neutral, blue, green, orange, red, rose, violet or yellow. It colors the bar beside heading 2, quote borders, inline code, WeChat links and reference numbers; body text stays near-black.
- **Links:** links to mp.weixin.qq.com stay clickable; other http and https links become numbered references at the end of the article. Other links keep only their text.
- **Images:** http and https addresses only; anything else keeps only its alt text.
- **Copying:** both buttons use your browser's clipboard, which needs permission on some browsers; Copy rich text also needs a browser that can copy formatted HTML. If copying fails, allow clipboard access and try again.
- **Not supported:** raw HTML (shown as text), math formulas and diagrams.

## Privacy

Your article is processed only on your device. The page does not upload it, store it on a server or use cookies.
