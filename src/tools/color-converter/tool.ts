import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

const line = v.metadata<string, FieldMetadata>({ widget: "line" });

export default defineTool({
  id: "color-converter",
  category: "developer",
  input: v.object({
    value: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.description(
        "A CSS color: hex (#rgb, #rgba, #rrggbb, #rrggbbaa), rgb() or rgba(), hsl() or hsla(), hwb(), or oklch(). Both the comma and the space-and-slash syntax work, and alpha is optional. Color names are not supported",
      ),
      line,
    ),
  }),
  output: v.object({
    hex: v.pipe(
      v.string(),
      v.description("The color as lowercase hex, with an alpha pair when alpha is below 1"),
      line,
    ),
    rgb: v.pipe(
      v.string(),
      v.description("The color as rgb() with 0–255 channels and an optional / alpha"),
      line,
    ),
    hsl: v.pipe(
      v.string(),
      v.description(
        "The color as hsl() with hue in degrees and saturation and lightness in percent",
      ),
      line,
    ),
    hwb: v.pipe(
      v.string(),
      v.description(
        "The color as hwb() with hue in degrees and whiteness and blackness in percent",
      ),
      line,
    ),
    oklch: v.pipe(
      v.string(),
      v.description("The color as oklch() with lightness 0–1, chroma and hue in degrees"),
      line,
    ),
  }),
  examples: [
    {
      input: { value: "#ff5733" },
      output: {
        hex: "#ff5733",
        rgb: "rgb(255 87 51)",
        hsl: "hsl(10.6 100% 60%)",
        hwb: "hwb(10.6 20% 0%)",
        oklch: "oklch(0.6804 0.21 33.7)",
      },
    },
    {
      input: { value: "rgb(0 128 255 / 0.5)" },
      output: {
        hex: "#0080ff80",
        rgb: "rgb(0 128 255 / 0.5)",
        hsl: "hsl(209.9 100% 50% / 0.5)",
        hwb: "hwb(209.9 0% 0% / 0.5)",
        oklch: "oklch(0.6152 0.2108 256.1 / 0.5)",
      },
    },
    {
      input: { value: "hsl(210, 50%, 40%)" },
      output: {
        hex: "#336699",
        rgb: "rgb(51 102 153)",
        hsl: "hsl(210 50% 40%)",
        hwb: "hwb(210 20% 40%)",
        oklch: "oklch(0.4993 0.0987 250.4)",
      },
    },
    {
      input: { value: "oklch(0.7 0.15 150)" },
      output: {
        hex: "#4cb86a",
        rgb: "rgb(76 184 106)",
        hsl: "hsl(136.7 43.2% 51%)",
        hwb: "hwb(136.7 29.8% 27.8%)",
        oklch: "oklch(0.7005 0.1506 149.9)",
      },
    },
  ],
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: true,
    description:
      "Convert a CSS color between hex, rgb, hsl, hwb and oklch. The value is a hex color (#rgb, #rgba, #rrggbb, #rrggbbaa) or an rgb(), rgba(), hsl(), hsla(), hwb() or oklch() function, in the comma or the space-and-slash syntax, with optional alpha. Hue accepts deg, grad, rad and turn units. Returns the color in all five formats; the rgb and hex results are rounded to 8-bit channels, and an oklch color outside the sRGB gamut is clamped to the nearest sRGB values. Fails with error code invalid_color when the value is not one of these formats (color names such as red are not supported).",
  },
  run: () => import("./core").then((m) => m.convertColor),
});
