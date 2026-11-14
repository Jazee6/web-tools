import { ToolError } from "@/lib/tool-contract/define-tool";

export interface ColorInput {
  value: string;
}

interface Color {
  // sRGB，0–1，可能因 oklch 色域外而越界，输出前统一夹紧
  r: number;
  g: number;
  b: number;
  alpha: number;
}

const invalid = () => new ToolError("invalid_color", { field: "value" });

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// 最多保留 digits 位小数并去掉末尾的 0；避免出现 "-0"
const num = (n: number, digits: number) => {
  const text = n.toFixed(digits);
  const trimmed = text.includes(".") ? text.replace(/\.?0+$/, "") : text;
  return trimmed === "-0" ? "0" : trimmed;
};

const NUMBER = String.raw`[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?`;
const HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FUNCTION = /^(rgba?|hsla?|hwb|oklch)\(\s*([^()]*?)\s*\)$/i;
const TOKEN = new RegExp(`^(${NUMBER})(%|deg|grad|rad|turn)?$`, "i");

const parseHex = (text: string): Color => {
  let digits = text.slice(1);
  if (digits.length <= 4) digits = [...digits].map((d) => d + d).join("");
  const channel = (i: number) => parseInt(digits.slice(i * 2, i * 2 + 2), 16) / 255;
  return {
    r: channel(0),
    g: channel(1),
    b: channel(2),
    alpha: digits.length === 8 ? channel(3) : 1,
  };
};

interface Token {
  value: number;
  unit: string;
}

// 现代语法（空格分隔，`/` 引出透明度）和旧语法（逗号分隔，第四项是透明度）都接受
const splitArguments = (body: string) => {
  const [main = "", alphaPart, ...rest] = body.split("/");
  if (rest.length > 0) throw invalid();
  if (alphaPart === undefined && main.includes(",")) {
    const parts = main.split(",").map((part) => part.trim());
    return { channels: parts.slice(0, 3), alpha: parts[3], count: parts.length };
  }
  const parts = main.trim().split(/\s+/);
  return { channels: parts, alpha: alphaPart?.trim(), count: parts.length };
};

const token = (text: string | undefined): Token => {
  const match = text === undefined ? null : TOKEN.exec(text);
  if (!match) throw invalid();
  return { value: Number(match[1]), unit: (match[2] ?? "").toLowerCase() };
};

const parseAlpha = (text: string | undefined) => {
  if (text === undefined) return 1;
  const { value, unit } = token(text);
  if (unit !== "" && unit !== "%") throw invalid();
  return clamp(unit === "%" ? value / 100 : value, 0, 1);
};

// 返回 0–360 的角度
const parseHue = ({ value, unit }: Token) => {
  const degrees =
    unit === "" || unit === "deg"
      ? value
      : unit === "turn"
        ? value * 360
        : unit === "grad"
          ? value * 0.9
          : unit === "rad"
            ? (value * 180) / Math.PI
            : Number.NaN;
  if (Number.isNaN(degrees)) throw invalid();
  return ((degrees % 360) + 360) % 360;
};

// 数字乘 unitless，百分比乘 percent，把各通道统一换算成 0–1（oklch 的 L、C 除外）
const scaled = (t: Token, unitless: number, percent: number) => {
  if (t.unit === "%") return t.value * percent;
  if (t.unit === "") return t.value * unitless;
  throw invalid();
};

const hslToRgb = (h: number, s: number, l: number): Pick<Color, "r" | "g" | "b"> => {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return { r: f(0), g: f(8), b: f(4) };
};

const oklchToRgb = (l: number, c: number, hue: number): Pick<Color, "r" | "g" | "b"> => {
  const h = (hue * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  const cl = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const cm = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const cs = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * cl - 3.3077115913 * cm + 0.2309699292 * cs,
    -1.2684380046 * cl + 2.6097574011 * cm - 0.3413193965 * cs,
    -0.0041960863 * cl - 0.7034186147 * cm + 1.707614701 * cs,
  ];
  const [r = 0, g = 0, bl = 0] = linear.map(encodeGamma);
  return { r, g, b: bl };
};

const encodeGamma = (x: number) => {
  const abs = Math.abs(x);
  const encoded = abs <= 0.0031308 ? 12.92 * abs : 1.055 * abs ** (1 / 2.4) - 0.055;
  return Math.sign(x) * encoded;
};

const decodeGamma = (x: number) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);

const parseFunction = (name: string, body: string): Color => {
  const { channels, alpha, count } = splitArguments(body);
  if (channels.length !== 3 || count > 4) throw invalid();
  const [c1, c2, c3] = channels.map(token) as [Token, Token, Token];
  const fn = name.toLowerCase();
  const a = parseAlpha(alpha);

  if (fn === "rgb" || fn === "rgba") {
    // 数字和百分比混用时浏览器会拒绝，这里宽松接受
    const channel = (t: Token) => clamp(scaled(t, 1 / 255, 0.01), 0, 1);
    return { r: channel(c1), g: channel(c2), b: channel(c3), alpha: a };
  }
  if (fn === "hsl" || fn === "hsla") {
    const s = clamp(scaled(c2, 0.01, 0.01), 0, 1);
    const l = clamp(scaled(c3, 0.01, 0.01), 0, 1);
    return { ...hslToRgb(parseHue(c1), s, l), alpha: a };
  }
  if (fn === "hwb") {
    const w = clamp(scaled(c2, 0.01, 0.01), 0, 1);
    const bk = clamp(scaled(c3, 0.01, 0.01), 0, 1);
    if (w + bk >= 1) {
      const gray = w / (w + bk);
      return { r: gray, g: gray, b: gray, alpha: a };
    }
    const { r, g, b } = hslToRgb(parseHue(c1), 1, 0.5);
    const scale = (x: number) => x * (1 - w - bk) + w;
    return { r: scale(r), g: scale(g), b: scale(b), alpha: a };
  }
  // oklch：L 为 0–1 或百分比，C 为数字或百分比（100% = 0.4）
  const l = clamp(scaled(c1, 1, 0.01), 0, 1);
  const c = Math.max(0, scaled(c2, 1, 0.004));
  return { ...oklchToRgb(l, c, parseHue(c3)), alpha: a };
};

const parse = (text: string): Color => {
  if (text.startsWith("#")) {
    if (!HEX.test(text)) throw invalid();
    return parseHex(text);
  }
  const match = FUNCTION.exec(text);
  if (!match) throw invalid();
  return parseFunction(match[1] as string, match[2] as string);
};

const toHex = (n: number) =>
  Math.round(clamp(n, 0, 1) * 255)
    .toString(16)
    .padStart(2, "0");

const toHsl = ({ r, g, b }: Color) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;
  let h = 0;
  if (delta > 1e-9) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = (h * 60 + 360) % 360;
  }
  const s = delta < 1e-9 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100, w: min * 100, bk: (1 - max) * 100 };
};

const toOklch = ({ r, g, b }: Color) => {
  const [lr = 0, lg = 0, lb = 0] = [r, g, b].map(decodeGamma);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const chroma = Math.hypot(a, bb);
  // 灰色没有色相；色度小于 0.0001 时（显示精度以下）色相没有意义
  const hue = chroma < 1e-4 ? 0 : ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { l: lightness, c: chroma, h: hue };
};

export const convertColor = ({ value }: ColorInput) => {
  const parsed = parse(value.trim());
  // 色域外的 oklch 夹紧到 sRGB，其余格式不会越界
  const color: Color = {
    r: clamp(parsed.r, 0, 1),
    g: clamp(parsed.g, 0, 1),
    b: clamp(parsed.b, 0, 1),
    alpha: parsed.alpha,
  };
  const rgb = [color.r, color.g, color.b].map((x) => Math.round(x * 255));
  // 先取整到 8 位再换算，hex、rgb、hsl 的结果互相一致
  const quantized: Color = {
    r: (rgb[0] as number) / 255,
    g: (rgb[1] as number) / 255,
    b: (rgb[2] as number) / 255,
    alpha: color.alpha,
  };
  const hsl = toHsl(quantized);
  const oklch = toOklch(quantized);
  const alpha = Math.round(color.alpha * 1000) / 1000;
  const slash = alpha < 1 ? ` / ${num(alpha, 3)}` : "";

  return {
    hex: `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}${alpha < 1 ? toHex(color.alpha) : ""}`,
    rgb: `rgb(${rgb.join(" ")}${slash})`,
    hsl: `hsl(${num(hsl.h, 1)} ${num(hsl.s, 1)}% ${num(hsl.l, 1)}%${slash})`,
    hwb: `hwb(${num(hsl.h, 1)} ${num(hsl.w, 1)}% ${num(hsl.bk, 1)}%${slash})`,
    oklch: `oklch(${num(oklch.l, 4)} ${num(oklch.c, 4)} ${num(oklch.h, 1)}${slash})`,
  };
};
