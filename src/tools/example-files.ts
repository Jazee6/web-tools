// 浏览器测试共用：按文件名读取 src/tools/<id>/examples/ 下的样例文件
const exampleFiles = import.meta.glob<string>("./*/examples/*", {
  query: "?url",
  import: "default",
  eager: true,
});

export const loadExampleFile = async (toolId: string, name: string): Promise<File> => {
  const url = exampleFiles[`./${toolId}/examples/${name}`];
  if (!url) throw new Error(`缺少样例文件 src/tools/${toolId}/examples/${name}`);
  const blob = await (await fetch(url)).blob();
  return new File([blob], name, { type: blob.type });
};
