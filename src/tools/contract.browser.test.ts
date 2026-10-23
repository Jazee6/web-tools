import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { runInWorker } from "@/components/tool/tool-worker";

import { toExampleShape } from "./example-output";
import { tools } from "./registry";

// 在 Web Worker 里运行的 Tool 依赖 WASM、OffscreenCanvas 等浏览器能力，examples 在真实浏览器里经 Worker RPC 跑
// （Vitest Browser Mode，Chromium / Firefox / WebKit）。样例文件放在各 Tool 的 examples/ 目录。
const exampleFiles = import.meta.glob<string>("./*/examples/*", {
  query: "?url",
  import: "default",
  eager: true,
});

const loadFile = async (toolId: string, name: string): Promise<File> => {
  const url = exampleFiles[`./${toolId}/examples/${name}`];
  if (!url) throw new Error(`缺少样例文件 src/tools/${toolId}/examples/${name}`);
  const blob = await (await fetch(url)).blob();
  return new File([blob], name, { type: blob.type });
};

const workerTools = tools.filter((tool) => tool.runtime.worker);

describe.each(workerTools.map((tool) => [tool.id, tool] as const))("%s", (_id, tool) => {
  it.each(tool.examples.map((example, index) => [index, example] as const))(
    "example %i satisfies the contract in a Web Worker",
    async (_, example) => {
      const files = await Promise.all(
        Object.entries(example.files ?? {}).map(
          async ([field, name]) => [field, await loadFile(tool.id, name)] as const,
        ),
      );
      const input = v.parse(tool.input, { ...example.input, ...Object.fromEntries(files) });
      const output = await runInWorker(tool, input);
      expect(toExampleShape(v.parse(tool.output, output), example.output)).toEqual(example.output);
    },
    60_000,
  );
});
