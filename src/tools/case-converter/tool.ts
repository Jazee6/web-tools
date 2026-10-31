import * as v from "valibot";

import { defineTool } from "@/lib/tool-contract/define-tool";

export default defineTool({
  id: "case-converter",
  category: "developer",
  input: v.object({
    text: v.pipe(v.string(), v.nonEmpty(), v.description("The text to convert")),
    mode: v.optional(
      v.pipe(
        v.picklist([
          "title",
          "sentence",
          "upper",
          "lower",
          "camel",
          "pascal",
          "snake",
          "kebab",
          "constant",
        ]),
        v.description(
          "title capitalizes every word, sentence only the first word of each sentence and line, upper and lower change every letter; camel (camelCase), pascal (PascalCase), snake (snake_case), kebab (kebab-case) and constant (CONSTANT_CASE) split the text into words and join them without spaces, line by line",
        ),
      ),
      "title",
    ),
  }),
  output: v.object({
    result: v.pipe(v.string(), v.description("The converted text")),
  }),
  examples: [
    {
      input: { text: "hello world, this is a test" },
      output: { result: "Hello World, This Is A Test" },
    },
    {
      input: { text: "THIS IS LOUD. and this is not! ok?", mode: "sentence" },
      output: { result: "This is loud. And this is not! Ok?" },
    },
    {
      input: { text: "XMLHttpRequest and user_id-v2", mode: "snake" },
      output: { result: "xml_http_request_and_user_id_v2" },
    },
    {
      input: { text: "first line\nsecond-line", mode: "camel" },
      output: { result: "firstLine\nsecondLine" },
    },
  ],
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: true,
    description:
      "Change the letter case of a text: title (every word capitalized, including after hyphens and apostrophes), sentence (first letter of each sentence and line), upper, lower, or a programming style: camel, pascal, snake, kebab or constant. The programming styles split the text on anything that is not a letter or digit and on lower-to-upper changes (XMLHttp becomes XML and Http), keep digits with the word before them, drop punctuation and convert each line separately. Title and sentence case do not know proper nouns, acronyms or abbreviations such as Mr. Never fails for non-empty text.",
  },
  run: () => import("./core").then((m) => m.convertCase),
});
