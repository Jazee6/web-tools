---
review: reviewed
updated: 2026-11-14
title: Excel in Markdown-Tabelle – Zellen aus der Tabelle online einfügen
description: "Kopieren Sie Zellen aus Excel oder Google Sheets und fügen Sie sie ein, um eine Markdown-Tabelle zu erhalten — ohne CSV-Export. Kostenlos, die Daten bleiben bei Ihnen."
name: Excel in Markdown-Tabelle
answer: Markieren Sie die Zellen in Excel oder Google Sheets, kopieren Sie sie und fügen Sie sie in das Feld Tabellendaten ein — TSV ist bereits ausgewählt, die Markdown-Tabelle erscheint sofort. Klicken Sie auf Kopieren, um sie zu kopieren.
steps:
  - Markieren Sie in Excel, Google Sheets, Numbers oder LibreOffice Calc den benötigten Zellbereich samt Kopfzeile.
  - Kopieren Sie die Zellen und fügen Sie sie in das Feld Tabellendaten ein; als Eingabeformat ist TSV bereits ausgewählt.
  - Klicken Sie auf Kopieren und fügen Sie die Tabelle in GitHub, GitLab, Notion, Obsidian oder einen anderen Markdown-Editor ein.
faq:
  - q: Muss ich die Tabelle zuerst als CSV speichern?
    a: Nein. Beim Kopieren legt die Tabellenkalkulation die Zellen als tabulatorgetrennten Text in die Zwischenablage, eine Zeile pro Tabellenzeile und ein Tabulator zwischen den Zellen. Genau diesen Text liest diese Voreinstellung, Kopieren und Einfügen genügt also.
  - q: Warum bleiben Zahlen mit Tausendertrennzeichen in einer Zelle?
    a: In tabulatorgetrenntem Text teilen nur Tabulatoren die Zellen, daher bleiben 1,234.50 oder eine Liste wie "red, green" in einer Zelle. Das ist der Hauptgrund, warum Einfügen aus der Tabellenkalkulation zuverlässiger ist als ein CSV-Export in Sprachen, die das Komma als Dezimaltrennzeichen verwenden.
  - q: Werden Formeln, Farben und verbundene Zellen übernommen?
    a: Nein. Die Zwischenablage enthält die angezeigten Werte, Sie erhalten also die Ergebnisse von Formeln, nicht die Formeln selbst. Formatierungen wie Fett, Farben und Rahmen gehören nicht zum Text, und eine verbundene Zelle kommt als ein Wert gefolgt von leeren Zellen an.
  - q: Eine mehrzeilige Zelle hat meine Tabelle zerlegt. Wie behebe ich das?
    a: Tabellenkalkulationen setzen eine Zelle mit Zeilenumbrüchen beim Kopieren in doppelte Anführungszeichen, und diese Voreinstellung macht aus jedem Umbruch ein <br>. Teilt ein Zeilenumbruch trotzdem eine Zeile, hat das Programm, aus dem Sie kopiert haben, die Zelle nicht in Anführungszeichen gesetzt; entfernen Sie die Umbrüche in der Tabelle und kopieren Sie erneut.
table:
  caption: Was aus kopierten Tabellenzellen in der Markdown-Tabelle wird
  columns:
    clipboard: Zelle wie kopiert (TSV)
    cell: Markdown-Zelle
    rule: Warum
  terms:
    commaKept: Kommas teilen in tabulatorgetrenntem Text nie Zellen
    lineBreak: Ein Zeilenumbruch in Anführungszeichen wird zu <br>
    doubledQuote: Zwei Anführungszeichen in Anführungszeichen stehen für eines
    pipe: "| wird maskiert, damit es die Spalte nicht teilt"
    trimmed: Leerzeichen um den Wert werden entfernt
---

## Warum Kopieren besser funktioniert als Exportieren

Eine Markdown-Tabelle braucht reinen Text, und die Zwischenablage hat ihn schon. Tabellenkalkulationen kopieren einen Bereich als tabulatorgetrennte Werte: jede Zeile in einer eigenen Zeile und ein Tabulator zwischen den Zellen. Weil Tabulatoren in normalen Zellwerten nicht vorkommen, bleiben Zahlen wie 1,234.50, Adressen und kommagetrennte Listen intakt — etwas, das ein CSV-Export falsch machen kann, wenn die Tabelle das Komma als Dezimaltrennzeichen nutzt oder der Export Semikolons verwendet.

## Optionen und Grenzen

- **Bereichsgröße:** bis zu 200.000 Zeichen kopierter Zellen, genug für Tausende kurzer Zellen.
- **Was kopiert wird:** nur die angezeigten Werte; legen Sie Zahlenformate, Datumsangaben und Rundung vor dem Kopieren in der Tabelle fest.
- **Leerzeilen:** werden übersprungen; eine kürzere Zeile erhält am Ende leere Zellen.
- **Zahlen:** Wählen Sie bei überwiegend numerischen Tabellen Rechts als Ausrichtung, damit die Zahlen in der gerenderten Tabelle bündig stehen.
- **Nicht unterstützt:** Formeln, Formatierungen wie Fett oder Farben, verbundene Zellen, Bilder und Kommentare.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt die kopierten Zellen nicht hoch, speichert sie nicht und verwendet keine Cookies.
