---
review: draft
updated: 2026-10-23
title: Bildkompressor – JPEG, PNG, WebP und AVIF online komprimieren
description: JPEG-, PNG-, WebP- und AVIF-Bilder verkleinern, ohne sie hochzuladen. Kostenlos und privat – komprimiert wird im Browser mit denselben Codecs wie Squoosh.
name: Bildkompressor
answer: Wählen Sie ein Bild, passen Sie bei Bedarf die Qualität an und klicken Sie auf Bild komprimieren – die Datei wird auf Ihrem Gerät im selben Format neu kodiert, danach laden Sie die kleinere Kopie herunter.
action: Bild komprimieren
fields:
  file:
    label: Bild (JPEG, PNG, WebP oder AVIF)
  quality:
    label: Qualität (1–100)
output:
  file:
    label: Komprimiertes Bild
errors:
  decode_failed: Dieses Bild konnte nicht gelesen werden. Es ist möglicherweise beschädigt oder in einem Format, das Ihr Browser nicht dekodieren kann.
steps:
  - Wählen Sie ein JPEG-, PNG-, WebP- oder AVIF-Bild mit bis zu 50 MB.
  - Behalten Sie die Standardqualität 75 bei oder legen Sie einen eigenen Wert fest – niedrigere Werte ergeben kleinere Dateien mit sichtbareren Artefakten. PNG ignoriert diese Einstellung, weil es immer verlustfrei komprimiert wird.
  - Klicken Sie auf Bild komprimieren und warten Sie kurz; große AVIF-Dateien können einige Sekunden dauern.
  - Prüfen Sie die neue Dateigröße und laden Sie das komprimierte Bild herunter.
faq:
  - q: Werden meine Bilder auf einen Server hochgeladen?
    a: Nein. Das Bild wird in Ihrem Browser mit WebAssembly-Codecs dekodiert und neu kodiert und verlässt Ihr Gerät nie.
  - q: Welche Qualität sollte ich wählen?
    a: 75 ist ein guter Standardwert für Fotos – der Unterschied ist kaum zu sehen, die Datei meist deutlich kleiner. Nehmen Sie 85–90 für Bilder mit feiner Schrift oder scharfen Kanten und 50–65, wenn die Größe wichtiger ist als Details, etwa bei Vorschaubildern.
  - q: Warum wird mein PNG nur wenig kleiner?
    a: Die PNG-Komprimierung ist hier verlustfrei – jedes Pixel bleibt exakt gleich, nur die Kodierung wird optimiert. Dateien, die bereits mit einem Optimierungstool gespeichert wurden, schrumpfen oft kaum. Bei Fotos spart die Umwandlung in JPEG, WebP oder AVIF weit mehr.
  - q: Ändert die Komprimierung Abmessungen oder Format?
    a: Nein. Das Ergebnis behält das ursprüngliche Format und die Pixelmaße. Würde die Datei durch das Neukodieren größer, erhalten Sie das Original unverändert zurück.
  - q: Bleiben die Metadaten des Fotos erhalten?
    a: Bei JPEG, WebP und AVIF werden Metadaten wie EXIF-Kameradaten und GPS-Standort entfernt, was auch Ihre Privatsphäre schützt. Das Bild wird vorher anhand der EXIF-Ausrichtung gedreht und wird daher weiterhin richtig herum angezeigt.
---

## So funktioniert die Komprimierung

JPEG-Dateien werden mit MozJPEG neu kodiert, WebP mit libwebp und AVIF mit libaom – die Codecs aus Googles Squoosh, kompiliert zu WebAssembly. PNG-Dateien werden mit OxiPNG verlustfrei optimiert. Alles läuft in einem Hintergrund-Thread, sodass die Seite auch bei großen Bildern reaktionsfähig bleibt.

## Grenzen

- **Formate:** JPEG, PNG, WebP und AVIF als Eingabe; Ausgabe im selben Format.
- **Größe:** bis zu 50 MB pro Bild. Sehr große Bilder brauchen viel Speicher und können auf Smartphones fehlschlagen.
- **Ein Bild auf einmal.** Animierte WebP- und AVIF-Dateien werden auf das erste Bild reduziert.
- **Geschwindigkeit:** AVIF ist am langsamsten. In Browsern, die Multithreading erlauben, werden mehrere CPU-Kerne genutzt.

## Datenschutz

Ihr Bild wird ausschließlich auf Ihrem Gerät verarbeitet. Die Seite lädt es nicht hoch, speichert es nicht und verwendet keine Cookies.
