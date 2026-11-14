// 文字识别（PP-OCRv6 rec）的预处理和 CTC 解码，对照 PaddleX 3.7 的 OCRReisizeNormImg 和 CTCLabelDecode。
import characterList from "./characters.txt?raw";
import { type Rgba, resizeToPlanes } from "./image";

export const HEIGHT = 48;
// 宽度至少 320（宽高比 20:3），最多 3200
const MIN_WIDTH = 320;
const MAX_WIDTH = 3200;

// 模型输出的类别：0 是 CTC 的 blank，1–18708 是字典里的字符，最后一个是空格（use_space_char）
// 只去掉文件末尾的换行：字典里有全角空格（U+3000），trim() 会把它当空白去掉
const characters = [...characterList.replace(/\n$/, "")];

export const characterCount = characters.length;

export const recognitionInput = (line: Rgba) => {
  const ratio = line.width / line.height;
  const padTo = Math.min(MAX_WIDTH, Math.trunc(HEIGHT * Math.max(MIN_WIDTH / HEIGHT, ratio)));
  const width = Math.min(padTo, Math.ceil(HEIGHT * ratio));
  // 归一化到 [-1, 1]；右侧补 0（相当于中灰）
  const planes = resizeToPlanes(line, width, HEIGHT, (value) => value / 127.5 - 1, padTo, 0);
  return { width: padTo, planes };
};

// 每个时间步取概率最大的类别，合并相邻重复、去掉 blank；score 是保留下来的各步概率的平均值
export const decode = (probabilities: Float32Array, steps: number, classes: number) => {
  let text = "";
  let sum = 0;
  let count = 0;
  let previous = -1;
  for (let step = 0; step < steps; step++) {
    let best = 0;
    let bestValue = -Infinity;
    const offset = step * classes;
    for (let index = 0; index < classes; index++) {
      const value = probabilities[offset + index]!;
      if (value > bestValue) {
        bestValue = value;
        best = index;
      }
    }
    if (best !== 0 && best !== previous) {
      text += best <= characters.length ? characters[best - 1] : " ";
      sum += bestValue;
      count++;
    }
    previous = best;
  }
  return { text, score: count ? sum / count : 0 };
};
