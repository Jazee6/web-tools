---
review: reviewed
updated: 2026-10-30
title: Zeitstempel-Konverter – Unix-Zeit in Datum umrechnen und zurück
description: Rechnen Sie Unix-Zeitstempel in Daten um oder Daten in Unix-Sekunden, in jeder Zeitzone. Kostenlos und privat – läuft in Ihrem Browser, nichts wird hochgeladen.
name: Zeitstempel-Konverter
answer: Geben Sie einen Unix-Zeitstempel oder ein Datum ein, wählen Sie eine Zeitzone und klicken Sie auf Umrechnen – Unix-Sekunden, Millisekunden, die UTC-Zeit und die Zeit in Ihrer Zeitzone erscheinen direkt im Browser.
action: Umrechnen
fields:
  value:
    label: Zeitstempel oder Datum
    placeholder: 1700000000 oder 2024-02-29 12:30:00+08:00
  unit:
    label: Einheit des Zeitstempels
    options:
      auto: Automatisch erkennen
      seconds: Sekunden
      milliseconds: Millisekunden
  timezone:
    label: Zeitzone
    placeholder: Asia/Shanghai
output:
  seconds:
    label: Unix-Zeit (Sekunden)
  milliseconds:
    label: Unix-Zeit (Millisekunden)
  utc:
    label: UTC-Zeit
  zoned:
    label: Zeit in der gewählten Zeitzone
errors:
  invalid_value: Dieser Zeitstempel oder dieses Datum kann nicht gelesen werden. Geben Sie Ziffern wie 1700000000 oder ein Datum wie 2024-02-29, 2024-02-29 12:30:00 oder 2024-02-29T12:30:00+08:00 ein. Monat, Tag, Stunde, Minute und Sekunde müssen echte Werte sein (es gibt weder 2023-02-29 noch 24:00).
  invalid_timezone: Diese Zeitzone wird nicht erkannt. Verwenden Sie einen IANA-Namen wie Asia/Shanghai, America/New_York oder Europe/Berlin oder UTC.
  out_of_range: Dieser Zeitpunkt liegt außerhalb des unterstützten Bereichs der Jahre 0001 bis 9999. Prüfen Sie die Zahl oder wechseln Sie die Einheit zwischen Sekunden und Millisekunden.
steps:
  - Geben Sie im ersten Feld einen Unix-Zeitstempel (zum Beispiel 1700000000) oder ein Datum (zum Beispiel 2024-02-29 12:30:00+08:00) ein oder fügen Sie ihn ein.
  - Ist der Wert eine Zahl, lassen Sie die Einheit des Zeitstempels auf Automatisch erkennen oder wählen Sie Sekunden oder Millisekunden.
  - Geben Sie die Zeitzone ein, in der Sie das Ergebnis sehen möchten, zum Beispiel Asia/Shanghai. Voreingestellt ist UTC.
  - Klicken Sie auf Umrechnen und kopieren Sie den benötigten Wert.
faq:
  - q: Wird meine Eingabe auf einen Server hochgeladen?
    a: Nein. Die Umrechnung läuft vollständig in Ihrem Browser, Ihre Eingabe verlässt also nie Ihr Gerät. Sie können die Seite sogar offline nutzen, sobald sie geladen ist.
  - q: Ist mein Zeitstempel in Sekunden oder in Millisekunden?
    a: Ein aktueller Unix-Zeitstempel hat in Sekunden 10 Ziffern (1700000000) und in Millisekunden 13 Ziffern (1700000000000). Automatisch erkennen liest Werte ab 100.000.000.000 als Millisekunden und kleinere als Sekunden. Daher wirken Millisekundenwerte vor dem 1973-03-03 wie Sekunden; wählen Sie dafür selbst Millisekunden.
  - q: In welcher Zeitzone liegt ein Datum ohne Offset?
    a: In UTC. Ein Datum wie 2024-02-29 12:30:00 enthält keine Zeitzone und wird deshalb als UTC gelesen, statt aus Ihrem Gerät abgeleitet zu werden. Um eine Ortszeit umzurechnen, fügen Sie ihren Offset an, zum Beispiel 2024-02-29 12:30:00+08:00, oder verwenden Sie Z für UTC.
  - q: Was ändert das Feld Zeitzone?
    a: Nur das letzte Ergebnis. Unix-Sekunden, Millisekunden und die UTC-Zeit bleiben gleich; das Ergebnis in der Zeitzone zeigt denselben Zeitpunkt als Ortszeit mit dem Offset der Zeitzone an diesem Datum, sodass die Sommerzeit berücksichtigt wird, wo die Zeitzone sie kennt.
  - q: Werden negative Zeitstempel und Nachkommastellen unterstützt?
    a: Ja. Eine negative Zahl ist ein Zeitpunkt vor 1970-01-01 UTC, und 1700000000.5 liegt eine halbe Sekunde nach 1700000000. Das Ergebnis in Sekunden wird auf eine ganze Sekunde abgerundet.
  - q: Warum schlägt ein sehr großer Zeitstempel fehl?
    a: Die Ergebnisse sind auf die Jahre 0001 bis 9999 begrenzt, damit die ISO-8601-Ausgabe vierstellige Jahre behält. Ein Wert außerhalb davon, etwa ein Millisekunden-Zeitstempel bei der Einheit Sekunden, wird mit einem Fehler für außerhalb des Bereichs abgelehnt.
---

## Was dieses Zeitstempel-Tool macht

Die Unix-Zeit zählt die Sekunden seit 1970-01-01 00:00:00 UTC, ohne Schaltsekunden. Das Tool rechnet Ihre Eingabe in diesen Zeitpunkt um und gibt ihn als Unix-Sekunden, Unix-Millisekunden, als UTC-Zeit nach [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) und als ISO-8601-Zeit mit dem Offset der gewählten Zeitzone aus. Daten werden in den Formaten `YYYY-MM-DD`, `YYYY-MM-DD HH:MM[:SS[.fff]]` oder `YYYY-MM-DDTHH:MM[:SS[.fff]]` gelesen, gefolgt von einem optionalen `Z` oder einem Offset wie `+08:00`. Die Offsets der Zeitzonen stammen aus den im Browser eingebauten Zeitzonendaten über `Intl.DateTimeFormat`.

## Optionen und Grenzen

- **Eingabe:** jeweils ein Zeitstempel oder ein Datum. Daten werden gegen den Kalender geprüft, auch Schaltjahre. Sekundenbruchteile jenseits der Millisekunden werden bei Daten verworfen und bei Zahlen gerundet.
- **Einheit:** gilt nur für Zahlen. Automatisch erkennen wechselt bei 100.000.000.000 von Sekunden zu Millisekunden.
- **Bereich:** Zeitpunkte von 0001-01-01T00:00:00Z bis 9999-12-31T23:59:59.999Z.
- **Zeitzonen:** IANA-Namen wie Asia/Shanghai oder UTC. Die Offsets vergangener Daten folgen den im Browser eingebauten Zeitzonendaten.
- **Keine aktuelle Zeit:** Das Tool liest Ihre Uhr nicht und vergleicht das Ergebnis nicht mit dem gegenwärtigen Zeitpunkt.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihre Eingabe nicht hoch, speichert sie nicht und verwendet keine Cookies.
