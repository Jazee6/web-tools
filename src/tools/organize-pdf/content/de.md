---
review: draft
updated: 2026-11-03
title: PDF organisieren – Seiten online neu anordnen, drehen und löschen
description: Ordnen Sie die Seiten einer PDF mit Seitenvorschau neu an, drehen oder löschen Sie sie. Kostenlos und privat – alles läuft im Browser, Ihr Dokument wird nie hochgeladen.
name: PDF organisieren
answer: Wählen Sie eine PDF, verschieben, drehen oder entfernen Sie Seiten mit den Schaltflächen unter der jeweiligen Vorschau und klicken Sie auf PDF organisieren. Die neue PDF entsteht auf Ihrem Gerät und kann sofort heruntergeladen werden.
action: PDF organisieren
fields:
  file:
    label: PDF-Datei
  pages:
    label: Seiten
    placeholder: 3, 1-2 r90, 5-
output:
  file:
    label: PDF
errors:
  encrypted: "Diese PDF ist mit einem Passwort geschützt. Entfernen Sie das Passwort und versuchen Sie es erneut:"
  invalid_pdf: "Diese Datei konnte nicht als PDF gelesen werden. Sie ist möglicherweise beschädigt. Exportieren Sie sie erneut und versuchen Sie es noch einmal:"
  invalid_pages: "Geben Sie die Seiten als Zahlen und Bereiche an, durch Kommas getrennt, mit r90, r180 oder r270 zum Drehen, zum Beispiel 3, 1-2 r90, 5-. Dieser Teil kann nicht gelesen werden:"
  page_out_of_range: "Diese Seite gibt es nicht. Seitenanzahl dieser PDF:"
steps:
  - Wählen Sie eine PDF-Datei mit bis zu 50 MB. Unter Seiten erscheint eine Vorschau jeder Seite.
  - Verschieben Sie eine Seite mit den Pfeilen darunter nach vorn oder hinten, drehen Sie sie mit der Drehen-Schaltfläche um 90° im Uhrzeigersinn oder entfernen Sie sie mit dem Kreuz.
  - Prüfen Sie die Reihenfolge im Feld Seiten, das sich beim Bearbeiten mitändert. Sie können auch direkt hineinschreiben, zum Beispiel 3, 1-2 r90, 5-.
  - Klicken Sie auf PDF organisieren und laden Sie die Datei herunter.
faq:
  - q: Wird meine PDF auf einen Server hochgeladen?
    a: Nein. Die Vorschauen und die neue PDF entstehen in Ihrem Browser mit PDFium, das zu WebAssembly kompiliert ist; Ihr Dokument verlässt Ihr Gerät also nie.
  - q: Verringert das Drehen einer Seite die Qualität?
    a: Nein. Beim Drehen ändert sich nur die Drehungs-Einstellung der Seite; Text bleibt markierbar und Bilder werden nicht neu komprimiert. Beim Verschieben und Löschen werden die Seiten unverändert übernommen.
  - q: Was bedeuten die Zahlen im Feld Seiten?
    a: Es sind die Seiten der neuen PDF in ihrer Reihenfolge. 3, 1-2 r90, 5- bedeutet Seite 3, dann die Seiten 1 und 2 um 90° im Uhrzeigersinn gedreht, dann Seite 5 bis zur letzten Seite. Nicht aufgeführte Seiten fallen weg. Lassen Sie das Feld leer, um alle Seiten unverändert zu behalten.
  - q: Kann ich dieselbe Seite zweimal einfügen?
    a: Ja. Geben Sie ihre Nummer im Feld Seiten zweimal ein, zum Beispiel 1, 2, 1. Jede Kopie kann eine eigene Drehung haben.
  - q: Eine Seite lag schon quer. Was macht die Drehen-Schaltfläche?
    a: Jeder Klick dreht die Seite um weitere 90° im Uhrzeigersinn, ausgehend davon, wie sie jetzt angezeigt wird; die Vorschau entspricht also immer dem Ergebnis. Nach vier Drehungen ist die Seite wieder in der Ausgangslage.
  - q: Bleiben Lesezeichen und Formularfelder erhalten?
    a: Die Seiten werden mit Text und Bildern unverändert übernommen, Lesezeichen werden der neuen Datei jedoch nicht hinzugefügt. Ausfüllbare Formularfelder behalten ihren Inhalt, lassen sich aber möglicherweise nicht mehr bearbeiten.
---

## So funktioniert das Organisieren

Das Tool verwendet PDFium – die PDF-Engine von Google Chrome – kompiliert zu WebAssembly. Wenn Sie eine Datei wählen, zeichnet es in einem Hintergrund-Thread jeweils einige Seiten als kleine Vorschau. Wenn Sie auf PDF organisieren klicken, kopiert es die Seiten in der festgelegten Reihenfolge in ein neues Dokument, wendet die Drehung jeder Seite an und speichert das Ergebnis. Die Seite bleibt dabei die ganze Zeit bedienbar.

## Optionen und Grenzen

- **Eingabe:** eine PDF-Datei mit bis zu 50 MB.
- **Seiten:** einzelne Seiten und Bereiche, durch Kommas getrennt, jeweils optional gefolgt von r90, r180 oder r270 für eine Drehung im Uhrzeigersinn. Ein Bereich muss von einer niedrigeren zu einer höheren Seite gehen, und jede Seite muss in der Datei vorhanden sein. Mindestens eine Seite muss bleiben.
- **Ausgabe:** eine PDF, benannt nach dem Original mit der Endung -organized.
- **Passwörter:** Dateien, die zum Öffnen ein Passwort brauchen, lassen sich nicht organisieren und zeigen keine Vorschau.
- **Speicher:** Die Datei bleibt während der Bearbeitung im Speicher; sehr große Dokumente können daher auf Handys fehlschlagen.

Um einzelne Seiten in eigene Dateien zu übernehmen, nutzen Sie [PDF teilen](/de/split-pdf). Um Seiten aus anderen Dokumenten hinzuzufügen, nutzen Sie [PDF zusammenfügen](/de/merge-pdf).

## Datenschutz

Ihr Dokument wird nur auf Ihrem Gerät verarbeitet. Die Seite lädt es nicht hoch, speichert es nicht und verwendet keine Cookies.
