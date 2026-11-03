---
review: draft
updated: 2026-11-03
title: Bild zuschneiden – JPEG, PNG & WebP online zuschneiden und drehen
description: Schneiden Sie ein Bild auf einen beliebigen Bereich oder ein Seitenverhältnis wie 1:1 oder 16:9 zu und drehen oder spiegeln Sie es vorher. Kostenlos, privat, im Browser.
name: Bild zuschneiden
answer: Wählen Sie ein Bild, ziehen Sie den Zuschnittrahmen oder wählen Sie ein Seitenverhältnis, drehen oder spiegeln Sie es bei Bedarf und klicken Sie auf Bild zuschneiden – das Bild wird auf Ihrem Gerät im selben Format zugeschnitten.
action: Bild zuschneiden
fields:
  file:
    label: Bild (JPEG, PNG, WebP oder AVIF)
  rotate:
    label: Im Uhrzeigersinn drehen
    options:
      "0": Nicht drehen
      "90": 90°
      "180": 180°
      "270": 270°
  flipHorizontal:
    label: Horizontal spiegeln
  flipVertical:
    label: Vertikal spiegeln
  aspect:
    label: Seitenverhältnis
    options:
      free: Frei
      "1:1": 1:1 (quadratisch)
      "4:3": 4:3 (Querformat)
      "3:4": 3:4 (Hochformat)
      "3:2": 3:2 (Querformat)
      "2:3": 2:3 (Hochformat)
      "16:9": 16:9 (Breitbild)
      "9:16": 9:16 (Hochkant)
  crop:
    label: Zuschnittbereich (x, y, Breite, Höhe in px)
    placeholder: Ganzes Bild oder mittig im Seitenverhältnis
  quality:
    label: Qualität (1–100)
output:
  file:
    label: Zugeschnittenes Bild
errors:
  decode_failed: Diese Datei konnte nicht als Bild gelesen werden. Sie ist möglicherweise beschädigt. Exportieren Sie sie erneut und versuchen Sie es noch einmal.
  too_large: Ihr Browser kann so viele Pixel nicht speichern. Browser auf Smartphones erlauben weniger als auf Computern; versuchen Sie einen kleineren Zuschnittbereich oder einen Computer.
  crop_out_of_range: "Der Zuschnittbereich ragt über den Bildrand hinaus. Halten Sie ihn innerhalb der Bildgröße nach dem Drehen, in Pixeln:"
  invalid_crop: "Geben Sie den Zuschnittbereich als vier ganze Zahlen ein – x, y, Breite und Höhe –, zum Beispiel 40, 0, 240, 240. Nicht lesbar:"
steps:
  - Wählen Sie ein JPEG-, PNG-, WebP- oder AVIF-Bild mit bis zu 50 MB.
  - Wählen Sie bei Bedarf, wie weit es im Uhrzeigersinn gedreht und ob es gespiegelt werden soll. Die Vorschau zeigt das Ergebnis, und der Zuschnitt wird darauf gemessen.
  - Wählen Sie ein Seitenverhältnis oder lassen Sie Frei. Ziehen Sie den Zuschnittrahmen, um ihn zu verschieben, und seine Ecken, um die Größe zu ändern, oder geben Sie den Bereich als x, y, Breite, Höhe ein.
  - Klicken Sie auf Bild zuschneiden und laden Sie das zugeschnittene Bild herunter.
faq:
  - q: Werden meine Bilder auf einen Server hochgeladen?
    a: Nein. Das Bild wird in Ihrem Browser dekodiert, zugeschnitten und neu kodiert und verlässt Ihr Gerät daher nie.
  - q: Wie schneide ich ein Bild quadratisch zu?
    a: Wählen Sie 1:1 (quadratisch) als Seitenverhältnis. Der Zuschnittrahmen wird zum größten Quadrat in der Bildmitte, und Sie können ihn auf den Teil ziehen, den Sie behalten möchten, bevor Sie auf Bild zuschneiden klicken.
  - q: Wie wechsle ich zwischen Quer- und Hochformat, etwa von 16:9 zu 9:16?
    a: Wählen Sie das andere Verhältnis in der Liste oder klicken Sie auf die Wechseltaste unter der Vorschau. Wenn Sie Seitenverhältnis, Drehung oder Spiegelung ändern, springt der Zuschnittrahmen auf den mittigen Bereich zurück.
  - q: Verringert das Zuschneiden die Qualität?
    a: Die behaltenen Pixel werden eins zu eins kopiert, ohne Skalierung. JPEG, WebP und AVIF werden danach mit der eingestellten Qualität neu kodiert (Standard 85), was einen kleinen Kompressionsverlust bringt; PNG bleibt verlustfrei.
  - q: Kann ich gleichzeitig zuschneiden und die Größe ändern?
    a: Nicht mit diesem Tool, das die zugeschnittenen Pixel in ihrer Größe belässt. Schneiden Sie zuerst zu und ändern Sie dann Breite und Höhe mit [Bildgröße ändern](/de/image-resizer).
  - q: Bleiben die EXIF-Daten des Fotos erhalten?
    a: Nein. Das Bild wird aus seinen Pixeln neu kodiert, daher sind EXIF-Daten wie Kameramodell und GPS-Standort nicht im Ergebnis. Die EXIF-Ausrichtung wird zuerst angewendet, sodass Vorschau und Ergebnis richtig herum sind.
---

## So funktioniert das Zuschneiden

Das Tool dekodiert das Bild mit dem eingebauten Bilddecoder Ihres Browsers, der auch die EXIF-Ausrichtung anwendet. Es dreht das Bild in 90°-Schritten im Uhrzeigersinn, spiegelt das gedrehte Bild und kopiert die Pixel im Zuschnittbereich ohne Glättung auf eine Canvas, sodass kein Pixel vermischt oder verschoben wird. Der Zuschnitt wird auf dem Bild gemessen, wie Sie es in der Vorschau sehen, also nach dem Drehen und Spiegeln. Das Ergebnis wird mit WebAssembly-Builds von MozJPEG, libwebp und libaom neu kodiert, PNG-Ausgaben laufen über OxiPNG. Die Arbeit läuft in einem Hintergrund-Thread.

## Optionen und Grenzen

- **Eingabe:** ein JPEG-, PNG-, WebP- oder AVIF-Bild mit bis zu 50 MB. Das Ausgabeformat ist immer dasselbe wie die Eingabe.
- **Zuschnittbereich:** x und y sind die obere linke Ecke in ganzen Pixeln, und der Bereich muss im Bild liegen. Lassen Sie ihn leer, um das ganze Bild zu behalten oder den größten mittigen Bereich im gewählten Seitenverhältnis. Wenn Sie einen Bereich eingeben, steuert das Seitenverhältnis nur den Zuschnittrahmen.
- **Drehen und Spiegeln:** gedreht wird um 90°, 180° oder 270° im Uhrzeigersinn; das Spiegeln kehrt das gedrehte Bild von links nach rechts oder von oben nach unten um.
- **Qualität:** gilt für JPEG, WebP und AVIF, Standardwert ist 85. PNG ist immer verlustfrei.
- **Transparenz:** bleibt bei PNG, WebP und AVIF erhalten.
- **Browser:** Browser auf Smartphones erlauben insgesamt weniger Pixel als auf Computern, daher können sehr große Bilder mit einer Meldung abbrechen. AVIF- und PNG-Kodierung nutzen mehrere Threads, wo der Browser es erlaubt; WebKit-basierte Browser wie Safari verwenden einen, daher dauern diese Formate dort länger.

## Datenschutz

Ihre Bilder werden nur auf Ihrem Gerät verarbeitet. Die Seite lädt sie nicht hoch, speichert sie nicht und verwendet keine Cookies.
