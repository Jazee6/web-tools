// 内容近似度（architecture §11 门槛 5）：shingling + Jaccard。近似度只在同一 Tool 的页面之间比较，
// 每组最多几十页，直接算精确的 Jaccard，不需要 MinHash 估算。

// 词元：汉字、假名逐字切分，其他文字按连续的字母数字切成词；标点、空白和 Markdown 符号都被丢弃
const TOKEN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]|[\p{L}\p{N}]+/gu;

export const SHINGLE_SIZE = 3;

export const shingles = (text: string, size = SHINGLE_SIZE): Set<string> => {
  const tokens = text.normalize("NFKC").toLowerCase().match(TOKEN) ?? [];
  const result = new Set<string>();
  for (let index = 0; index + size <= tokens.length; index++) {
    result.add(tokens.slice(index, index + size).join(" "));
  }
  return result;
};

export const jaccard = (a: ReadonlySet<string>, b: ReadonlySet<string>): number => {
  if (a.size === 0 && b.size === 0) return 1;
  let shared = 0;
  for (const shingle of a) if (b.has(shingle)) shared++;
  return shared / (a.size + b.size - shared);
};
