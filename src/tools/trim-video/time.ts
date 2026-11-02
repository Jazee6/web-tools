// 秒（90、90.5）、分:秒（1:30、1:30.5）、时:分:秒（01:02:03.250）。冒号后的分、秒必须小于 60
const TIME = /^(?:(?:(\d+):)?(\d+):)?(\d+(?:\.\d+)?)$/;

// 返回秒数；写法不合法时返回 undefined
export const parseTime = (text: string): number | undefined => {
  const match = TIME.exec(text.trim());
  if (!match) return undefined;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3]);
  if (match[2] !== undefined && seconds >= 60) return undefined;
  if (match[1] !== undefined && minutes >= 60) return undefined;
  return hours * 3600 + minutes * 60 + seconds;
};

// 精确到毫秒的 H:MM:SS.mmm，末尾的 0 和小数点去掉，用在错误信息里
export const formatTime = (seconds: number): string => {
  const total = Math.round(seconds * 1000);
  const hours = Math.floor(total / 3_600_000);
  const minutes = Math.floor(total / 60_000) % 60;
  const [whole, fraction] = ((total % 60_000) / 1000).toFixed(3).split(".");
  const decimals = fraction!.replace(/0+$/, "");
  return `${hours}:${String(minutes).padStart(2, "0")}:${whole!.padStart(2, "0")}${decimals && `.${decimals}`}`;
};
