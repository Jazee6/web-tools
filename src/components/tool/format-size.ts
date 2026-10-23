import { hreflang } from "@/lib/i18n/locales";
import { getLocale } from "@/paraglide/runtime";

// 文件体积按当前 Locale 显示为 KB / MB
export const formatSize = (bytes: number) =>
  new Intl.NumberFormat(hreflang[getLocale()], {
    style: "unit",
    unit: bytes < 1024 * 1024 ? "kilobyte" : "megabyte",
    maximumFractionDigits: 1,
  }).format(bytes / (bytes < 1024 * 1024 ? 1024 : 1024 * 1024));
