---
review: reviewed
updated: 2026-11-14
title: Hintergrund entfernen – Bildhintergrund online kostenlos entfernen
description: "Entfernen Sie den Hintergrund eines Fotos – als transparentes PNG oder WebP oder mit einfarbigem Hintergrund. Kostenlos und privat: Die KI läuft in Ihrem Browser."
name: Hintergrund entfernen
answer: "Wählen Sie ein Foto, behalten Sie PNG für einen transparenten Hintergrund oder geben Sie eine Hintergrundfarbe ein, und klicken Sie auf Hintergrund entfernen, damit ein KI-Modell auf Ihrem Gerät den Hintergrund zum Herunterladen entfernt."
action: Hintergrund entfernen
fields:
  file:
    label: Bild (HEIC, JPEG, PNG, WebP oder AVIF)
  format:
    label: Ausgabeformat
    options:
      png: PNG (transparent)
      webp: "WebP (transparent)"
      jpeg: JPEG (braucht eine Hintergrundfarbe)
  background:
    label: Hintergrundfarbe (Hex)
    placeholder: "Transparent oder eine Farbe wie #ffffff"
  quality:
    label: Qualität (1–100)
output:
  file:
    label: Bild ohne Hintergrund
errors:
  decode_failed: Diese Datei konnte nicht als Bild gelesen werden. Sie ist vielleicht beschädigt, oder Ihr Browser kann das Format nicht dekodieren. Exportieren Sie sie erneut als JPEG oder PNG und versuchen Sie es noch einmal.
  too_large: Ihr Browser kann so viele Pixel nicht speichern. Browser auf Smartphones erlauben weniger als auf Computern; versuchen Sie ein kleineres Bild oder einen Computer.
  background_required: "JPEG unterstützt keine Transparenz und braucht deshalb eine Hintergrundfarbe. Geben Sie eine ein, etwa #ffffff für Weiß, oder wählen Sie PNG oder WebP, um den Hintergrund transparent zu lassen."
  invalid_color: "Geben Sie die Hintergrundfarbe als Hex-Code mit drei oder sechs Stellen ein, etwa #fff oder #ffffff, oder lassen Sie das Feld leer. Nicht lesbar:"
steps:
  - Wählen Sie ein HEIC-, JPEG-, PNG-, WebP- oder AVIF-Bild mit bis zu 50 MB.
  - "Wählen Sie unter Ausgabeformat ein Format. PNG und WebP lassen den Hintergrund transparent; JPEG braucht eine Hintergrundfarbe."
  - "Um das Motiv auf eine einfarbige Fläche zu setzen, geben Sie die Farbe unter Hintergrundfarbe (Hex) ein, etwa #ffffff."
  - "Klicken Sie auf Hintergrund entfernen. Beim ersten Mal werden das KI-Modell und seine Laufzeitumgebung (etwa 125–150 MB) heruntergeladen und, wenn genug Platz ist, im Browser gespeichert."
  - Laden Sie das Bild ohne Hintergrund herunter.
faq:
  - q: Werden meine Fotos auf einen Server hochgeladen?
    a: "Nein. Das Bild wird in Ihrem Browser dekodiert, vom Modell analysiert und neu kodiert. Das Tool lädt das KI-Modell und seine Laufzeitumgebung herunter, aber Ihr Foto verlässt Ihr Gerät nie."
  - q: Wie bekomme ich einen weißen Hintergrund, etwa für ein Produktfoto?
    a: "Geben Sie #ffffff als Hintergrundfarbe ein. Das Motiv wird auf Weiß gesetzt, und das Ergebnis hat keine Transparenz, sodass Sie es auch als JPEG speichern können."
  - q: Warum dauert es beim ersten Mal länger?
    a: "Das Tool lädt zuerst das BiRefNet-Modell und seine Laufzeitumgebung herunter, je nach Gerät etwa 125–150 MB, und speichert sie im Browser, wenn genug Platz ist. Spätere Durchläufe können die gespeicherte Kopie nutzen, solange der Browser sie behält."
  - q: "Kann ich auswählen, welches Objekt erhalten bleibt?"
    a: "Nein. Das Modell wählt das Hauptmotiv selbst aus, und es gibt keine Möglichkeit, ein Objekt von Hand zu markieren. Prüfen Sie die Kanten des Ergebnisses vor der Verwendung."
  - q: Kann ich den Hintergrund mehrerer Bilder auf einmal entfernen?
    a: Nicht mit diesem Tool, das ein Bild nach dem anderen bearbeitet. Sobald das Modell geladen ist, werden weitere Bilder ohne erneuten Download verarbeitet.
  - q: Bleiben die EXIF-Daten des Fotos erhalten?
    a: Nein. Das Bild wird aus seinen Pixeln neu kodiert, daher sind EXIF-Daten wie Kameramodell und GPS-Standort nicht im Ergebnis. Bei JPEG, PNG, WebP und AVIF wird die EXIF-Ausrichtung zuerst angewendet, sodass das Ergebnis richtig herum ist.
---

## So wird der Hintergrund entfernt

Das Tool dekodiert das Bild mit dem eingebauten Bilddecoder Ihres Browsers, bei HEIC mit einer WebAssembly-Version von libheif, und übergibt eine Kopie an BiRefNet_lite, ein quelloffenes Segmentierungsmodell (MIT-Lizenz). Das Modell läuft mit ONNX Runtime in einem Hintergrund-Thread und berechnet für jedes Pixel, wie wahrscheinlich es ist, dass es zum Motiv gehört. Diese Maske wird auf die volle Größe Ihres Bildes skaliert und wird zu seiner Transparenz: Das Motiv bleibt erhalten, und der Hintergrund wird transparent oder mit der eingegebenen Farbe gefüllt. Das Ergebnis wird als PNG (danach mit OxiPNG optimiert), WebP oder JPEG kodiert.

## Optionen und Grenzen

- **Eingabe:** ein HEIC-, JPEG-, PNG-, WebP- oder AVIF-Bild mit bis zu 50 MB. Bereiche, die schon transparent sind, bleiben transparent, außer Sie geben eine Hintergrundfarbe ein.
- **Ausgabe:** PNG und WebP behalten den transparenten Hintergrund; JPEG unterstützt keine Transparenz und braucht eine Hintergrundfarbe. Breite und Höhe des Bildes bleiben gleich.
- **Hintergrundfarbe:** ein Hex-Code wie #ffffff oder #fff. Leer lassen für einen transparenten Hintergrund.
- **Qualität:** gilt für WebP und JPEG, Standard ist 90. PNG ist immer verlustfrei.
- **Browser:** Mit WebGPU und einer GPU, die 16-Bit-Gleitkommazahlen unterstützt, läuft das Modell auf der GPU und analysiert das Bild mit 1024 × 1024 Pixeln. Sonst läuft es auf der CPU mit 512 × 512 Pixeln, sodass die Kanten bei großen Bildern weniger genau sein können. Auf der CPU nutzt es mehrere Threads, wenn der Browser es erlaubt.
- **Download:** Modell und Laufzeitumgebung sind mit WebGPU etwa 150 MB groß, ohne etwa 125 MB, und werden bei der ersten Nutzung heruntergeladen.
- **Genauigkeit:** Das Modell findet das Hauptmotiv automatisch; Sie können nicht wählen, welches Objekt erhalten bleibt.

## Datenschutz

Ihre Bilder werden nur auf Ihrem Gerät verarbeitet. Die Seite lädt sie nicht hoch, speichert sie nicht und verwendet keine Cookies.
