import { ToolError } from "@/lib/tool-contract/define-tool";

export interface TimestampInput {
  value: string;
  unit: "auto" | "seconds" | "milliseconds";
  timezone: string;
}

// 0001-01-01T00:00:00Z 到 9999-12-31T23:59:59.999Z：ISO 输出始终是四位年份
const MIN_MS = -62_135_596_800_000;
const MAX_MS = 253_402_300_799_999;

// 自动判断：绝对值不小于 1e11 按毫秒。1e11 秒是 5138 年，1e11 毫秒是 1973-03-03
const AUTO_MS_THRESHOLD = 1e11;

const NUMBER = /^[+-]?\d+(?:\.\d+)?$/;
const DATE =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?\s*(Z|[+-]\d{2}(?::?\d{2})?)?)?$/i;

const daysInMonth = (year: number, month: number) =>
  month === 2
    ? year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
      ? 29
      : 28
    : [4, 6, 9, 11].includes(month)
      ? 30
      : 31;

// 没有时区标记的日期时间按 UTC 理解，结果不依赖运行环境所在的时区
const parseDate = (value: string) => {
  const match = DATE.exec(value);
  if (!match) return undefined;
  const [, y, mo, d, h = "0", mi = "0", s = "0", fraction = "", zone = "Z"] = match;
  const [year, month, day, hour, minute, second] = [y, mo, d, h, mi, s].map(Number) as [
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  const offset = /^([+-])(\d{2}):?(\d{2})?$/.exec(zone);
  const offsetHours = Number(offset?.[2] ?? 0);
  const offsetMinutes = Number(offset?.[3] ?? 0);
  if (
    year < 1 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > daysInMonth(year, month) ||
    hour > 23 ||
    minute > 59 ||
    second > 59 ||
    offsetHours > 23 ||
    offsetMinutes > 59
  ) {
    throw new ToolError("invalid_value", { field: "value" });
  }
  const date = new Date(0);
  // Date.UTC 会把 0–99 年当作 1900–1999 年，所以用 setUTCFullYear
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, second, Number(fraction.padEnd(3, "0").slice(0, 3)));
  const sign = offset?.[1] === "-" ? -1 : 1;
  return date.getTime() - sign * (offsetHours * 60 + offsetMinutes) * 60_000;
};

const parseValue = (value: string, unit: TimestampInput["unit"]) => {
  if (NUMBER.test(value)) {
    const number = Number(value);
    const milliseconds =
      unit === "milliseconds" || (unit === "auto" && Math.abs(number) >= AUTO_MS_THRESHOLD);
    return Math.round(milliseconds ? number : number * 1000);
  }
  return parseDate(value);
};

// 取该时刻在指定时区的 UTC 偏移（分钟，可带秒：1937 年前的 LMT 偏移含秒）
const offsetSeconds = (ms: number, timezone: string) => {
  let name: string | undefined;
  try {
    name = new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: "longOffset" })
      .formatToParts(ms)
      .find((part) => part.type === "timeZoneName")?.value;
  } catch {
    throw new ToolError("invalid_timezone", { field: "timezone" });
  }
  const match = /^GMT(?:([+-])(\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(name ?? "");
  if (!match) throw new ToolError("invalid_timezone", { field: "timezone" });
  const [, sign = "+", hours = "0", minutes = "0", seconds = "0"] = match;
  return (sign === "-" ? -1 : 1) * (Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds));
};

const pad = (n: number) => String(n).padStart(2, "0");

const formatOffset = (offset: number) => {
  const abs = Math.abs(offset);
  const seconds = abs % 60;
  return `${offset < 0 ? "-" : "+"}${pad(Math.floor(abs / 3600))}:${pad(Math.floor((abs % 3600) / 60))}${seconds ? `:${pad(seconds)}` : ""}`;
};

export const convertTimestamp = ({ value, unit, timezone }: TimestampInput) => {
  const trimmed = value.trim();
  const ms = parseValue(trimmed, unit);
  if (ms === undefined) throw new ToolError("invalid_value", { field: "value" });
  if (!Number.isFinite(ms) || ms < MIN_MS || ms > MAX_MS) {
    throw new ToolError("out_of_range", { field: "value" });
  }

  const offset = offsetSeconds(ms, timezone.trim() || "UTC");
  const zoned = new Date(ms + offset * 1000).toISOString().replace("Z", formatOffset(offset));

  return {
    seconds: String(Math.floor(ms / 1000)),
    milliseconds: String(ms),
    utc: new Date(ms).toISOString().replace(".000Z", "Z"),
    zoned: zoned.replace(/\.000(?=[+-])/, ""),
  };
};
