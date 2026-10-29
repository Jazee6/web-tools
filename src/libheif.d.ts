// libheif-js 只带 Emscripten 生成的完整绑定，这里声明 HEIC 解码用到的最小部分
declare module "libheif-js/libheif-wasm/libheif-bundle.mjs" {
  interface HeifImage {
    get_width(): number;
    get_height(): number;
    display(
      target: { data: Uint8ClampedArray<ArrayBuffer>; width: number; height: number },
      callback: (result: ImageData | null) => void,
    ): void;
  }
  interface HeifDecoder {
    decode(data: Uint8Array | ArrayBuffer): HeifImage[];
  }
  const createLibheif: () => Promise<{ HeifDecoder: new () => HeifDecoder }>;
  export default createLibheif;
}
