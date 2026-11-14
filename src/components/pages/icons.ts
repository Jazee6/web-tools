// 首页用的 Tool / Category 图标。键必须覆盖全部 Tool id，新增 Tool 时漏配会在构建期报错。
import {
  ArrowRightLeft,
  AudioLines,
  Binary,
  Braces,
  CaseSensitive,
  Dices,
  Clapperboard,
  Clock,
  Code,
  Crop,
  Eraser,
  Files,
  FileImage,
  FileMusic,
  FileStack,
  FileText,
  FileVideo,
  Film,
  Globe,
  Hash,
  Image,
  ImageDown,
  Images,
  KeyRound,
  Link,
  type LucideIcon,
  Mic,
  Palette,
  Regex,
  Ruler,
  Scaling,
  ScanText,
  Scissors,
  Server,
  WholeWord,
} from "lucide-react";

import type { CategoryId } from "@/categories/categories";
import { toolIds } from "@/tools/tool-ids";

export const categoryIcons: Record<CategoryId, LucideIcon> = {
  developer: Code,
  image: Image,
  pdf: FileText,
  media: Clapperboard,
};

const toolIcons: Record<string, LucideIcon> = {
  "audio-converter": AudioLines,
  "background-remover": Eraser,
  "base64-encode-decode": Binary,
  "case-converter": CaseSensitive,
  "color-converter": Palette,
  "dns-lookup": Globe,
  "extract-audio": FileMusic,
  "hash-generator": Hash,
  "http-header-checker": Server,
  "image-compressor": ImageDown,
  "image-converter": ArrowRightLeft,
  "image-cropper": Crop,
  "image-resizer": Scaling,
  "image-to-pdf": Images,
  "image-to-text": ScanText,
  "json-formatter": Braces,
  "jwt-decoder": KeyRound,
  "merge-pdf": Files,
  "organize-pdf": FileStack,
  "pdf-to-image": FileImage,
  "regex-tester": Regex,
  "speech-to-text": Mic,
  "split-pdf": Scissors,
  "timestamp-converter": Clock,
  "trim-video": FileVideo,
  "unit-converter": Ruler,
  "url-encode-decode": Link,
  "uuid-generator": Dices,
  "video-converter": Film,
  "word-counter": WholeWord,
};

const missing = [...toolIds].filter((id) => !toolIcons[id]);
if (missing.length > 0) throw new Error(`首页缺少 Tool 图标：${missing.join(", ")}`);

export const toolIcon = (id: string): LucideIcon => toolIcons[id]!;
