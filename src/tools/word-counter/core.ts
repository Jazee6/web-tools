export interface WordCounterInput {
  text: string;
}

// 汉字、平假名、片假名没有空格分词，逐字计一个词（与 Word 的中日文计数一致）；ー 的 Script 是 Common，要单列
const CJK = /[\p{sc=Han}\p{sc=Hiragana}\p{sc=Katakana}ー]/gu;
const HAS_LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;
const LINE_BREAK = /\r\n|\r|\n/;
// 句末标点：拉丁标点后必须跟空白或结尾（3.14、example.com 不断句），可带收尾引号和括号；全角标点任何位置都断句
const SENTENCE_END = /[.!?…]+["'”’)\]]*(?=\s|$)|[。！？]+[」』”’）)\]]*/gu;

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });

const countWords = (text: string) => {
  let words = 0;
  const rest = text.replace(CJK, () => {
    words += 1;
    return " ";
  });
  for (const token of rest.split(/\s+/)) if (HAS_LETTER_OR_DIGIT.test(token)) words += 1;
  return words;
};

const countParagraphs = (lines: string[]) => {
  let paragraphs = 0;
  let inside = false;
  for (const line of lines) {
    const blank = line.trim() === "";
    if (!blank && !inside) paragraphs += 1;
    inside = !blank;
  }
  return paragraphs;
};

export const countText = ({ text }: WordCounterInput) => {
  let characters = 0;
  let charactersNoSpaces = 0;
  for (const { segment } of graphemes.segment(text)) {
    characters += 1;
    if (!/^\s+$/u.test(segment)) charactersNoSpaces += 1;
  }
  // 末尾的换行只结束最后一行，不开启新的一行
  const lines = text.replace(/(?:\r\n|\r|\n)$/, "").split(LINE_BREAK);
  return {
    words: countWords(text),
    characters,
    charactersNoSpaces,
    bytes: new TextEncoder().encode(text).length,
    lines: lines.length,
    sentences: text.split(SENTENCE_END).filter((part) => HAS_LETTER_OR_DIGIT.test(part)).length,
    paragraphs: countParagraphs(lines),
  };
};
