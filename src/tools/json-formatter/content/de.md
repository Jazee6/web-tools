---
review: reviewed
updated: 2026-10-29
title: JSON-Formatierer – JSON online formatieren, prüfen & minifizieren
description: JSON formatieren, prüfen, minifizieren oder Schlüssel sortieren. Kostenlos, sofort und privat – Ihre Daten werden in Ihrem Browser verarbeitet und nie hochgeladen.
name: JSON-Formatierer
answer: Fügen Sie Ihr JSON ein, wählen Sie eine Einrückung und klicken Sie auf JSON formatieren – das Tool prüft die Eingabe und liefert sauber eingerücktes oder minifiziertes JSON direkt in Ihrem Browser.
action: JSON formatieren
fields:
  json:
    label: JSON
    placeholder: '{"name": "Ada", "langs": ["en", "fr"]}'
  indent:
    label: Einrückung
    options:
      "2": 2 Leerzeichen
      "4": 4 Leerzeichen
      tab: Tabs
      minify: Minifizieren (eine Zeile)
  sortKeys:
    label: Schlüssel alphabetisch sortieren
output:
  formatted:
    label: Formatiertes JSON
errors:
  invalid_json: Das ist kein gültiges JSON. Prüfen Sie, ob Kommas am Ende, einfache Anführungszeichen, Schlüssel ohne Anführungszeichen oder Kommentare vorkommen, und versuchen Sie es erneut.
steps:
  - Fügen Sie Ihr JSON in das Eingabefeld ein oder tippen Sie es ein.
  - Wählen Sie eine Einrückung – 2 Leerzeichen, 4 Leerzeichen, Tabs oder Minifizieren, um alles in eine Zeile zu schreiben.
  - Aktivieren Sie bei Bedarf Schlüssel alphabetisch sortieren, um die Schlüssel aller Objekte auf jeder Ebene zu ordnen.
  - Klicken Sie auf JSON formatieren und kopieren Sie das Ergebnis. Ist das JSON ungültig, zeigt die Fehlermeldung, was der Parser gefunden hat und wo.
faq:
  - q: Wird mein JSON auf einen Server hochgeladen?
    a: Nein. Die Formatierung läuft vollständig in Ihrem Browser mit dem eingebauten JSON-Parser, die Daten verlassen Ihr Gerät also nie. Sobald die Seite geladen ist, funktioniert sie sogar offline.
  - q: Was ist der Unterschied zwischen Formatieren und Minifizieren?
    a: Formatieren (Pretty-Printing) fügt Zeilenumbrüche und Einrückungen hinzu, damit Menschen die Struktur lesen können. Minifizieren entfernt alle optionalen Leerzeichen und erzeugt das kleinstmögliche gültige JSON zum Speichern oder Übertragen. In beiden Fällen bleiben die Daten exakt gleich.
  - q: Verändert das Sortieren der Schlüssel meine Daten?
    a: Nur die Reihenfolge der Schlüssel innerhalb von Objekten ändert sich; Werte, Verschachtelung und die Reihenfolge in Arrays bleiben gleich. JSON-Objekte sind per Definition ungeordnet, das sortierte Ergebnis ist also gleichwertig – und zwei Dokumente lassen sich viel leichter vergleichen.
  - q: Warum meldet der Formatierer, dass mein JSON ungültig ist?
    a: Häufige Ursachen sind Kommas am Ende, einfache statt doppelter Anführungszeichen, Schlüssel ohne Anführungszeichen, Kommentare und Werte wie NaN oder undefined. In JavaScript sind sie erlaubt, in JSON nicht. Die Fehlermeldung zeigt, was der Parser abgelehnt hat und wo.
  - q: Bleiben sehr große Zahlen exakt erhalten?
    a: Zahlen werden als standardmäßige 64-Bit-Gleitkommazahlen gelesen, daher können Ganzzahlen über 9.007.199.254.740.991 an Genauigkeit verlieren. Wenn Sie mit großen IDs arbeiten, speichern Sie sie als Strings.
---

## Was dieser JSON-Formatierer macht

Er parst Ihre Eingabe mit demselben strengen JSON-Parser, den Browser verwenden – alles, was er akzeptiert, ist also gültiges JSON nach [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259). Gültige Eingaben werden mit der gewählten Einrückung neu ausgegeben; ungültige werden mit der Fehlermeldung des Parsers abgelehnt, statt stillschweigend „repariert“ zu werden.

## Optionen und Grenzen

- **Einrückung:** 2 Leerzeichen, 4 Leerzeichen, Tabs oder minifiziert in einer einzigen Zeile.
- **Schlüssel sortieren:** rekursiv und alphabetisch nach Codepunkt; die Reihenfolge in Arrays ändert sich nie.
- **Größe:** nur durch den Speicher Ihres Geräts begrenzt.
- **Nicht unterstützt:** Erweiterungen von JSON5 oder JSONC wie Kommentare und Kommas am Ende – entfernen Sie sie vorher.

## Datenschutz

Ihr JSON wird nur auf Ihrem Gerät verarbeitet. Die Seite lädt es nicht hoch, speichert es nicht und verwendet keine Cookies.
