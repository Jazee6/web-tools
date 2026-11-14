import { describe, expect, it } from "vitest";

import { pageSizes } from "@/lib/pdf/test-helpers";
import { ToolError } from "@/lib/tool-contract/define-tool";

import { loadExampleFile } from "../example-files";
import { mergePdf } from "./core";

const load = (...names: string[]) =>
  Promise.all(names.map((name) => loadExampleFile("merge-pdf", name)));

describe("mergePdf", () => {
  // letter 612×792，slides 两页 960×540，按尺寸核对页序
  it("appends every page in the given order", async () => {
    const { file } = await mergePdf({ files: await load("slides.pdf", "letter.pdf") }, {});
    expect(file.type).toBe("application/pdf");
    expect(await pageSizes(file)).toEqual([
      [960, 540],
      [960, 540],
      [612, 792],
    ]);
  });

  it("rejects password-protected files", async () => {
    const error = await mergePdf({ files: await load("letter.pdf", "encrypted.pdf") }, {}).catch(
      (reason: unknown) => reason,
    );
    expect(error).toBeInstanceOf(ToolError);
    expect(error).toMatchObject({ code: "encrypted", field: "files", detail: "encrypted.pdf" });
  });

  it("rejects files that are not PDFs", async () => {
    const broken = new File(["not a pdf"], "broken.pdf", { type: "application/pdf" });
    const error = await mergePdf({ files: [...(await load("letter.pdf")), broken] }, {}).catch(
      (reason: unknown) => reason,
    );
    expect(error).toMatchObject({ code: "invalid_pdf", field: "files", detail: "broken.pdf" });
  });
});
