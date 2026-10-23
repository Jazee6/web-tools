---
review: draft
updated: 2026-10-23
title: Video-Konverter – MP4, WebM, MOV & MKV kostenlos umwandeln
description: Wandeln Sie Videos kostenlos zwischen MP4, WebM, MOV und MKV um. Privat und schnell – die Umwandlung läuft mit WebCodecs in Ihrem Browser, Ihr Video wird nie hochgeladen.
name: Video-Konverter
answer: Wählen Sie ein MP4-, MOV- oder WebM-Video, legen Sie das Ausgabeformat fest und klicken Sie auf Video umwandeln – die Datei wird auf Ihrem Gerät umgewandelt und Sie laden das Ergebnis sofort herunter. Ändert sich nur der Container, dauert es nur Sekunden.
action: Video umwandeln
fields:
  file:
    label: Video (MP4, MOV oder WebM)
  format:
    label: Ausgabeformat
    options:
      mp4: MP4 (H.264 + AAC)
      webm: WebM (VP9 + Opus)
      mov: MOV (QuickTime)
      mkv: MKV (Matroska)
output:
  file:
    label: Umgewandeltes Video
errors:
  invalid_video: Diese Datei konnte nicht als Video gelesen werden. Sie ist möglicherweise beschädigt oder hat ein Format, das dieses Tool nicht unterstützt.
  no_video: Diese Datei hat keine Videospur – sie enthält nur Audio.
  unsupported_codec: "Dieser Browser kann eine Spur dieses Videos nicht dekodieren oder kodieren. Versuchen Sie ein anderes Ausgabeformat oder die neueste Version von Chrome. Codec:"
steps:
  - Wählen Sie ein MP4-, MOV- oder WebM-Video mit bis zu 500 MB.
  - Legen Sie das Ausgabeformat fest. MP4 läuft fast überall, WebM eignet sich fürs Web, MOV für Apple-Apps, und MKV übernimmt die Originalspuren unverändert.
  - Klicken Sie auf Video umwandeln. Ein Fortschrittsbalken zeigt den Stand der Umwandlung, und Sie können jederzeit abbrechen.
  - Laden Sie das umgewandelte Video herunter.
faq:
  - q: Wird mein Video auf einen Server hochgeladen?
    a: Nein. Das Video wird in Ihrem Browser mit der WebCodecs-API gelesen, dekodiert und kodiert und verlässt Ihr Gerät nie.
  - q: Warum ist die Umwandlung manchmal fast sofort fertig?
    a: Wenn Video und Audio bereits einen Codec nutzen, den das neue Format aufnehmen kann – zum Beispiel H.264 und AAC von MOV nach MP4 –, werden die Spuren unverändert kopiert und nur der Container neu geschrieben. Nichts wird neu kodiert, deshalb geht es schnell und die Qualität bleibt gleich.
  - q: Verringert die Umwandlung die Qualität?
    a: Nur wenn das Video neu kodiert werden muss, zum Beispiel von WebM nach MP4. Das Tool kodiert mit hoher Qualität, sodass der Unterschied meist kaum zu sehen ist, ganz verlustfrei ist eine Neukodierung aber nie.
  - q: Welche Codecs verwendet die Ausgabe?
    a: MP4 und MOV verwenden H.264-Video und AAC-Audio, wenn Ihr Browser sie kodieren kann. Wenn nicht – Firefox hat zum Beispiel keinen AAC-Encoder –, weicht das Tool auf einen anderen Codec aus, den das Format unterstützt, etwa Opus-Audio. WebM verwendet VP9 und Opus. MKV behält die Original-Codecs.
  - q: Kann ich MKV-Dateien umwandeln?
    a: Noch nicht. MKV ist als Ausgabeformat verfügbar, MKV-Dateien lassen sich derzeit aber nicht als Eingabe auswählen.
---

## So funktioniert die Umwandlung

Das Tool liest das Video mit Mediabunny, einer Open-Source-Medienbibliothek, und nutzt die in Ihren Browser eingebaute WebCodecs-API, um die Spuren zu dekodieren und zu kodieren – oft mit Hardwarebeschleunigung. Spuren, die das Zielformat bereits aufnehmen kann, werden ohne Neukodierung kopiert. Die Arbeit läuft in einem Hintergrund-Thread, sodass die Seite reaktionsfähig bleibt.

## Grenzen

- **Eingabe:** MP4-, MOV- und WebM-Dateien mit bis zu 500 MB.
- **Spuren:** Die Haupt-Videospur und die Haupt-Audiospur werden umgewandelt; Untertitel und zusätzliche Audiospuren entfallen.
- **Codecs:** Welche Codecs dekodiert und kodiert werden können, hängt von Ihrem Browser und Gerät ab. Lässt sich eine Spur nicht umwandeln, bricht das Tool mit einer Meldung ab, statt eine Datei ohne Ton oder Bild zu erzeugen.
- **Speicher:** Das umgewandelte Video bleibt bis zum Herunterladen im Arbeitsspeicher, sodass sehr große Dateien auf Smartphones scheitern können.

## Datenschutz

Ihr Video wird nur auf Ihrem Gerät verarbeitet. Die Seite lädt es nicht hoch, speichert es nicht und verwendet keine Cookies.
