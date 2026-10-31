---
review: draft
updated: 2026-10-31
title: Groß-/Kleinschreibung-Konverter – Title Case, camelCase und mehr
description: Wandeln Sie Text in Groß- oder Kleinbuchstaben, Titelschreibweise, camelCase, snake_case und mehr um. Kostenlos und privat – läuft in Ihrem Browser.
name: Groß-/Kleinschreibung-Konverter
answer: Fügen Sie Ihren Text ein, wählen Sie ein Format wie Title Case oder snake_case und klicken Sie auf Umwandeln – der umgewandelte Text erscheint direkt im Browser und lässt sich kopieren.
action: Umwandeln
fields:
  text:
    label: Text
    placeholder: Text hier einfügen oder eingeben
  mode:
    label: Format
    options:
      title: Title Case (jedes Wort groß beginnen)
      sentence: Sentence case (nur Satzanfang groß)
      upper: GROSSBUCHSTABEN
      lower: kleinbuchstaben
      camel: camelCase
      pascal: PascalCase
      snake: snake_case
      kebab: kebab-case
      constant: CONSTANT_CASE
output:
  result:
    label: Ergebnis
steps:
  - Fügen Sie Ihren Text in das Feld Text ein oder geben Sie ihn dort ein.
  - Wählen Sie ein Format – Title Case, Sentence case, GROSSBUCHSTABEN, kleinbuchstaben, camelCase, PascalCase, snake_case, kebab-case oder CONSTANT_CASE.
  - Klicken Sie auf Umwandeln und kopieren Sie das Ergebnis.
faq:
  - q: Wird mein Text auf einen Server hochgeladen?
    a: Nein. Die Umwandlung läuft vollständig in Ihrem Browser, Ihr Text verlässt also nie Ihr Gerät. Nach dem Laden der Seite können Sie sie sogar offline nutzen.
  - q: Was ist der Unterschied zwischen Title Case und Sentence case?
    a: Title Case schreibt den ersten Buchstaben jedes Wortes groß und den Rest klein, aus „the cat's hat“ wird also „The Cat's Hat“. Sentence case schreibt nur den ersten Buchstaben jedes Satzes und jeder Zeile groß und alles andere klein, aus „THE CAT. IT SLEPT“ wird also „The cat. It slept“.
  - q: Lässt Title Case kleine Wörter wie „a“ und „of“ klein?
    a: Nein. Jedes Wort wird großgeschrieben, weil das Tool keine Ausnahmeliste hat und Stilrichtlinien sich uneins sind, welche Wörter ausgenommen werden. Schreiben Sie die wenigen kleinen Wörter bei Bedarf von Hand wieder klein.
  - q: Wie werden Wörter für camelCase, snake_case und die anderen Code-Stile getrennt?
    a: Der Text wird an Leerzeichen, Satzzeichen und jedem anderen Zeichen getrennt, das kein Buchstabe oder keine Ziffer ist, sowie zwischen einem Kleinbuchstaben und einem Großbuchstaben. Eine Folge von Großbuchstaben vor einem kleingeschriebenen Wort wird vor ihrem letzten Großbuchstaben getrennt, aus XMLHttpRequest werden also XML, Http und Request. Ziffern bleiben beim vorangehenden Wort, „utf8“ ist also ein Wort, während eine Zahl am Wortanfang allein steht. Satzzeichen entfallen.
  - q: Funktioniert das mit mehreren Zeilen?
    a: Ja. Die Code-Stile wandeln jede Zeile einzeln um, sodass jede Zeile zu einem Bezeichner wird und die Zeilenumbrüche an ihrer Stelle bleiben. Das ist praktisch, um eine Liste von Namen in Konstanten zu verwandeln.
  - q: Funktioniert das mit Buchstaben mit Akzenten und aus anderen Sprachen?
    a: Ja, bei allen Schriften mit Groß- und Kleinbuchstaben, etwa lateinischen Buchstaben mit Akzenten, Griechisch und Kyrillisch. Das deutsche ß wird in Großbuchstaben zu SS. Schriften ohne Groß- und Kleinschreibung wie Chinesisch und Japanisch bleiben unverändert, und die Code-Stile behandeln eine zusammenhängende Folge davon als ein Wort.
---

## Was dieser Groß-/Kleinschreibung-Konverter macht

Groß- und Kleinbuchstaben nutzen die Standard-Zeichenkettenumwandlung des Browsers, die den Unicode-Zuordnungen für Groß- und Kleinschreibung folgt und nicht von Ihren Spracheinstellungen abhängt. Title Case findet jedes Wort, eine Folge aus Buchstaben und Ziffern, die Apostrophe enthalten darf, und schreibt dessen ersten Buchstaben groß. Sentence case schreibt den Text zunächst klein und dann den ersten Buchstaben nach einem Punkt, Ausrufezeichen, Fragezeichen oder Auslassungszeichen (…) mit folgendem Leerzeichen, nach `。`, `！` und `？` sowie am Anfang des Textes und jeder Zeile groß. Die Code-Stile teilen den Text wie in den Fragen oben beschrieben in Wörter und verbinden sie mit dem Trennzeichen des gewählten Stils.

## Optionen und Grenzen

- **Eingabe:** jeweils ein Text, so groß, wie Ihr Gerät ihn aufnehmen kann. Ein leerer Text wird nicht umgewandelt.
- **Regeln:** Sie sind für alle Sprachen gleich. Das türkische i mit und ohne Punkt wird nicht gesondert behandelt, und das Tool kennt weder Eigennamen noch Akronyme oder Abkürzungen – bei Sentence case beginnt daher auch das Wort nach „Mr.“ mit einem Großbuchstaben.
- **Sentence case:** Ein Punkt innerhalb einer Zahl oder Domain wie 3.14 oder example.com beginnt keinen neuen Satz.
- **Code-Stile:** Satzzeichen entfallen, eine Zeile ohne Buchstaben und Ziffern wird leer, und ein Name wie „iOS“ wird in „i“ und „OS“ geteilt.
- **Zeilenumbrüche:** `\n`, `\r\n` und `\r` bleiben unverändert erhalten.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihren Text nicht hoch, speichert ihn nicht und verwendet keine Cookies.
