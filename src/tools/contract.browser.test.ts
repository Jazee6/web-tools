import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { server } from "vitest/browser";

import { runInWorker } from "@/components/tool/tool-worker";

import { loadExampleFile } from "./example-files";
import { toExampleShape } from "./example-output";
import { tools } from "./registry";

// 在 Web Worker 里运行的 Tool 依赖 WASM、OffscreenCanvas 等浏览器能力，examples 在真实浏览器里经 Worker RPC 跑
// （Vitest Browser Mode，Chromium / Firefox / WebKit）。样例文件放在各 Tool 的 examples/ 目录。
const workerTools = tools.filter((tool) => tool.runtime.worker);

// CI 的 Linux 版 WebKit 在同一页面里跑过其他 Tool 的 WASM 后，装不下 Speech to Text 的模型（RangeError: Out of memory），
// 单独分组、终止 Worker 都没用。只在这里跳过：其他引擎照常跑，e2e 和 speech-to-text 自己的 Browser Mode 测试仍覆盖它。
// 不靠 UA 判断：CI 的 WebKit 的 UA 没能被 Linux 匹配到
const skipOnLinuxWebKit = new Set(["speech-to-text"]);
const isLinuxWebKit = server.browser === "webkit" && server.platform === "linux";

describe.each(workerTools.map((tool) => [tool.id, tool] as const))("%s", (_id, tool) => {
  it
    .skipIf(isLinuxWebKit && skipOnLinuxWebKit.has(tool.id))
    .each(tool.examples.map((example, index) => [index, example] as const))(
    "example %i satisfies the contract in a Web Worker",
    async (_, example) => {
      const files = await Promise.all(
        Object.entries(example.files ?? {}).map(
          async ([field, names]) =>
            [
              field,
              typeof names === "string"
                ? await loadExampleFile(tool.id, names)
                : await Promise.all(names.map((name) => loadExampleFile(tool.id, name))),
            ] as const,
        ),
      );
      const input = v.parse(tool.input, { ...example.input, ...Object.fromEntries(files) });
      const output = await runInWorker(tool, input);
      expect(toExampleShape(v.parse(tool.output, output), example.output)).toEqual(example.output);
    },
    60_000,
  );
});
