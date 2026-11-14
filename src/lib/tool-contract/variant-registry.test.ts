import * as v from "valibot";
import { describe, expect, it } from "vitest";

import type { AnyTool } from "./define-tool";
import type { AnyVariant } from "./define-variant";
import { fileType } from "./file-type";
import { createVariantRegistry } from "./variant-registry";

const tool = {
  id: "converter",
  input: v.object({
    file: v.pipe(v.file(), fileType({ "video/mp4": [".mp4"], "video/webm": [".webm"] })),
    format: v.optional(v.picklist(["mp4", "webm", "mkv"]), "mp4"),
  }),
} as unknown as AnyTool;

const variant = (overrides: Partial<AnyVariant> = {}): AnyVariant => ({
  id: "to-webm",
  tool: "converter",
  preset: { format: "webm" },
  table: { columns: ["codec"], rows: [{ codec: "VP9" }] },
  demand: { query: "to webm", source: "google-autocomplete", checkedAt: "2026-10-23" },
  ...overrides,
});

const register = (...variants: AnyVariant[]) =>
  createVariantRegistry(
    [tool],
    Object.fromEntries(
      variants.map((item) => [`./${item.tool}/variants/${item.id}/variant.ts`, { default: item }]),
    ),
  );

describe("createVariantRegistry", () => {
  it("admits a valid Variant", () => {
    expect(register(variant()).map((item) => item.id)).toEqual(["to-webm"]);
  });

  it("requires directory names to match tool and id", () => {
    expect(() =>
      createVariantRegistry([tool], {
        "./converter/variants/x/variant.ts": { default: variant() },
      }),
    ).toThrow(/目录名/);
  });

  it("rejects presets that fail the input schema or set a file", () => {
    expect(() => register(variant({ preset: { format: "avi" } }))).toThrow(/preset 不满足 input/);
    expect(() => register(variant({ preset: { file: "x" } }))).toThrow(/文件字段/);
    expect(() => register(variant({ preset: { speed: 2 } }))).toThrow(/不是 input 字段/);
  });

  it("rejects a preset equal to the Tool defaults", () => {
    expect(() => register(variant({ preset: { format: "mp4" } }))).toThrow(
      /Tool converter 的默认值/,
    );
    expect(() => register(variant({ preset: {} }))).toThrow(/默认值/);
  });

  it("counts a narrowed source format as a difference", () => {
    const movToMp4 = variant({
      id: "webm-to-mp4",
      preset: { format: "mp4" },
      accept: { file: ["video/webm"] },
    });
    expect(register(movToMp4)).toHaveLength(1);
  });

  it("rejects siblings with the same preset and source", () => {
    expect(() => register(variant(), variant({ id: "webm-converter" }))).toThrow(
      /与Variant converter\/to-webm相同/,
    );
  });

  it("only narrows declared file types", () => {
    expect(() => register(variant({ accept: { file: ["video/avi"] } }))).toThrow(
      /不在 fileType 表里/,
    );
    expect(() => register(variant({ accept: { file: ["video/mp4", "video/webm"] } }))).toThrow(
      /没有收窄/,
    );
    expect(() => register(variant({ accept: { format: ["video/mp4"] } }))).toThrow(/文件字段/);
  });

  it("requires unique data", () => {
    expect(() => register(variant({ table: { columns: ["codec"], rows: [] as never } }))).toThrow(
      /table.rows 不能为空/,
    );
    expect(() =>
      register(variant({ table: { columns: ["codec", "result"], rows: [{ codec: "VP9" }] } })),
    ).toThrow(/一一对应/);
    expect(() =>
      register(variant({ table: { columns: ["codec"], rows: [{ codec: { term: " " } }] } })),
    ).toThrow(/空单元格/);
  });

  it("requires search demand evidence", () => {
    expect(() =>
      register(
        variant({ demand: { query: "", source: "google-autocomplete", checkedAt: "2026-13-40" } }),
      ),
    ).toThrow(/demand.query[\s\S]*demand.checkedAt/);
  });
});
