import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

import { unitIds } from "./units";

const line = v.metadata<string, FieldMetadata>({ widget: "line" });

export default defineTool({
  id: "unit-converter",
  category: "developer",
  input: v.object({
    value: v.pipe(
      v.number(),
      v.description("The number to convert; may be negative or fractional"),
    ),
    from: v.optional(
      v.pipe(
        v.picklist(unitIds),
        v.description(
          "The unit of the value. Length: mm, cm, m, km, in, ft, yd, mi. Mass: g, kg, t (metric ton), oz, lb. Temperature: celsius, fahrenheit, kelvin. Volume: ml, l, floz, cup, gal (US customary). Area: m2, km2, ha, ft2, ac, mi2. Speed: mps, kmh, mph, kn. Time: ms, s, min, h, d, wk. Data: B, KB, MB, GB, TB (powers of 1,000), KiB, MiB, GiB (powers of 1,024)",
        ),
      ),
      "km",
    ),
    to: v.optional(
      v.pipe(
        v.picklist(unitIds),
        v.description("The unit to convert to; must be of the same kind as from"),
      ),
      "mi",
    ),
  }),
  output: v.object({
    result: v.pipe(
      v.string(),
      v.description("The converted number with up to 10 significant digits"),
      line,
    ),
    summary: v.pipe(
      v.string(),
      v.description("The conversion as a sentence, for example 5 km = 3.106855961 mi"),
      line,
    ),
  }),
  examples: [
    {
      input: { value: 5, from: "km", to: "mi" },
      output: { result: "3.106855961", summary: "5 km = 3.106855961 mi" },
    },
    {
      input: { value: 100, from: "celsius", to: "fahrenheit" },
      output: { result: "212", summary: "100 °C = 212 °F" },
    },
    {
      input: { value: 1, from: "GiB", to: "MB" },
      output: { result: "1073.741824", summary: "1 GiB = 1073.741824 MB" },
    },
    {
      input: { value: 90, from: "kmh", to: "mph" },
      output: { result: "55.9234073", summary: "90 km/h = 55.9234073 mph" },
    },
  ],
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: true,
    description:
      "Convert a number between units of the same kind: length (mm, cm, m, km, in, ft, yd, mi), mass (g, kg, t, oz, lb), temperature (celsius, fahrenheit, kelvin), volume (ml, l, floz, cup, gal; US customary), area (m2, km2, ha, ft2, ac, mi2), speed (mps, kmh, mph, kn), time (ms, s, min, h, d, wk) and data (B, KB, MB, GB, TB in powers of 1,000; KiB, MiB, GiB in powers of 1,024). Returns the result with up to 10 significant digits and a summary sentence. Fails with error code incompatible_units when from and to are of different kinds, and below_absolute_zero when a temperature is below 0 K.",
  },
  run: () => import("./core").then((m) => m.convertUnit),
});
