import { describe, expect, it } from "vitest";

import type { AnyTool } from "./define-tool";
import { createRegistry } from "./registry";

const module = (id: string) => ({ default: { id } as AnyTool });

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

  it("rejects non-kebab-case ids", () => {
    expect(() => createRegistry({ "./tools/Foo_Bar/tool.ts": module("Foo_Bar") })).toThrow(
      /kebab-case/,
    );
  });
});
