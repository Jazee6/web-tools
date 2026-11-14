export type CaseMode =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant";

export interface CaseInput {
  text: string;
  mode: CaseMode;
}

// 标识符风格的分词：连续大写后接「大写+小写」时在最后一个大写前断开（XMLHttp → XML、Http），数字附在前一个词后（utf8、v2）
const IDENTIFIER_WORD =
  /\p{Lu}+(?=\p{Lu}\p{Ll})|\p{Lu}?\p{Ll}+\p{N}*|\p{Lu}+\p{N}*|\p{N}+|\p{L}+/gu;
// 标题大小写的「词」：字母数字串，中间可带撇号（don't），连字符两侧各算一个词
const TITLE_WORD = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
// 句首：全文开头、换行后，或句末标点加空白后（中间可有开引号、括号），后面的小写字母要大写
const SENTENCE_START =
  /(^[^\p{L}\p{N}]*|[\r\n]+[^\p{L}\p{N}\r\n]*|[.!?…]+["'”’)\]]*\s+["'“‘([]*|[。！？]+[」』”’）)\]]*\s*)(\p{Ll})/gu;
const LINE_BREAK = /(\r\n|\r|\n)/;

const capitalize = (word: string) => {
  const [first = "", ...rest] = Array.from(word);
  return first.toUpperCase() + rest.join("").toLowerCase();
};

const words = (line: string) => line.normalize("NFC").match(IDENTIFIER_WORD) ?? [];

const joinWords = (line: string, mode: "camel" | "pascal" | "snake" | "kebab" | "constant") => {
  const parts = words(line);
  switch (mode) {
    case "camel":
      return parts.map((part, i) => (i === 0 ? part.toLowerCase() : capitalize(part))).join("");
    case "pascal":
      return parts.map(capitalize).join("");
    case "snake":
      return parts.map((part) => part.toLowerCase()).join("_");
    case "kebab":
      return parts.map((part) => part.toLowerCase()).join("-");
    case "constant":
      return parts.map((part) => part.toUpperCase()).join("_");
  }
};

export const convertCase = ({ text, mode }: CaseInput) => {
  switch (mode) {
    case "upper":
      return { result: text.toUpperCase() };
    case "lower":
      return { result: text.toLowerCase() };
    case "title":
      return { result: text.replace(TITLE_WORD, capitalize) };
    case "sentence":
      return {
        result: text
          .toLowerCase()
          .replace(
            SENTENCE_START,
            (_, before: string, letter: string) => before + letter.toUpperCase(),
          ),
      };
    default:
      // 标识符风格逐行转换，换行原样保留
      return {
        result: text
          .split(LINE_BREAK)
          .map((part, i) => (i % 2 === 1 ? part : joinWords(part, mode)))
          .join(""),
      };
  }
};
