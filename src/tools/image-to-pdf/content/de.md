---
review: draft
updated: 2026-11-03
title: Bild in PDF – JPG, PNG und WebP online kostenlos in PDF umwandeln
description: Fassen Sie JPG-, PNG-, WebP- und AVIF-Bilder zu einem PDF zusammen, auf A4, Letter oder in Bildgröße. Kostenlos und privat – Ihre Bilder werden nie hochgeladen.
name: Bild in PDF
answer: Wählen Sie Ihre Bilder, bringen Sie sie in die richtige Reihenfolge, wählen Sie eine Seitengröße und klicken Sie auf PDF erstellen – jedes Bild wird zu einer Seite eines PDFs, das auf Ihrem Gerät entsteht und sofort heruntergeladen werden kann.
action: PDF erstellen
fields:
  files:
    label: Bilder (JPEG, PNG, WebP oder AVIF)
  pageSize:
    label: Seitengröße
    options:
      a4: A4 (210 × 297 mm)
      letter: US Letter (8,5 × 11 Zoll)
      fit: Wie das Bild
  orientation:
    label: Ausrichtung
    options:
      auto: Automatisch (je nach Bild)
      portrait: Hochformat
      landscape: Querformat
  margin:
    label: Rand
    options:
      none: Keiner
      small: Schmal (0,5 Zoll)
      large: Breit (1 Zoll)
output:
  file:
    label: PDF
errors:
  decode_failed: "Diese Datei konnte nicht als Bild gelesen werden. Sie ist möglicherweise beschädigt. Exportieren Sie sie erneut oder entfernen Sie sie aus der Liste und versuchen Sie es noch einmal:"
  too_large: "Dieses Bild hat zu viele Pixel, als dass Ihr Browser es verarbeiten könnte. Verkleinern Sie es mit Bildgröße ändern oder entfernen Sie es aus der Liste und versuchen Sie es noch einmal:"
steps:
  - Wählen Sie bis zu 50 JPEG-, PNG-, WebP- oder AVIF-Bilder mit je bis zu 50 MB aus. Sie können Dateien auch in mehreren Schritten hinzufügen.
  - Bringen Sie die Bilder mit den Pfeilen nach oben und unten in die richtige Reihenfolge. Das erste Bild wird die erste Seite.
  - Wählen Sie die Seitengröße. A4 und US Letter eignen sich für Dokumente, die Sie drucken möchten; mit Wie das Bild ist jede Seite genau so groß wie ihr Bild.
  - Lassen Sie bei A4 und US Letter die Ausrichtung auf Automatisch, damit die Seite bei breiten Bildern ins Querformat wechselt, oder wählen Sie Hochformat oder Querformat für alle Seiten. Wählen Sie einen Rand, wenn Sie weißen Platz um die Bilder möchten.
  - Klicken Sie auf PDF erstellen und laden Sie die Datei herunter.
faq:
  - q: Werden meine Bilder auf einen Server hochgeladen?
    a: Nein. Das PDF wird in Ihrem Browser mit PDFium erstellt, das zu WebAssembly kompiliert ist; Ihre Bilder verlassen Ihr Gerät also nie.
  - q: Verringert die Umwandlung in PDF die Bildqualität?
    a: Bei JPEG, PNG und verlustfreiem WebP nicht. JPEG-Dateien werden Byte für Byte ins PDF übernommen, ohne erneute Komprimierung, und PNG- sowie verlustfreie WebP-Bilder werden verlustfrei gespeichert. Verlustbehaftete WebP- und AVIF-Bilder ohne Transparenz werden mit Qualität 90 in JPEG umgewandelt, damit die Datei klein bleibt; dabei können leichte Kompressionsartefakte entstehen.
  - q: Mein Handyfoto liegt in anderen Tools auf der Seite. Steht es hier richtig?
    a: Ja. Handys speichern Fotos oft in der Ausrichtung des Sensors und vermerken die Drehung in einem Tag. Das Tool liest dieses Tag und platziert das Foto aufrecht, ohne es neu zu kodieren.
  - q: Wie werden die Bilder auf A4- oder Letter-Seiten platziert?
    a: Jedes Bild wird unter Beibehaltung der Proportionen so skaliert, dass es innerhalb der Ränder passt, und auf der Seite zentriert. Kleine Bilder werden vergrößert, bis sie den Platz ausfüllen; sehr kleine Bilder können deshalb im Druck unscharf aussehen.
  - q: Wie groß ist eine Seite mit Wie das Bild?
    a: Die Seite erhält die Größe des Bildes bei 96 Pixeln pro Zoll, plus Rand. Ein Screenshot mit 1920 × 1080 Pixeln wird zu einer Seite mit 20 × 11,25 Zoll.
  - q: Kann ich HEIC-Fotos vom iPhone hinzufügen?
    a: Nicht direkt. Wandeln Sie sie zuerst mit dem Bildkonverter in JPEG um und fügen Sie dann die JPEG-Dateien hier hinzu.
---

## So entsteht das PDF

Das Tool verwendet PDFium – die PDF-Engine von Google Chrome – kompiliert zu WebAssembly und legt für jedes Bild eine Seite in der Reihenfolge Ihrer Liste an. Jede Datei wird zuerst von Ihrem Browser dekodiert, um sicherzustellen, dass sie ein lesbares Bild ist. Danach werden JPEG-Dateien unverändert eingebettet, und ihr Drehungs-Tag wird angewendet, indem das Bild auf der Seite gedreht wird. PNG-Bilder, verlustfreie WebP-Bilder und alle Bilder mit Transparenz werden verlustfrei gespeichert; in transparenten Bereichen ist die weiße Seite zu sehen. Verlustbehaftete WebP- und AVIF-Bilder ohne Transparenz werden mit Qualität 90 in JPEG umgewandelt. Die Arbeit läuft in einem Hintergrund-Thread, die Seite bleibt also bedienbar.

## Optionen und Grenzen

- **Eingabe:** 1 bis 50 JPEG-, PNG-, WebP- oder AVIF-Bilder mit je bis zu 50 MB. HEIC wird nicht angenommen; wandeln Sie es zuerst mit dem [Bildkonverter](/de/image-converter) um.
- **Seiten:** A4 (210 × 297 mm), US Letter (8,5 × 11 Zoll) oder die Größe des jeweiligen Bildes bei 96 Pixeln pro Zoll. Die Ränder betragen auf jeder Seite 0,5 Zoll (12,7 mm) oder 1 Zoll (25,4 mm).
- **Platzierung:** Bilder behalten ihre Proportionen, werden zentriert und vergrößert oder verkleinert, bis sie innerhalb der Ränder passen. Es wird nichts abgeschnitten.
- **Ausgabe:** ein PDF, benannt nach dem ersten Bild. Text in den Bildern ist nicht durchsuchbar oder markierbar.
- **Speicher:** Verlustfrei gespeicherte Bilder werden bis zum Speichern des PDFs unkomprimiert im Speicher gehalten; viele große Screenshots können daher auf Handys fehlschlagen. Erstellen Sie das PDF in kleineren Gruppen und fügen Sie sie mit [PDF zusammenfügen](/de/merge-pdf) zusammen.

Um Fotos vor dem Hinzufügen zu verkleinern, nutzen Sie [Bildgröße ändern](/de/image-resizer); um PDF-Seiten wieder in Bilder umzuwandeln, nutzen Sie [PDF in Bild](/de/pdf-to-image).

## Datenschutz

Ihre Bilder werden nur auf Ihrem Gerät verarbeitet. Die Seite lädt sie nicht hoch, speichert sie nicht und verwendet keine Cookies.
