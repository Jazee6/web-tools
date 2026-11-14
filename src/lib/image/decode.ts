import { ToolError } from "@/lib/tool-contract/define-tool";

// libheif（HEIC 解码，含 HEVC）编译成的 WASM，首次遇到 HEIC 时加载并初始化一次
let libheif: Promise<
  Awaited<ReturnType<typeof import("libheif-js/libheif-wasm/libheif-bundle.mjs").default>>
>;

const decodeHeic = async (file: File): Promise<ImageData> => {
  libheif ??= import("libheif-js/libheif-wasm/libheif-bundle.mjs").then((m) => m.default());
  const [image] = new (await libheif).HeifDecoder().decode(await file.arrayBuffer());
  if (!image) throw new Error("HEIC 文件里没有图像");
  const width = image.get_width();
  const height = image.get_height();
  const decoded = await new Promise<ImageData | null>((resolve) =>
    image.display({ data: new Uint8ClampedArray(width * height * 4), width, height }, resolve),
  );
  if (!decoded) throw new Error("HEIC 解码失败");
  // libheif 回调给的是只有 data / width / height 的普通对象，putImageData 要真正的 ImageData
  return new ImageData(decoded.data, width, height);
};

// 画布放不下解码后的像素（浏览器的画布面积上限各不相同，手机上更小）
class CanvasLimitError extends Error {}

// 原生 API 解码（createImageBitmap 会按 EXIF 方向摆正）
const decodeNative = async (file: File): Promise<ImageData> => {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new CanvasLimitError();
    context.drawImage(bitmap, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
  } catch (error) {
    throw new CanvasLimitError(undefined, { cause: error });
  } finally {
    bitmap.close();
  }
};

export const isHeic = (file: File) => file.type === "image/heic" || file.type === "image/heif";

export interface DecodeOptions {
  // 报错时指向的字段
  field?: string;
  // 画布放不下时报 too_large；不设时与读不出来一样报 decode_failed（Tool 的内容里要有对应的错误文案）
  reportTooLarge?: boolean;
}

// 解码成像素；HEIC 用 libheif，其余用浏览器。读不出来时报 decode_failed
export const decodeImage = async (
  file: File,
  { field = "file", reportTooLarge = false }: DecodeOptions = {},
): Promise<ImageData> => {
  try {
    return await (isHeic(file) ? decodeHeic(file) : decodeNative(file));
  } catch (error) {
    if (reportTooLarge && error instanceof CanvasLimitError) {
      throw new ToolError("too_large", { field });
    }
    throw new ToolError("decode_failed", { field });
  }
};
