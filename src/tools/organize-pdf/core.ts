import { expandArrangement, parseArrangement } from "@/lib/pdf/arrangement";
import { InvalidPagesError, toRangeString } from "@/lib/pdf/pages";
import { closeDocument, loadPdfium, openDocument, saveDocument } from "@/lib/pdf/pdfium";
import { type ToolContext, ToolError } from "@/lib/tool-contract/define-tool";

export interface OrganizePdfInput {
  file: File;
  pages: string;
}

const stemOf = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
};

const readArrangement = (text: string) => {
  try {
    return parseArrangement(text);
  } catch (error) {
    if (error instanceof InvalidPagesError) {
      throw new ToolError("invalid_pages", { field: "pages", detail: error.part });
    }
    throw error;
  }
};

// 按排列把页面导入新文档（可以重复、省略的页即删除），再在页面原有的 /Rotate 上叠加旋转
export const organizePdf = async ({ file, pages }: OrganizePdfInput, { signal }: ToolContext) => {
  const ranges = readArrangement(pages);
  // 自己打开一份，不用缩略图缓存的那份：编辑器可能还在渲染缩略图，关掉它会让进行中的一批读到已释放的内存
  const module = await loadPdfium();
  const source = await openDocument(module, file, "file");
  try {
    const total = module.FPDF_GetPageCount(source.document);
    const arranged = expandArrangement(ranges, total);
    if (!arranged) {
      throw new ToolError("page_out_of_range", { field: "pages", detail: String(total) });
    }
    signal?.throwIfAborted();

    const target = module.FPDF_CreateNewDocument();
    try {
      const order = arranged.map(({ page }) => toRangeString({ start: page, end: page })).join(",");
      if (!module.FPDF_ImportPages(target, source.document, order, 0)) {
        throw new Error("PDFium 导入页面失败");
      }
      for (const [index, { rotate }] of arranged.entries()) {
        if (!rotate) continue;
        const page = module.FPDF_LoadPage(target, index);
        if (!page) throw new Error(`PDFium 无法加载第 ${index + 1} 页`);
        // PDFium 的旋转以 90° 为单位：0–3
        module.FPDFPage_SetRotation(page, (module.FPDFPage_GetRotation(page) + rotate / 90) % 4);
        module.FPDF_ClosePage(page);
      }
      const bytes = saveDocument(module, target);
      return {
        file: new File([bytes], `${stemOf(file.name)}-organized.pdf`, {
          type: "application/pdf",
        }),
      };
    } finally {
      module.FPDF_CloseDocument(target);
    }
  } finally {
    closeDocument(module, source);
  }
};
