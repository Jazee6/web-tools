import { describe, expect, it } from "vitest";

import type { AnyTool } from "./define-tool";
import { createRegistry } from "./registry";

const module = (id: string, tool: Partial<AnyTool> = {}) => ({
  default: { id, runtime: { where: "client" }, run: async () => () => ({}), ...tool } as AnyTool,
});

describe("createRegistry", () => {
  it("sorts tools by id", () => {
    const tools = createRegistry({
      "/src/tools/b-tool/tool.ts": module("b-tool"),
      "/src/tools/a-tool/tool.ts": module("a-tool"),
    });
    expect(tools.map((tool) => tool.id)).toEqual(["a-tool", "b-tool"]);
  });

  it("requires the directory name to match the id", () => {
    expect(() => createRegistry({ "./x/tool.ts": module("y") })).toThrow(/目录名/);
  });

  it.each(["developer", "zh", "api", "mcp"])("rejects the taken slug %s", (id) => {
    expect(() => createRegistry({ [`./tools/${id}/tool.ts`]: module(id) })).toThrow(/冲突/);
  });

  it("requires either a Web Worker or run", () => {
    const worker = { runtime: { where: "client", worker: true } } as const;
    expect(() => createRegistry({ "./tools/a/tool.ts": module("a", worker) })).toThrow(/二选一/);
    expect(() =>
      createRegistry({ "./tools/a/tool.ts": module("a", { ...worker, run: undefined }) }),
    ).not.toThrow();
  });

  it("rejects non-kebab-case ids", () => {
    expect(() => createRegistry({ "./tools/Foo_Bar/tool.ts": module("Foo_Bar") })).toThrow(
      /kebab-case/,
    );
  });
});
