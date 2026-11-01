// 全部 Tool id（目录名就是 id，见 createRegistry）。非 eager：只取路径，不加载模块，
// 这样 /api/e 校验 Tool id 时，新 isolate 不用执行整个注册表。
const paths = Object.keys(import.meta.glob("./*/tool.ts"));

export const toolIds: ReadonlySet<string> = new Set(paths.map((path) => path.split("/")[1]!));

export const isToolId = (id: string): boolean => toolIds.has(id);
