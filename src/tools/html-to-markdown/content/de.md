---
review: reviewed
updated: 2026-11-14
title: HTML zu Markdown – HTML und formatierten Text online umwandeln
description: "HTML einfügen oder formatierten Text aus Webseiten, Word oder Google Docs kopieren und sauberes Markdown mit Tabellen erhalten. Kostenlos und privat im Browser."
name: HTML zu Markdown
answer: Fügen Sie HTML-Code ein oder kopieren Sie formatierten Text aus einer Webseite oder einem Dokument und fügen Sie ihn in das Feld HTML ein — das Markdown erscheint sofort. Klicken Sie auf Kopieren, um es zu kopieren.
action: Umwandeln
fields:
  html:
    label: HTML
    placeholder: "<h1>Title</h1>\n<p>Paste HTML, or copy formatted text from a page and paste it here.</p>"
output:
  markdown:
    label: Markdown
errors:
  empty: Es bleibt nichts zum Umwandeln übrig. Das HTML enthält nur Skripte, Stile oder andere Inhalte, die entfernt werden — fügen Sie den Teil der Seite mit dem gewünschten Text ein.
steps:
  - Fügen Sie HTML in das Feld HTML ein, oder markieren Sie formatierten Text auf einer Webseite, in Word oder in Google Docs, kopieren Sie ihn und fügen Sie ihn in das Feld ein.
  - Lesen Sie das Markdown, das im Feld Markdown erscheint.
  - Klicken Sie auf Kopieren, um das Markdown zu kopieren.
faq:
  - q: Kann ich formatierten Text statt HTML-Code einfügen?
    a: Ja. Wenn Sie aus einer Webseite, Word, Google Docs oder einer E-Mail kopieren, enthält die Zwischenablage auch das HTML hinter der Formatierung. Beim Einfügen in das Feld HTML wird dieses HTML statt des reinen Texts eingefügt, sodass Überschriften, Links, Listen und Tabellen erhalten bleiben. Enthält die Zwischenablage nur reinen Text, wird er wie gewohnt eingefügt.
  - q: Wie werden Tabellen umgewandelt?
    a: Jede Tabelle mit Zellen wird zu einer Markdown-Tabelle, und ihre erste Zeile wird zur Kopfzeile, auch wenn sie normale Zellen verwendet, wie bei Tabellen aus Word und Google Docs. Ein | in einer Zelle wird als \| maskiert, mehrere Absätze oder Zeilenumbrüche in einer Zelle werden mit <br> verbunden, und auf eine Zelle über mehrere Spalten folgen leere Zellen. Die Ausrichtung links, zentriert oder rechts an den Kopfzellen bleibt erhalten.
  - q: Was wird entfernt?
    a: <script>, <style>, <noscript>, <iframe>, <template> und der <head> der Seite einschließlich Titel. Alles andere wird umgewandelt, auch Navigationsmenüs und Fußzeilen — fügen Sie also nur den Teil einer Seite ein, den Sie brauchen.
  - q: Welchen Markdown-Stil schreibt das Tool?
    a: "GitHub Flavored Markdown mit #-Überschriften, Aufzählungen mit -, *kursiv*, **fett**, ```-Codeblöcken mit Sprachangabe, wenn das code-Element eine Klasse wie language-js hat, Inline-Links, ~~Durchstreichung~~ und - [x]-Aufgabenlistenpunkten aus Kontrollkästchen. Der Stil ist fest, damit die Ausgabe jedes Mal gleich aussieht."
  - q: Warum verschwinden manche HTML-Elemente spurlos?
    a: Markdown hat keine Syntax für Farben, Schriften, Formulare oder Layout, daher bleibt nur ihr Text erhalten. Bilder behalten Adresse und Alternativtext; eine Adresse, die auf eine Datei auf Ihrem Computer zeigt, funktioniert nirgendwo sonst.
---

## So funktioniert der HTML-zu-Markdown-Konverter

Der Konverter liest Ihr HTML mit dem HTML-Parser Ihres Browsers und wandelt es mit [Turndown](https://github.com/mixmark-io/turndown) in Markdown um. Unsauberes oder unvollständiges HTML wird daher so gelesen, wie Ihr Browser es anzeigen würde. Die GitHub-Flavored-Markdown-Regeln für Tabellen, Durchstreichen und Aufgabenlisten stammen von dieser Website, sodass Tabellen ohne Kopfzellen umgewandelt statt als HTML belassen werden.

## Optionen und Grenzen

- **Eingabe:** HTML-Fragmente oder ganze Seiten, bis zu 1.000.000 Zeichen.
- **Einfügen:** Formatierter Text wird als HTML eingefügt, wenn die Zwischenablage es enthält; reiner Text wird unverändert eingefügt.
- **Entfernt:** Skripte, Stile, noscript, iframes, templates und der head der Seite. Navigation, Kopf- und Fußbereiche werden wie jeder andere Inhalt umgewandelt.
- **Tabellen:** Die erste Zeile ist immer die Kopfzeile; eine Zelle über mehrere Zeilen wird nicht wiederholt, und eine Tabelle in einer Zelle landet als Text in dieser Zelle.
- **Listen:** HTML-Listen (<ul> und <ol>) werden zu Markdown-Listen. Listen, die als Absätze mit Aufzählungszeichen oder Nummer am Anfang ankommen, wie Word sie oft kopiert, bleiben Absätze.
- **Nicht unterstützt:** die Wahl eines anderen Markdown-Stils, etwa *-Aufzählungen, Setext-Überschriften oder Referenz-Links.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihr HTML nicht hoch, speichert es nicht und verwendet keine Cookies.
