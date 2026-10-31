---
review: draft
updated: 2026-10-31
title: Wortzähler – Wörter, Zeichen, Sätze und Absätze online zählen
description: Zählen Sie Wörter, Zeichen, Bytes, Zeilen, Sätze und Absätze, auch auf Chinesisch und Japanisch. Kostenlos und privat – läuft in Ihrem Browser.
name: Wortzähler
answer: Fügen Sie Ihren Text ein und klicken Sie auf Zählen – Wörter, Zeichen mit und ohne Leerzeichen, Bytes, Zeilen, Sätze und Absätze erscheinen direkt im Browser.
action: Zählen
fields:
  text:
    label: Text
    placeholder: Text hier einfügen oder eingeben
output:
  words:
    label: Wörter
  characters:
    label: Zeichen
  charactersNoSpaces:
    label: Zeichen (ohne Leerzeichen)
  bytes:
    label: Bytes (UTF-8)
  lines:
    label: Zeilen
  sentences:
    label: Sätze
  paragraphs:
    label: Absätze
steps:
  - Fügen Sie Ihren Text in das Feld Text ein oder geben Sie ihn dort ein.
  - Klicken Sie auf Zählen.
  - Lesen Sie die Zahlen ab, die Sie brauchen – Wörter, Zeichen, Zeichen (ohne Leerzeichen), Bytes (UTF-8), Zeilen, Sätze oder Absätze.
faq:
  - q: Wird mein Text auf einen Server hochgeladen?
    a: Nein. Das Zählen läuft vollständig in Ihrem Browser, Ihr Text verlässt also nie Ihr Gerät. Nach dem Laden der Seite können Sie sie sogar offline nutzen.
  - q: Wie werden Wörter gezählt?
    a: Ein Wort ist jede Zeichenfolge zwischen Leerzeichen oder Zeilenumbrüchen, die einen Buchstaben oder eine Ziffer enthält. „well-known“, „don't“ und „3.14“ zählen also je als ein Wort, ein einzelner Gedankenstrich nicht. Chinesische Zeichen sowie japanische Kana und Kanji stehen ohne Leerzeichen zwischen den Wörtern, deshalb zählt jedes Zeichen als ein Wort – so wie Microsoft Word sie zählt. Koreanisch wird durch Leerzeichen getrennt und wie Englisch gezählt.
  - q: Warum ist die Zeichenzahl niedriger als die Zahl der Codeeinheiten in meinem Text?
    a: Zeichen werden so gezählt, wie ein Leser sie sieht. Ein Emoji wie 😀, ein Familien-Emoji aus mehreren verbundenen Emojis oder ein Buchstabe mit Akzentzeichen zählt je als ein Zeichen, ebenso ein Windows-Zeilenumbruch (CRLF). Leerzeichen, Tabulatoren und Zeilenumbrüche sind in Zeichen enthalten und in Zeichen (ohne Leerzeichen) ausgenommen.
  - q: Warum unterscheiden sich Bytes von Zeichen?
    a: Bytes sind die Größe des Textes, wenn er als UTF-8 gespeichert wird. Englische Buchstaben brauchen 1 Byte, Buchstaben mit Akzent 2, die meisten chinesischen und japanischen Zeichen 3 und Emojis 4. Diese Zahl ist für Grenzen bei Dateigrößen oder Datenbankfeldern maßgeblich.
  - q: Wie zählt das Tool Sätze?
    a: Ein Satz endet bei einem Punkt, Ausrufezeichen, Fragezeichen oder Auslassungszeichen (…), auf das ein Leerzeichen oder das Textende folgt, oder bei 。, ！ oder ？ im Chinesischen und Japanischen. Eine Zahl wie 3.14 oder eine Domain wie example.com beendet keinen Satz, eine Abkürzung wie „Mr.“ aber schon – bei Texten voller Abkürzungen fällt die Zahl daher zu hoch aus.
  - q: Was zählt als Absatz?
    a: Ein Textblock, der vom nächsten durch mindestens eine Leerzeile getrennt ist; eine Zeile nur mit Leerzeichen gilt als leer. Zeilen zählt jede Zeile, auch leere, und ein Zeilenumbruch am Textende fügt keine weitere Zeile hinzu.
---

## Was dieser Wortzähler macht

Das Tool liest Ihren Text einmal und gibt sieben Zahlen aus. Zeichen werden als Graphemcluster gezählt, also als die Einheiten, die ein Leser als einzelnes Zeichen sieht – mit `Intl.Segmenter` des Browsers nach [Unicode Standard Annex #29](https://www.unicode.org/reports/tr29/). Wörter, Sätze und Absätze folgen festen Regeln, die nicht von Browser oder Spracheinstellung abhängen, sodass derselbe Text überall dieselben Zahlen ergibt. Bytes werden gemessen, indem der Text als UTF-8 kodiert wird.

## Optionen und Grenzen

- **Eingabe:** jeweils ein Text, so groß, wie Ihr Gerät ihn aufnehmen kann. Ein leerer Text wird nicht gezählt.
- **Wörter:** durch Leerraum getrennte Abschnitte, die einen Buchstaben oder eine Ziffer enthalten. Chinesische Zeichen sowie japanische Kana und Kanji zählen je als ein Wort; Thai und andere Schriften ohne Leerzeichen werden als durch Leerraum getrennte Abschnitte gezählt, ihre Wortzahl fällt daher zu niedrig aus.
- **Sätze:** nach Satzzeichen gezählt, daher beenden Abkürzungen wie „Mr.“ oder „e.g.“ einen Satz, und ein Text ohne Satzzeichen zählt als ein Satz.
- **Zeilenumbrüche:** `\n`, `\r\n` und `\r` beginnen jeweils eine neue Zeile.
- **Nicht enthalten:** Lesezeit, Sprechzeit und Keyword-Dichte.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihren Text nicht hoch, speichert ihn nicht und verwendet keine Cookies.
