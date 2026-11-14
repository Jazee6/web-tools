import type { HostedFile } from "@/lib/runtime/model-files";
import { ortWasmFile } from "@/lib/runtime/ort-wasm";

// PP-OCRv6 small（Apache-2.0）的检测和识别模型，PaddlePaddle 官方发布的 ONNX，固定到一个 commit（ADR-0023）。
// 识别模型的字典（inference.yml 的 character_dict）由 scripts/ocr-characters.ts 生成 characters.txt
const modelFile = (id: string, revision: string, size: number, sha256: string): HostedFile => ({
  path: `${id}/${revision}/inference.onnx`,
  size,
  sha256,
  source: `https://huggingface.co/${id}/resolve/${revision}/inference.onnx`,
});

export const RECOGNITION_MODEL = {
  id: "PaddlePaddle/PP-OCRv6_small_rec_onnx",
  revision: "b8f84f0b80c529de40b4fbb3544b84fa7233a513",
};

export const detectionFile = modelFile(
  "PaddlePaddle/PP-OCRv6_small_det_onnx",
  "28fe5895c24fd108c19eb3e8479f4ab385fbfc62",
  9_880_512,
  "d73e0058b7a8086bbd57f3d10b8bcd4ff95363f67e06e2762b5e814fe9c9410e",
);

export const recognitionFile = modelFile(
  RECOGNITION_MODEL.id,
  RECOGNITION_MODEL.revision,
  21_159_378,
  "5435fd747c9e0efe15a96d0b378d5bd157e9492ed8fd80edf08f30d02fa24634",
);

export const hostedFiles: HostedFile[] = [detectionFile, recognitionFile, ortWasmFile];
