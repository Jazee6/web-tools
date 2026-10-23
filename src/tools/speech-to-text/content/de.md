---
review: draft
updated: 2026-10-23
title: Sprache zu Text – Audio & Video kostenlos online transkribieren
description: Audio und Video kostenlos in Text und SRT-Untertitel umwandeln. Privat – das Spracherkennungsmodell Whisper läuft im Browser, Ihre Datei wird nie hochgeladen.
name: Sprache zu Text
answer: Wählen Sie eine Audio- oder Videodatei, lassen Sie die Sprache auf Automatisch erkennen oder wählen Sie die gesprochene Sprache und klicken Sie auf Transkribieren. Whisper wandelt die Sprache auf Ihrem Gerät in Text um; Sie können ihn kopieren oder als SRT-Untertitel herunterladen.
action: Transkribieren
fields:
  file:
    label: Audio oder Video (MP3, M4A, WAV, OGG, FLAC, MP4, MOV, WebM oder MKV)
  language:
    label: Gesprochene Sprache
    options:
      auto: Automatisch erkennen
output:
  text:
    label: Transkript
  subtitles:
    label: Untertitel (SRT)
errors:
  invalid_audio: Diese Datei konnte nicht als Audio gelesen werden. Sie ist möglicherweise beschädigt oder hat ein Format, das dieses Tool nicht unterstützt.
  no_audio: Diese Datei hat keine Tonspur, es gibt also nichts zu transkribieren.
  unsupported_codec: "Dieser Browser kann den Ton in dieser Datei nicht decodieren. Versuchen Sie ein anderes Dateiformat oder die neueste Version von Chrome. Codec:"
  too_long: Die Aufnahme ist länger als 60 Minuten. Teilen Sie sie in kürzere Abschnitte auf und transkribieren Sie diese einzeln.
  no_speech: In dieser Aufnahme wurde keine Sprache gefunden.
steps:
  - Wählen Sie eine Audio- oder Videodatei mit höchstens 1 GB und 60 Minuten.
  - Lassen Sie die Sprache auf Automatisch erkennen oder wählen Sie die gesprochene Sprache. Das hilft bei kurzen Clips und starkem Akzent.
  - Klicken Sie auf Transkribieren. Beim ersten Mal wird das Spracherkennungsmodell (etwa 105–125 MB) heruntergeladen und im Browser gespeichert; danach startet es sofort.
  - Kopieren Sie das Transkript oder laden Sie die SRT-Datei herunter, um sie in einem Videoplayer oder Schnittprogramm als Untertitel zu verwenden.
faq:
  - q: Wird meine Aufnahme auf einen Server hochgeladen?
    a: Nein. Der Ton wird in Ihrem Browser decodiert und transkribiert, die Datei verlässt Ihr Gerät also nie. Heruntergeladen wird nur das Spracherkennungsmodell, und zwar einmalig.
  - q: Welche Sprachen werden unterstützt?
    a: Die 99 Sprachen, mit denen Whisper trainiert wurde, darunter Deutsch, Englisch, Chinesisch, Spanisch, Französisch, Japanisch und Portugiesisch. Am genauesten ist das Ergebnis bei weit verbreiteten Sprachen und klaren Aufnahmen.
  - q: Warum dauert die erste Transkription länger?
    a: Das Tool lädt zuerst das Whisper-Modell herunter – je nach Gerät etwa 105–125 MB – und speichert es im Browser. Spätere Transkriptionen nutzen die gespeicherte Kopie und starten sofort.
  - q: Wie genau ist das Transkript?
    a: Das Tool verwendet Whisper base, ein kompaktes Modell, das gut im Browser läuft. Klare Sprache erkennt es zuverlässig, bei verrauschten Aufnahmen, mehreren gleichzeitigen Sprechern oder seltenen Namen können aber Wörter falsch sein. Prüfen Sie das Transkript daher vor der Veröffentlichung.
  - q: Was ist eine SRT-Datei?
    a: SRT ist das gängigste Untertitelformat. Jede Zeile des Transkripts hat eine Start- und eine Endzeit, sodass Player wie VLC und Schnittprogramme wie Premiere Pro oder CapCut sie als Untertitel anzeigen können.
---

## So funktioniert die Transkription

Das Tool decodiert den Ton mit Mediabunny und der WebCodecs-API, wandelt ihn in 16 kHz Mono um und übergibt ihn an Whisper base, ein Open-Source-Spracherkennungsmodell von OpenAI. Das Modell läuft mit ONNX Runtime in einem Hintergrund-Thread. Hat Ihr Gerät eine ausreichend leistungsfähige GPU, läuft ein Teil des Modells per WebGPU darauf, was schneller ist; andernfalls läuft alles mit WebAssembly auf der CPU. Lange Aufnahmen werden in sich überlappende 30-Sekunden-Abschnitte geteilt und anschließend wieder zusammengefügt.

## Grenzen

- **Eingabe:** MP3-, M4A-, AAC-, WAV-, OGG-, Opus-, FLAC- und WebM-Audio oder die Tonspur eines MP4-, MOV-, WebM- oder MKV-Videos, bis 1 GB und 60 Minuten.
- **Geschwindigkeit:** Auf einem aktuellen Laptop dauert eine Minute Audio mit WebGPU wenige Sekunden, ohne WebGPU bis zu etwa 20 Sekunden.
- **Download:** Das Modell ist etwa 105–125 MB groß und wird bei der ersten Nutzung heruntergeladen.
- **Genauigkeit:** Whisper base ist ein kleines Modell. Hintergrundgeräusche, Musik und mehrere gleichzeitige Sprecher verringern die Qualität.

## Datenschutz

Ihre Aufnahme wird nur auf Ihrem Gerät verarbeitet. Die Seite lädt sie nicht hoch, speichert sie nicht und verwendet keine Cookies.
