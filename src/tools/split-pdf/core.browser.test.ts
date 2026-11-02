import { describe, expect, it } from "vitest";

import { pageSizes } from "@/lib/pdf/test-helpers";

import { loadExampleFile } from "../example-files";
import { splitPdf } from "./core";

// report.pdf 有 5 页，宽度依次是 200、300、400、500、600 pt，高度都是 400 pt
const report = () => loadExampleFile("split-pdf", "report.pdf");
const widths = async (file: File) => (await pageSizes(file)).map(([width]) => width);

describe("splitPdf", () => {
  it("writes every page to its own file when no pages are given", async () => {
    const { files } = await splitPdf({ file: await report(), pages: "", mode: "separate" }, {});
    expect(files.map((file) => file.name)).toEqual(
      [1, 2, 3, 4, 5].map((page) => `report-${page}.pdf`),
    );
    expect(await Promise.all(files.map(widths))).toEqual([[200], [300], [400], [500], [600]]);
    expect(files.every((file) => file.type === "application/pdf")).toBe(true);
  });

  it("writes one file per range and runs an open range to the last page", async () => {
    const { files } = await splitPdf(
      { file: await report(), pages: "1-2, 4-", mode: "separate" },
      {},
    );
    expect(files.map((file) => file.name)).toEqual(["report-1-2.pdf", "report-4-5.pdf"]);
    expect(await Promise.all(files.map(widths))).toEqual([
      [200, 300],
      [500, 600],
    ]);
  });

  it("combines pages in the order given and allows repeats", async () => {
    const { files } = await splitPdf(
      { file: await report(), pages: "5, 1-2, 1", mode: "combined" },
      {},
    );
    expect(files.map((file) => file.name)).toEqual(["report-extracted.pdf"]);
    expect(await widths(files[0]!)).toEqual([600, 200, 300, 200]);
  });

  it("requires pages in combined mode", async () => {
    await expect(
      splitPdf({ file: await report(), pages: " ", mode: "combined" }, {}),
    ).rejects.toMatchObject({ code: "pages_required", field: "pages" });
  });

  it("rejects malformed pages and names the part", async () => {
    await expect(
      splitPdf({ file: await report(), pages: "1, 3-2", mode: "separate" }, {}),
    ).rejects.toMatchObject({ code: "invalid_pages", field: "pages", detail: "3-2" });
  });

  it.each(["6", "2-6", "6-"])("reports the page count when %s does not exist", async (pages) => {
    await expect(
      splitPdf({ file: await report(), pages, mode: "separate" }, {}),
    ).rejects.toMatchObject({ code: "page_out_of_range", field: "pages", detail: "5" });
  });

  it("limits the number of output files", async () => {
    const pages = Array.from({ length: 501 }, () => "1").join(",");
    await expect(
      splitPdf({ file: await report(), pages, mode: "separate" }, {}),
    ).rejects.toMatchObject({ code: "too_many_files", field: "pages" });
  });

  it("rejects password-protected files", async () => {
    const encrypted = await loadExampleFile("merge-pdf", "encrypted.pdf");
    await expect(
      splitPdf({ file: encrypted, pages: "", mode: "separate" }, {}),
    ).rejects.toMatchObject({ code: "encrypted", field: "file", detail: "encrypted.pdf" });
  });

  it("rejects files that are not PDFs", async () => {
    const broken = new File(["not a pdf"], "broken.pdf", { type: "application/pdf" });
    await expect(splitPdf({ file: broken, pages: "", mode: "separate" }, {})).rejects.toMatchObject(
      { code: "invalid_pdf", field: "file", detail: "broken.pdf" },
    );
  });

  it("stops when aborted", async () => {
    const controller = new AbortController();
    const running = splitPdf(
      { file: await report(), pages: "", mode: "separate" },
      { signal: controller.signal, onProgress: () => controller.abort() },
    );
    await expect(running).rejects.toMatchObject({ name: "AbortError" });
  });
});
