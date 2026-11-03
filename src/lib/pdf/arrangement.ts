import { InvalidPagesError, type PageRange } from "./pages";

// Organize PDF 的页面排列：逗号分隔的页码或范围（语法同 pages.ts），每段可以加顺时针旋转后缀，
// 如 "3, 1-2 r90, 5-"。旋转在页面原有的 /Rotate 上叠加，只作用于这一段输出的页面（同一页出现两次时可以转得不同）。
// 缩略图编辑器在主线程上读写同一个字符串，所以这里不依赖 PDFium
export type Rotation = 0 | 90 | 180 | 270;

export interface ArrangedRange extends PageRange {
  rotate: Rotation;
}

// 编辑器里的一格：一个输出页面
export interface ArrangedPage {
  page: number;
  rotate: Rotation;
}

const ITEM = /^(\d+)(?:\s*-\s*(\d*))?(?:\s*r\s*(90|180|270))?$/i;

export const parseArrangement = (text: string): ArrangedRange[] =>
  text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = ITEM.exec(part);
      if (!match) throw new InvalidPagesError(part);
      const start = Number(match[1]);
      const end = match[2] === undefined ? start : match[2] === "" ? undefined : Number(match[2]);
      if (start < 1 || (end !== undefined && end < start)) throw new InvalidPagesError(part);
      return { start, end, rotate: Number(match[3] ?? 0) as Rotation };
    });

// 展开成逐页的列表；空的排列表示全部页面按原顺序、不旋转。页码超出 total 时返回 undefined
export const expandArrangement = (
  ranges: ArrangedRange[],
  total: number,
): ArrangedPage[] | undefined => {
  if (ranges.length === 0) {
    return Array.from({ length: total }, (_, index) => ({ page: index + 1, rotate: 0 }));
  }
  const pages: ArrangedPage[] = [];
  for (const { start, end = total, rotate } of ranges) {
    if (start > total || end > total) return undefined;
    for (let page = start; page <= end; page++) pages.push({ page, rotate });
  }
  return pages;
};

// 逐页列表写回字符串：连续递增、旋转相同的页合成一段；保持全部页面原样时写成空字符串
export const formatArrangement = (pages: ArrangedPage[], total: number): string => {
  if (pages.length === total && pages.every(({ page, rotate }, i) => page === i + 1 && !rotate)) {
    return "";
  }
  const parts: string[] = [];
  let index = 0;
  while (index < pages.length) {
    const { page: start, rotate } = pages[index]!;
    let end = start;
    while (
      index + 1 < pages.length &&
      pages[index + 1]!.page === end + 1 &&
      pages[index + 1]!.rotate === rotate
    ) {
      end++;
      index++;
    }
    index++;
    const range = start === end ? String(start) : `${start}-${end}`;
    parts.push(rotate ? `${range} r${rotate}` : range);
  }
  return parts.join(", ");
};

export const rotateClockwise = (rotate: Rotation): Rotation => ((rotate + 90) % 360) as Rotation;
