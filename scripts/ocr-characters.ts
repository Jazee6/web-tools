/// <reference types="bun" />
// 生成 Image to Text 识别模型的字典 src/tools/image-to-text/characters.txt：取固定 revision 的 inference.yml，
// 用 YAML 解析器读出 PostProcess.character_dict（每项一个码位），按顺序拼成一行。升级识别模型后重新运行：
//   bun scripts/ocr-characters.ts
import { join } from "node:path";

import { RECOGNITION_MODEL } from "../src/tools/image-to-text/model";

const { id, revision } = RECOGNITION_MODEL;
const response = await fetch(`https://huggingface.co/${id}/resolve/${revision}/inference.yml`);
if (!response.ok) throw new Error(`下载 inference.yml 失败：HTTP ${response.status}`);
const config = Bun.YAML.parse(await response.text()) as {
  PostProcess: { name: string; character_dict: string[] };
};
const { name, character_dict: characters } = config.PostProcess;
if (name !== "CTCLabelDecode") throw new Error(`后处理不是 CTCLabelDecode：${name}`);
const invalid = characters.filter((character) => [...character].length !== 1);
if (invalid.length > 0) throw new Error(`字典里有不是单个码位的项：${JSON.stringify(invalid)}`);
const target = join(import.meta.dir, "../src/tools/image-to-text/characters.txt");
await Bun.write(target, `${characters.join("")}\n`);
console.log(`✓ ${characters.length} 个字符写入 ${target}`);
