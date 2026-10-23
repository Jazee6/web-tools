import { describe, expect, it } from "vitest";

import { ToolError } from "@/lib/tool-contract/define-tool";

import { loadExampleFile } from "../example-files";
import { loadPdfium, mergePdf } from "./core";

const load = (...names: string[]) =>
  Promise.all(names.map((name) => loadExampleFile("merge-pdf", name)));

// 用 PDFium 读回合并结果的页面尺寸，按尺寸核对页序（letter 612×792，slides 两页 960×540）
const pageSizes = async (file: File) => {
  const module = await loadPdfium();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pointer = module.pdfium.wasmExports.malloc(bytes.length);
  const size = module.pdfium.wasmExports.malloc(8);
  module.pdfium.HEAPU8.set(bytes, pointer);
  const document = module.FPDF_LoadMemDocument(pointer, bytes.length, "");
  try {
    return Array.from({ length: module.FPDF_GetPageCount(document) }, (_, index) => {
      module.FPDF_GetPageSizeByIndexF(document, index, size);
      return [module.pdfium.getValue(size, "float"), module.pdfium.getValue(size + 4, "float")];
    });
  } finally {
    module.FPDF_CloseDocument(document);
    module.pdfium.wasmExports.free(size);
    module.pdfium.wasmExports.free(pointer);
  }
};

describe("mergePdf", () => {
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
