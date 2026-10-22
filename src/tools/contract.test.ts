import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { toolJsonSchemas } from "@/lib/tool-contract/json-schema";

import { tools } from "./registry";

// 每个 Tool 的 examples 必须满足 schema，并且 run 的结果与期望输出一致（architecture §18）
describe.each(tools.map((tool) => [tool.id, tool] as const))("%s", (_id, tool) => {
  it.each(tool.examples.map((example, index) => [index, example] as const))(
    "example %i satisfies the contract",
    async (_, example) => {
      const input = v.parse(tool.input, example.input);
      const run = await tool.run();
      const output = await run(input, {});
      expect(v.parse(tool.output, output)).toEqual(example.output);
    },
  );

  it("derives JSON Schemas", () => {
    const schemas = toolJsonSchemas(tool);
    expect(schemas.input).toMatchObject({ type: "object" });
    expect(schemas.output).toMatchObject({ type: "object" });
    expect(JSON.stringify(schemas)).not.toContain("widget");
  });

  it("is remote-callable only with JSON-only, server-safe runtime", () => {
    if (!tool.agent.remote) return;
    expect(tool.runtime.worker ?? false).toBe(false);
    expect(tool.runtime.requires ?? []).toEqual([]);
  });
});
