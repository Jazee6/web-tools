import { decodeImage } from "@/lib/image/decode";
import { encodeImage } from "@/lib/image/encode";

export interface ConvertImageInput {
  file: File;
  format: "jpeg" | "png" | "webp" | "avif";
  quality: number;
}

const OUTPUT = {
  jpeg: { type: "image/jpeg", extension: ".jpg" },
  png: { type: "image/png", extension: ".png" },
  webp: { type: "image/webp", extension: ".webp" },
  avif: { type: "image/avif", extension: ".avif" },
} as const;

const convertedName = (name: string, extension: string) => {
  const dot = name.lastIndexOf(".");
  return `${dot > 0 ? name.slice(0, dot) : name}${extension}`;
};

export const convertImage = async ({ file, format, quality }: ConvertImageInput) => {
  const output = OUTPUT[format];
  const bytes = await encodeImage(await decodeImage(file), output.type, quality);
  return {
    file: new File([bytes], convertedName(file.name, output.extension), { type: output.type }),
  };
};
