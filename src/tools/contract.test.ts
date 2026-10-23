import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { loadRun, type ToolContext } from "@/lib/tool-contract/define-tool";
import { describeFields } from "@/lib/tool-contract/fields";
import { toolJsonSchemas } from "@/lib/tool-contract/json-schema";

import { hasFileFields, toExampleShape } from "./example-output";
import { tools } from "./registry";

// Server-assisted Tool 的 examples 用同目录 fixtures.ts 导出的假 fetch 跑，不访问网络
const fixtures = import.meta.glob<{ fetch: ToolContext["fetch"] }>("./*/fixtures.ts", {
  eager: true,
});

// 每个 Tool 的 examples 必须满足 schema，并且 run 的结果与期望输出一致（architecture §18）。
// 在 Web Worker 里运行的 Tool 依赖浏览器 API 和 WASM，examples 改由 contract.browser.test.ts 在浏览器里跑。
describe.each(tools.map((tool) => [tool.id, tool] as const))("%s", (_id, tool) => {
  it
    .skipIf(tool.runtime.worker)
    .each(tool.examples.map((example, index) => [index, example] as const))(
    "example %i satisfies the contract",
    async (_, example) => {
      const input = v.parse(tool.input, example.input);
      const run = await loadRun(tool);
      const output = await run(input, { fetch: fixtures[`./${tool.id}/fixtures.ts`]?.fetch });
      expect(toExampleShape(v.parse(tool.output, output), example.output)).toEqual(example.output);
    },
  );

  it("has no Agent Interface when it takes or returns files", () => {
    if (!hasFileFields(tool)) return;
    expect(tool.agent.webmcp).toBe(false);
    expect(tool.agent.remote).toBe(false);
  });

  it("names example files for file inputs only", () => {
    const fileFields = describeFields(tool.input)
      .filter((field) => field.kind === "file")
      .map((field) => field.name);
    for (const example of tool.examples) {
      expect(Object.keys(example.files ?? {}).toSorted()).toEqual(fileFields.toSorted());
    }
  });

  it.skipIf(!tool.agent.webmcp && !tool.agent.remote)("derives JSON Schemas", () => {
    const schemas = toolJsonSchemas(tool);
    expect(schemas.input).toMatchObject({ type: "object" });
    expect(schemas.output).toMatchObject({ type: "object" });
    expect(JSON.stringify(schemas)).not.toContain("widget");
  });

  it("has a fetch fixture when it runs on the server", () => {
    if (tool.runtime.where !== "server") return;
    expect(fixtures[`./${tool.id}/fixtures.ts`]).toBeDefined();
  });

  it("is remote-callable only with JSON-only, server-safe runtime", () => {
    if (!tool.agent.remote) return;
    expect(tool.runtime.worker ?? false).toBe(false);
    expect(tool.runtime.requires ?? []).toEqual([]);
  });
});
