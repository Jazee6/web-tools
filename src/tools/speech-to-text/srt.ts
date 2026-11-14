// Whisper 带时间戳的输出：每段 [开始, 结束] 秒；最后一段的结束时间可能缺失（null），用音频时长补上
export interface TimedChunk {
  timestamp: [number, number | null];
  text: string;
}

const pad = (value: number, length = 2) => String(value).padStart(length, "0");

// SRT 时间格式 HH:MM:SS,mmm
export const formatSrtTime = (seconds: number) => {
  const total = Math.max(0, Math.round(seconds * 1000));
  const ms = total % 1000;
  const s = Math.floor(total / 1000) % 60;
  const m = Math.floor(total / 60_000) % 60;
  const h = Math.floor(total / 3_600_000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
};

// 空白段跳过，序号连续；结束时间不早于开始时间
export const formatSrt = (chunks: readonly TimedChunk[], duration: number) =>
  chunks
    .map(({ timestamp: [start, end], text }) => ({
      start,
      end: Math.max(start, end ?? duration),
      text: text.trim(),
    }))
    .filter((cue) => cue.text)
    .map(
      (cue, index) =>
        `${index + 1}\n${formatSrtTime(cue.start)} --> ${formatSrtTime(cue.end)}\n${cue.text}\n`,
    )
    .join("\n");
