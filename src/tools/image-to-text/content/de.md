---
review: reviewed
updated: 2026-11-14
title: Bild in Text – Text aus Fotos und Screenshots erkennen (OCR) online
description: Text aus Fotos, Screenshots und Scans kopieren – Deutsch, Englisch, Chinesisch, Japanisch und weitere lateinische Sprachen. Kostenlos und privat, OCR im Browser.
name: Bild in Text
answer: "Wählen Sie ein Bild und klicken Sie auf Text erkennen, damit KI-Modelle den gedruckten Text auf Ihrem Gerät lesen, und kopieren Sie den reinen Text, ohne vorher eine Sprache zu wählen."
action: Text erkennen
fields:
  file:
    label: Bild (HEIC, JPEG, PNG, WebP oder AVIF)
output:
  text:
    label: Erkannter Text
errors:
  decode_failed: Diese Datei konnte nicht als Bild gelesen werden. Sie ist vielleicht beschädigt, oder Ihr Browser kann das Format nicht dekodieren. Exportieren Sie sie erneut als JPEG oder PNG und versuchen Sie es noch einmal.
  too_large: "Dieses Bild hat möglicherweise mehr Pixel, als Ihr Browser verarbeiten kann. Browser auf Smartphones erlauben weniger als auf Computern; versuchen Sie es mit einem kleineren Bild oder an einem Computer."
  no_text: In diesem Bild wurde kein Text gefunden. Achten Sie darauf, dass der Text scharf und groß genug ist, oder schneiden Sie das Bild auf den Teil mit Text zu und versuchen Sie es noch einmal.
steps:
  - "Wählen Sie unter Bild (HEIC, JPEG, PNG, WebP oder AVIF) ein Bild mit gedrucktem Text, bis 50 MB."
  - "Klicken Sie auf Text erkennen. Beim ersten Mal werden die KI-Modelle und ONNX Runtime (etwa 60 MB) heruntergeladen und, wenn genug Platz ist, im Browser gespeichert."
  - "Kopieren Sie den erkannten Text. Der gefundene Text wird zu Zeilen zusammengefasst, und eine Leerzeile markiert einen größeren Abstand, etwa einen neuen Absatz."
faq:
  - q: Werden meine Bilder auf einen Server hochgeladen?
    a: "Nein. Das Bild wird in Ihrem Browser dekodiert und gelesen und verlässt Ihr Gerät daher nie. Heruntergeladen werden nur die KI-Modelle und die Dateien, die sie ausführen."
  - q: Welche Sprachen kann es lesen?
    a: Chinesisch (vereinfacht und traditionell), Japanisch und Sprachen in lateinischer Schrift wie Deutsch, Englisch, Spanisch, Portugiesisch und Französisch, einschließlich Umlauten und Akzenten. Sie wählen keine Sprache, und ein Bild darf mehrere mischen. Koreanisch sowie kyrillische, arabische, hebräische, thailändische und Devanagari-Schrift kann es nicht lesen.
  - q: Funktioniert es mit Fotos vom Smartphone?
    a: "Ja. Die Texterkennung findet Zeilen in Fotos ebenso wie in Screenshots und Scans, auch schräge Zeilen. Für das beste Ergebnis verwenden Sie ein scharfes Foto, auf dem der Text groß und flach ist, und prüfen das Ergebnis, bevor Sie es verwenden."
  - q: Kann es Handschrift lesen?
    a: "Dafür ist es nicht gemacht. Das Tool ist für gedruckten Text gedacht, daher kann Handschrift falsch gelesen werden; prüfen Sie das Ergebnis sorgfältig."
  - q: Bleiben Layout, Tabellen oder Formatierung erhalten?
    a: Nein. Sie erhalten reinen Text in Lesereihenfolge, von oben nach unten und von links nach rechts. Fettdruck, Schriftarten und Tabellenzellen bleiben nicht erhalten, und auf einer Seite mit mehreren Spalten werden Zeilen auf gleicher Höhe über die Spalten hinweg verbunden.
  - q: Warum dauert der erste Durchlauf länger?
    a: "Das Tool lädt zuerst zwei PP-OCRv6-Modelle und ONNX Runtime herunter, zusammen etwa 60 MB, und speichert sie im Browser, wenn genug Platz ist. Spätere Durchläufe können die gespeicherte Kopie nutzen, solange der Browser sie behält. Danach hängt die Dauer von der Textmenge ab, weil jede Zeile einzeln gelesen wird."
---

## So funktioniert die Texterkennung

Das Tool dekodiert das Bild mit dem eingebauten Bilddecoder Ihres Browsers, bei HEIC mit einer WebAssembly-Version von libheif, und führt zwei Open-Source-Modelle aus PP-OCRv6 von PaddleOCR (Apache-2.0-Lizenz) mit ONNX Runtime in einem Hintergrund-Thread aus. Das Erkennungsmodell markiert, wo Text steht; jeder Bereich wird zu einem Rahmen, der auch schräg sein darf. Das Lesemodell liest dann jeden Rahmen, Zeile für Zeile: Der Rahmen wird aus dem Bild in voller Auflösung ausgeschnitten und auf 48 Pixel Höhe skaliert (sehr lange Zeilen werden auf höchstens 3.200 Pixel Breite gestaucht), und die Zeilen werden in Lesereihenfolge gebracht: von oben nach unten und innerhalb einer Zeile von links nach rechts.

## Optionen und Grenzen

- **Eingabe:** ein HEIC-, JPEG-, PNG-, WebP- oder AVIF-Bild, bis 50 MB. Transparente Bereiche werden als weiß behandelt.
- **Ausgabe:** reiner Text, nach der Höhe im Bild zu Zeilen zusammengefasst, mit einer Leerzeile, wo der Abstand zwischen zwei Zeilen größer ist als eine Textzeile.
- **Sprachen:** Chinesisch (vereinfacht und traditionell), Japanisch, Englisch und andere Sprachen in lateinischer Schrift, ohne dass Sie eine Sprache wählen. Koreanisch sowie kyrillische, arabische, hebräische, thailändische und Devanagari-Schrift werden nicht unterstützt.
- **Ausrichtung:** Schräger Text wird gerade ausgerichtet, und eine Zeile, die mindestens 1,5-mal so hoch wie breit ist, wird vor dem Lesen um 90° gegen den Uhrzeigersinn gedreht; senkrechte Schrift kann falsch gelesen werden. Kopfstehender Text wird nicht korrigiert und kann falsch gelesen werden.
- **Layout:** Spalten, Tabellen und Formatierung bleiben nicht erhalten.
- **Größe:** Für die Textsuche wird das Bild so verkleinert, dass die längere Seite höchstens 2.048 Pixel misst; sehr kleiner Text in einem großen Bild kann übersehen werden, schneiden Sie das Bild daher vorher auf den Text zu. Höchstens 1.000 Kandidatenbereiche werden geprüft, daher kann auf einem sehr unruhigen Bild Text fehlen.
- **Browser:** JPEG, PNG, WebP und AVIF dekodiert Ihr Browser, sie funktionieren also, wo der Browser sie unterstützt; HEIC nutzt libheif. Die Modelle laufen auf der CPU, mit mehreren Threads, wo der Browser es erlaubt.
- **Download:** etwa 60 MB bei der ersten Nutzung (zwei Modelle mit 10 MB und 21 MB, dazu ONNX Runtime, das sich die anderen KI-Tools der Website teilen).

## Datenschutz

Ihre Bilder werden nur auf Ihrem Gerät verarbeitet. Die Seite lädt sie nicht hoch, speichert sie nicht und verwendet keine Cookies.
