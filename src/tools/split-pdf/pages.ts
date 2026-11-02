// 页面范围（从 1 开始，含两端）。end 为 undefined 表示到最后一页
export interface PageRange {
  start: number;
  end?: number;
}

const RANGE = /^(\d+)(?:\s*-\s*(\d*))?$/;

// 解析 "1-3, 5, 8-"；空白忽略，逗号分隔的每一段是一个范围。不合法的段落抛出，由 core 报给用户
export const parsePages = (text: string): PageRange[] =>
  text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = RANGE.exec(part);
      if (!match) throw new InvalidPagesError(part);
      const start = Number(match[1]);
      // "8-" 到最后一页；"8" 只有一页
      const end = match[2] === undefined ? start : match[2] === "" ? undefined : Number(match[2]);
      if (start < 1 || (end !== undefined && end < start)) throw new InvalidPagesError(part);
      return { start, end };
    });

export class InvalidPagesError extends Error {
  readonly part: string;

  constructor(part: string) {
    super(part);
    this.part = part;
  }
}

// 转成 PDFium 的页面范围写法（FPDF_ImportPages）：从 1 开始，单页写一个数字
export const toRangeString = ({ start, end }: Required<PageRange>): string =>
  start === end ? String(start) : `${start}-${end}`;
