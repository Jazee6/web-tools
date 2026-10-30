---
review: reviewed
updated: 2026-10-30
title: URL kodieren und dekodieren – URLs online prozentkodieren
description: Text für eine URL oder einen Query-String prozentkodieren oder %20-Sequenzen dekodieren. Kostenlos und privat – läuft in Ihrem Browser, nichts wird hochgeladen.
name: URL kodieren/dekodieren
answer: Fügen Sie Ihren Text oder Ihre URL ein, wählen Sie Kodieren oder Dekodieren und einen Bereich und klicken Sie auf Umwandeln – das Ergebnis erscheint direkt in Ihrem Browser.
action: Umwandeln
fields:
  text:
    label: Text oder URL
    placeholder: https://example.com/search?q=café & tea
  mode:
    label: Modus
    options:
      encode: Kodieren (Text zu %XX)
      decode: Dekodieren (%XX zu Text)
  scope:
    label: Bereich
    options:
      component: URL-Bestandteil (Abfragewert, Pfadsegment)
      url: "Ganze URL (behält : / ? # & =)"
      form: Formulardaten (Leerzeichen als +)
output:
  result:
    label: Ergebnis
errors:
  invalid_encoding: Dieser Text lässt sich nicht umwandeln. Prüfen Sie beim Dekodieren, ob ein % nicht von zwei Hexadezimalziffern gefolgt wird oder ob prozentkodierte Bytes kein gültiges UTF-8 sind. Prüfen Sie beim Kodieren, ob beschädigte Zeichen wie ein einzelnes Surrogat vorkommen.
steps:
  - Fügen Sie Ihren Text, Ihre URL oder Ihre prozentkodierte Zeichenfolge in das Eingabefeld ein oder tippen Sie sie ein.
  - Wählen Sie einen Modus – Kodieren (Text zu %XX) oder Dekodieren (%XX zu Text).
  - "Wählen Sie einen Bereich. Nehmen Sie URL-Bestandteil (Abfragewert, Pfadsegment) für einen einzelnen Abfragewert oder ein Pfadsegment, Ganze URL (behält : / ? # & =), um die Satzzeichen der URL selbst zu belassen, oder Formulardaten (Leerzeichen als +) für Werte im Format application/x-www-form-urlencoded."
  - Klicken Sie auf Umwandeln und kopieren Sie das Ergebnis. Schlägt es fehl, erklärt die Fehlermeldung, was Sie prüfen sollten.
faq:
  - q: Wird mein Text auf einen Server hochgeladen?
    a: Nein. Kodieren und Dekodieren laufen vollständig in Ihrem Browser, Ihr Text verlässt Ihr Gerät also nie. Sobald die Seite geladen ist, funktioniert sie sogar offline.
  - q: Was ist der Unterschied zwischen URL-Bestandteil und Ganze URL?
    a: "URL-Bestandteil maskiert alles außer Buchstaben, Ziffern und - _ . ! ~ * ' ( ), also auch Zeichen wie / ? & = #. Verwenden Sie es für einen einzelnen Wert innerhalb einer URL. Ganze URL lässt die Zeichen, die eine URL gliedern (: / ? # & = und weitere), unverändert und maskiert nur den Rest, sodass eine vollständige Adresse funktionsfähig bleibt."
  - q: Wann sollte ich Formulardaten verwenden?
    a: Verwenden Sie sie für Werte im Format application/x-www-form-urlencoded, dem Format von HTML-Formularübermittlungen und vieler Query-Strings. Ein Leerzeichen wird als + statt als %20 kodiert, außerdem werden ! ' ( ) ~ maskiert. Beim Dekodieren wird + wieder zu einem Leerzeichen.
  - q: Warum schlägt das Dekodieren bei einer %-Sequenz fehl?
    a: Auf ein Prozentzeichen müssen genau zwei Hexadezimalziffern folgen, und die damit gebildeten Bytes müssen gültiges UTF-8 ergeben. Ein einzelnes % in normalem Text, etwa „100%“, oder eine abgeschnittene Sequenz wie %E4%B8 wird abgelehnt. Ein wörtliches Prozentzeichen schreiben Sie als %25.
  - q: Wird %2F beim Dekodieren mit Ganze URL wieder zu einem Schrägstrich?
    a: Nein. Beim Dekodieren im Bereich Ganze URL bleiben Maskierungen reservierter Zeichen wie %2F, %3F und %23 erhalten, weil echte Trennzeichen die Bedeutung der URL verändern würden. Wählen Sie zum Dekodieren URL-Bestandteil.
---

## Was dieses URL-Tool macht

Es wendet die in [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) definierte Prozentkodierung an: Der Text wird in UTF-8-Bytes umgewandelt, und jedes nicht erlaubte Byte wird als %XX geschrieben. Die Bereiche URL-Bestandteil und Ganze URL nutzen die im Browser eingebauten Funktionen `encodeURIComponent` und `encodeURI`; Formulardaten folgt den Regeln des [URL Standard](https://url.spec.whatwg.org/#application/x-www-form-urlencoded). Die Ergebnisse entsprechen dem, was dieselben Funktionen in Ihrem eigenen JavaScript liefern.

## Optionen und Grenzen

- **Modi:** Text prozentkodieren oder zurück in Text dekodieren.
- **Bereiche:** URL-Bestandteil, Ganze URL oder Formulardaten (Leerzeichen als +). Der Bereich gilt in beiden Modi.
- **Nur Text:** Es wird jeweils eine Zeichenfolge umgewandelt; eine URL wird weder in ihre Teile zerlegt noch abgerufen.
- **Größe:** nur durch den Speicher Ihres Geräts begrenzt.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihren Text nicht hoch, speichert ihn nicht und verwendet keine Cookies.
