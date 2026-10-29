---
review: reviewed
updated: 2026-10-29
title: Base64 kodieren und dekodieren – Text online in Base64 umwandeln
description: Text in Base64 kodieren oder Base64 in Text dekodieren, mit URL-sicherer Ausgabe und UTF-8. Kostenlos und privat – läuft in Ihrem Browser, nichts wird hochgeladen.
name: Base64 kodieren/dekodieren
answer: Fügen Sie Ihren Text oder Ihren Base64-String ein, wählen Sie Kodieren oder Dekodieren und klicken Sie auf Umwandeln – das Ergebnis erscheint direkt in Ihrem Browser, auch mit Nicht-ASCII-Zeichen.
action: Umwandeln
fields:
  text:
    label: Text oder Base64
    placeholder: Hello, 世界!
  mode:
    label: Modus
    options:
      encode: Text in Base64 kodieren
      decode: Base64 in Text dekodieren
  urlSafe:
    label: URL-sichere Ausgabe (- und _, ohne Auffüllung)
output:
  result:
    label: Ergebnis
errors:
  invalid_base64: Das ist kein gültiges Base64. Entfernen Sie alle Zeichen außer Buchstaben, Ziffern, + / - _ und = (Leerzeichen und Zeilenumbrüche sind in Ordnung), prüfen Sie, ob nichts abgeschnitten wurde, und versuchen Sie es erneut.
  invalid_utf8: Das Base64 ist gültig, aber die enthaltenen Bytes sind kein UTF-8-Text. Vermutlich handelt es sich um Binärdaten wie ein Bild oder eine Datei, die dieses Tool nicht als Text anzeigen kann.
steps:
  - Fügen Sie den zu kodierenden Text oder den zu dekodierenden Base64-String in das Eingabefeld ein oder tippen Sie ihn ein.
  - Wählen Sie einen Modus – Text in Base64 kodieren oder Base64 in Text dekodieren.
  - Aktivieren Sie beim Kodieren URL-sichere Ausgabe (- und _, ohne Auffüllung), wenn das Ergebnis in einer URL, einem Dateinamen oder einem JWT verwendet wird.
  - Klicken Sie auf Umwandeln und kopieren Sie das Ergebnis. Schlägt das Dekodieren fehl, zeigt die Fehlermeldung, ob das Base64 selbst oder der darin enthaltene Text das Problem ist.
faq:
  - q: Wird mein Text auf einen Server hochgeladen?
    a: Nein. Kodieren und Dekodieren laufen vollständig in Ihrem Browser, Ihr Text verlässt Ihr Gerät also nie. Sobald die Seite geladen ist, funktioniert sie sogar offline.
  - q: Funktioniert es mit Emojis und Nicht-ASCII-Zeichen?
    a: Ja. Der Text wird vor dem Kodieren in UTF-8-Bytes umgewandelt, und dekodierte Bytes werden als UTF-8 gelesen. Zeichen wie 世界 oder 😀 bleiben daher bei Hin- und Rückumwandlung erhalten.
  - q: Was ist URL-sicheres Base64?
    a: Standard-Base64 verwendet + und /, die in URLs eine besondere Bedeutung haben, sowie = als Auffüllung. Die URL-sichere Variante aus RFC 4648 ersetzt sie durch - und _ und lässt die Auffüllung weg. So lässt sich das Ergebnis ohne Maskierung in URLs, Dateinamen und JWTs verwenden.
  - q: Warum meldet das Dekodieren, dass die Bytes kein UTF-8-Text sind?
    a: Base64 kann beliebige Bytes enthalten, nicht nur Text. Stammt der String von einem Bild, einer PDF-Datei oder verschlüsselten Daten, sind seine Bytes kein gültiges UTF-8 und lassen sich nicht als Text anzeigen. Dieses Tool dekodiert nur Text.
  - q: Ist Base64 eine Form der Verschlüsselung?
    a: Nein. Base64 kann jeder ohne Schlüssel dekodieren, es verbirgt also nichts. Es wandelt Bytes lediglich in gewöhnliche Zeichen um, die Systeme für Text wie E-Mail, JSON und URLs unbeschadet überstehen. Schützen Sie damit keine Geheimnisse.
---

## Was dieses Base64-Tool macht

Beim Kodieren wandelt es Ihren Text in UTF-8-Bytes um und schreibt sie mit dem 64-Zeichen-Alphabet aus [RFC 4648](https://www.rfc-editor.org/rfc/rfc4648), ergänzt um die Auffüllung mit =. Beim Dekodieren läuft es umgekehrt, und die Bytes werden als UTF-8-Text gelesen. Das Dekodieren ist nachsichtig: Es akzeptiert sowohl das Standard- als auch das URL-sichere Alphabet, ignoriert Leerzeichen und Zeilenumbrüche und funktioniert auch ohne Auffüllung.

## Optionen und Grenzen

- **Modi:** Text in Base64 kodieren oder Base64 in Text dekodieren.
- **URL-sichere Ausgabe:** gilt nur beim Kodieren – sie verwendet - und _ und lässt die Auffüllung mit = weg. Zum Dekodieren ist keine Einstellung nötig.
- **Nur Text:** Dateien und Binärdaten werden nicht unterstützt. Base64, das zu Bytes ohne gültiges UTF-8 dekodiert wird, wird abgelehnt, statt als unleserlicher Text angezeigt zu werden.
- **Größe:** nur durch den Speicher Ihres Geräts begrenzt.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihren Text nicht hoch, speichert ihn nicht und verwendet keine Cookies.
