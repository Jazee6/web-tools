---
review: draft
updated: 2026-11-02
title: PDF in Bild – PDF online in JPG, PNG oder WebP umwandeln
description: Wandeln Sie PDF-Seiten in JPG, PNG oder WebP mit 72, 150 oder 300 DPI um. Kostenlos und privat – alles läuft in Ihrem Browser, Ihr Dokument wird nie hochgeladen.
name: PDF in Bild
answer: Wählen Sie eine PDF, wählen Sie JPEG, PNG oder WebP und eine Auflösung und klicken Sie auf In Bilder umwandeln. Jede Seite wird auf Ihrem Gerät zu einem eigenen Bild; geben Sie Seiten wie 1-3, 5 ein, um nur diese umzuwandeln.
action: In Bilder umwandeln
fields:
  file:
    label: PDF-Datei
  pages:
    label: Seiten
    placeholder: Alle Seiten oder 1-3, 5, 8-
  format:
    label: Bildformat
    options:
      jpeg: JPEG (funktioniert überall)
      png: PNG (verlustfrei, schärfster Text)
      webp: WebP (klein, moderne Browser)
  dpi:
    label: Auflösung
    options:
      "72": 72 DPI (Bildschirm, am kleinsten)
      "150": 150 DPI (scharf am Bildschirm)
      "300": 300 DPI (Druckqualität)
  quality:
    label: Qualität (1–100)
output:
  files:
    label: Bilder
errors:
  encrypted: "Diese PDF ist mit einem Passwort geschützt. Entfernen Sie das Passwort und versuchen Sie es erneut:"
  invalid_pdf: "Diese Datei konnte nicht als PDF gelesen werden. Sie ist möglicherweise beschädigt. Exportieren Sie sie erneut und versuchen Sie es noch einmal:"
  invalid_pages: "Geben Sie die Seiten als Zahlen und Bereiche an, durch Kommas getrennt, zum Beispiel 1-3, 5, 8-. Dieser Teil kann nicht gelesen werden:"
  page_out_of_range: "Diese Seite gibt es nicht. Seitenanzahl dieser PDF:"
  too_many_files: Dabei würden mehr als 500 Bilder entstehen. Geben Sie einen kleineren Seitenbereich ein, zum Beispiel 1-100, und wandeln Sie den Rest in einem weiteren Durchgang um.
  too_large: "Diese Seite ist bei der gewählten Auflösung zu groß: Eine Seite des Bildes würde 10.000 Pixel überschreiten, oder Ihr Browser kann so viele Pixel nicht verarbeiten. Wählen Sie eine niedrigere Auflösung oder lassen Sie diese Seite weg. Seite:"
steps:
  - Wählen Sie eine PDF-Datei mit bis zu 50 MB.
  - Lassen Sie Seiten leer, um alle Seiten umzuwandeln, oder geben Sie Seiten wie 1-3, 5, 8- ein. Die Zählung beginnt bei 1, und 8- reicht bis zur letzten Seite.
  - Wählen Sie Bildformat und Auflösung. 150 DPI wirkt am Bildschirm scharf; 300 DPI ist für den Druck gedacht und ergibt viermal so viele Pixel.
  - Behalten Sie für JPEG und WebP die Standardqualität 85 bei oder legen Sie eine eigene fest. PNG ignoriert diese Einstellung.
  - Klicken Sie auf In Bilder umwandeln und laden Sie jedes Bild einzeln oder alle als ZIP-Datei herunter.
faq:
  - q: Wird meine PDF auf einen Server hochgeladen?
    a: Nein. Die Seiten werden in Ihrem Browser mit dem zu WebAssembly kompilierten PDFium gerendert, die Datei verlässt Ihr Gerät nie.
  - q: Welches Format sollte ich wählen?
    a: JPEG lässt sich fast überall öffnen und eignet sich für Seiten mit Fotos. PNG ist verlustfrei und hält Text und Linien am schärfsten, die Dateien sind aber größer. WebP liefert bei ähnlicher Qualität kleinere Dateien als JPEG und öffnet sich in aktuellen Browsern.
  - q: Wie groß werden die Bilder?
    a: Die Größe in Pixeln ist die Seitengröße in Punkt mal Auflösung geteilt durch 72. Eine A4-Seite wird bei 72 DPI zu 595 × 842 Pixeln, bei 150 DPI zu 1240 × 1754 und bei 300 DPI zu 2480 × 3508.
  - q: Kann ich nur eine Seite umwandeln?
    a: Ja. Geben Sie ihre Nummer unter Seiten ein, zum Beispiel 4. Sie können mehrere Seiten und Bereiche angeben, etwa 1, 3-5; jede Seite wird einmal umgewandelt, in der eingegebenen Reihenfolge.
  - q: Warum ist der Hintergrund weiß statt transparent?
    a: Jede Seite wird auf Weiß gezeichnet, so wie PDF-Reader sie anzeigen, damit JPEG, PNG und WebP gleich aussehen. Transparente Bereiche der Seite bleiben nicht erhalten.
  - q: Kann ich den Text in den Bildern markieren oder kopieren?
    a: Nein. Die Bilder sind Abbildungen der Seiten, der Text wird also zu Pixeln. Damit der Text markierbar bleibt, extrahieren Sie die Seiten stattdessen mit PDF teilen als PDF.
---

## So funktioniert die Umwandlung

Das Tool nutzt PDFium – die PDF-Engine von Google Chrome –, kompiliert zu WebAssembly. Es zeichnet jede gewählte Seite in der gewählten Auflösung auf weißem Hintergrund, einschließlich der in der Datei gespeicherten Anmerkungen wie Hervorhebungen und ausgefüllter Formularfelder, und stellt Seiten, die gedreht angezeigt werden sollen, richtig herum. Anschließend wird jede Seite mit der gewählten Qualität als JPEG oder WebP oder verlustfrei als PNG codiert. Die Arbeit läuft in einem Hintergrund-Thread, die Seite bleibt also bedienbar.

## Optionen und Grenzen

- **Eingabe:** eine PDF-Datei mit bis zu 50 MB.
- **Seiten:** einzelne Seiten und Bereiche, durch Kommas getrennt. Jede Seite muss in der Datei vorhanden sein; eine doppelt angegebene Seite wird nur einmal umgewandelt.
- **Ausgabe:** bis zu 500 Bilder pro Durchgang, benannt nach Datei und Seitenzahl, zum Beispiel report-3.jpg.
- **Auflösung:** 72, 150 oder 300 DPI. Keine Seite eines Bildes darf 10.000 Pixel überschreiten, sehr große Seiten wie Poster und Zeichnungen brauchen daher eine niedrigere Auflösung.
- **Passwörter:** Dateien, die zum Öffnen ein Passwort verlangen, können nicht umgewandelt werden.
- **Speicher:** Die Datei und alle Bilder werden im Arbeitsspeicher gehalten, lange Dokumente mit 300 DPI können auf Smartphones daher scheitern. Wandeln Sie sie in kleineren Seitenbereichen um.

Um Seiten als PDF zu behalten, nutzen Sie [PDF teilen](/de/split-pdf); um das Format der Bilder danach zu ändern, nutzen Sie den [Bildkonverter](/de/image-converter).

## Datenschutz

Ihr Dokument wird nur auf Ihrem Gerät verarbeitet. Die Seite lädt es nicht hoch, speichert es nicht und verwendet keine Cookies.
