---
review: draft
updated: 2026-10-31
title: "Unit Converter – Length, Weight, Temperature, Volume and More"
description: "Convert between metric and imperial units of length, mass, temperature, volume, area, speed, time and data size. Free and private — it runs in your browser."
name: "Unit Converter"
answer: "Enter a number, choose the unit to convert from and to, and press Convert — length, mass, temperature, volume, area, speed, time and data units are converted right in your browser."
action: "Convert"
fields:
  value:
    label: "Value"
    placeholder: "5"
  from:
    label: "From"
    options:
      mm: "Length – millimeter (mm)"
      cm: "Length – centimeter (cm)"
      m: "Length – meter (m)"
      km: "Length – kilometer (km)"
      in: "Length – inch (in)"
      ft: "Length – foot (ft)"
      yd: "Length – yard (yd)"
      mi: "Length – mile (mi)"
      g: "Mass – gram (g)"
      kg: "Mass – kilogram (kg)"
      t: "Mass – metric ton (t)"
      oz: "Mass – ounce (oz)"
      lb: "Mass – pound (lb)"
      celsius: "Temperature – Celsius (°C)"
      fahrenheit: "Temperature – Fahrenheit (°F)"
      kelvin: "Temperature – Kelvin (K)"
      ml: "Volume – milliliter (mL)"
      l: "Volume – liter (L)"
      floz: "Volume – US fluid ounce (fl oz)"
      cup: "Volume – US cup (cup)"
      gal: "Volume – US gallon (gal)"
      m2: "Area – square meter (m²)"
      km2: "Area – square kilometer (km²)"
      ha: "Area – hectare (ha)"
      ft2: "Area – square foot (ft²)"
      ac: "Area – acre (ac)"
      mi2: "Area – square mile (mi²)"
      mps: "Speed – meter per second (m/s)"
      kmh: "Speed – kilometer per hour (km/h)"
      mph: "Speed – mile per hour (mph)"
      kn: "Speed – knot (kn)"
      ms: "Time – millisecond (ms)"
      s: "Time – second (s)"
      min: "Time – minute (min)"
      h: "Time – hour (h)"
      d: "Time – day (d)"
      wk: "Time – week (wk)"
      B: "Data – B"
      KB: "Data – KB"
      MB: "Data – MB"
      GB: "Data – GB"
      TB: "Data – TB"
      KiB: "Data – KiB"
      MiB: "Data – MiB"
      GiB: "Data – GiB"
  to:
    label: "To"
    options:
      mm: "Length – millimeter (mm)"
      cm: "Length – centimeter (cm)"
      m: "Length – meter (m)"
      km: "Length – kilometer (km)"
      in: "Length – inch (in)"
      ft: "Length – foot (ft)"
      yd: "Length – yard (yd)"
      mi: "Length – mile (mi)"
      g: "Mass – gram (g)"
      kg: "Mass – kilogram (kg)"
      t: "Mass – metric ton (t)"
      oz: "Mass – ounce (oz)"
      lb: "Mass – pound (lb)"
      celsius: "Temperature – Celsius (°C)"
      fahrenheit: "Temperature – Fahrenheit (°F)"
      kelvin: "Temperature – Kelvin (K)"
      ml: "Volume – milliliter (mL)"
      l: "Volume – liter (L)"
      floz: "Volume – US fluid ounce (fl oz)"
      cup: "Volume – US cup (cup)"
      gal: "Volume – US gallon (gal)"
      m2: "Area – square meter (m²)"
      km2: "Area – square kilometer (km²)"
      ha: "Area – hectare (ha)"
      ft2: "Area – square foot (ft²)"
      ac: "Area – acre (ac)"
      mi2: "Area – square mile (mi²)"
      mps: "Speed – meter per second (m/s)"
      kmh: "Speed – kilometer per hour (km/h)"
      mph: "Speed – mile per hour (mph)"
      kn: "Speed – knot (kn)"
      ms: "Time – millisecond (ms)"
      s: "Time – second (s)"
      min: "Time – minute (min)"
      h: "Time – hour (h)"
      d: "Time – day (d)"
      wk: "Time – week (wk)"
      B: "Data – B"
      KB: "Data – KB"
      MB: "Data – MB"
      GB: "Data – GB"
      TB: "Data – TB"
      KiB: "Data – KiB"
      MiB: "Data – MiB"
      GiB: "Data – GiB"
output:
  result:
    label: "Result"
  summary:
    label: "Conversion"
errors:
  incompatible_units: "These two units measure different things. Choose a From and a To unit from the same group — each option starts with its group, such as Length or Temperature."
  below_absolute_zero: "This temperature is below absolute zero (0 K, −273.15 °C, −459.67 °F), so it cannot exist. Check the value and the unit."
steps:
  - "Enter the number in Value."
  - "Choose the unit you have in From and the unit you want in To. Both must be in the same group, such as Length or Temperature."
  - "Press Convert, then copy the Result or the Conversion sentence."
faq:
  - q: "Is my input uploaded to a server?"
    a: "No. The conversion runs entirely in your browser, so what you enter never leaves your device. You can even use the page offline once it has loaded."
  - q: "Which units can I convert?"
    a: "Length (mm, cm, m, km, in, ft, yd, mi), mass (g, kg, metric ton, oz, lb), temperature (Celsius, Fahrenheit, Kelvin), volume (mL, L, fl oz, cup, gal), area (m², km², ha, ft², ac, mi²), speed (m/s, km/h, mph, kn), time (ms, s, min, h, d, wk) and data size (B, KB, MB, GB, TB, KiB, MiB, GiB). You can only convert within one group."
  - q: "Are the gallons and ounces US or imperial?"
    a: "US customary. A fluid ounce is 29.5735 mL, a cup is 236.588 mL and a gallon is 3.785 L; the imperial gallon (4.546 L) is not included. The mass ounce and pound are the international avoirdupois units: 1 lb is exactly 0.45359237 kg, and the mile is the international mile of 1,609.344 m."
  - q: "What is the difference between KB and KiB?"
    a: 'KB, MB, GB and TB are decimal units: 1 KB is 1,000 bytes. KiB, MiB and GiB are binary units: 1 KiB is 1,024 bytes. Storage makers usually count in decimal, while operating systems often show binary sizes, which is why a "1 TB" drive appears as about 931 GiB.'
  - q: "How precise is the result?"
    a: "The result has up to 10 significant digits, with trailing zeros removed, so 1 m in miles is 0.0006213711922. Very large or very small numbers may appear in exponent form, such as 1e-7 for 0.0000001."
  - q: "How is temperature converted?"
    a: "Through Kelvin: Celsius is Kelvin minus 273.15, and Fahrenheit is (Kelvin − 273.15) × 9/5 + 32. A temperature below absolute zero (0 K) is rejected with an error."
---

## What this unit converter does

The tool multiplies your value by the size of the starting unit and divides by the size of the target unit, both measured against a base unit (meter, kilogram, liter, square meter, meter per second, second or byte). The sizes come from the international definitions, for example 1 inch = 25.4 mm and 1 lb = 0.45359237 kg. Temperature is converted through Kelvin because Celsius and Fahrenheit do not start at zero.

## Options and limits

- **Value:** any number, including negative and fractional ones. Temperatures below absolute zero are rejected.
- **Groups:** length, mass, temperature, volume, area, speed, time and data size. Both units must belong to the same group.
- **Volume:** US customary units only.
- **Precision:** up to 10 significant digits, so the result can differ from an exact fraction in the last digit.
- **Not included:** currency, whose rates change every day, and fuel-economy, pressure, energy and other groups.

## Privacy

Processing happens only on your device. The page does not upload your input, store it or use cookies.
