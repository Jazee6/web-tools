---
review: draft
updated: 2026-10-31
title: Regex Tester – Test JavaScript Regular Expressions Online
description: Test a JavaScript regular expression against your text and list every match with its position and capture groups. Free and private — it runs in your browser.
name: Regex Tester
answer: Enter a pattern and some text, keep or change the flags, and press Test — every match appears with its position and capture groups right in your browser.
action: Test
fields:
  pattern:
    label: Pattern
    placeholder: '(\d{4})-(\d{2})-(\d{2})'
  flags:
    label: Flags
    placeholder: gi
  text:
    label: Text
    placeholder: Paste the text to search here
output:
  count:
    label: Matches found
  matches:
    label: Matches
    columns:
      index: Position
      match: Match
      groups: Groups
errors:
  invalid_pattern: This pattern is not a valid JavaScript regular expression. Check for unbalanced brackets or parentheses, a quantifier with nothing before it, a stray backslash, or flags that cannot be combined, such as u and v.
  invalid_flags: These flags are not valid. Use only d, g, i, m, s, u, v and y, each at most once.
  text_too_long: The text is longer than 100,000 characters. Test the pattern on a shorter sample.
steps:
  - Type the regular expression into Pattern, without the slashes around it.
  - Keep the Flags as they are (g finds all matches) or change them, for example to gi to ignore case.
  - Paste the text into Text and press Test.
  - Read the number of matches and, in the table, each match with its position and the text captured by each group.
faq:
  - q: Is my text uploaded to a server?
    a: No. The pattern runs entirely in your browser, so neither the pattern nor your text leaves your device. You can even use the page offline once it has loaded.
  - q: Which regular expression syntax does it use?
    a: The one built into your browser's JavaScript engine, as defined by the ECMAScript standard. That includes lookahead and lookbehind, named groups and, with the u or v flag, Unicode property escapes such as \p{L}. It is not the same as PCRE, Python or Java, so features such as possessive quantifiers or inline flags like (?i) may not work.
  - q: What do the flags mean?
    a: g finds all matches instead of only the first, i ignores case, m makes ^ and $ match at every line, s lets the dot match line breaks, u and v turn on Unicode mode (use one of them, not both), y matches only at the exact position where the search starts, and d records the indices of groups. Each flag can be used once.
  - q: Why do I only see one match?
    a: Without the g flag a JavaScript regular expression stops at the first match, and so does this tool. Add g to the Flags field to list all matches.
  - q: What does the Groups column show?
    a: The text captured by each group in parentheses, as JSON. A pattern with plain groups gives an array in order, such as ["2024","02","29"]. A pattern with named groups gives an object, such as {"year":"2024"}. A group that did not take part in the match is shown as null, and the column is empty when the pattern has no groups.
  - q: Why does the page freeze on some patterns?
    a: Some patterns with nested repetition, such as (a+)+$, take exponentially longer as the text grows, and a browser cannot stop a regular expression in the middle of running. If the tab stops responding, close or reload it and simplify the pattern.
---

## What this regex tester does

The tool builds a regular expression from your pattern and flags with the browser's own `RegExp` and runs it once over your text. With the g flag it collects every match with `matchAll`; without it, it takes the first match, exactly as `RegExp.prototype.exec` does. For each match it reports the 0-based position in the text, the matched text and the captured groups. The syntax and behavior are those of your browser, described in the [MDN regular expressions guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions).

## Options and limits

- **Input:** a pattern of up to 1,000 characters and a text of up to 100,000 characters. Neither can be empty.
- **Result size:** the count covers all matches, but the table lists only the first 200.
- **Position:** counted in UTF-16 code units, the way JavaScript counts string indexes, so an emoji takes two positions.
- **Browser differences:** the v flag and some newer syntax work only in current browsers. A pattern that one browser rejects as invalid may be accepted by another.
- **Not included:** replacing text, splitting text and explaining the pattern.

## Privacy

Processing happens only on your device. The page does not upload your pattern or text, store them or use cookies.
