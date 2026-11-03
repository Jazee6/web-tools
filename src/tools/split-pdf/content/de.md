---
review: draft
updated: 2026-11-03
title: PDF teilen – Seiten extrahieren oder PDF kostenlos online teilen
description: Teilen Sie eine PDF in mehrere Dateien oder extrahieren Sie Seiten. Kostenlos und privat – alles läuft in Ihrem Browser, Ihr Dokument wird nie hochgeladen.
name: PDF teilen
answer: Wählen Sie eine PDF, geben Sie die gewünschten Seiten ein – etwa 1-3, 5, 8- – und klicken Sie auf PDF teilen. Jeder Bereich wird auf Ihrem Gerät zu einer eigenen Datei; lassen Sie die Seiten leer, wird jede Seite einzeln gespeichert.
action: PDF teilen
fields:
  file:
    label: PDF-Datei
  pages:
    label: Seiten
    placeholder: 1-3, 5, 8-
  mode:
    label: Ausgabe
    options:
      separate: Eine PDF pro Bereich
      combined: Alle genannten Seiten in einer PDF
output:
  files:
    label: PDF-Dateien
errors:
  encrypted: "Diese PDF ist mit einem Passwort geschützt. Entfernen Sie das Passwort und versuchen Sie es erneut:"
  invalid_pdf: "Diese Datei konnte nicht als PDF gelesen werden. Sie ist möglicherweise beschädigt. Exportieren Sie sie erneut und versuchen Sie es noch einmal:"
  invalid_pages: "Geben Sie die Seiten als Zahlen und Bereiche an, durch Kommas getrennt, zum Beispiel 1-3, 5, 8-. Dieser Teil kann nicht gelesen werden:"
  page_out_of_range: "Diese Seite gibt es nicht. Seitenanzahl dieser PDF:"
  pages_required: Geben Sie die Seiten ein, die in die PDF sollen, zum Beispiel 1-3, 5.
  too_many_files: Dabei würden mehr als 500 Dateien entstehen. Geben Sie weniger Bereiche ein oder nutzen Sie größere Bereiche wie 1-100, 101-200.
steps:
  - Wählen Sie eine PDF-Datei mit bis zu 50 MB.
  - Geben Sie die Seiten ein, zum Beispiel 1-3, 5, 8-. Die Seiten werden ab 1 gezählt, und 8- reicht bis zur letzten Seite. Lassen Sie Seiten leer, um jede Seite einzeln zu speichern.
  - Wählen Sie unter Ausgabe Eine PDF pro Bereich, um für jeden Teil zwischen den Kommas eine eigene Datei zu erhalten, oder Alle genannten Seiten in einer PDF, um sie in einer einzigen Datei zu extrahieren.
  - Klicken Sie auf PDF teilen und laden Sie dann jede Datei einzeln oder alle gemeinsam als ZIP herunter.
faq:
  - q: Wird meine PDF auf einen Server hochgeladen?
    a: Nein. Die Datei wird in Ihrem Browser mit dem zu WebAssembly kompilierten PDFium gelesen und geteilt und verlässt Ihr Gerät nie.
  - q: Wie extrahiere ich nur einige Seiten?
    a: Geben Sie sie unter Seiten ein, zum Beispiel 2, 5-7, und wählen Sie Alle genannten Seiten in einer PDF. Sie erhalten eine Datei mit diesen Seiten.
  - q: Wie teile ich eine PDF in einzelne Seiten?
    a: Lassen Sie Seiten leer, lassen Sie Eine PDF pro Bereich ausgewählt und klicken Sie auf PDF teilen. Jede Seite wird zu einer eigenen Datei. Pro Vorgang sind höchstens 500 Dateien möglich, bei längeren Dokumenten nutzen Sie daher Bereiche.
  - q: Kann ich Seiten umsortieren oder wiederholen?
    a: Ja, wenn Sie sie in einer PDF zusammenfassen. Die Seiten erscheinen in der Reihenfolge, in der Sie sie eingeben, 5, 1-2, 1 ergibt also Seite 5, die Seiten 1 und 2 und dann noch einmal Seite 1.
  - q: Verringert das Teilen die Qualität?
    a: Nein. Die Seiten werden unverändert übernommen – Text bleibt markierbar und Bilder werden nicht neu komprimiert.
  - q: Bleiben Lesezeichen und Formularfelder erhalten?
    a: Die Seiten werden mit Text und Bildern unverändert übernommen, Lesezeichen werden den neuen Dateien jedoch nicht hinzugefügt. Ausfüllbare Formularfelder behalten ihren Inhalt, lassen sich aber möglicherweise nicht mehr bearbeiten.
---

## So funktioniert das Teilen

Das Tool verwendet das zu WebAssembly kompilierte PDFium – die PDF-Engine von Google Chrome. Es öffnet Ihre Datei, kopiert die gewünschten Seiten für jede Ausgabedatei in ein neues Dokument und speichert das Ergebnis. Die Arbeit läuft in einem Hintergrund-Thread, sodass die Seite reaktionsfähig bleibt.

## Optionen und Grenzen

- **Eingabe:** eine PDF-Datei mit bis zu 50 MB.
- **Seiten:** einzelne Seiten und Bereiche, durch Kommas getrennt. Ein Bereich muss von einer niedrigeren zu einer höheren Seite reichen, und jede Seite muss in der Datei vorhanden sein.
- **Ausgabe:** bis zu 500 PDF-Dateien pro Vorgang.
- **Passwörter:** Dateien, die zum Öffnen ein Passwort benötigen, können nicht geteilt werden.
- **Dateigröße:** Jede Datei kann Ressourcen enthalten, die zum ganzen Dokument gehören, etwa Schriften, daher können die Teile zusammen größer sein als das Original.
- **Arbeitsspeicher:** Die Datei und alle Ergebnisse werden im Speicher gehalten, sodass sehr große Dokumente auf Smartphones scheitern können.

Um die Teile wieder zusammenzufügen oder andere Dokumente zu verbinden, nutzen Sie [PDF zusammenfügen](/de/merge-pdf).

Um Seiten innerhalb eines Dokuments neu anzuordnen, zu drehen oder zu löschen, nutzen Sie [PDF organisieren](/de/organize-pdf).

## Datenschutz

Ihr Dokument wird nur auf Ihrem Gerät verarbeitet. Die Seite lädt es nicht hoch, speichert es nicht und verwendet keine Cookies.
