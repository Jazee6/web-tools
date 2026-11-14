// 把识别出的文字框拼成纯文本：按阅读顺序（上到下、左到右）分行，同一行的框按 x 排序拼接。
// 不分栏：多栏版面里左右两栏同一高度的文字会拼进同一行。
import type { Point } from "./image";

export interface TextBox {
  // 外扩后的框（左上、右上、右下、左下），框高与字高相近
  quad: readonly Point[];
  text: string;
}

interface Placed {
  text: string;
  centerY: number;
  left: number;
  height: number;
}

const place = ({ quad, text }: TextBox): Placed => {
  const [p0, , , p3] = quad as [Point, Point, Point, Point];
  return {
    text: text.trim(),
    centerY: quad.reduce((sum, p) => sum + p[1], 0) / quad.length,
    left: Math.min(...quad.map((p) => p[0])),
    // 左边的长度：旋转的文字也按字高算，不用竖直方向的跨度
    height: Math.hypot(p3[0] - p0[0], p3[1] - p0[1]),
  };
};

// 中日文（汉字、假名、全角标点）之间不加空格
const isCjk = (character: string | undefined) =>
  character !== undefined &&
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}　-〿＀-￯]/u.test(character);

const join = (left: string, right: string) =>
  isCjk(left.at(-1)) && isCjk(right[0]) ? left + right : `${left} ${right}`;

interface Line {
  items: Placed[];
  centerY: number;
  height: number;
}

export const toText = (boxes: readonly TextBox[]): string => {
  const placed = boxes.map(place).filter((item) => item.text);
  placed.sort((a, b) => a.centerY - b.centerY || a.left - b.left);
  const lines: Line[] = [];
  for (const item of placed) {
    const line = lines.at(-1);
    // 中心的高度差不到较矮那个框的一半，算同一行
    if (line && Math.abs(item.centerY - line.centerY) < Math.min(item.height, line.height) / 2) {
      line.items.push(item);
      const count = line.items.length;
      line.centerY += (item.centerY - line.centerY) / count;
      line.height = Math.max(line.height, item.height);
    } else {
      lines.push({ items: [item], centerY: item.centerY, height: item.height });
    }
  }
  let text = "";
  for (const [index, line] of lines.entries()) {
    const previous = lines[index - 1];
    if (previous) {
      // 两行之间的空白超过一行字高时当作段落之间，空一行
      const gap = line.centerY - previous.centerY - (line.height + previous.height) / 2;
      text += gap > Math.min(line.height, previous.height) ? "\n\n" : "\n";
    }
    text += line.items
      .toSorted((a, b) => a.left - b.left)
      .map((item) => item.text)
      .reduce(join);
  }
  return text;
};
