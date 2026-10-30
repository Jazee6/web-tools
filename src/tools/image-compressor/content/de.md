---
review: draft
updated: 2026-10-30
title: Bildkompressor – JPEG, PNG, WebP und AVIF online komprimieren
description: JPEG-, PNG-, WebP- und AVIF-Bilder komprimieren, ohne sie hochzuladen. Kostenlos und privat – die Komprimierung läuft in Ihrem Browser mit denselben Codecs wie Squoosh.
name: Bildkompressor
answer: Wählen Sie ein oder mehrere Bilder, passen Sie bei Bedarf die Qualität an und klicken Sie auf Bilder komprimieren – jede Datei wird auf Ihrem Gerät im selben Format neu kodiert, danach laden Sie die kleineren Kopien herunter.
action: Bilder komprimieren
fields:
  files:
    label: Bilder (JPEG, PNG, WebP oder AVIF)
  quality:
    label: Qualität (1–100)
output:
  files:
    label: Komprimierte Bilder
errors:
  decode_failed: Dieses Bild konnte nicht gelesen werden. Es ist möglicherweise beschädigt oder in einem Format, das Ihr Browser nicht dekodieren kann. Versuchen Sie eine andere Kopie des Bildes oder öffnen Sie die Seite in der neuesten Version von Chrome, Firefox oder Safari.
steps:
  - Wählen Sie bis zu 20 JPEG-, PNG-, WebP- oder AVIF-Bilder mit je bis zu 50 MB. Sie können Dateien in mehreren Schritten hinzufügen und per Klick auf eine Vorschau vergrößern.
  - Behalten Sie die Standardqualität 75 bei oder legen Sie einen eigenen Wert fest – niedrigere Werte ergeben kleinere Dateien mit sichtbareren Artefakten. PNG ignoriert diese Einstellung, weil es immer verlustfrei komprimiert wird.
  - Prüfen Sie die geschätzte Größe unter jeder Datei; sie aktualisiert sich, wenn Sie die Qualität ändern.
  - Klicken Sie auf Bilder komprimieren und warten Sie kurz; große AVIF-Dateien können einige Sekunden dauern.
  - Vergleichen Sie jedes Original mit seiner komprimierten Kopie und laden Sie die Dateien einzeln oder gemeinsam als ZIP herunter.
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
  - q: Wie genau ist die geschätzte Größe?
    a: Bilder bis etwa 1 Megapixel werden für die Schätzung tatsächlich einmal kodiert, die Zahl stimmt also mit dem Ergebnis überein. Größere Bilder werden geschätzt, indem einige Ausschnitte in Originalauflösung kodiert und auf das ganze Bild hochgerechnet werden – meist liegt der Wert nah am Ergebnis, bei Fotos mit sehr ungleich verteilten Details kann er stärker abweichen. Die Schätzung übersteigt nie die Originalgröße, denn wenn das erneute Kodieren die Datei vergrößern würde, wird das Original unverändert zurückgegeben.
---

## So funktioniert die Komprimierung

JPEG-Dateien werden mit MozJPEG neu kodiert, WebP mit libwebp und AVIF mit libaom – die Codecs aus Googles Squoosh, kompiliert zu WebAssembly. PNG-Dateien werden mit OxiPNG verlustfrei optimiert. Alles läuft in einem Hintergrund-Thread, sodass die Seite auch bei großen Bildern reaktionsfähig bleibt.

## Grenzen

- **Formate:** JPEG, PNG, WebP und AVIF als Eingabe; Ausgabe im selben Format. Andere Formate wie GIF, SVG oder BMP werden nicht akzeptiert.
- **Größe:** bis zu 50 MB pro Bild. Sehr große Bilder brauchen viel Speicher und können auf Smartphones fehlschlagen.
- **Anzahl:** bis zu 20 Bilder auf einmal, die nacheinander verarbeitet werden. Die Ergebnisse lassen sich einzeln oder als ein ZIP herunterladen.
- **Animation:** Animierte WebP- und AVIF-Dateien werden auf das erste Bild reduziert.
- **Geschwindigkeit:** AVIF ist am langsamsten. In Browsern, die Multithreading erlauben, werden mehrere CPU-Kerne genutzt.
- **Browser:** Ihr Browser dekodiert das Bild zuerst; ein Format, das er nicht darstellen kann, etwa AVIF in einem älteren Browser, wird abgelehnt.

## Datenschutz

Ihre Bilder werden ausschließlich auf Ihrem Gerät verarbeitet. Die Seite lädt sie nicht hoch, speichert sie nicht und verwendet keine Cookies.
