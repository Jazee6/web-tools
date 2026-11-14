---
review: reviewed
updated: 2026-11-14
title: Markdown to HTML – Convert Markdown and Preview HTML Online
description: Convert Markdown to clean HTML with heading IDs, an optional full HTML document and syntax highlighting. Free and private — it runs in your browser.
name: Markdown to HTML
answer: Type or paste Markdown and the HTML appears as you write — switch between the preview and the HTML source, then press Copy HTML to copy the code.
action: Convert
fields:
  markdown:
    label: Markdown
    placeholder: "# Title\n\nWrite **Markdown** here…"
  headingIds:
    label: Add heading IDs
  document:
    label: Full HTML document
  highlight:
    label: Syntax highlighting
  theme:
    label: Highlighting theme
    options:
      github-light: GitHub Light
      github-dark: GitHub Dark
      one-dark-pro: One Dark Pro
      vitesse-light: Vitesse Light
output:
  html:
    label: HTML
steps:
  - Type or paste your Markdown into the Markdown box. The HTML updates as you write.
  - Turn on Full HTML document if you need a complete page instead of a fragment.
  - Turn on Syntax highlighting to color code blocks.
  - Pick a Highlighting theme.
  - Open the HTML tab to read the source, or stay on Preview to check how it looks.
  - Press Copy HTML to copy the source code, or Copy rich text to paste the formatted result into an editor such as Google Docs or Word.
faq:
  - q: Is HTML inside my Markdown kept?
    a: Yes. Raw HTML such as <details>, <kbd> or an <img> with a width is copied into the output unchanged, as the CommonMark specification requires. The preview runs in a sandboxed frame without scripts, so a <script> in your Markdown does not run on this page. It is still part of the output and may run wherever you publish the HTML, so only convert Markdown you trust.
  - q: How are heading IDs made?
    a: By the rules GitHub uses for its anchors. The text of the heading, without Markdown or HTML tags, is lowercased; punctuation, symbols and emoji are removed, except hyphens and connector punctuation such as _; and spaces become hyphens. So "What's new in v2.0?" becomes id="whats-new-in-v20". Letters of every script are kept, so Chinese or Cyrillic headings keep their text. A repeated heading gets -1, -2 and so on, and a heading with nothing left, such as one made only of emoji, gets no ID. Turn off Add heading IDs to leave them out.
  - q: What is the difference between a fragment and a full HTML document?
    a: A fragment is just the converted content, ready to paste into a page, a CMS or a template that already has its own <head> and styles. A full HTML document adds <!doctype html>, a <head> with a title taken from the first heading 1 that has text (or "Document" when there is none) and a small default stylesheet, so you can save it as an .html file and open it in a browser.
  - q: How does syntax highlighting work?
    a: Code blocks that name a language after the opening fence, such as ```python, are colored with the Shiki highlighter. Every color is written as an inline style, so the HTML needs no separate stylesheet, although editors that strip inline styles will drop the colors. Code without a language, or with one Shiki does not recognize, stays plain. Highlighting is off by default; code blocks that name a language then get <pre><code class="language-…"> for your own highlighter, and the others plain <pre><code>.
  - q: Is my Markdown saved?
    a: Yes, when your browser allows the site to store data. The Markdown box is saved on this device shortly after you stop typing and restored when you come back. It is never uploaded. Clearing the site's local data deletes it.
---

## How the Markdown to HTML converter works

The converter parses your Markdown with [marked](https://marked.js.org/), following [CommonMark](https://commonmark.org/) plus the GitHub Flavored Markdown extensions for tables, task lists, strikethrough and bare links. It writes the same HTML marked produces, adding GitHub-style heading IDs and, when you turn it on, highlighted code from [Shiki](https://shiki.style/). Conversion runs in a background thread of your browser rather than on the page itself.

## Options and limits

- **Markdown:** up to 200,000 characters.
- **Raw HTML:** kept unchanged and not sanitized. Scripts never run in the preview, but they are part of the output.
- **Heading IDs:** on by default, built by GitHub's anchor rules; repeated headings get -1, -2, and headings with nothing left after that get none.
- **Full HTML document:** off by default; adds a doctype, a title from the first heading 1 and a default stylesheet.
- **Syntax highlighting:** off by default; GitHub Light, GitHub Dark, One Dark Pro or Vitesse Light, with inline colors. The theme and each language's grammar are downloaded the first time they are needed, which can take a moment; if a download fails, for example when you are offline, code blocks stay unhighlighted.
- **Copying:** both buttons use your browser's clipboard, which needs permission on some browsers; Copy rich text also needs a browser that can copy formatted HTML.
- **Not supported:** footnotes, math formulas and diagrams such as Mermaid, which stay as plain text or code blocks. YAML front matter is not removed and is converted like the rest of the Markdown.

## Privacy

Your Markdown is processed only on your device. The page does not upload it, store it on a server or use cookies.
