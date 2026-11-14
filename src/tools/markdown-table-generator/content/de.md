---
review: reviewed
updated: 2026-11-14
title: Markdown-Tabellengenerator – CSV und Excel in Markdown-Tabelle online
description: "Wandeln Sie CSV, aus Excel oder Google Sheets kopierte Zellen oder eine unordentliche Markdown-Tabelle in eine ausgerichtete Markdown-Tabelle um. Kostenlos und privat."
name: Markdown-Tabellengenerator
answer: Fügen Sie CSV, aus einer Tabellenkalkulation kopierte Zellen oder eine Markdown-Tabelle in das Feld Tabellendaten ein — die ausgerichtete Markdown-Tabelle erscheint sofort. Klicken Sie auf Kopieren, um sie zu kopieren.
action: Tabelle erstellen
fields:
  data:
    label: Tabellendaten
    placeholder: "Name,Role\nAda,Engineer\nGrace,Admiral"
  from:
    label: Eingabeformat
    options:
      auto: Automatisch erkennen
      csv: CSV (kommagetrennt)
      tsv: TSV (aus Excel oder Google Sheets kopiert)
      markdown: Markdown-Tabelle
  header:
    label: Erste Zeile ist die Kopfzeile
  align:
    label: Ausrichtung
    options:
      none: Nicht festgelegt
      left: Links
      center: Zentriert
      right: Rechts
  pad:
    label: Spalten auffüllen
output:
  markdown:
    label: Markdown-Tabelle
errors:
  empty: Es wurden keine Zellen gefunden. Fügen Sie CSV-Zeilen, aus einer Tabellenkalkulation kopierte Zellen oder eine Markdown-Tabelle ein.
steps:
  - Fügen Sie Ihre Daten in das Feld Tabellendaten ein — CSV, aus Excel oder Google Sheets kopierte Zellen oder eine Markdown-Tabelle.
  - Wenn die Tabelle falsch aussieht, wählen Sie das richtige Eingabeformat.
  - Schalten Sie Erste Zeile ist die Kopfzeile aus, wenn Ihre Daten keine Kopfzeile haben.
  - Wählen Sie eine Ausrichtung, wenn alle Spalten gleich ausgerichtet sein sollen.
  - Klicken Sie auf Kopieren, um die Markdown-Tabelle zu kopieren.
faq:
  - q: Wie mache ich aus einem Excel- oder Google-Sheets-Bereich eine Markdown-Tabelle?
    a: Markieren Sie die Zellen, kopieren Sie sie und fügen Sie sie in das Feld Tabellendaten ein. Tabellenkalkulationen kopieren Zellen als tabulatorgetrennten Text (TSV), den der Generator an den Tabulatoren in der ersten Zeile erkennt. Zellen mit Zeilenumbrüchen oder Anführungszeichen setzt die Tabellenkalkulation beim Kopieren in Anführungszeichen, sodass sie richtig gelesen werden.
  - q: Was passiert mit Kommas, Anführungszeichen und Zeilenumbrüchen in CSV?
    a: Der Generator folgt RFC 4180. Ein Feld in doppelten Anführungszeichen darf Kommas und Zeilenumbrüche enthalten, und "" steht für ein Anführungszeichen. Ein | in einer Zelle wird als \| maskiert, damit es die Spalte nicht teilt, und ein Zeilenumbruch in einer Zelle wird zu <br>, weil eine Zeile einer Markdown-Tabelle in einer Zeile stehen muss.
  - q: Kann der Generator eine unordentliche Markdown-Tabelle aufräumen?
    a: Ja. Fügen Sie die Tabelle ein, und sie wird mit einheitlichen Abständen neu geschrieben. Jede Spalte behält ihre Ausrichtung aus der Zeile mit ---, sofern Sie keine Ausrichtung für die ganze Tabelle wählen, und der Zellinhalt einschließlich Inline-Code, Links und maskierter \| bleibt so, wie er geschrieben ist.
  - q: Warum hat meine Tabelle eine leere erste Zeile?
    a: Markdown-Tabellen brauchen eine Kopfzeile. Ist Erste Zeile ist die Kopfzeile ausgeschaltet, fügt der Generator eine leere Kopfzeile hinzu, damit Ihre erste Zeile im Tabellenkörper bleibt. Manche Renderer zeigen die leere Zeile als schmalen Balken.
  - q: Warum stehen die Spalten in meinem Editor nicht bündig?
    a: Spalten auffüllen fügt Leerzeichen ein, damit alle Zellen einer Spalte in einer Festbreitenschrift gleich breit sind. Die Breite wird pro Zeichen geschätzt — chinesische, japanische und koreanische Zeichen, Vollbreitensymbole und Emoji zählen als zwei Spalten, so wie die meisten Code-Editoren sie darstellen, alles andere als eine. In Editoren mit Proportionalschrift oder mit anderer Breite für manche Zeichen kann es trotzdem ungleichmäßig aussehen — die gerenderte Tabelle ist in jedem Fall dieselbe.
---

## So funktioniert der Markdown-Tabellengenerator

Der Generator liest Ihre Daten als CSV nach [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180), als tabulatorgetrennte Werte oder als [GitHub-Flavored-Markdown-Tabelle](https://github.github.com/gfm/#tables-extension-) und schreibt eine GitHub-Flavored-Markdown-Tabelle. Steht das Eingabeformat auf automatischer Erkennung, bedeutet eine erste Zeile, die mit | beginnt, oder eine zweite Zeile aus Zellen mit --- Markdown, Tabulatoren in der ersten Zeile bedeuten TSV, und alles andere wird als CSV gelesen. Die Spaltenbreite wird pro Zeichen geschätzt, so wie man es liest; breite ostasiatische Zeichen und Emoji zählen als zwei Spalten, sodass der meiste Text in einem Code-Editor bündig steht.

## Optionen und Grenzen

- **Tabellendaten:** bis zu 200.000 Zeichen. Leerzeilen werden übersprungen, und Zeilen mit weniger Zellen als die längste werden mit leeren Zellen aufgefüllt.
- **CSV:** Nur Kommas trennen Felder. Durch Semikolon getrennte Dateien, wie sie manche europäische Excel-Versionen erzeugen, werden nicht aufgeteilt; speichern Sie sie mit Kommas oder fügen Sie die Zellen direkt aus der Tabellenkalkulation ein.
- **Ausrichtung:** eine Ausrichtung für alle Spalten oder Nicht festgelegt, um CSV- und TSV-Spalten ohne Ausrichtung zu lassen und die Ausrichtung einer Markdown-Tabelle beizubehalten.
- **Zellen:** Leerzeichen am Anfang und Ende werden entfernt. In CSV- und TSV-Zellen wird nur | maskiert, und Zeilenumbrüche werden zu <br>; Markdown oder HTML darin, etwa **fett**, bleibt erhalten und wird dargestellt.
- **Nicht unterstützt:** verbundene Zellen, Ausrichtung pro Spalte für CSV und TSV und die Rückumwandlung einer Markdown-Tabelle in CSV.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihre Daten nicht hoch, speichert sie nicht und verwendet keine Cookies.
