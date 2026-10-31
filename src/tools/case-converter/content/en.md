---
review: draft
updated: 2026-10-31
title: Case Converter – UPPERCASE, Title Case, camelCase, snake_case
description: Change text to uppercase, lowercase, title case or sentence case, or to camelCase, snake_case and other code styles. Free and private — it runs in your browser.
name: Case Converter
answer: Paste your text, choose a case such as Title Case or snake_case and press Convert — the converted text appears right in your browser, ready to copy.
action: Convert
fields:
  text:
    label: Text
    placeholder: Paste or type your text here
  mode:
    label: Case
    options:
      title: Title Case
      sentence: Sentence case
      upper: UPPERCASE
      lower: lowercase
      camel: camelCase
      pascal: PascalCase
      snake: snake_case
      kebab: kebab-case
      constant: CONSTANT_CASE
output:
  result:
    label: Result
steps:
  - Paste or type your text into the Text field.
  - Choose a Case — Title Case, Sentence case, UPPERCASE, lowercase, camelCase, PascalCase, snake_case, kebab-case or CONSTANT_CASE.
  - Press Convert, then copy the result.
faq:
  - q: Is my text uploaded to a server?
    a: No. The conversion runs entirely in your browser, so your text never leaves your device. You can even use the page offline once it has loaded.
  - q: What is the difference between Title Case and Sentence case?
    a: Title Case capitalizes the first letter of every word and lowercases the rest, so "the cat's hat" becomes "The Cat's Hat". Sentence case capitalizes only the first letter of each sentence and of each line, and lowercases everything else, so "THE CAT. IT SLEPT" becomes "The cat. It slept".
  - q: Does Title Case leave small words like "a" and "of" in lowercase?
    a: No. Every word is capitalized, because the tool has no list of exceptions, and style guides disagree about which words to skip. Lowercase the few small words by hand if your style requires it.
  - q: How are words split for camelCase, snake_case and the other code styles?
    a: The text is cut at spaces, punctuation and any other character that is not a letter or digit, and between a lowercase letter and an uppercase one. A run of capitals followed by a lowercase word is split before its last capital, so XMLHttpRequest becomes XML, Http and Request. Digits stay with the word before them, so "utf8" is one word, while a number at the start of a word stands alone. Punctuation is dropped.
  - q: Does it work with several lines?
    a: Yes. The code styles convert each line separately, so every line becomes one identifier and the line breaks stay where they are. That is handy for turning a list of names into constants.
  - q: Does it work with accented and non-English letters?
    a: Yes for every script that has uppercase and lowercase, such as accented Latin, Greek and Cyrillic. The German ß becomes SS in uppercase. Scripts without case, such as Chinese and Japanese, pass through unchanged, and the code styles treat an unbroken run of them as one word.
---

## What this case converter does

Upper and lower case use the browser's standard string conversion, which follows the Unicode case mappings and does not depend on your language settings. Title case finds each word, a run of letters and digits that may contain apostrophes, and capitalizes its first letter. Sentence case lowercases the text, then capitalizes the first letter after a period, exclamation mark, question mark or ellipsis (…) followed by a space, after `。`, `！` and `？`, and at the start of the text and of every line. The code styles split the text into words as described in the questions above and join them with the separator of the chosen style.

## Options and limits

- **Input:** one text at a time, as long as your device can hold it. An empty text is not converted.
- **Case rules:** they are the same for every language. The Turkish dotted and dotless i get no special handling, and the tool does not know proper nouns, acronyms or abbreviations, so "Mr." in sentence case also makes the next word start with a capital.
- **Sentence case:** a dot inside a number or a domain, such as 3.14 or example.com, does not start a new sentence.
- **Code styles:** punctuation is removed, a line with no letters or digits becomes empty, and a name such as "iOS" is split into "i" and "OS".
- **Line breaks:** `\n`, `\r\n` and `\r` are kept as they are.

## Privacy

Processing happens only on your device. The page does not upload your text, store it or use cookies.
