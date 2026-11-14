---
review: reviewed
updated: 2026-10-29
title: "MP4 in WebM umwandeln – VP9 und Opus kostenlos im Browser"
description: "MP4 kostenlos in WebM mit VP9-Video und Opus-Audio umwandeln. Ideal für Webseiten und HTML5-Video. Die Datei wird auf Ihrem Gerät kodiert, nie hochgeladen."
name: "MP4 zu WebM"
answer: "Wählen Sie eine .mp4-Datei, lassen Sie WebM ausgewählt und klicken Sie auf Video umwandeln. H.264- oder HEVC-Video wird zu VP9 und AAC-Audio zu Opus kodiert – lizenzfreie Formate, die jeder moderne Browser in einem HTML5-Video-Element abspielt."
steps:
  - "Wählen Sie ein MP4-Video bis 500 MB."
  - "Prüfen Sie, dass WebM als Ausgabeformat ausgewählt ist."
  - "Klicken Sie auf Video umwandeln und lassen Sie den Tab während der Kodierung geöffnet."
  - "Laden Sie die WebM-Datei herunter und verwenden Sie sie in Ihrer Seite oder App."
faq:
  - q: "Wann sollte ich WebM statt MP4 verwenden?"
    a: "WebM wurde für das Web entwickelt. VP9 und Opus sind lizenzfrei und werden von Chrome, Edge, Firefox und Safari unterstützt, daher eignet sich WebM gut für HTML5-Video, animierte Hintergründe und Web-Apps."
  - q: "Warum dauert MP4 zu WebM länger als andere Umwandlungen?"
    a: "Die meisten MP4-Dateien enthalten H.264-Video, das WebM nicht speichern kann. Jedes Bild muss dekodiert und als VP9 neu kodiert werden, die Dauer hängt also von Länge und Auflösung des Videos und von Ihrem Gerät ab."
  - q: "Ist die WebM-Datei kleiner als die MP4-Datei?"
    a: "Das hängt von der Quelle ab. VP9 ist bei gleicher Qualität effizienter als H.264, aber der Konverter kodiert mit einer hohen Qualitätseinstellung, sodass die Größe steigen oder sinken kann."
  - q: "Wird eine MP4-Datei, die schon VP9 oder AV1 enthält, neu kodiert?"
    a: "Nein. WebM kann VP9, AV1 und Opus direkt aufnehmen, daher werden diese Streams unverändert kopiert und nur der Container ändert sich."
table:
  caption: "Was mit jedem Stream einer MP4-Datei in der WebM-Datei passiert"
  columns:
    track: "Spur"
    source: "Codec in der MP4-Datei"
    result: "In der WebM-Datei"
    output: "Ausgabe-Codec"
  terms:
    video: "Video"
    audio: "Audio"
    copied: "Ohne Neukodierung kopiert"
    reencoded: "Neu kodiert"
---

## Was sich in der Datei ändert

WebM akzeptiert nur VP8-, VP9- oder AV1-Video und Opus- oder Vorbis-Audio. Eine typische MP4-Datei von einem Handy, Bildschirmrekorder oder Videoeditor enthält H.264- oder HEVC-Video mit AAC-Audio, daher werden beide Spuren neu kodiert: das Video zu VP9 und das Audio zu Opus. Die Kodierung nutzt WebCodecs, das die Hardware Ihres Geräts verwenden kann, wenn der Browser es unterstützt.

## Tipps für Web-Video

- Behalten Sie die ursprüngliche MP4-Datei als alternatives `<source>` für sehr alte Browser.
- Kürzere Clips mit niedrigerer Auflösung werden deutlich schneller kodiert; kürzen Sie lange Aufnahmen vorher.
- Die Neukodierung ist der langsame Teil; eine MP4-Datei, die schon VP9 oder AV1 enthält, ist in Sekunden umgewandelt.

## Datenschutz

Die MP4-Datei wird lokal in Ihrem Browser dekodiert und kodiert. Es wird nichts hochgeladen, und die Seite setzt keine Cookies.
