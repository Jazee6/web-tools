---
review: reviewed
updated: 2026-10-29
title: JWT-Decoder – Header und Claims eines Tokens online dekodieren
description: "Dekodieren Sie ein JWT: Header, Claims und Signatur, mit exp, nbf und iat als UTC-Zeit. Kostenlos und privat – läuft in Ihrem Browser, nichts wird hochgeladen."
name: JWT-Decoder
answer: Fügen Sie Ihr JSON Web Token ein und klicken Sie auf Dekodieren – Header, Payload-Claims und Signatur erscheinen direkt in Ihrem Browser, exp, nbf und iat sind in UTC umgerechnet. Die Signatur wird nicht geprüft.
action: Dekodieren
fields:
  token:
    label: JWT
    placeholder: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature
output:
  header:
    label: Header
  payload:
    label: Payload
  signature:
    label: Signatur (nicht geprüft)
  times:
    label: Zeit-Claims (UTC)
    columns:
      claim: Claim
      time: Zeit
errors:
  invalid_token: Das ist kein gültiges JWT. Ein Token besteht aus drei durch Punkte getrennten Teilen, die jeweils in base64url geschrieben sind (nur Buchstaben, Ziffern, - und _, ohne =-Auffüllung) und sich zu UTF-8-Text dekodieren lassen. Kopieren Sie das gesamte Token erneut und entfernen Sie Anführungszeichen oder Zeilenumbrüche darin.
  invalid_json: Der Header oder die Payload ist kein JSON-Objekt. Ein JWT enthält Header und Claims als JSON-Objekte; prüfen Sie, ob das Token beim Kopieren abgeschnitten oder verändert wurde.
  encrypted_token: Dieses Token hat fünf Teile, ist also ein verschlüsseltes JWT (JWE), dessen Inhalt sich ohne den Entschlüsselungsschlüssel nicht lesen lässt. Hier lassen sich nur signierte Tokens mit drei Teilen dekodieren.
steps:
  - Kopieren Sie das Token und fügen Sie es in das Eingabefeld ein. Ein führendes „Bearer “ aus einem Authorization-Header wird automatisch entfernt.
  - Klicken Sie auf Dekodieren.
  - Lesen Sie den Header (Algorithmus und Token-Typ) und die Payload (die Claims); enthält das Token die Claims exp, nbf oder iat, sehen Sie dieselben Zeitpunkte zusätzlich in UTC umgerechnet.
  - Behandeln Sie das Ergebnis als ungeprüft. Das Dekodieren liest das Token nur; es beweist nicht, wer es ausgestellt hat.
faq:
  - q: Wird mein Token auf einen Server hochgeladen?
    a: Nein. Das Token wird vollständig in Ihrem Browser dekodiert und verlässt Ihr Gerät nie. Sobald die Seite geladen ist, funktioniert sie sogar offline. Fügen Sie dennoch keine Tokens, die in Produktivsystemen gültig sind, auf Websites ein, denen Sie nicht vertrauen.
  - q: Prüft dieses Tool die Signatur?
    a: Nein. Es dekodiert nur die drei Teile, und die Signatur wird so angezeigt, wie sie im Token steht. Jeder kann ein Token mit beliebigen Claims erstellen. Prüfen Sie daher die Signatur in Ihrem eigenen Code mit dem Schlüssel des Ausstellers, bevor Sie einem Token vertrauen.
  - q: Was bedeuten exp, nbf und iat?
    a: Es sind in RFC 7519 registrierte Zeit-Claims, angegeben in Sekunden seit 1970-01-01 UTC. exp ist der Ablaufzeitpunkt des Tokens, nbf (not before) der Zeitpunkt, ab dem es gültig ist, und iat (issued at) der Zeitpunkt der Erstellung. Die Tabelle rechnet jeden Wert in eine lesbare UTC-Zeit um; ob das Token jetzt abgelaufen ist, sagt sie nicht.
  - q: Warum erhalte ich bei einem Token mit fünf Teilen einen Fehler?
    a: Ein Token mit fünf Teilen ist ein verschlüsseltes JWT (JWE). Seine Payload ist verschlüsselt, ohne Entschlüsselungsschlüssel gibt es also nichts zu lesen. Signierte JWTs (JWS) haben drei Teile.
  - q: Lässt sich ein Token mit leerer Signatur dekodieren?
    a: Ja. Ein ungesichertes Token (mit "alg":"none") endet mit einem Punkt und einer leeren Signatur. Es lässt sich normal dekodieren, doch nichts schützt seine Claims – vertrauen Sie ihm daher nie für die Zugriffskontrolle.
---

## Was dieses JWT-Tool macht

Ein JSON Web Token ([RFC 7519](https://www.rfc-editor.org/rfc/rfc7519)) besteht aus drei base64url-kodierten Teilen, die durch Punkte verbunden sind: einem Header mit dem Signaturalgorithmus, einer Payload mit den Claims und einer Signatur. Der Decoder teilt das Token auf, dekodiert Header und Payload von base64url zu UTF-8 und gibt sie als eingerückten JSON-Text aus. Von den Claims sind `iat`, `nbf` und `exp` numerische Zeitangaben, daher werden sie zusätzlich als UTC-Zeiten aufgelistet.

## Optionen und Grenzen

- **Nur Dekodieren:** Die Signatur wird nie geprüft, und das Tool holt keine Schlüssel und vergleicht das Token nicht mit der aktuellen Zeit.
- **Signierte Tokens:** Tokens mit drei Teilen lassen sich dekodieren, auch ungesicherte mit leerer Signatur. Verschlüsselte Tokens mit fünf Teilen (JWE) werden abgelehnt.
- **Strenges Format:** Header und Payload müssen JSON-Objekte sein. Zeichen des Standard-Base64 (+, / und =) werden anstelle von base64url nicht akzeptiert.
- **Große Zahlen:** Claim-Werte werden über JavaScript-Zahlen angezeigt, daher können ganze Zahlen über 9.007.199.254.740.991 an Genauigkeit verlieren.
- **Größe:** nur durch den Speicher Ihres Geräts begrenzt.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihr Token nicht hoch, speichert es nicht und verwendet keine Cookies.
