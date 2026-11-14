import { hreflang } from "@/lib/i18n/locales";
import { getLocale } from "@/paraglide/runtime";

// 文件体积按当前 Locale 显示为 KB / MB
export const formatSize = (bytes: number) =>
  new Intl.NumberFormat(hreflang[getLocale()], {
    style: "unit",
    unit: bytes < 1024 * 1024 ? "kilobyte" : "megabyte",
    maximumFractionDigits: 1,
  }).format(bytes / (bytes < 1024 * 1024 ? 1024 : 1024 * 1024));

// 体积变化率，如 -72% / +8%
export const formatChange = (before: number, after: number) =>
  new Intl.NumberFormat(hreflang[getLocale()], {
    style: "percent",
    maximumFractionDigits: 0,
    signDisplay: "exceptZero",
  }).format(before > 0 ? (after - before) / before : 0);
