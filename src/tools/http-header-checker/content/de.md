---
review: reviewed
updated: 2026-10-29
title: HTTP-Header-Checker – Response-Header & Weiterleitungen prüfen
description: Prüfen Sie den HTTP-Statuscode, die Response-Header und die komplette Weiterleitungskette jeder öffentlichen URL. Kostenlos, sofort, ohne Anmeldung und ohne Speicherung.
name: HTTP-Header-Checker
answer: Geben Sie eine URL ein und klicken Sie auf Header prüfen – das Tool ruft sie von unserem Server aus ab und zeigt den finalen Statuscode, alle Response-Header und jede Weiterleitung auf dem Weg.
action: Header prüfen
fields:
  url:
    label: URL
    placeholder: example.com
  followRedirects:
    label: Weiterleitungen folgen
output:
  status:
    label: Statuscode
  url:
    label: Finale URL
  headers:
    label: Response-Header
    columns:
      name: Header
      value: Wert
  redirects:
    label: Weiterleitungskette
    columns:
      status: Status
      url: URL
errors:
  invalid_url: Das ist keine gültige URL. Geben Sie eine Adresse ein, die mit http:// oder https:// beginnt und höchstens 2.048 Zeichen lang ist.
  blocked_url: Diese Adresse kann nicht geprüft werden. Private und lokale Adressen sowie Nicht-Standard-Ports sind nicht erlaubt – verwenden Sie eine öffentliche http://- oder https://-URL auf Port 80 oder 443.
  timeout: Die Antwort des Servers hat zu lange gedauert. Prüfen Sie, ob die Website erreichbar ist, und versuchen Sie es gleich noch einmal.
  fetch_failed: Der Server war nicht erreichbar. Prüfen Sie die Schreibweise der URL und ob die Website online ist, und versuchen Sie es erneut.
  too_many_redirects: Die URL wurde mehr als 5-mal weitergeleitet. Schalten Sie Weiterleitungen folgen aus, um die erste Antwort zu sehen, oder prüfen Sie die Website auf eine Weiterleitungsschleife.
steps:
  - Geben Sie die URL ein, die Sie prüfen möchten. Ohne Schema wird https:// angenommen.
  - Lassen Sie Weiterleitungen folgen eingeschaltet, um jeden Schritt bis zur finalen Seite zu verfolgen, oder schalten Sie es aus, um nur die erste Antwort zu sehen.
  - Klicken Sie auf Header prüfen und sehen Sie sich Statuscode, finale URL, Response-Header und Weiterleitungskette an.
faq:
  - q: Warum läuft die Prüfung auf einem Server und nicht in meinem Browser?
    a: Aus Sicherheitsgründen verbergen Browser die meisten Response-Header fremder Websites vor Skripten, eine Seite kann sie also nicht direkt lesen. Unser Server sendet die Anfrage und gibt nur Status, Header und Weiterleitungsziele zurück – niemals den Seiteninhalt.
  - q: Welche Anfragemethode wird verwendet?
    a: Jede Prüfung ist eine HEAD-Anfrage, die nur die Header anfordert, ohne die Seite herunterzuladen. Manche Server beantworten HEAD anders als GET, etwa mit 405 Method Not Allowed; dann zeigt das Ergebnis genau, was der Server zurückgegeben hat.
  - q: Kann ich localhost oder Adressen in meinem Netzwerk prüfen?
    a: Nein. Zum Schutz privater Netzwerke werden Adressen wie localhost, 10.x.x.x, 192.168.x.x, Link-Local- und andere reservierte Bereiche abgelehnt, ebenso Ports außer 80 und 443.
  - q: Was bedeuten die Statuscodes der Weiterleitungen?
    a: 301 und 308 sind dauerhafte Weiterleitungen, denen Suchmaschinen folgen und die sie zusammenführen; 302, 303 und 307 sind vorübergehend. Bei 307 und 308 muss außerdem die Anfragemethode gleich bleiben.
  - q: Gibt es ein Limit, wie oft ich prüfen kann?
    a: Ja. Damit der Dienst kostenlos bleibt und dieselbe Website nicht wiederholt angefragt wird, sind Prüfungen pro Besucher und pro Ziel-Website begrenzt. Wenn Sie das Limit erreichen, warten Sie eine Minute und versuchen Sie es erneut.
---

## Was dieser Header-Checker anzeigt

Er sendet eine HEAD-Anfrage ([RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#name-head)) an die eingegebene Adresse und zeigt, was der Server geantwortet hat: den HTTP-Statuscode, die Response-Header so, wie der Server sie gesendet hat (Namen kleingeschrieben), und – wenn Weiterleitungen verfolgt werden – jeden Schritt mit seinem Statuscode. Das hilft beim Prüfen von Cache-Headern wie `cache-control`, Sicherheits-Headern wie `strict-transport-security` und `content-security-policy` und bei der Frage, ob eine alte URL dorthin weiterleitet, wo Sie es erwarten.

## Optionen und Grenzen

- **Weiterleitungen:** Bis zu 5 Schritte werden verfolgt, jeder wird vor der Anfrage erneut geprüft.
- **Zeitlimit:** Die gesamte Prüfung inklusive Weiterleitungen muss innerhalb von 8 Sekunden abgeschlossen sein.
- **Adressen:** Nur öffentliche `http://`- und `https://`-URLs mit bis zu 2.048 Zeichen auf den Standard-Ports 80 und 443.
- **Nutzungslimits:** Einige Prüfungen pro Minute und Besucher sowie eine Obergrenze pro Ziel-Website.
- **Nicht enthalten:** Seiteninhalt, Cookies aus Ihrem Browser und Protokolldetails von HTTP/2 oder HTTP/3.

## Datenschutz

Die eingegebene URL wird nur an unseren Server gesendet, um die Anfrage auszuführen; sie wird nicht gespeichert, und der Inhalt Ihrer Prüfung wird nicht protokolliert. Die Ziel-Website sieht die Anfrage von unserem Server, gekennzeichnet als WebToolsBot, nicht von Ihnen.
