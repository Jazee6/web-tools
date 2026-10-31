import * as v from "valibot";

import { defineTool } from "@/lib/tool-contract/define-tool";

export default defineTool({
  id: "word-counter",
  category: "developer",
  input: v.object({
    text: v.pipe(v.string(), v.nonEmpty(), v.description("The text to count")),
  }),
  output: v.object({
    words: v.pipe(
      v.number(),
      v.description(
        "Words separated by whitespace that contain a letter or digit; every Chinese character, Japanese kana and kanji counts as one word",
      ),
    ),
    characters: v.pipe(
      v.number(),
      v.description(
        "Characters as a reader sees them (an emoji or a letter with an accent counts once), including spaces and line breaks",
      ),
    ),
    charactersNoSpaces: v.pipe(
      v.number(),
      v.description("The same count without spaces, tabs and line breaks"),
    ),
    bytes: v.pipe(v.number(), v.description("Size of the text in bytes when saved as UTF-8")),
    lines: v.pipe(
      v.number(),
      v.description("Lines, blank ones included; a final line break does not start a new line"),
    ),
    sentences: v.pipe(
      v.number(),
      v.description(
        "Sentences, counted by . ! ? … followed by a space or the end, and by 。！？ anywhere; abbreviations such as Mr. also end a sentence",
      ),
    ),
    paragraphs: v.pipe(
      v.number(),
      v.description("Blocks of text separated by one or more blank lines"),
    ),
  }),
  examples: [
    {
      input: { text: "Hello, world! This is a test." },
      output: {
        words: 6,
        characters: 29,
        charactersNoSpaces: 24,
        bytes: 29,
        lines: 1,
        sentences: 2,
        paragraphs: 1,
      },
    },
    {
      input: { text: "First paragraph.\nStill the first.\n\nSecond paragraph?\n" },
      output: {
        words: 7,
        characters: 53,
        charactersNoSpaces: 45,
        bytes: 53,
        lines: 4,
        sentences: 3,
        paragraphs: 2,
      },
    },
    {
      input: { text: "你好，世界！今天天气很好。Hello 😀" },
      output: {
        words: 11,
        characters: 20,
        charactersNoSpaces: 19,
        bytes: 49,
        lines: 1,
        sentences: 3,
        paragraphs: 1,
      },
    },
  ],
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: true,
    description:
      "Count the words, characters (with and without spaces), UTF-8 bytes, lines, sentences and paragraphs of a text. Words are whitespace-separated tokens containing a letter or digit, and each Chinese character or Japanese kana counts as one word. Characters are what a reader sees, so an emoji counts once. Sentences end at . ! ? … followed by whitespace or the end, or at 。！？; abbreviations such as Mr. also end a sentence. Paragraphs are separated by blank lines. Never fails for non-empty text.",
  },
  run: () => import("./core").then((m) => m.countText),
});
