---
review: reviewed
updated: 2026-11-09
title: "Datenschutz – Dateien, Statistiken und Browserdaten"
description: "Erfahren Sie, welche Web-Tools-Funktionen Server kontaktieren, was anonyme Statistiken enthalten und wie Sie Einstellungen und Browserdaten löschen."
name: "Datenschutz"
---

## Ihre Dateien bleiben auf Ihrem Gerät

Datei-Tools arbeiten im Browser, ohne Ihre Dateien auf unseren Server hochzuladen. Der Browser lädt den benötigten Code und bei einigen Tools auch Modelle zur Verarbeitung herunter.

## Funktionen mit Serververbindung

- **HTTP-Header-Checker** sendet die eingegebene URL an unseren Server, um die Antwort-Header des Ziels zu prüfen. Der Teil nach `#` wird entfernt, Pfad und Abfrageparameter werden jedoch gesendet. Vermeiden Sie URLs mit geheimen Daten. Cloudflare Turnstile prüft auf Missbrauch und erhält ein Prüftoken und Ihre IP-Adresse. Siehe die [Datenschutzhinweise von Turnstile](https://www.cloudflare.com/turnstile-privacy-policy/).
- **DNS-Abfrage** sendet die Domain und den Eintragstyp direkt an Ihren gewählten DNS-Anbieter Cloudflare oder Google, nicht über unseren Server. Standard ist Cloudflare. Der Anbieter sieht auch Ihre IP-Adresse. Siehe die [Datenschutzhinweise von Cloudflare](https://www.cloudflare.com/privacypolicy/) und [Google Public DNS](https://developers.google.com/speed/public-dns/privacy).
- **Entfernte MCP-Aufrufe** senden den Tool-Namen und Ihre Argumente an unseren Server, wo das Tool ausgeführt wird. Das gilt auch für Tools, die sonst im Browser laufen. Senden Sie keine sensiblen Daten.

## Anonyme Nutzungsstatistiken

Wir erfassen begrenzte Statistiken zur Tool-Nutzung und zu Fehlern, ohne Besucherkennung.

| Was gemeldet wird  | Enthaltene Informationen                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------- |
| Tool-Nutzung       | Name, Oberflächensprache, Ergebniskategorie und Zeitspanne für die Dauer                      |
| Unerwartete Fehler | Fehlertyp und Herkunft, Tool falls bekannt, Sprache und verfügbare Browserfunktionen          |
| Nicht enthalten    | Ihre Eingaben, Ergebnisse, Dateien, IP-Adresse, Fehlermeldung oder detaillierte Fehlerabläufe |

Jede abgeschlossene Tool-Nutzung wird mit 10% Wahrscheinlichkeit gemeldet; es werden nicht 10% der Besucher ausgewählt. Unerwartete Fehler werden nicht stichprobenartig erfasst. Wiederholungen werden unterdrückt, mit höchstens 20 verschiedenen Fehlern pro Sitzung. Meldungen können verloren gehen und werden nicht erneut gesendet.

## Cloudflare Web Analytics

Cloudflare Web Analytics misst Seitenaufrufe und Ladeleistung ohne Cookies. Cloudflare kann das Messskript automatisch ergänzen, getrennt von den obigen Tool-Statistiken. Informationen zum Umgang mit Daten finden Sie in den [Datenschutzhinweisen von Cloudflare](https://www.cloudflare.com/privacypolicy/).

## Serverprotokolle und IP-Adressen

Unser Server nutzt Ihre IP-Adresse zur Begrenzung von Anfragen und zum Schutz vor Missbrauch, schreibt sie aber nicht in die Nutzungsstatistiken. Cloudflare verarbeitet Verbindungsdaten einschließlich IP-Adressen bei der Bereitstellung der Website und der Prüfung von Anfragen.

Serverprotokolle enthalten das Tool, die Dauer und das Ergebnis. Unerwartete Serverfehler können auch Fehlermeldungen und detaillierte Fehlerabläufe enthalten. Cloudflares Umgang mit diesen Daten und deren Aufbewahrung werden in den [Datenschutzhinweisen](https://www.cloudflare.com/privacypolicy/) beschrieben.

## Was Ihr Browser speichert

Ihr Browser merkt sich Favoriten, bis zu 20 zuletzt verwendete Tools und Formulareinstellungen wie Auswahlen, Schalter und Zahlen. Dateien und Freitext werden nicht als Einstellungen gespeichert; voreingestellte Optionen ebenfalls nicht.

Besuchte Seiten und benötigte Ressourcen werden für die Offline-Nutzung zwischengespeichert, heruntergeladene Modelle getrennt davon. Temporäre Informationen verhindern außerdem wiederholte Fehlermeldungen innerhalb einer Sitzung.

Mit **Lokale Daten löschen** in der Fußzeile entfernen Sie Einstellungen, Favoriten, zuletzt verwendete Tools, Offline- und Modell-Caches sowie temporäre lokale Dateien. Der Offline-Dienst wird vor dem Neuladen beendet. Browserbeschränkungen können das Löschen einiger temporärer Dateien verhindern. Der normale Webcache, Cookies, Markierungen für Sitzungsfehler und Serveraufzeichnungen werden nicht gelöscht. Nach dem Neuladen kann die Zwischenspeicherung erneut beginnen.
