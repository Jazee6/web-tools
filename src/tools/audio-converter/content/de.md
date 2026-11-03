---
review: draft
updated: 2026-11-03
title: Audio-Konverter – WAV, M4A, OGG & FLAC kostenlos in MP3 umwandeln
description: Audio kostenlos zwischen MP3, M4A, WAV und OGG umwandeln, aus MP3, M4A, AAC, WAV, OGG, Opus oder FLAC. Privat und schnell – läuft im Browser, nichts wird hochgeladen.
name: Audio-Konverter
answer: Wählen Sie eine Audiodatei, entscheiden Sie sich für MP3, M4A, WAV oder OGG und eine Bitrate, und klicken Sie auf Audio umwandeln. Die Datei wird auf Ihrem Gerät umgewandelt, und Sie laden das Ergebnis herunter. Standard ist MP3 mit 192 kbit/s, das überall läuft.
action: Audio umwandeln
fields:
  file:
    label: Audio (MP3, M4A, AAC, WAV, OGG, Opus oder FLAC)
  format:
    label: Ausgabeformat
    options:
      mp3: MP3
      m4a: M4A (AAC)
      wav: WAV (unkomprimiert)
      ogg: OGG (Opus)
  bitrate:
    label: Bitrate
    options:
      "128": 128 kbit/s (kleiner)
      "192": 192 kbit/s (empfohlen)
      "320": 320 kbit/s (höchste)
output:
  file:
    label: Umgewandeltes Audio
errors:
  invalid_audio: Diese Datei konnte nicht als Audio gelesen werden. Sie ist möglicherweise beschädigt oder hat ein Format, das dieses Tool nicht unterstützt. Exportieren Sie sie erneut als MP3 oder WAV und versuchen Sie es noch einmal.
  unsupported_codec: "Dieser Browser kann dieses Audio nicht dekodieren oder kodieren. Versuchen Sie ein anderes Ausgabeformat oder die neueste Version von Chrome. Codec:"
  aac_unavailable: Dieser Browser kann kein AAC kodieren – Firefox zum Beispiel hat keinen AAC-Encoder. Wählen Sie MP3, WAV oder OGG, oder nutzen Sie Chrome oder Safari.
steps:
  - Wählen Sie eine MP3-, M4A-, AAC-, WAV-, OGG-, Opus-, FLAC- oder WebM-Audiodatei mit bis zu 500 MB.
  - Wählen Sie das Ausgabeformat. MP3 läuft überall, M4A (AAC) passt zu iPhone und Mac, WAV ist unkomprimiert und eignet sich zum Bearbeiten, und OGG (Opus) klingt für seine Größe am besten.
  - Wählen Sie eine Bitrate für MP3, M4A oder OGG. 192 kbit/s passt für die meiste Musik, 128 kbit/s ergibt kleinere Dateien, und 320 kbit/s ist die höchste. WAV ignoriert sie.
  - Klicken Sie auf Audio umwandeln. Ein Fortschrittsbalken zeigt den Stand, und Sie können jederzeit abbrechen.
  - Laden Sie die umgewandelte Datei herunter.
faq:
  - q: Wird mein Audio auf einen Server hochgeladen?
    a: Nein. Die Datei wird in Ihrem Browser dekodiert und kodiert, sie verlässt Ihr Gerät also nie.
  - q: Wie wandle ich WAV in MP3 um?
    a: Wählen Sie die WAV-Datei, lassen Sie MP3 als Ausgabeformat stehen, wählen Sie eine Bitrate und klicken Sie auf Audio umwandeln. Eine Minute Stereo-WAV braucht etwa 10 MB, dieselbe Minute als MP3 mit 192 kbit/s etwa 1,4 MB.
  - q: Welche Bitrate sollte ich wählen?
    a: Bei 192 kbit/s lässt sich die meiste Musik kaum vom Original unterscheiden. 128 kbit/s reicht für Sprache und Podcasts und ergibt kleinere Dateien. 320 kbit/s ist die höchste MP3-Einstellung, für den Fall, dass die Dateigröße keine Rolle spielt.
  - q: Verbessert eine höhere Bitrate den Klang?
    a: Nein. Wandeln Sie ein MP3 mit 128 kbit/s in 320 kbit/s um, wird die Datei größer, aber die bei der ersten Kodierung verlorenen Details kommen nicht zurück. Jede Umwandlung von einem verlustbehafteten Format in ein anderes kostet etwas Qualität, starten Sie also möglichst mit WAV oder FLAC.
  - q: Kann ich die Bitrate eines MP3 ändern?
    a: Ja. Wählen Sie das MP3, lassen Sie MP3 als Ausgabeformat stehen und wählen Sie eine andere Bitrate. Der Ton wird mit dieser Bitrate neu kodiert – eine einfache Art, ein großes MP3 zu verkleinern.
  - q: Kann ich FLAC-Dateien umwandeln?
    a: Ja, in Chrome, Edge und Firefox. Safari kann FLAC nicht dekodieren, dort zeigt das Tool stattdessen eine Meldung. FLAC lässt sich in MP3, M4A, OGG oder WAV umwandeln; FLAC schreibt dieses Tool nicht.
  - q: Was passiert mit Surround-Ton?
    a: MP3, M4A und OGG werden mit bis zu 2 Kanälen geschrieben, Surround-Ton wird also zu Stereo heruntergemischt. WAV behält alle Kanäle.
---

## So funktioniert die Umwandlung

Das Tool liest die Datei mit Mediabunny, einer Open-Source-Medienbibliothek, dekodiert den Ton mit der in Ihren Browser eingebauten WebCodecs-API und kodiert ihn im gewählten Format neu. Browser können kein MP3 kodieren, deshalb nutzt das Tool für MP3 einen Encoder, der auf LAME basiert, einem Open-Source-MP3-Encoder. Die Arbeit läuft in einem Hintergrund-Thread, sodass die Seite reaktionsfähig bleibt.

Um den Ton aus einem Video zu holen, nutzen Sie [Audio extrahieren](/de/extract-audio).

## Optionen und Grenzen

- **Eingabe:** MP3-, M4A-, AAC-, WAV-, OGG-, Opus-, FLAC- und WebM-Audiodateien mit bis zu 500 MB. Nur die Haupt-Audiospur wird umgewandelt.
- **MP3:** 128, 192 oder 320 kbit/s, bis zu 2 Kanäle. Ungewöhnliche Abtastraten werden in 48 kHz umgewandelt.
- **M4A:** AAC mit der gewählten Bitrate, bis zu 2 Kanäle, mit 44,1 oder 48 kHz. Firefox hat keinen AAC-Encoder, dort ist M4A also nicht verfügbar.
- **OGG:** Opus mit der gewählten Bitrate, bis zu 2 Kanäle, immer mit 48 kHz. Mono-Ton wird mit höchstens 256 kbit/s kodiert.
- **WAV:** unkomprimierter 16-Bit-Ton mit den ursprünglichen Kanälen und der ursprünglichen Abtastrate, etwa 10 MB pro Minute Stereo-Audio.
- **Neukodierung:** MP3, M4A und OGG werden immer mit der gewählten Bitrate kodiert, auch wenn die Quelle schon dasselbe Format hat. Ein WAV, das bereits 16 Bit hat, wird unverändert kopiert.
- **Browser:** Safari kann FLAC und Vorbis nicht dekodieren. Lässt sich eine Datei nicht dekodieren oder kodieren, hält das Tool mit einer Meldung an.
- **Speicher:** Die umgewandelte Datei bleibt bis zum Herunterladen im Speicher, sehr lange Aufnahmen können daher auf Smartphones fehlschlagen.

## Datenschutz

Ihr Audio wird nur auf Ihrem Gerät verarbeitet. Die Seite lädt es nicht hoch, speichert es nicht und verwendet keine Cookies.
