---
review: draft
updated: 2026-10-29
title: Hash-Generator – MD5, SHA-1, SHA-256 und SHA-512 online erzeugen
description: Erzeugen Sie den MD5-, SHA-1-, SHA-256-, SHA-384- oder SHA-512-Hash eines beliebigen Textes als Hex oder Base64. Kostenlos und privat – läuft in Ihrem Browser.
name: Hash-Generator
answer: Geben Sie Ihren Text ein oder fügen Sie ihn ein, wählen Sie einen Algorithmus wie SHA-256 und ein Ausgabeformat und klicken Sie auf Hash erzeugen – der Hash erscheint direkt in Ihrem Browser.
action: Hash erzeugen
fields:
  text:
    label: Text
    placeholder: Text, dessen Hash berechnet werden soll
  algorithm:
    label: Algorithmus
    options:
      md5: MD5
      sha-1: SHA-1
      sha-256: SHA-256
      sha-384: SHA-384
      sha-512: SHA-512
  format:
    label: Ausgabeformat
    options:
      hex: Hex (Kleinbuchstaben)
      hex-upper: Hex (Großbuchstaben)
      base64: Base64
output:
  hash:
    label: Hash
errors: {}
steps:
  - Geben Sie den Text, dessen Hash Sie berechnen möchten, in das Eingabefeld ein oder fügen Sie ihn ein.
  - Wählen Sie einen Algorithmus. SHA-256 ist voreingestellt; MD5 und SHA-1 eignen sich nur für Prüfsummen und Kompatibilität.
  - Wählen Sie ein Ausgabeformat – Hex (Kleinbuchstaben), Hex (Großbuchstaben) oder Base64.
  - Klicken Sie auf Hash erzeugen und kopieren Sie das Ergebnis.
faq:
  - q: Wird mein Text auf einen Server hochgeladen?
    a: Nein. Der Hash wird vollständig in Ihrem Browser berechnet, Ihr Text verlässt Ihr Gerät also nie. Sobald die Seite geladen ist, funktioniert sie sogar offline.
  - q: Welchen Algorithmus sollte ich verwenden?
    a: Verwenden Sie SHA-256, sofern nichts anderes verlangt wird. SHA-384 und SHA-512 liefern längere Hashes aus derselben Familie. MD5 und SHA-1 gelten für Sicherheitszwecke als gebrochen, weil Angreifer Kollisionen erzeugen können; nutzen Sie sie nur für Prüfsummen und die Kompatibilität mit alten Systemen.
  - q: Kann ich damit Passwörter hashen?
    a: Nein. Das sind schnelle Allzweck-Hashes, und ein schneller Hash lässt sich leicht per Brute Force knacken. Zum Speichern von Passwörtern verwenden Sie auf dem Server eine langsame, gesalzene Passwort-Hash-Funktion wie Argon2, scrypt oder bcrypt.
  - q: Warum weicht der Hash vom Ergebnis eines anderen Tools ab?
    a: Der Text wird genau so, wie Sie ihn eingegeben haben, als UTF-8-Bytes gehasht. Ein Zeilenumbruch am Ende, ein zusätzliches Leerzeichen oder andere Zeilenenden ändern daher das Ergebnis. Ein anderes Tool liest den Text möglicherweise auch in einer anderen Kodierung.
  - q: Kann ich eine Datei hashen?
    a: Mit diesem Tool nicht, da es nur Text verarbeitet.
---

## Was dieses Hash-Tool macht

Es wandelt Ihren Text in UTF-8-Bytes um und berechnet die Prüfsumme dieser Bytes. SHA-1, SHA-256, SHA-384 und SHA-512 nutzen die im Browser eingebaute Web-Crypto-API, die [FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final) umsetzt. MD5 gehört nicht zu Web Crypto, deshalb enthält die Seite eine eigene Implementierung von [RFC 1321](https://www.rfc-editor.org/rfc/rfc1321), die anhand der offiziellen Testvektoren geprüft wurde.

## Optionen und Grenzen

- **Algorithmen:** MD5, SHA-1, SHA-256, SHA-384, SHA-512.
- **Ausgabeformate:** Hex in Kleinbuchstaben, Hex in Großbuchstaben oder Base64.
- **Nur Text:** Dateien werden nicht unterstützt, und der Text wird genau so gehasht, wie er eingegeben wurde, einschließlich Leerzeichen und Zeilenumbrüchen.
- **Nicht für Passwörter:** Die Hashes sind von Haus aus schnell und ungesalzen und eignen sich daher nicht zum Speichern von Passwörtern.
- **Größe:** nur durch den Speicher Ihres Geräts begrenzt.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihren Text nicht hoch, speichert ihn nicht und verwendet keine Cookies.
