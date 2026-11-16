---
review: reviewed
updated: 2026-11-16
title: QR-Code-Scanner – QR-Codes und Barcodes aus Bildern online lesen
description: "Lesen Sie QR-Codes und Barcodes aus Screenshots, Fotos oder mit der Kamera und kopieren Sie den Inhalt. Kostenlos und privat – das Scannen läuft in Ihrem Browser."
name: QR-Code-Scanner
answer: Wählen Sie ein Bild mit einem QR-Code oder Barcode, oder klicken Sie auf Kamera verwenden und richten Sie sie auf den Code – der dekodierte Text erscheint sofort mit dem Codetyp und lässt sich kopieren.
action: Scannen
fields:
  file:
    label: Bild (JPEG, PNG, WebP, GIF, BMP oder AVIF)
output:
  codes:
    label: Gefundene Codes
    columns:
      text: Inhalt
      format: Typ
errors:
  decode_failed: Diese Datei konnte nicht als Bild gelesen werden. Sie ist möglicherweise beschädigt, oder Ihr Browser kann das Format nicht dekodieren. Exportieren Sie sie erneut als JPEG oder PNG und versuchen Sie es noch einmal.
  too_large: Dieses Bild hat möglicherweise mehr Pixel, als Ihr Browser verarbeiten kann. Browser auf Smartphones erlauben weniger als auf Computern; versuchen Sie es mit einem kleineren Bild oder an einem Computer.
  not_found: In diesem Bild wurde kein QR-Code und kein Barcode gefunden. Achten Sie darauf, dass der ganze Code im Bild, scharf und nicht zu klein ist, oder schneiden Sie das Bild auf den Code zu und versuchen Sie es erneut.
steps:
  - Wählen Sie unter Bild (JPEG, PNG, WebP, GIF, BMP oder AVIF) ein Bild, etwa einen Screenshot oder ein Foto eines Codes. Das Bild wird gescannt, sobald Sie es wählen.
  - Oder klicken Sie auf Kamera verwenden, erlauben Sie den Kamerazugriff und halten Sie den Code vor die Kamera. Die Kamera schaltet sich aus, sobald ein Code gelesen wurde.
  - Lesen Sie Inhalt und Typ jedes gefundenen Codes ab und kopieren Sie den Text, den Sie brauchen.
faq:
  - q: Ist es sicher, den Link in einem QR-Code zu öffnen?
    a: Prüfen Sie ihn zuerst. Das Tool zeigt nur den im Code gespeicherten Text und öffnet nie selbst Links, sodass Sie sehen, wohin ein Link führt, bevor Sie ihn aufrufen. Seien Sie vorsichtig bei Kurzlinks und Adressen, die eine bekannte Website nachahmen.
  - q: Kann es auch Barcodes lesen?
    a: Ja. Neben QR-Codes liest es Micro QR, rMQR, Data Matrix, Aztec, PDF417 und MaxiCode sowie Barcodes wie EAN-13, EAN-8, UPC-A, UPC-E, Code 39, Code 93, Code 128, Codabar, ITF und DataBar. Die Spalte Typ zeigt, um welche Art von Code es sich jeweils handelt.
  - q: Was passiert bei mehreren Codes in einem Bild?
    a: Alle werden aufgelistet, jeweils mit Inhalt und Typ, bis zu 255 Codes pro Bild.
  - q: Warum funktioniert die Kamera nicht?
    a: Ihr Browser muss der Seite erlauben, die Kamera zu verwenden; wenn Sie das blockiert haben, erlauben Sie den Kamerazugriff in den Website-Einstellungen und klicken Sie erneut auf Kamera verwenden. In Browsern ohne Kameraunterstützung ist die Schaltfläche nicht verfügbar. Sie können jederzeit ein Foto oder einen Screenshot des Codes machen und ihn als Bild wählen.
  - q: Warum wurde kein Code gefunden?
    a: Der Code ist möglicherweise unscharf, zu klein, am Bildrand abgeschnitten oder zu kontrastarm. Verwenden Sie ein schärferes Bild, schneiden Sie es auf den Code zu oder halten Sie die Kamera näher heran. Das Tool versucht auch, Codes mit hellen Modulen auf dunklem Hintergrund zu lesen.
---

## So funktioniert das Scannen

Das Bild wird vom eingebauten Bilddecoder Ihres Browsers dekodiert und mit [zxing-cpp](https://github.com/zxing-cpp/zxing-cpp) durchsucht, einer Open-Source-Barcode-Bibliothek, die zu WebAssembly kompiliert ist und in einem Hintergrund-Thread läuft. Sie sucht gleichzeitig nach allen unterstützten Codetypen, probiert auch gedrehte, gespiegelte und invertierte Codes und liefert den dekodierten Text jedes Codes, den sie vollständig lesen kann. Im Kameramodus werden die Kamerabilder auf höchstens 1.280 Pixel an der längeren Seite verkleinert und nacheinander gescannt; das erste Bild mit einem Code wird als Bild übernommen, und seine Codes werden angezeigt.

## Optionen und Grenzen

- **Eingabe:** ein JPEG-, PNG-, WebP-, GIF-, BMP- oder AVIF-Bild bis 20 MB oder die Kamera. Bei einem animierten GIF wird nur das erste Bild gescannt. HEIC-Bilder werden nicht unterstützt; wandeln Sie sie zuerst mit dem [Bildkonverter](/de/image-converter) um.
- **Ausgabe:** eine Tabelle mit Text und Typ jedes gefundenen Codes, bis zu 255 pro Bild. Binäre Inhalte, die kein Text sind, werden möglicherweise nicht richtig angezeigt.
- **Codetypen:** QR Code, Micro QR, rMQR, Data Matrix, Aztec, PDF417, MaxiCode, EAN-13, EAN-8, UPC-A, UPC-E, Code 39, Code 93, Code 128, Codabar, ITF, DataBar und weitere, die zxing-cpp unterstützt.
- **Kamera:** fordert die Rückkamera an, wenn es eine gibt, und stoppt nach dem ersten erfolgreichen Scan; klicken Sie erneut auf Kamera verwenden, um einen weiteren Code zu scannen. Nötig sind ein Browser mit Kameraunterstützung und Ihre Erlaubnis.
- **Browser:** JPEG, PNG, GIF und BMP funktionieren in allen aktuellen Browsern; AVIF funktioniert, wo der Browser es unterstützt.
- **Download:** Der WebAssembly-Scanner, etwa 950 KB groß, wird beim ersten Scannen heruntergeladen.

## Datenschutz

Ihre Bilder und Kamerabilder werden nur auf Ihrem Gerät verarbeitet. Die Seite lädt sie nicht hoch, speichert sie nicht und verwendet keine Cookies.
