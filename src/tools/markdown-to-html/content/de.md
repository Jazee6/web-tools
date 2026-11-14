---
review: reviewed
updated: 2026-11-14
title: Markdown zu HTML – Markdown umwandeln und HTML online ansehen
description: Wandeln Sie Markdown in sauberes HTML um, mit Überschriften-IDs, optionalem vollständigem HTML-Dokument und Syntaxhervorhebung. Kostenlos und privat im Browser.
name: Markdown zu HTML
answer: Geben Sie Markdown ein oder fügen Sie es ein — das HTML entsteht beim Schreiben. Wechseln Sie zwischen Vorschau und HTML-Quelltext und klicken Sie auf HTML kopieren, um den Code zu kopieren.
action: Umwandeln
fields:
  markdown:
    label: Markdown
    placeholder: "# Title\n\nWrite **Markdown** here…"
  headingIds:
    label: Überschriften-IDs hinzufügen
  document:
    label: Vollständiges HTML-Dokument
  highlight:
    label: Syntaxhervorhebung
  theme:
    label: Farbschema der Hervorhebung
    options:
      github-light: GitHub Light
      github-dark: GitHub Dark
      one-dark-pro: One Dark Pro
      vitesse-light: Vitesse Light
output:
  html:
    label: HTML
steps:
  - Geben Sie Ihr Markdown in das Feld Markdown ein oder fügen Sie es ein. Das HTML wird beim Schreiben aktualisiert.
  - Schalten Sie Vollständiges HTML-Dokument ein, wenn Sie statt eines Fragments eine ganze Seite brauchen.
  - Schalten Sie Syntaxhervorhebung ein, um Codeblöcke einzufärben.
  - Wählen Sie ein Farbschema der Hervorhebung.
  - Öffnen Sie den Tab HTML, um den Quelltext zu lesen, oder bleiben Sie in der Vorschau, um das Ergebnis zu prüfen.
  - Klicken Sie auf HTML kopieren, um den Quelltext zu kopieren, oder auf Als formatierten Text kopieren, um das formatierte Ergebnis in einen Editor wie Google Docs oder Word einzufügen.
faq:
  - q: Bleibt HTML in meinem Markdown erhalten?
    a: Ja. Rohes HTML wie <details>, <kbd> oder ein <img> mit Breitenangabe wird unverändert übernommen, wie es die CommonMark-Spezifikation verlangt. Die Vorschau läuft in einem abgeschotteten Rahmen ohne Skripte, daher wird ein <script> aus Ihrem Markdown auf dieser Seite nicht ausgeführt. Es bleibt aber Teil der Ausgabe und kann dort laufen, wo Sie das HTML veröffentlichen — wandeln Sie also nur Markdown um, dem Sie vertrauen.
  - q: Wie entstehen die Überschriften-IDs?
    a: Nach den Regeln, die GitHub für seine Anker verwendet. Der Text der Überschrift ohne Markdown- oder HTML-Tags wird kleingeschrieben; Satzzeichen, Symbole und Emoji werden entfernt, außer Bindestrichen und verbindenden Satzzeichen wie _; Leerzeichen werden zu Bindestrichen. So wird aus „What's new in v2.0?“ id="whats-new-in-v20". Buchstaben aller Schriften bleiben erhalten, deutsche Umlaute ebenso wie chinesische oder kyrillische Überschriften. Eine wiederholte Überschrift erhält -1, -2 usw., und eine Überschrift, von der nichts übrig bleibt, etwa eine nur aus Emoji, erhält keine ID. Schalten Sie Überschriften-IDs hinzufügen aus, um sie wegzulassen.
  - q: Was ist der Unterschied zwischen einem Fragment und einem vollständigen HTML-Dokument?
    a: Ein Fragment ist nur der umgewandelte Inhalt, bereit zum Einfügen in eine Seite, ein CMS oder eine Vorlage, die schon ein eigenes <head> und eigene Stile hat. Ein vollständiges HTML-Dokument ergänzt <!doctype html>, ein <head> mit einem Titel aus der ersten Überschrift 1 mit Text („Document“, wenn es keine gibt) und ein kleines Standard-Stylesheet, sodass Sie es als .html-Datei speichern und im Browser öffnen können.
  - q: Wie funktioniert die Syntaxhervorhebung?
    a: Codeblöcke, die nach dem öffnenden Zaun eine Sprache angeben, etwa ```python, werden mit dem Highlighter Shiki eingefärbt. Jede Farbe steht als Inline-Stil im HTML, ein eigenes Stylesheet ist also nicht nötig; Editoren, die Inline-Stile entfernen, entfernen allerdings auch die Farben. Code ohne Sprache oder mit einer Sprache, die Shiki nicht kennt, bleibt ungefärbt. Die Hervorhebung ist standardmäßig aus; Codeblöcke mit Sprachangabe erhalten dann <pre><code class="language-…"> für Ihren eigenen Highlighter, alle anderen ein einfaches <pre><code>.
  - q: Wird mein Markdown gespeichert?
    a: Ja, wenn Ihr Browser der Website erlaubt, Daten zu speichern. Das Feld Markdown wird kurz nach dem Tippen auf diesem Gerät gespeichert und beim nächsten Besuch wiederhergestellt. Es wird nie hochgeladen. Wenn Sie die lokalen Daten der Website löschen, wird es entfernt.
---

## So funktioniert der Markdown-zu-HTML-Konverter

Der Konverter liest Ihr Markdown mit [marked](https://marked.js.org/) nach [CommonMark](https://commonmark.org/) und den GitHub-Flavored-Markdown-Erweiterungen für Tabellen, Aufgabenlisten, Durchstreichen und automatische Links. Er erzeugt dasselbe HTML wie marked und ergänzt Überschriften-IDs im Stil von GitHub sowie, wenn Sie es einschalten, mit [Shiki](https://shiki.style/) hervorgehobenen Code. Die Umwandlung läuft in einem Hintergrund-Thread Ihres Browsers und nicht auf der Seite selbst.

## Optionen und Grenzen

- **Markdown:** bis zu 200.000 Zeichen.
- **Rohes HTML:** bleibt unverändert und wird nicht bereinigt. Skripte laufen nie in der Vorschau, sind aber Teil der Ausgabe.
- **Überschriften-IDs:** standardmäßig an, nach GitHubs Anker-Regeln; wiederholte Überschriften erhalten -1, -2, und Überschriften, von denen danach nichts übrig bleibt, erhalten keine.
- **Vollständiges HTML-Dokument:** standardmäßig aus; ergänzt einen Doctype, einen Titel aus der ersten Überschrift 1 und ein Standard-Stylesheet.
- **Syntaxhervorhebung:** standardmäßig aus; GitHub Light, GitHub Dark, One Dark Pro oder Vitesse Light, mit Inline-Farben. Das Farbschema und die Grammatik jeder Sprache werden beim ersten Bedarf heruntergeladen, was einen Moment dauern kann; schlägt der Download fehl, etwa offline, bleiben die Codeblöcke ungefärbt.
- **Kopieren:** Beide Schaltflächen nutzen die Zwischenablage Ihres Browsers, die manche Browser erst freigeben müssen; Als formatierten Text kopieren braucht außerdem einen Browser, der formatiertes HTML kopieren kann.
- **Nicht unterstützt:** Fußnoten, mathematische Formeln und Diagramme wie Mermaid, die als Text oder Codeblock erhalten bleiben. YAML-Front-Matter wird nicht entfernt und wie das übrige Markdown umgewandelt.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihr Markdown nicht hoch, speichert es nicht auf einem Server und verwendet keine Cookies.
