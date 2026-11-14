---
review: reviewed
updated: 2026-11-14
title: CSV in Markdown-Tabelle umwandeln – Kostenlos online
description: Fügen Sie den Inhalt einer CSV-Datei ein und erhalten Sie eine GitHub-Markdown-Tabelle. Felder in Anführungszeichen werden korrekt gelesen. Kostenlos, ohne Upload.
name: CSV in Markdown-Tabelle
answer: Fügen Sie den Inhalt Ihrer CSV-Datei in das Feld Tabellendaten ein — CSV ist bereits ausgewählt, die Markdown-Tabelle erscheint sofort. Klicken Sie auf Kopieren, um sie zu kopieren.
steps:
  - Öffnen Sie die .csv-Datei in einem Texteditor, markieren Sie alles und kopieren Sie es.
  - Fügen Sie es in das Feld Tabellendaten ein; als Eingabeformat ist CSV bereits ausgewählt.
  - Klicken Sie auf Kopieren und fügen Sie die Tabelle in Ihre README, Ihr Wiki oder Ihre Notizen ein.
faq:
  - q: Meine CSV hat Kommas in manchen Werten. Verrutschen dann die Spalten?
    a: Nicht, wenn diese Werte in doppelten Anführungszeichen stehen, wie Tabellenkalkulationen, Datenbanken und die meisten Programme sie beim CSV-Export schreiben. "Smith, Ada" bleibt eine Zelle. Ein Komma außerhalb von Anführungszeichen beginnt immer eine neue Spalte.
  - q: Meine Datei verwendet Semikolons statt Kommas. Was kann ich tun?
    a: Semikolons gelten nicht als Trennzeichen, daher landet jede Zeile in einer einzigen Spalte. Exportieren Sie die Datei erneut mit Kommas, oder öffnen Sie sie in Ihrer Tabellenkalkulation und kopieren Sie die Zellen — die Voreinstellung Excel in Markdown-Tabelle liest sie direkt.
  - q: Warum steht in manchen Zellen <br>?
    a: Ein CSV-Feld in Anführungszeichen kann mehrere Zeilen umfassen, eine Zeile einer Markdown-Tabelle aber nicht. Jeder Zeilenumbruch in einem Feld wird zu <br>, das GitHub und die meisten Markdown-Renderer als Zeilenumbruch in der Zelle anzeigen.
  - q: Kann ich eine CSV-Datei mit Tausenden Zeilen umwandeln?
    a: Bis zu 200.000 Zeichen CSV, also einige Tausend kurze Zeilen. Eine so große Markdown-Tabelle ist schwer zu lesen; verlinken Sie bei großen Datenmengen besser die CSV-Datei.
table:
  caption: Was aus CSV-Feldern in den Zellen der Markdown-Tabelle wird
  columns:
    field: Feld in der CSV
    cell: Markdown-Zelle
    rule: Warum
  terms:
    quotedComma: Ein Komma in Anführungszeichen bleibt in der Zelle
    doubledQuote: Zwei Anführungszeichen in Anführungszeichen stehen für eines
    lineBreak: Ein Zeilenumbruch in Anführungszeichen wird zu <br>
    pipe: "| wird maskiert, damit es die Spalte nicht teilt"
    trimmed: Leerzeichen um den Wert werden entfernt
    semicolon: Semikolons trennen keine Felder
---

## CSV so lesen, wie RFC 4180 es festlegt

CSV wirkt einfach, bis ein Wert ein Komma, ein Anführungszeichen oder einen Zeilenumbruch enthält. Der Konverter folgt [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180), dem Format, das die meisten Programme schreiben: Felder werden durch Kommas getrennt, ein Feld in doppelten Anführungszeichen darf Kommas und Zeilenumbrüche enthalten, und ein Anführungszeichen in einem solchen Feld wird doppelt geschrieben. Zeilen dürfen mit CRLF, LF oder CR enden, daher funktionieren Dateien aus Windows, macOS und Linux.

## Optionen und Grenzen

- **CSV-Größe:** bis zu 200.000 Zeichen.
- **Kopfzeile:** Die erste CSV-Zeile wird zur Kopfzeile; ist Erste Zeile ist die Kopfzeile ausgeschaltet, wird stattdessen eine leere Kopfzeile ergänzt.
- **Ungleich lange Zeilen:** Zeilen mit weniger Feldern als die längste erhalten am Ende leere Zellen, und Leerzeilen werden übersprungen.
- **Trennzeichen:** nur Kommas. Diese Voreinstellung teilt keine Dateien, die durch Semikolon oder Tabulator getrennt sind.
- **Nicht geschlossene Anführungszeichen:** Ein Feld ohne schließendes Anführungszeichen reicht bis zum Dateiende; prüfen Sie die Quelle, wenn die letzte Zelle mehrere Zeilen verschluckt.
- **Nicht unterstützt:** die Kopfzeile aus einer separaten Datei lesen, Spalten überspringen und zurück in CSV umwandeln.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihre CSV nicht hoch, speichert sie nicht und verwendet keine Cookies.
