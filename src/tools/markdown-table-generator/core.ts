import { ToolError, type ToolContext } from "@/lib/tool-contract/define-tool";

export type SourceFormat = "auto" | "csv" | "tsv" | "markdown";
export type Alignment = "none" | "left" | "center" | "right";

export interface TableInput {
  data: string;
  from: SourceFormat;
  header: boolean;
  align: Alignment;
  pad: boolean;
}

interface ParsedTable {
  rows: string[][];
  // 只有 Markdown 来源才有逐列对齐（取自分隔行）
  alignments?: Alignment[];
}

// RFC 4180：引号包住的字段里可以有分隔符和换行，"" 表示一个引号；CRLF、LF、CR 都算换行。
// Excel 和 Google Sheets 复制出来的 TSV 也按这个规则给带换行或引号的单元格加引号。
// 未闭合的引号按宽松处理：一直读到末尾。空行不算记录
export const parseDelimited = (text: string, delimiter: "," | "\t"): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  let started = false;
  const endRow = () => {
    row.push(cell);
    if (row.length > 1 || row[0] !== "" || started) rows.push(row);
    row = [];
    cell = "";
    started = false;
  };
  for (let i = 0; i < text.length; i++) {
    const char = text[i]!;
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += char;
    } else if (char === '"' && cell === "") {
      quoted = true;
      started = true;
    } else if (char === delimiter) {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      endRow();
    } else cell += char;
  }
  if (cell !== "" || row.length > 0 || started) endRow();
  return rows;
};

const delimiterCell = /^\s*:?-+:?\s*$/;

const splitMarkdownRow = (line: string): string[] => {
  let body = line.trim();
  if (body.startsWith("|")) body = body.slice(1);
  if (body.endsWith("|") && !body.endsWith("\\|")) body = body.slice(0, -1);
  // 只在没有转义的 | 处切分，单元格里的 \| 原样保留
  const cells: string[] = [];
  let cell = "";
  for (let i = 0; i < body.length; i++) {
    const char = body[i]!;
    if (char === "\\" && body[i + 1] === "|") {
      cell += "\\|";
      i++;
    } else if (char === "|") {
      cells.push(cell.trim());
      cell = "";
    } else cell += char;
  }
  cells.push(cell.trim());
  return cells;
};

const alignmentOf = (cell: string): Alignment => {
  const value = cell.trim();
  const left = value.startsWith(":");
  const right = value.endsWith(":");
  return left && right ? "center" : right ? "right" : left ? "left" : "none";
};

// 已有的 Markdown 表格：去掉分隔行并记下逐列对齐，单元格内容保持 Markdown 原文
export const parseMarkdownTable = (text: string): ParsedTable => {
  const lines = text.split(/\r\n|\r|\n/).filter((line) => line.trim() !== "");
  const rows = lines.map(splitMarkdownRow);
  const delimiterIndex = rows.findIndex(
    (cells, index) => index > 0 && cells.every((cell) => delimiterCell.test(cell)),
  );
  if (delimiterIndex === -1) return { rows };
  const alignments = rows[delimiterIndex]!.map(alignmentOf);
  rows.splice(delimiterIndex, 1);
  return { rows, alignments };
};

// 第一行非空内容像 Markdown 表格行（以 | 开头），或第二行是分隔行，就当作 Markdown；
// 否则第一行有制表符就是 TSV（电子表格复制出来的），其余按 CSV
export const detectFormat = (text: string): Exclude<SourceFormat, "auto"> => {
  const lines = text.split(/\r\n|\r|\n/).filter((line) => line.trim() !== "");
  const [first = "", second = ""] = lines;
  if (first.trim().startsWith("|")) return "markdown";
  if (second.includes("-") && splitMarkdownRow(second).every((cell) => delimiterCell.test(cell))) {
    return "markdown";
  }
  return first.includes("\t") ? "tsv" : "csv";
};

// CSV / TSV 的单元格是纯文本：| 转义成 \|，单元格内的换行变成 <br>（GFM 表格单元格不能换行）
const escapeCell = (cell: string) =>
  cell
    .trim()
    .replaceAll("|", "\\|")
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .join("<br>");

// 等宽字体下的显示宽度：按字素计算，东亚宽字符（中日韩文字、全角符号）和 emoji 占两格
const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

const wideRanges: readonly (readonly [number, number])[] = [
  [0x1100, 0x115f],
  [0x2e80, 0x303e],
  [0x3041, 0x33ff],
  [0x3400, 0x4dbf],
  [0x4e00, 0x9fff],
  [0xa000, 0xa4cf],
  [0xa960, 0xa97f],
  [0xac00, 0xd7a3],
  [0xf900, 0xfaff],
  [0xfe10, 0xfe19],
  [0xfe30, 0xfe6f],
  [0xff00, 0xff60],
  [0xffe0, 0xffe6],
  [0x1f300, 0x1f64f],
  [0x1f900, 0x1f9ff],
  [0x20000, 0x3fffd],
];

// emoji：默认以 emoji 显示的图形字符、加了 U+FE0F 的、国旗（两个区域指示符）和 keycap（如 1️⃣）
const isEmoji = (grapheme: string) =>
  (/\p{Extended_Pictographic}/u.test(grapheme) &&
    /\p{Emoji_Presentation}|\uFE0F/u.test(grapheme)) ||
  /^\p{Regional_Indicator}{2}$/u.test(grapheme) ||
  /\u20E3/u.test(grapheme);

const isWide = (grapheme: string) => {
  if (isEmoji(grapheme)) return true;
  const code = grapheme.codePointAt(0)!;
  return wideRanges.some(([start, end]) => code >= start && code <= end);
};

export const displayWidth = (text: string): number => {
  let width = 0;
  for (const { segment } of segmenter.segment(text)) width += isWide(segment) ? 2 : 1;
  return width;
};

const padCell = (cell: string, width: number, alignment: Alignment) => {
  const gap = width - displayWidth(cell);
  if (gap <= 0) return cell;
  if (alignment === "right") return " ".repeat(gap) + cell;
  if (alignment === "center") {
    const left = Math.floor(gap / 2);
    return " ".repeat(left) + cell + " ".repeat(gap - left);
  }
  return cell + " ".repeat(gap);
};

const delimiterFor = (alignment: Alignment, width: number) => {
  switch (alignment) {
    case "left":
      return `:${"-".repeat(width - 1)}`;
    case "right":
      return `${"-".repeat(width - 1)}:`;
    case "center":
      return `:${"-".repeat(width - 2)}:`;
    default:
      return "-".repeat(width);
  }
};

export const generateTable = (input: TableInput, _ctx: ToolContext = {}): { markdown: string } => {
  const format = input.from === "auto" ? detectFormat(input.data) : input.from;
  const parsed: ParsedTable =
    format === "markdown"
      ? parseMarkdownTable(input.data)
      : {
          rows: parseDelimited(input.data, format === "tsv" ? "\t" : ",").map((row) =>
            row.map(escapeCell),
          ),
        };
  const rows = parsed.rows.filter((row) => row.some((cell) => cell !== ""));
  if (rows.length === 0) throw new ToolError("empty", { field: "data" });

  // 行的列数不一致时，短的行在末尾补空单元格；没有表头时用一行空表头（GFM 表格必须有表头）
  const columns = Math.max(...rows.map((row) => row.length));
  const filled = rows.map((row) => [...row, ...Array<string>(columns - row.length).fill("")]);
  const [head, ...body] = input.header ? filled : [Array<string>(columns).fill(""), ...filled];
  // 「不指定」对齐时保留 Markdown 来源原有的逐列对齐
  const alignments = Array.from({ length: columns }, (_, index) =>
    input.align === "none" ? (parsed.alignments?.[index] ?? "none") : input.align,
  );

  // 分隔行至少 3 个字符（--- / :-: ），补齐时各列宽度取最宽的单元格
  const widths = alignments.map((_, index) =>
    input.pad ? Math.max(3, ...[head!, ...body].map((row) => displayWidth(row[index]!))) : 3,
  );
  const line = (cells: string[]) =>
    `| ${cells
      .map((cell, index) => (input.pad ? padCell(cell, widths[index]!, alignments[index]!) : cell))
      .join(" | ")} |`;
  const delimiter = `| ${alignments.map((alignment, index) => delimiterFor(alignment, widths[index]!)).join(" | ")} |`;

  return { markdown: [line(head!), delimiter, ...body.map(line)].join("\n") };
};
