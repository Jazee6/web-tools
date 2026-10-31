---
review: draft
updated: 2026-10-31
title: "Einheitenumrechner – Länge, Gewicht, Temperatur, Volumen und mehr"
description: "Rechnen Sie zwischen metrischen und imperialen Einheiten für Länge, Masse, Temperatur, Volumen, Fläche, Geschwindigkeit, Zeit und Datengröße um. Kostenlos und privat."
name: "Einheitenumrechner"
answer: "Geben Sie eine Zahl ein, wählen Sie Ausgangs- und Zieleinheit und klicken Sie auf Umrechnen – Einheiten für Länge, Masse, Temperatur, Volumen, Fläche, Geschwindigkeit, Zeit und Daten werden direkt im Browser umgerechnet."
action: "Umrechnen"
fields:
  value:
    label: "Wert"
    placeholder: "5"
  from:
    label: "Von"
    options:
      mm: "Länge – Millimeter (mm)"
      cm: "Länge – Zentimeter (cm)"
      m: "Länge – Meter (m)"
      km: "Länge – Kilometer (km)"
      in: "Länge – Zoll (in)"
      ft: "Länge – Fuß (ft)"
      yd: "Länge – Yard (yd)"
      mi: "Länge – Meile (mi)"
      g: "Masse – Gramm (g)"
      kg: "Masse – Kilogramm (kg)"
      t: "Masse – Tonne (t)"
      oz: "Masse – Unze (oz)"
      lb: "Masse – Pound (lb)"
      celsius: "Temperatur – Celsius (°C)"
      fahrenheit: "Temperatur – Fahrenheit (°F)"
      kelvin: "Temperatur – Kelvin (K)"
      ml: "Volumen – Milliliter (mL)"
      l: "Volumen – Liter (L)"
      floz: "Volumen – Flüssigunze (US) (fl oz)"
      cup: "Volumen – Cup (US) (cup)"
      gal: "Volumen – Gallone (US) (gal)"
      m2: "Fläche – Quadratmeter (m²)"
      km2: "Fläche – Quadratkilometer (km²)"
      ha: "Fläche – Hektar (ha)"
      ft2: "Fläche – Quadratfuß (ft²)"
      ac: "Fläche – Acre (ac)"
      mi2: "Fläche – Quadratmeile (mi²)"
      mps: "Geschwindigkeit – Meter pro Sekunde (m/s)"
      kmh: "Geschwindigkeit – Kilometer pro Stunde (km/h)"
      mph: "Geschwindigkeit – Meilen pro Stunde (mph)"
      kn: "Geschwindigkeit – Knoten (kn)"
      ms: "Zeit – Millisekunde (ms)"
      s: "Zeit – Sekunde (s)"
      min: "Zeit – Minute (min)"
      h: "Zeit – Stunde (h)"
      d: "Zeit – Tag (d)"
      wk: "Zeit – Woche (wk)"
      B: "Daten – B"
      KB: "Daten – KB"
      MB: "Daten – MB"
      GB: "Daten – GB"
      TB: "Daten – TB"
      KiB: "Daten – KiB"
      MiB: "Daten – MiB"
      GiB: "Daten – GiB"
  to:
    label: "Nach"
    options:
      mm: "Länge – Millimeter (mm)"
      cm: "Länge – Zentimeter (cm)"
      m: "Länge – Meter (m)"
      km: "Länge – Kilometer (km)"
      in: "Länge – Zoll (in)"
      ft: "Länge – Fuß (ft)"
      yd: "Länge – Yard (yd)"
      mi: "Länge – Meile (mi)"
      g: "Masse – Gramm (g)"
      kg: "Masse – Kilogramm (kg)"
      t: "Masse – Tonne (t)"
      oz: "Masse – Unze (oz)"
      lb: "Masse – Pound (lb)"
      celsius: "Temperatur – Celsius (°C)"
      fahrenheit: "Temperatur – Fahrenheit (°F)"
      kelvin: "Temperatur – Kelvin (K)"
      ml: "Volumen – Milliliter (mL)"
      l: "Volumen – Liter (L)"
      floz: "Volumen – Flüssigunze (US) (fl oz)"
      cup: "Volumen – Cup (US) (cup)"
      gal: "Volumen – Gallone (US) (gal)"
      m2: "Fläche – Quadratmeter (m²)"
      km2: "Fläche – Quadratkilometer (km²)"
      ha: "Fläche – Hektar (ha)"
      ft2: "Fläche – Quadratfuß (ft²)"
      ac: "Fläche – Acre (ac)"
      mi2: "Fläche – Quadratmeile (mi²)"
      mps: "Geschwindigkeit – Meter pro Sekunde (m/s)"
      kmh: "Geschwindigkeit – Kilometer pro Stunde (km/h)"
      mph: "Geschwindigkeit – Meilen pro Stunde (mph)"
      kn: "Geschwindigkeit – Knoten (kn)"
      ms: "Zeit – Millisekunde (ms)"
      s: "Zeit – Sekunde (s)"
      min: "Zeit – Minute (min)"
      h: "Zeit – Stunde (h)"
      d: "Zeit – Tag (d)"
      wk: "Zeit – Woche (wk)"
      B: "Daten – B"
      KB: "Daten – KB"
      MB: "Daten – MB"
      GB: "Daten – GB"
      TB: "Daten – TB"
      KiB: "Daten – KiB"
      MiB: "Daten – MiB"
      GiB: "Daten – GiB"
output:
  result:
    label: "Ergebnis"
  summary:
    label: "Umrechnung"
errors:
  incompatible_units: "Diese beiden Einheiten messen Verschiedenes. Wählen Sie bei Von und Nach Einheiten aus derselben Gruppe – jede Option beginnt mit ihrer Gruppe, etwa Länge oder Temperatur."
  below_absolute_zero: "Diese Temperatur liegt unter dem absoluten Nullpunkt (0 K, −273,15 °C, −459,67 °F) und kann nicht existieren. Prüfen Sie den Wert und die Einheit."
steps:
  - "Geben Sie die Zahl bei Wert ein."
  - "Wählen Sie bei Von die Einheit, die Sie haben, und bei Nach die Einheit, die Sie brauchen. Beide müssen zur selben Gruppe gehören, etwa Länge oder Temperatur."
  - "Klicken Sie auf Umrechnen und kopieren Sie das Ergebnis oder den Umrechnungssatz."
faq:
  - q: "Wird meine Eingabe auf einen Server hochgeladen?"
    a: "Nein. Die Umrechnung läuft vollständig in Ihrem Browser, Ihre Eingabe verlässt also nie Ihr Gerät. Nach dem Laden der Seite können Sie sie sogar offline nutzen."
  - q: "Welche Einheiten lassen sich umrechnen?"
    a: "Länge (mm, cm, m, km, in, ft, yd, mi), Masse (g, kg, Tonne, oz, lb), Temperatur (Celsius, Fahrenheit, Kelvin), Volumen (mL, L, fl oz, cup, gal), Fläche (m², km², ha, ft², ac, mi²), Geschwindigkeit (m/s, km/h, mph, kn), Zeit (ms, s, min, h, d, wk) und Datengröße (B, KB, MB, GB, TB, KiB, MiB, GiB). Umgerechnet wird nur innerhalb einer Gruppe."
  - q: "Sind Gallonen und Unzen amerikanisch oder imperial?"
    a: "Amerikanisch. Eine Flüssigunze sind 29,5735 mL, ein Cup 236,588 mL und eine Gallone 3,785 L; die imperiale Gallone (4,546 L) ist nicht enthalten. Unze und Pound als Masse sind die internationalen Avoirdupois-Einheiten: 1 lb sind genau 0,45359237 kg, und die Meile ist die internationale Meile mit 1.609,344 m. Das deutsche Pfund (500 g) ist damit nicht gemeint."
  - q: "Was ist der Unterschied zwischen KB und KiB?"
    a: "KB, MB, GB und TB sind dezimale Einheiten: 1 KB sind 1.000 Byte. KiB, MiB und GiB sind binäre Einheiten: 1 KiB sind 1.024 Byte. Speicherhersteller zählen meist dezimal, Betriebssysteme zeigen oft binäre Größen an – deshalb erscheint ein Laufwerk mit „1 TB“ als etwa 931 GiB."
  - q: "Wie genau ist das Ergebnis?"
    a: "Das Ergebnis hat bis zu 10 signifikante Stellen ohne nachgestellte Nullen, 1 m in Meilen sind also 0,0006213711922. Sehr große oder sehr kleine Zahlen können in Exponentialschreibweise erscheinen, etwa 1e-7 für 0,0000001."
  - q: "Wie wird die Temperatur umgerechnet?"
    a: "Über Kelvin: Celsius ist Kelvin minus 273,15, und Fahrenheit ist (Kelvin − 273,15) × 9/5 + 32. Eine Temperatur unter dem absoluten Nullpunkt (0 K) wird mit einem Fehler abgelehnt."
---

## Was dieser Einheitenumrechner macht

Das Tool multipliziert Ihren Wert mit der Größe der Ausgangseinheit und teilt durch die Größe der Zieleinheit, beide gemessen an einer Basiseinheit (Meter, Kilogramm, Liter, Quadratmeter, Meter pro Sekunde, Sekunde oder Byte). Die Größen stammen aus den internationalen Definitionen, etwa 1 Zoll = 25,4 mm und 1 lb = 0,45359237 kg. Die Temperatur wird über Kelvin umgerechnet, weil Celsius und Fahrenheit nicht bei null beginnen.

## Optionen und Grenzen

- **Wert:** jede Zahl, auch negativ oder mit Nachkommastellen. Temperaturen unter dem absoluten Nullpunkt werden abgelehnt.
- **Gruppen:** Länge, Masse, Temperatur, Volumen, Fläche, Geschwindigkeit, Zeit und Datengröße. Beide Einheiten müssen zur selben Gruppe gehören.
- **Volumen:** nur US-amerikanische Einheiten.
- **Genauigkeit:** bis zu 10 signifikante Stellen, das Ergebnis kann sich also in der letzten Stelle von einem exakten Bruch unterscheiden.
- **Nicht enthalten:** Währungen, deren Kurse sich täglich ändern, sowie Kraftstoffverbrauch, Druck, Energie und andere Gruppen.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihre Eingabe nicht hoch, speichert sie nicht und verwendet keine Cookies.
