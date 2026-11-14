---
review: reviewed
updated: 2026-11-09
title: "UUID-Generator – Zufällige UUID-v4-Kennungen online erzeugen"
description: "Erzeugen Sie bis zu 1.000 zufällige UUID-v4-Kennungen auf einmal, in Klein- oder Großbuchstaben. Kostenlos und privat, vollständig in Ihrem Browser."
name: "UUID-Generator"
answer: "Wählen Sie eine Anzahl und klicken Sie auf UUIDs erzeugen, um zufällige UUID-v4-Kennungen in Ihrem Browser zu erstellen, eine pro Zeile und bereit zum Kopieren."
action: "UUIDs erzeugen"
fields:
  count:
    label: "Anzahl"
  uppercase:
    label: "Großbuchstaben"
output:
  uuids:
    label: "UUIDs"
errors: {}
steps:
  - "Stellen Sie Anzahl auf eine ganze Zahl von 1 bis 1.000 ein; voreingestellt ist 1."
  - "Aktivieren Sie bei Bedarf Großbuchstaben; voreingestellt sind Kleinbuchstaben."
  - "Klicken Sie auf UUIDs erzeugen und kopieren Sie das Ergebnis mit einer Kennung pro Zeile."
faq:
  - q: "Welche UUID-Version wird erzeugt?"
    a: "Nur Version 4, mit der kryptografisch sicheren randomUUID-API der Plattform. Zeit- oder namensbasierte UUIDs wie v1, v5 oder v7 werden nicht erzeugt."
  - q: "Wie viele UUIDs kann ich auf einmal erzeugen?"
    a: "1 bis 1.000 pro Durchlauf. Jede UUID steht in einer eigenen Zeile, ohne geschweifte Klammern oder URN-Präfix."
  - q: "Verändern Großbuchstaben die UUID?"
    a: "Nein. Sie verändern nur die hexadezimalen Buchstaben, nicht den Wert der Kennung. Beide Formen behalten die Bindestriche."
  - q: "Werden die erzeugten Kennungen hochgeladen oder gespeichert?"
    a: "Nein. Die Erzeugung findet auf Ihrem Gerät statt, und die Seite lädt die erzeugten Kennungen weder hoch noch speichert sie. Kopieren Sie Ergebnisse, die Sie behalten möchten, bevor Sie die Seite verlassen."
---

## So funktioniert die UUID-Erzeugung

Jede Kennung stammt aus der Web-Crypto-API `crypto.randomUUID()` der Plattform. Das Ergebnis ist eine UUID v4 im Format `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`, wobei `y` in Kleinschreibung 8, 9, a oder b ist. Jeder Klick erzeugt einen neuen Satz; es gibt weder Eingabetext noch einen Startwert.

## Optionen und Grenzen

- **Anzahl:** eine ganze Zahl von 1 bis 1.000, voreingestellt ist 1.
- **Schreibweise:** standardmäßig Kleinbuchstaben oder Großbuchstaben im gleichen Format mit Bindestrichen.
- **Nicht unterstützt:** andere UUID-Versionen als v4, eigene Startwerte, geschweifte Klammern und URN-Präfixe.

## Datenschutz

Die Erzeugung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihre erzeugten UUIDs nicht hoch, speichert sie nicht und verwendet keine Cookies.
