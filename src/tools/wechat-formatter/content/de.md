---
review: reviewed
updated: 2026-11-14
title: WeChat-Formatierer – Markdown für WeChat-Artikel online formatieren
description: Schreiben Sie Ihren Artikel in Markdown und kopieren Sie ihn als formatierten Text im Stil des Editors für offizielle WeChat-Konten. Kostenlos, privat, im Browser.
name: WeChat-Formatierer
answer: Geben Sie Ihren Artikel in Markdown ein oder fügen Sie ihn ein, wählen Sie eine Akzentfarbe und klicken Sie auf Als formatierten Text kopieren, um den gestalteten Artikel in den Editor für offizielle WeChat-Konten einzufügen – die Vorschau aktualisiert sich beim Schreiben.
action: Artikel formatieren
fields:
  markdown:
    label: Markdown
    placeholder: "# Titel\n\nSchreiben Sie Ihren Artikel in **Markdown**…"
  accent:
    label: Akzentfarbe
    options:
      neutral: Neutral
      blue: Blau
      green: Grün
      orange: Orange
      red: Rot
      rose: Rosé
      violet: Violett
      yellow: Gelb
output:
  html:
    label: WeChat-Vorschau
steps:
  - Geben Sie Ihren Artikel in das Feld Markdown ein oder fügen Sie ihn ein. Die WeChat-Vorschau aktualisiert sich beim Schreiben.
  - Wählen Sie eine Akzentfarbe für den Balken an Überschriften der Ebene 2, die Ränder von Zitaten, Inline-Code und die Nummern der Quellenverweise.
  - Klicken Sie auf Als formatierten Text kopieren.
  - Fügen Sie den Text in den Artikeltext im Editor für offizielle WeChat-Konten ein.
  - Um den Artikel in einem anderen Editor oder einer Vorlage zu verwenden, klicken Sie stattdessen auf HTML kopieren. So erhalten Sie den Quelltext mit allen Stilen inline.
faq:
  - q: Warum werden meine Links zu Nummern?
    a: Im Editor für offizielle WeChat-Konten können Leser im Artikeltext nicht auf Links zu anderen Websites klicken. Der Formatierer behält den Linktext, setzt eine Nummer wie [1] dahinter und listet alle Adressen am Ende auf, damit Leser die Quelle trotzdem finden. Links zu Artikeln auf mp.weixin.qq.com bleiben anklickbar.
  - q: Warum verschwindet die Formatierung, wenn ich das HTML in den Editor einfüge?
    a: HTML kopieren legt den Quelltext in die Zwischenablage, und der Editor zeigt ihn als reinen Text an. Verwenden Sie für den WeChat-Editor Als formatierten Text kopieren. Damit wird der formatierte Artikel kopiert, so wie beim Kopieren aus einer Webseite.
  - q: Kann ich Bilder von meinem Computer einfügen?
    a: Nein. Bilder müssen http- oder https-Webadressen sein und als ![Bildunterschrift](https://…) geschrieben werden. Der Formatierer lädt keine Dateien hoch. Ein Bild, das allein in einem Absatz steht, wird zentriert, und sein Alternativtext erscheint darunter als Bildunterschrift.
  - q: Welche Programmiersprachen werden hervorgehoben?
    a: Jede Sprache, die der Highlighter Shiki kennt, von JavaScript und Python bis SQL und Bash. Schreiben Sie die Sprache hinter den öffnenden Codezaun, zum Beispiel ```python. Code ohne Sprachangabe oder mit einer Sprache, die Shiki nicht erkennt, erscheint als einfacher Text in Festbreitenschrift.
  - q: Wird mein Entwurf gespeichert?
    a: Ja, sofern Ihr Browser der Website erlaubt, Daten zu speichern. Der Inhalt des Felds Markdown wird kurz nach dem Tippen auf diesem Gerät gespeichert und beim nächsten Besuch wiederhergestellt. Warten Sie also einen Moment, bevor Sie die Seite schließen. Der Entwurf wird nie hochgeladen. Wenn Sie die lokalen Daten der Website löschen, wird er gelöscht.
  - q: Kann ich HTML im Markdown schreiben?
    a: Nein. HTML-Tags werden als Text angezeigt statt gerendert, was die Vorschau außerdem sicher hält. Verwenden Sie Markdown für Überschriften, Listen, Links, Bilder und Tabellen.
---

## So funktioniert der WeChat-Formatierer

Der Editor für offizielle WeChat-Konten entfernt Stylesheets und Klassennamen aus eingefügten Inhalten. Deshalb wird die gesamte Formatierung des Artikels als Inline-Stile geschrieben. Der Formatierer liest Ihr Markdown mit [marked](https://marked.js.org/) und schreibt jede Überschrift, jeden Absatz, jede Liste, Tabelle, jedes Zitat und jeden Codeblock mit den typografischen Stilen dieser Website: 16 px Schriftgröße, eine Zeilenhöhe von 1,75, eine neutrale Farbpalette und Systemschriften, weil der Editor keine Webfonts laden kann. Codeblöcke werden mit [Shiki](https://shiki.style/) in den Farben von GitHub Light hervorgehoben.

## Optionen und Grenzen

- **Markdown:** CommonMark plus Tabellen, Aufgabenlisten und Durchstreichen von GitHub, bis zu 200.000 Zeichen. Einträge in Aufgabenlisten erscheinen als ☑ oder ☐, weil der Editor Kontrollkästchen entfernt.
- **Akzentfarbe:** Neutral, Blau, Grün, Orange, Rot, Rosé, Violett oder Gelb. Sie färbt den Balken neben Überschriften der Ebene 2, die Ränder von Zitaten, Inline-Code, WeChat-Links und die Nummern der Quellenverweise; der Fließtext bleibt fast schwarz.
- **Links:** Links zu mp.weixin.qq.com bleiben anklickbar; andere http- und https-Links werden zu nummerierten Quellenverweisen am Ende des Artikels. Alle übrigen Links behalten nur ihren Text.
- **Bilder:** nur http- und https-Adressen; bei allen anderen bleibt nur der Alternativtext.
- **Kopieren:** Beide Schaltflächen verwenden die Zwischenablage des Browsers, die in manchen Browsern eine Berechtigung erfordert; Als formatierten Text kopieren setzt außerdem einen Browser voraus, der formatiertes HTML kopieren kann. Wenn das Kopieren fehlschlägt, erlauben Sie den Zugriff auf die Zwischenablage und versuchen Sie es erneut.
- **Nicht unterstützt:** reines HTML (wird als Text angezeigt), mathematische Formeln und Diagramme.

## Datenschutz

Ihr Artikel wird nur auf Ihrem Gerät verarbeitet. Die Seite lädt ihn nicht hoch, speichert ihn nicht auf einem Server und verwendet keine Cookies.
