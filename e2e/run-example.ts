import { expect, type Page } from "@playwright/test";
import * as v from "valibot";

import type { AnyTool, ExampleFile } from "../src/lib/tool-contract/define-tool";
import { describeFields } from "../src/lib/tool-contract/fields";

// 在 Tool 页上按 examples 填表、提交并核对输出（tools.spec.ts 的冒烟测试和 offline.spec.ts 共用）

const fill = async (page: Page, name: string, kind: string, value: unknown) => {
  const field = page.locator(`[data-field="${name}"]`);
  switch (kind) {
    case "boolean": {
      const control = field.getByRole("switch");
      if ((await control.getAttribute("aria-checked")) !== String(value)) await control.click();
      return;
    }
    case "select":
      await field.locator('[data-slot="select-trigger"]').click();
      // 关闭的下拉仍留在 DOM 里，两个下拉有同名选项时（单位换算的 From / To）只点打开的那个
      await page.locator(`[data-option="${String(value)}"]:visible`).click();
      return;
    default:
      await field.locator("textarea, input").fill(String(value));
  }
};

export const expectOutput = async (page: Page, tool: AnyTool, output: Record<string, unknown>) => {
  for (const spec of describeFields(tool.output)) {
    const field = page.locator(`[data-output="${spec.name}"]`);
    const value = output[spec.name];
    if (spec.kind === "file" || spec.kind === "files") {
      // 文件输出（多文件逐个）只比较 MIME 类型和体积上限
      const expected = [value].flat() as ExampleFile[];
      const links = field.locator("a[download]");
      await expect(links).toHaveCount(expected.length);
      for (const [index, { type, maxSize }] of expected.entries()) {
        const link = links.nth(index);
        await expect(link).toHaveAttribute("data-type", type);
        if (maxSize !== undefined) {
          expect(Number(await link.getAttribute("data-size"))).toBeLessThanOrEqual(maxSize);
        }
      }
      continue;
    }
    if (spec.kind !== "table") {
      await expect(field.locator("textarea, input")).toHaveValue(String(value));
      continue;
    }
    const rows = value as Record<string, unknown>[];
    // 空表只有一行占位
    await expect(field.locator("tbody tr")).toHaveCount(Math.max(rows.length, 1));
    for (const [index, row] of rows.entries()) {
      await expect(field.locator("tbody tr").nth(index).locator("td")).toHaveText(
        spec.columns.map((column) => String(row[column])),
      );
    }
  }
};

export const runExample = async (
  page: Page,
  tool: AnyTool,
  example: AnyTool["examples"][number],
) => {
  // 等待 Tool island 水合完成
  await page.waitForSelector("[data-hydrated]");
  // 文件字段从 examples/ 选择样例文件，其余字段取示例值或 schema 默认值
  const input = { ...v.getDefaults(tool.input), ...example.input } as Record<string, unknown>;
  for (const spec of describeFields(tool.input)) {
    if (spec.kind === "file" || spec.kind === "files") {
      const names = [example.files![spec.name]].flat();
      await page
        .locator(`[data-field="${spec.name}"] input[type="file"]`)
        .setInputFiles(names.map((name) => `src/tools/${tool.id}/examples/${name}`));
      continue;
    }
    await fill(page, spec.name, spec.kind, input[spec.name]);
  }
  await page.locator('button[type="submit"]').click();
  // Worker Tool 可能要先下载 WASM 或模型，等输出出现再逐项比较
  if (tool.runtime.worker) {
    await expect(page.locator("[data-output]").first()).toBeVisible({ timeout: 90_000 });
  }
  await expectOutput(page, tool, example.output);
};
