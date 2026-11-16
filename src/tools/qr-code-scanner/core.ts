import { formatToLabel, prepareZXingModule, readBarcodes } from "zxing-wasm/reader";
import wasmUrl from "zxing-wasm/reader/zxing_reader.wasm?url";

import { decodeImage } from "@/lib/image/decode";
import { ToolError } from "@/lib/tool-contract/define-tool";

// zxing-wasm 默认从 jsDelivr 下载 .wasm；改成本站自托管的文件，图片和代码都不经第三方（ADR-0002）
prepareZXingModule({
  overrides: { locateFile: (path, prefix) => (path.endsWith(".wasm") ? wasmUrl : prefix + path) },
});

export interface ScanInput {
  file: File;
}

export const scanCodes = async ({ file }: ScanInput) => {
  const image = await decodeImage(file, { reportTooLarge: true });
  const results = await readBarcodes(image, {
    // 空数组表示所有码制：二维码、Data Matrix、PDF417 和各种条形码
    formats: [],
    tryHarder: true,
    maxNumberOfSymbols: 255,
  });
  const codes = results
    .filter((result) => result.isValid)
    // 码制用通用写法（QR Code、EAN-13、Code 128），而不是 zxing 的标识符
    .map((result) => ({
      text: result.text,
      format: formatToLabel(result.format) ?? result.format,
    }));
  if (codes.length === 0) throw new ToolError("not_found", { field: "file" });
  return { codes };
};
