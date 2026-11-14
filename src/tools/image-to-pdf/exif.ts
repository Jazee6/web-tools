// EXIF 方向（1–8）：照片按传感器方向存储，标签告诉看图软件怎么摆正。
// JPEG 原样嵌进 PDF 时，PDF 阅读器不看 EXIF，所以要读出方向，在放置图片时自己摆正
export type Orientation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const ORIENTATION_TAG = 0x0112;

// 只扫描 SOS 之前的标记段；没有 EXIF、格式不对或值不在 1–8 时按 1（不旋转）处理
export const jpegOrientation = (bytes: Uint8Array): Orientation => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return 1;
  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) return 1;
    const marker = view.getUint8(offset + 1);
    // 填充字节
    if (marker === 0xff) {
      offset++;
      continue;
    }
    // SOS 之后是压缩数据，EXIF 不会出现在后面
    if (marker === 0xda || marker === 0xd9) return 1;
    const length = view.getUint16(offset + 2);
    if (marker === 0xe1 && length >= 8) {
      const orientation = readExif(view, offset + 4, length - 2);
      if (orientation) return orientation;
    }
    offset += 2 + length;
  }
  return 1;
};

const readExif = (view: DataView, start: number, length: number): Orientation | undefined => {
  const end = Math.min(start + length, view.byteLength);
  // "Exif\0\0"
  if (end - start < 14 || view.getUint32(start) !== 0x45786966 || view.getUint16(start + 4) !== 0) {
    return undefined;
  }
  const tiff = start + 6;
  const order = view.getUint16(tiff);
  if (order !== 0x4949 && order !== 0x4d4d) return undefined;
  const little = order === 0x4949;
  const ifd = tiff + view.getUint32(tiff + 4, little);
  if (ifd + 2 > end) return undefined;
  const count = view.getUint16(ifd, little);
  for (let index = 0; index < count; index++) {
    const entry = ifd + 2 + index * 12;
    if (entry + 12 > end) return undefined;
    if (view.getUint16(entry, little) !== ORIENTATION_TAG) continue;
    // SHORT 类型的值放在条目的值字段开头
    const value = view.getUint16(entry + 8, little);
    return value >= 1 && value <= 8 ? (value as Orientation) : undefined;
  }
  return undefined;
};
