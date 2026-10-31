---
review: draft
updated: 2026-10-31
title: Regex-Tester – JavaScript-Regex online testen
description: Testen Sie einen regulären JavaScript-Ausdruck an Ihrem Text und sehen Sie jeden Treffer mit Position und Gruppen. Kostenlos und privat – läuft im Browser.
name: Regex-Tester
answer: Geben Sie ein Muster und einen Text ein, behalten oder ändern Sie die Flags und klicken Sie auf Testen – jeder Treffer erscheint mit Position und Erfassungsgruppen direkt im Browser.
action: Testen
fields:
  pattern:
    label: Muster
    placeholder: '(\d{4})-(\d{2})-(\d{2})'
  flags:
    label: Flags
    placeholder: gi
  text:
    label: Text
    placeholder: Text zum Durchsuchen hier einfügen
output:
  count:
    label: Gefundene Treffer
  matches:
    label: Treffer
    columns:
      index: Position
      match: Treffer
      groups: Gruppen
errors:
  invalid_pattern: Dieses Muster ist kein gültiger regulärer JavaScript-Ausdruck. Prüfen Sie, ob Klammern ausgeglichen sind, ob vor einem Quantifizierer etwas steht, ob ein überzähliger Backslash vorkommt und ob sich die Flags kombinieren lassen – u und v zum Beispiel nicht.
  invalid_flags: Diese Flags sind ungültig. Verwenden Sie nur d, g, i, m, s, u, v und y, jedes höchstens einmal.
  text_too_long: Der Text ist länger als 100.000 Zeichen. Testen Sie das Muster an einer kürzeren Stichprobe.
steps:
  - Geben Sie den regulären Ausdruck bei Muster ein, ohne die umgebenden Schrägstriche.
  - Behalten Sie die Flags bei (g findet alle Treffer) oder ändern Sie sie, etwa zu gi, um die Groß-/Kleinschreibung zu ignorieren.
  - Fügen Sie den Text bei Text ein und klicken Sie auf Testen.
  - Lesen Sie die Zahl der Treffer ab und in der Tabelle jeden Treffer mit seiner Position und dem Text, den die einzelnen Gruppen erfasst haben.
faq:
  - q: Wird mein Text auf einen Server hochgeladen?
    a: Nein. Das Muster läuft vollständig in Ihrem Browser, weder das Muster noch Ihr Text verlässt Ihr Gerät. Nach dem Laden der Seite können Sie sie sogar offline nutzen.
  - q: Welche Syntax für reguläre Ausdrücke wird verwendet?
    a: Die der JavaScript-Engine Ihres Browsers, wie sie der ECMAScript-Standard festlegt. Dazu gehören Lookahead und Lookbehind, benannte Gruppen und mit dem Flag u oder v Unicode-Eigenschaften wie \p{L}. Sie ist nicht mit PCRE, Python oder Java identisch, daher funktionieren Funktionen wie possessive Quantifizierer oder Inline-Flags wie (?i) womöglich nicht.
  - q: Was bedeuten die Flags?
    a: g findet alle Treffer statt nur den ersten, i ignoriert die Groß-/Kleinschreibung, m lässt ^ und $ in jeder Zeile gelten, s lässt den Punkt auch Zeilenumbrüche treffen, u und v schalten den Unicode-Modus ein (eines von beiden, nicht beide), y trifft nur an der genauen Stelle, an der die Suche beginnt, und d speichert die Indizes der Gruppen. Jedes Flag darf einmal vorkommen.
  - q: Warum sehe ich nur einen Treffer?
    a: Ohne das Flag g hört ein regulärer JavaScript-Ausdruck beim ersten Treffer auf, und dieses Tool ebenso. Ergänzen Sie g bei Flags, um alle Treffer aufzulisten.
  - q: Was zeigt die Spalte Gruppen?
    a: Den Text, den jede Gruppe in Klammern erfasst hat, als JSON. Ein Muster mit gewöhnlichen Gruppen ergibt ein Array in der Reihenfolge, etwa ["2024","02","29"]. Ein Muster mit benannten Gruppen ergibt ein Objekt, etwa {"year":"2024"}. Eine Gruppe, die am Treffer nicht beteiligt war, erscheint als null, und die Spalte bleibt leer, wenn das Muster keine Gruppen hat.
  - q: Warum bleibt die Seite bei manchen Mustern hängen?
    a: Manche Muster mit verschachtelten Wiederholungen, etwa (a+)+$, brauchen mit wachsendem Text exponentiell länger, und ein Browser kann einen regulären Ausdruck nicht mitten in der Ausführung anhalten. Reagiert der Tab nicht mehr, schließen oder laden Sie ihn neu und vereinfachen Sie das Muster.
---

## Was dieser Regex-Tester macht

Das Tool baut mit dem `RegExp` des Browsers aus Ihrem Muster und Ihren Flags einen regulären Ausdruck und führt ihn einmal über Ihren Text aus. Mit dem Flag g sammelt es alle Treffer per `matchAll`; ohne g nimmt es nur den ersten, genau wie `RegExp.prototype.exec`. Zu jedem Treffer gibt es die bei 0 beginnende Position, den getroffenen Text und die erfassten Gruppen. Syntax und Verhalten sind die Ihres Browsers, beschrieben im [MDN-Leitfaden zu regulären Ausdrücken](https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Regular_expressions).

## Optionen und Grenzen

- **Eingabe:** ein Muster mit bis zu 1.000 Zeichen und ein Text mit bis zu 100.000 Zeichen. Keines von beiden darf leer sein.
- **Umfang des Ergebnisses:** Die Anzahl zählt alle Treffer, die Tabelle listet aber nur die ersten 200 auf.
- **Position:** gezählt in UTF-16-Codeeinheiten, so wie JavaScript Zeichenketten-Indizes zählt, ein Emoji belegt also zwei Positionen.
- **Browserunterschiede:** Das Flag v und einige neuere Syntax funktionieren nur in aktuellen Browsern. Ein Muster, das ein Browser als ungültig ablehnt, kann in einem anderen akzeptiert werden.
- **Nicht enthalten:** Text ersetzen, Text aufteilen und das Muster erklären.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihr Muster und Ihren Text nicht hoch, speichert sie nicht und verwendet keine Cookies.
