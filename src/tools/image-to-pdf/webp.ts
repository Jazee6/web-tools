// WebP 的图像数据块：VP8 是有损，VP8L 是无损。扩展格式（VP8X）先有 VP8X 块，图像块在后面（RFC 9649）
const fourCC = (bytes: Uint8Array, offset: number) =>
  String.fromCharCode(...bytes.subarray(offset, offset + 4));

export const isLosslessWebp = (bytes: Uint8Array): boolean => {
  if (bytes.length < 20 || fourCC(bytes, 0) !== "RIFF" || fourCC(bytes, 8) !== "WEBP") return false;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const chunk = fourCC(bytes, offset);
    if (chunk === "VP8L") return true;
    // 有损数据，或动画的帧（动画只取第一帧，按有损处理）
    if (chunk === "VP8 " || chunk === "ANMF") return false;
    // 块长度不含 8 字节的块头，奇数长度后面补一个字节
    const size = view.getUint32(offset + 4, true);
    offset += 8 + size + (size % 2);
  }
  return false;
};
