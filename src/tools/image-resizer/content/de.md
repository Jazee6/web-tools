---
review: draft
updated: 2026-11-02
title: Bildgröße ändern – JPEG, PNG, WebP und AVIF online kostenlos
description: Ändern Sie die Größe von Bildern auf eine genaue Breite und Höhe, kostenlos. Privat und schnell – alles läuft in Ihrem Browser, Ihre Fotos werden nie hochgeladen.
name: Bildgröße ändern
answer: Wählen Sie Ihre Bilder, geben Sie eine Breite, eine Höhe oder beides ein und klicken Sie auf Bildgröße ändern – die Größe wird auf Ihrem Gerät im selben Format angepasst, danach laden Sie die Ergebnisse herunter.
action: Bildgröße ändern
fields:
  files:
    label: Bilder (JPEG, PNG, WebP oder AVIF)
  width:
    label: Breite (px)
    placeholder: Auto
  height:
    label: Höhe (px)
    placeholder: Auto
  fit:
    label: Wenn beide Maße angegeben sind
    options:
      contain: Einpassen und Proportionen beibehalten
      cover: Größe ausfüllen und Überstand zuschneiden
      stretch: Auf die genaue Größe strecken
  quality:
    label: Qualität (1–100)
output:
  files:
    label: Bilder mit geänderter Größe
errors:
  decode_failed: "Diese Datei konnte nicht als Bild gelesen werden. Sie ist möglicherweise beschädigt. Exportieren Sie sie erneut oder entfernen Sie sie und versuchen Sie es noch einmal:"
  too_large: "Das Bild würde zu groß: Eine Seite würde 10.000 Pixel überschreiten, oder Ihr Browser kann so viele Pixel nicht speichern. Geben Sie eine kleinere Größe ein und versuchen Sie es noch einmal:"
  size_required: Geben Sie eine Breite, eine Höhe oder beides ein.
steps:
  - Wählen Sie bis zu 20 JPEG-, PNG-, WebP- oder AVIF-Bilder mit je bis zu 50 MB.
  - Geben Sie eine Breite, eine Höhe oder beides in Pixeln ein. Wenn Sie nur ein Maß eingeben, ergibt sich das andere aus den Proportionen des jeweiligen Bildes.
  - Wenn Sie beide Maße eingegeben haben, legen Sie fest, wie das Bild diese Größe nutzt. Einpassen behält das ganze Bild, Ausfüllen schneidet den Überstand gleichmäßig an beiden Seiten ab, und Strecken ignoriert die Proportionen.
  - Klicken Sie auf Bildgröße ändern und laden Sie dann jedes Bild einzeln oder alle gemeinsam als ZIP herunter.
faq:
  - q: Werden meine Bilder auf einen Server hochgeladen?
    a: Nein. Die Bilder werden in Ihrem Browser dekodiert, in der Größe geändert und kodiert und verlassen Ihr Gerät nie.
  - q: Wie behalte ich die Proportionen bei?
    a: Geben Sie nur eine Breite oder nur eine Höhe ein, dann wird das andere Maß aus den Proportionen des jeweiligen Bildes berechnet. Bei beiden Maßen lassen Sie „Einpassen und Proportionen beibehalten“ ausgewählt. Das Bild passt dann in diese Größe, eine Seite kann also kleiner ausfallen.
  - q: Wie erhalte ich eine exakte Größe, ohne das Bild zu verzerren?
    a: Geben Sie Breite und Höhe ein und wählen Sie „Größe ausfüllen und Überstand zuschneiden“. Das Bild wird so weit skaliert, bis es die Größe ausfüllt, und was übersteht, wird gleichmäßig an beiden Seiten abgeschnitten.
  - q: Kann ich ein Bild vergrößern?
    a: Ja, bis zu 10.000 Pixel pro Seite. Beim Vergrößern werden die vorhandenen Pixel nur auf eine größere Fläche verteilt, das Bild wird dadurch weicher und gewinnt keine neuen Details.
  - q: Kann ich HEIC-Fotos vom iPhone verkleinern?
    a: Nicht direkt. Wandeln Sie sie zuerst mit dem [Bildkonverter](/de/image-converter) um und ändern Sie danach die Größe des Ergebnisses.
  - q: Bleiben die EXIF-Daten des Fotos erhalten?
    a: Nein. Das Bild wird aus seinen Pixeln neu kodiert, daher fehlen EXIF-Daten wie Kameramodell und GPS-Standort im Ergebnis. Die EXIF-Ausrichtung wird vorher auf das Bild angewendet, sodass Fotos richtig herum bleiben.
---

## So funktioniert die Größenänderung

Das Tool dekodiert jedes Bild mit dem eingebauten Bilddecoder Ihres Browsers, der auch die EXIF-Ausrichtung anwendet. Es zeichnet das Bild in der neuen Größe auf eine Canvas und verkleinert starke Verkleinerungen in Schritten von höchstens der Hälfte, damit feine Details nicht gezackt werden. Das Ergebnis wird mit WebAssembly-Builds von MozJPEG, libwebp und libaom neu kodiert, PNG-Ausgaben laufen über OxiPNG. Die Arbeit läuft in einem Hintergrund-Thread, ein Bild nach dem anderen.

## Optionen und Grenzen

- **Eingabe:** 1 bis 20 JPEG-, PNG-, WebP- oder AVIF-Bilder mit je bis zu 50 MB. Das Ausgabeformat ist immer dasselbe wie die Eingabe.
- **Größe:** 1 bis 10.000 Pixel pro Seite. Browser auf Smartphones erlauben möglicherweise weniger Pixel insgesamt; das Tool bricht dann mit einer Meldung ab.
- **Qualität:** gilt für JPEG, WebP und AVIF, Standardwert ist 85. PNG ist immer verlustfrei.
- **Transparenz:** bleibt bei PNG, WebP und AVIF erhalten.
- **Browser:** AVIF- und PNG-Kodierung nutzen mehrere Threads, wo der Browser es erlaubt; WebKit-basierte Browser wie Safari verwenden einen, daher dauern diese Formate dort länger.

## Datenschutz

Ihre Bilder werden nur auf Ihrem Gerät verarbeitet. Die Seite lädt sie nicht hoch, speichert sie nicht und verwendet keine Cookies.
