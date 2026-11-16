import { encode, type QrCodeGenerateResult } from "uqr";

import { ToolError } from "@/lib/tool-contract/define-tool";

export type ErrorCorrection = "L" | "M" | "Q" | "H";

export interface QrCodeInput {
  text: string;
  format: "png" | "svg";
  size: number;
  errorCorrection: ErrorCorrection;
  margin: number;
  foreground: string;
  background: string;
  logo?: File;
}

// Logo 的底板（背景色方块）占二维码本体（不含留白）边长的比例，Logo 在底板里留一圈边
const LOGO_PLATE = 0.24;
const LOGO_INSET = 0.02;

// uqr 用 encodeURI 把文本转成 UTF-8；单独的代理项（不成对的 UTF-16）会让它抛 URIError，这时自己按 UTF-8 编码
const encodeText = (text: string, ecc: ErrorCorrection): QrCodeGenerateResult => {
  const options = { ecc, border: 0 };
  try {
    return encode(text, options);
  } catch (error) {
    if (error instanceof URIError) return encode([...new TextEncoder().encode(text)], options);
    throw error;
  }
};

const encodeQr = (text: string, ecc: ErrorCorrection) => {
  try {
    return encodeText(text, ecc);
  } catch (error) {
    // 版本 40 也放不下
    if (error instanceof RangeError) {
      throw new ToolError(ecc === "H" ? "too_long_high" : "too_long", { field: "text" });
    }
    throw error;
  }
};

// 二维码里第 i 条模块边界的像素位置：按整数取整，相邻模块无缝、没有抗锯齿灰边，整张图正好 size 像素
const edge = (i: number, scale: number) => Math.round(i * scale);

const svgEscape = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

const dataUrl = async (file: File) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return `data:${file.type};base64,${btoa(binary)}`;
};

// Logo 区域（单位与坐标系由调用方决定）：底板方块和放 Logo 的内框，都在二维码中心
const logoBoxes = (offset: number, side: number) => {
  const plate = side * LOGO_PLATE;
  const inset = side * LOGO_INSET;
  const start = offset + (side - plate) / 2;
  return { plate: { start, side: plate }, logo: { start: start + inset, side: plate - inset * 2 } };
};

const renderSvg = async (qr: QrCodeGenerateResult, input: QrCodeInput) => {
  const total = qr.size + input.margin * 2;
  const path: string[] = [];
  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.data[y]![x]) path.push(`M${x + input.margin} ${y + input.margin}h1v1h-1z`);
    }
  }
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${input.size}" height="${input.size}" shape-rendering="crispEdges">`,
    `<rect width="${total}" height="${total}" fill="${input.background}"/>`,
    `<path fill="${input.foreground}" d="${path.join("")}"/>`,
  ];
  if (input.logo) {
    // 先确认浏览器能解码，和 PNG 一样对坏文件报错
    (await loadLogo(input.logo)).close();
    const { plate, logo } = logoBoxes(input.margin, qr.size);
    parts.push(
      `<rect x="${plate.start}" y="${plate.start}" width="${plate.side}" height="${plate.side}" fill="${input.background}"/>`,
      `<image x="${logo.start}" y="${logo.start}" width="${logo.side}" height="${logo.side}" preserveAspectRatio="xMidYMid meet" href="${svgEscape(await dataUrl(input.logo))}"/>`,
    );
  }
  parts.push("</svg>");
  return new Blob([parts.join("")], { type: "image/svg+xml" });
};

const loadLogo = async (file: File) => {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new ToolError("logo_decode_failed", { field: "logo" });
  }
};

const renderPng = async (qr: QrCodeGenerateResult, input: QrCodeInput) => {
  const total = qr.size + input.margin * 2;
  const scale = input.size / total;
  const canvas = new OffscreenCanvas(input.size, input.size);
  const context = canvas.getContext("2d")!;
  context.fillStyle = input.background;
  context.fillRect(0, 0, input.size, input.size);
  context.fillStyle = input.foreground;
  for (let y = 0; y < qr.size; y++) {
    const top = edge(y + input.margin, scale);
    const height = edge(y + input.margin + 1, scale) - top;
    for (let x = 0; x < qr.size; x++) {
      if (!qr.data[y]![x]) continue;
      const left = edge(x + input.margin, scale);
      context.fillRect(left, top, edge(x + input.margin + 1, scale) - left, height);
    }
  }
  if (input.logo) {
    const bitmap = await loadLogo(input.logo);
    try {
      const { plate, logo } = logoBoxes(input.margin * scale, qr.size * scale);
      context.fillStyle = input.background;
      context.fillRect(plate.start, plate.start, plate.side, plate.side);
      // 按比例缩进内框，不拉伸
      const ratio = Math.min(logo.side / bitmap.width, logo.side / bitmap.height);
      const width = bitmap.width * ratio;
      const height = bitmap.height * ratio;
      context.imageSmoothingQuality = "high";
      context.drawImage(
        bitmap,
        logo.start + (logo.side - width) / 2,
        logo.start + (logo.side - height) / 2,
        width,
        height,
      );
    } finally {
      bitmap.close();
    }
  }
  return canvas.convertToBlob({ type: "image/png" });
};

export const generateQrCode = async (input: QrCodeInput): Promise<{ file: File }> => {
  // 中心 Logo 遮住部分模块，强制用最高的纠错级别
  const ecc = input.logo ? "H" : input.errorCorrection;
  const qr = encodeQr(input.text, ecc);
  // 每个模块至少 1 像素，否则扫不出来
  if (input.size < qr.size + input.margin * 2) {
    throw new ToolError("too_small", { field: "size" });
  }
  const blob = input.format === "svg" ? await renderSvg(qr, input) : await renderPng(qr, input);
  return { file: new File([blob], `qr-code.${input.format}`, { type: blob.type }) };
};
