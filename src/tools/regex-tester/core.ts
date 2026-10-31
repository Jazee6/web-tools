import { ToolError } from "@/lib/tool-contract/define-tool";

export interface RegexInput {
  pattern: string;
  flags: string;
  text: string;
}

// 文本上限防止一次测试卡住页面；表格只列前 MAX_ROWS 条，count 仍是全部匹配数
const MAX_TEXT = 100_000;
const MAX_ROWS = 200;
const FLAGS = "dgimsuvy";

const checkFlags = (flags: string) => {
  const unique = new Set(flags);
  if (unique.size !== flags.length || [...unique].some((flag) => !FLAGS.includes(flag))) {
    throw new ToolError("invalid_flags", { field: "flags" });
  }
};

const compile = (pattern: string, flags: string) => {
  try {
    return new RegExp(pattern, flags);
  } catch (error) {
    // u 与 v 同时出现等标志冲突也会落到这里
    throw new ToolError("invalid_pattern", {
      field: "pattern",
      detail: error instanceof Error ? error.message : undefined,
    });
  }
};

// 命名分组时给对象，否则给按序号排列的数组；没参与匹配的分组是 null
const groupsOf = (match: RegExpMatchArray) => {
  if (match.groups) return JSON.stringify(match.groups, (_, value) => value ?? null);
  const captures = match.slice(1);
  return captures.length === 0 ? "" : JSON.stringify(captures.map((value) => value ?? null));
};

export const testRegex = ({ pattern, flags, text }: RegexInput) => {
  if (text.length > MAX_TEXT) throw new ToolError("text_too_long", { field: "text" });
  checkFlags(flags);
  const regex = compile(pattern, flags);
  // 没有 g 时和 JS 一致，只取第一个匹配
  const all = flags.includes("g") ? [...text.matchAll(regex)] : [regex.exec(text)].filter((m) => m);
  return {
    count: all.length,
    matches: all.slice(0, MAX_ROWS).map((match) => ({
      index: match!.index!,
      match: match![0],
      groups: groupsOf(match!),
    })),
  };
};
