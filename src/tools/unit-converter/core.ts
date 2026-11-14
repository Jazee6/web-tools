import { ToolError } from "@/lib/tool-contract/define-tool";

import { type UnitId, units } from "./units";

export interface UnitInput {
  value: number;
  from: UnitId;
  to: UnitId;
}

const toKelvin = (value: number, unit: UnitId) =>
  unit === "celsius"
    ? value + 273.15
    : unit === "fahrenheit"
      ? ((value - 32) * 5) / 9 + 273.15
      : value;

const fromKelvin = (kelvin: number, unit: UnitId) =>
  unit === "celsius"
    ? kelvin - 273.15
    : unit === "fahrenheit"
      ? ((kelvin - 273.15) * 9) / 5 + 32
      : kelvin;

// 10 位有效数字：去掉浮点误差（0.1 + 0.2），又保留足够的精度；-0 显示为 0
const format = (n: number) => String(Number(n.toPrecision(10)));

export const convertUnit = ({ value, from, to }: UnitInput) => {
  const a = units[from];
  const b = units[to];
  if (a.group !== b.group) throw new ToolError("incompatible_units", { field: "to" });
  let result: number;
  if (a.group === "temperature") {
    const kelvin = toKelvin(value, from);
    // 容差吸收浮点误差：-273.15 °C 换成开尔文是 5.7e-14 之类的值
    if (kelvin < -1e-9) throw new ToolError("below_absolute_zero", { field: "value" });
    result = fromKelvin(kelvin, to);
  } else {
    result = (value * a.factor) / b.factor;
  }
  const text = format(result);
  return { result: text, summary: `${format(value)} ${a.symbol} = ${text} ${b.symbol}` };
};
