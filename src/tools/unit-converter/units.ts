// 换算表：每类单位列出符号和相对基准单位的系数（长度 m、质量 kg、体积 L、面积 m²、速度 m/s、时间 s、数据 B）。
// 温度不是比例换算，单独在 core.ts 里处理。顺序即下拉选项的顺序。
export interface UnitDef {
  group: Group;
  symbol: string;
  // 基准单位 = 数值 × factor
  factor: number;
}

export const groups = [
  "length",
  "mass",
  "temperature",
  "volume",
  "area",
  "speed",
  "time",
  "data",
] as const;
export type Group = (typeof groups)[number];

const unit = (group: Group, symbol: string, factor: number): UnitDef => ({
  group,
  symbol,
  factor,
});

export const units = {
  mm: unit("length", "mm", 0.001),
  cm: unit("length", "cm", 0.01),
  m: unit("length", "m", 1),
  km: unit("length", "km", 1000),
  in: unit("length", "in", 0.0254),
  ft: unit("length", "ft", 0.3048),
  yd: unit("length", "yd", 0.9144),
  mi: unit("length", "mi", 1609.344),
  g: unit("mass", "g", 0.001),
  kg: unit("mass", "kg", 1),
  t: unit("mass", "t", 1000),
  oz: unit("mass", "oz", 0.028349523125),
  lb: unit("mass", "lb", 0.45359237),
  // 温度的 factor 不使用
  celsius: unit("temperature", "°C", 1),
  fahrenheit: unit("temperature", "°F", 1),
  kelvin: unit("temperature", "K", 1),
  ml: unit("volume", "mL", 0.001),
  l: unit("volume", "L", 1),
  floz: unit("volume", "fl oz", 0.0295735295625),
  cup: unit("volume", "cup", 0.2365882365),
  gal: unit("volume", "gal", 3.785411784),
  m2: unit("area", "m²", 1),
  km2: unit("area", "km²", 1e6),
  ha: unit("area", "ha", 1e4),
  ft2: unit("area", "ft²", 0.09290304),
  ac: unit("area", "ac", 4046.8564224),
  mi2: unit("area", "mi²", 2589988.110336),
  mps: unit("speed", "m/s", 1),
  kmh: unit("speed", "km/h", 1 / 3.6),
  mph: unit("speed", "mph", 0.44704),
  kn: unit("speed", "kn", 1852 / 3600),
  ms: unit("time", "ms", 0.001),
  s: unit("time", "s", 1),
  min: unit("time", "min", 60),
  h: unit("time", "h", 3600),
  d: unit("time", "d", 86400),
  wk: unit("time", "wk", 604800),
  B: unit("data", "B", 1),
  KB: unit("data", "KB", 1e3),
  MB: unit("data", "MB", 1e6),
  GB: unit("data", "GB", 1e9),
  TB: unit("data", "TB", 1e12),
  KiB: unit("data", "KiB", 1024),
  MiB: unit("data", "MiB", 1024 ** 2),
  GiB: unit("data", "GiB", 1024 ** 3),
} as const satisfies Record<string, UnitDef>;

export type UnitId = keyof typeof units;
export const unitIds = Object.keys(units) as [UnitId, ...UnitId[]];
