---
review: draft
updated: 2026-10-31
title: Word Counter – Count Words, Characters and Sentences Online
description: Count the words, characters, bytes, lines, sentences and paragraphs of any text, Chinese and Japanese included. Free and private — it runs in your browser.
name: Word Counter
answer: Paste your text and press Count — words, characters with and without spaces, bytes, lines, sentences and paragraphs appear right in your browser.
action: Count
fields:
  text:
    label: Text
    placeholder: Paste or type your text here
output:
  words:
    label: Words
  characters:
    label: Characters
  charactersNoSpaces:
    label: Characters (no spaces)
  bytes:
    label: Bytes (UTF-8)
  lines:
    label: Lines
  sentences:
    label: Sentences
  paragraphs:
    label: Paragraphs
steps:
  - Paste or type your text into the Text field.
  - Press Count.
  - Read the numbers you need — Words, Characters, Characters (no spaces), Bytes (UTF-8), Lines, Sentences or Paragraphs.
faq:
  - q: Is my text uploaded to a server?
    a: No. The counting runs entirely in your browser, so your text never leaves your device. You can even use the page offline once it has loaded.
  - q: How are words counted?
    a: A word is any run of characters between spaces or line breaks that contains a letter or a digit, so "well-known", "don't" and "3.14" are one word each, and a lone dash is none. Chinese characters and Japanese kana and kanji have no spaces between words, so each of them counts as one word, the way Microsoft Word counts them. Korean is separated by spaces, so it is counted like English.
  - q: Why is the character count lower than the number of code units in my text?
    a: Characters are counted the way a reader sees them. An emoji such as 😀, a family emoji made of several joined emoji, or a letter followed by an accent mark each count as one character, and a Windows line break (CRLF) counts as one. Spaces, tabs and line breaks are included in Characters and left out of Characters (no spaces).
  - q: Why do bytes differ from characters?
    a: Bytes are the size of the text when saved as UTF-8. English letters take 1 byte, accented letters 2, most Chinese and Japanese characters 3 and emoji 4. This is the number that matters for limits on file size or database fields.
  - q: How does the tool count sentences?
    a: A sentence ends at a period, exclamation mark, question mark or ellipsis (…) followed by a space or the end of the text, or at 。, ！ or ？ in Chinese and Japanese. A number such as 3.14 or a domain such as example.com does not end a sentence, but an abbreviation such as "Mr." does, so texts full of abbreviations are counted high.
  - q: What counts as a paragraph?
    a: A block of text separated from the next one by at least one blank line; a line with only spaces counts as blank. Lines counts every line, blank ones included, and a line break at the very end of the text does not add another line.
---

## What this word counter does

The tool reads your text once and reports seven numbers. Characters are counted as grapheme clusters, the units a reader sees as single characters, using the browser's `Intl.Segmenter` following [Unicode Standard Annex #29](https://www.unicode.org/reports/tr29/). Words, sentences and paragraphs follow fixed rules that do not depend on your browser or language settings, so the same text gives the same numbers everywhere. Bytes are measured by encoding the text as UTF-8.

## Options and limits

- **Input:** one text at a time, as long as your device can hold it. An empty text is not counted.
- **Words:** whitespace-separated tokens that contain a letter or a digit. Chinese characters, Japanese kana and kanji count one word each; Thai and other scripts written without spaces are counted as whitespace-separated tokens, so their word count is too low.
- **Sentences:** counted from punctuation, so abbreviations such as "Mr." or "e.g." end a sentence, and text without punctuation counts as one sentence.
- **Line breaks:** `\n`, `\r\n` and `\r` all start a new line.
- **Not included:** reading time, speaking time and keyword density.

## Privacy

Processing happens only on your device. The page does not upload your text, store it or use cookies.
