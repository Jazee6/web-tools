---
review: draft
updated: 2026-11-03
title: Audio aus Video extrahieren – MP4 in MP3 umwandeln, kostenlos
description: Extrahieren Sie den Ton aus MP4-, MOV-, WebM- oder MKV-Videos kostenlos als MP3, M4A oder WAV. Privat und schnell – läuft im Browser, Ihr Video wird nie hochgeladen.
name: Audio extrahieren
answer: Wählen Sie ein MP4-, MOV-, WebM- oder MKV-Video, entscheiden Sie sich für MP3, M4A, WAV oder die Originalspur und klicken Sie auf Audio extrahieren. Der Ton wird auf Ihrem Gerät als Audiodatei zum Herunterladen gespeichert, ohne Bild.
action: Audio extrahieren
fields:
  file:
    label: Video (MP4, MOV, WebM oder MKV)
  format:
    label: Audioformat
    options:
      mp3: MP3 (192 kbit/s)
      m4a: M4A (AAC, 192 kbit/s)
      wav: WAV (unkomprimiert)
      original: Originalspur (ohne Neukodierung)
output:
  file:
    label: Extrahiertes Audio
errors:
  invalid_video: Diese Datei konnte nicht als Video gelesen werden. Sie ist möglicherweise beschädigt oder hat ein Format, das dieses Tool nicht unterstützt. Exportieren Sie sie erneut als MP4 und versuchen Sie es noch einmal.
  no_audio: Dieses Video hat keine Audiospur, es gibt also keinen Ton zum Extrahieren.
  unsupported_codec: "Dieser Browser kann das Audio dieses Videos nicht dekodieren oder kodieren. Versuchen Sie Originalspur oder die neueste Version von Chrome. Codec:"
  aac_unavailable: Dieser Browser kann kein AAC kodieren – Firefox zum Beispiel hat keinen AAC-Encoder. Wählen Sie MP3, WAV oder Originalspur, oder nutzen Sie Chrome oder Safari.
steps:
  - Wählen Sie ein MP4-, MOV-, WebM- oder MKV-Video mit bis zu 500 MB.
  - Wählen Sie das Audioformat. MP3 läuft überall, M4A (AAC) passt zu iPhone und Mac, WAV ist unkomprimiert und eignet sich zum Bearbeiten, und Originalspur behält den Ton genau so, wie er im Video ist.
  - Klicken Sie auf Audio extrahieren. Ein Fortschrittsbalken zeigt den Stand, und Sie können jederzeit abbrechen.
  - Laden Sie die Audiodatei herunter.
faq:
  - q: Wird mein Video auf einen Server hochgeladen?
    a: Nein. Das Video wird in Ihrem Browser gelesen und sein Ton dort kodiert, die Datei verlässt Ihr Gerät also nie.
  - q: Wie wandle ich ein MP4-Video in MP3 um?
    a: Wählen Sie die MP4-Datei, lassen Sie MP3 als Audioformat stehen und klicken Sie auf Audio extrahieren. Der Ton wird als MP3 mit 192 kbit/s kodiert, das Bild entfällt. Mit MOV-, WebM- und MKV-Videos funktioniert es genauso.
  - q: Welches Format sollte ich wählen?
    a: MP3, wenn Sie einfach eine Datei möchten, die auf jedem Gerät läuft. M4A (AAC) klingt bei gleicher Größe etwas besser und passt zu iPhone und Mac. WAV ist unkomprimiert und deutlich größer, was sich für Audio-Editoren eignet. Originalspur ist am schnellsten und verliert keine Qualität.
  - q: Was macht Originalspur?
    a: Es kopiert die Audiodaten ohne Neukodierung aus dem Video, ist also in Sekunden fertig, und der Ton bleibt unverändert. Der Dateityp richtet sich nach dem Audio im Video, zum Beispiel M4A für AAC-Ton in einem MP4 und OGG für Opus-Ton in einem WebM.
  - q: Verschlechtert das Extrahieren die Tonqualität?
    a: Mit Originalspur nicht, und mit WAV nur insofern, als es 16 Bit speichert. MP3 und M4A kodieren den Ton mit 192 kbit/s neu, was sich in den meisten Fällen kaum vom Original unterscheiden lässt. Ist das Audio im Video bereits MP3 oder AAC, wird es beim selben Format ohne Neukodierung kopiert.
  - q: Was ist, wenn das Video mehrere Audiospuren hat?
    a: Nur die Haupt-Audiospur wird extrahiert. Andere Spuren, etwa weitere Sprachen oder Kommentare, entfallen.
  - q: Kann ich nur einen Teil des Tons behalten?
    a: Hier nicht. Schneiden Sie das Video zuerst mit [Video schneiden](/de/trim-video) auf den gewünschten Abschnitt zu und extrahieren Sie dann das Audio aus dem Clip.
---

## So funktioniert das Extrahieren

Das Tool liest das Video mit Mediabunny, einer Open-Source-Medienbibliothek, und behält nur die Haupt-Audiospur. Für WAV und M4A dekodiert und kodiert es den Ton mit der in Ihren Browser eingebauten WebCodecs-API. Browser können kein MP3 kodieren, deshalb lädt das Tool für MP3 beim ersten Bedarf einen Encoder, der auf LAME basiert, einem Open-Source-MP3-Encoder. Mit Originalspur wird nichts dekodiert: Die Audiodaten werden unverändert kopiert. Die Arbeit läuft in einem Hintergrund-Thread, sodass die Seite reaktionsfähig bleibt.

Um statt eines Videos eine Audiodatei umzuwandeln, nutzen Sie den [Audio-Konverter](/de/audio-converter).

## Optionen und Grenzen

- **Eingabe:** MP4-, MOV-, WebM- und MKV-Dateien mit bis zu 500 MB.
- **MP3:** 192 kbit/s, bis zu 2 Kanäle. Surround-Ton wird zu Stereo heruntergemischt, ungewöhnliche Abtastraten werden in 48 kHz umgewandelt.
- **M4A:** AAC mit 192 kbit/s. Firefox hat keinen AAC-Encoder, dort funktioniert M4A also nur, wenn der Ton des Videos bereits AAC ist; er wird dann kopiert. Neu kodiertes M4A hat wie MP3 bis zu 2 Kanäle.
- **WAV:** unkomprimierter 16-Bit-Ton, etwa 10 MB pro Minute Stereo-Audio.
- **Originalspur:** AAC landet in M4A, MP3 in MP3, Opus und Vorbis in OGG, FLAC in FLAC und PCM in WAV. Andere Codecs wie AC-3 oder DTS landen in einer MKA-Datei (Matroska-Audio).
- **Spuren:** Nur die Haupt-Audiospur wird extrahiert. Hat das Video keinen Ton, meldet das Tool dies, statt eine leere Datei zu erstellen.
- **Speicher:** Die Audiodatei bleibt bis zum Herunterladen im Speicher. Ein langes Video als WAV kann sehr groß werden und auf Smartphones fehlschlagen.

## Datenschutz

Ihr Video wird nur auf Ihrem Gerät verarbeitet. Die Seite lädt es nicht hoch, speichert es nicht und verwendet keine Cookies.
