---
review: reviewed
updated: 2026-10-29
title: "MKV in MP4 umwandeln – Matroska-Videos kostenlos online"
description: "MKV kostenlos in Ihrem Browser in MP4 umwandeln. H.264- und AAC-Streams werden ohne Neukodierung kopiert, die meisten Dateien sind in Sekunden fertig. Ohne Upload."
name: "MKV zu MP4"
answer: "Wählen Sie eine .mkv-Datei und klicken Sie bei ausgewähltem MP4 auf Video umwandeln. Bei H.264- oder HEVC-Video und AAC-Audio werden die Streams unverändert kopiert; VP9-, AV1-, Opus- oder FLAC-Spuren werden neu kodiert, damit die Datei auf Handys, Fernsehern und in Schnittprogrammen läuft."
steps:
  - "Wählen Sie eine MKV-Datei bis 500 MB."
  - "Lassen Sie das Ausgabeformat auf MP4 und klicken Sie auf Video umwandeln."
  - "Warten Sie auf den Fortschrittsbalken – neu kodierte Dateien brauchen länger als kopierte."
  - "Laden Sie die MP4-Datei herunter."
faq:
  - q: "Warum lässt sich meine MKV-Datei auf dem Fernseher oder Handy nicht abspielen?"
    a: "Matroska (MKV) ist ein flexibler Container, den viele Geräte und Apps nicht öffnen, selbst wenn sie das Video darin abspielen könnten. Dieselben Streams in MP4 zu verpacken behebt das meist."
  - q: "Was passiert mit Untertiteln und weiteren Audiosprachen?"
    a: "Nur die Hauptvideospur und die Hauptaudiospur bleiben erhalten. Eingebettete Untertitel und zusätzliche Audiospuren entfallen, weil der Konverter eine MP4-Datei mit einer Video- und einer Audiospur schreibt."
  - q: "Warum wird meine Datei neu kodiert statt kopiert?"
    a: "MP4 ist hier auf H.264- oder HEVC-Video und AAC-Audio beschränkt, die Kombination, die auf nahezu jedem Gerät läuft. VP9- oder AV1-Video und Opus-, Vorbis- oder FLAC-Audio werden neu kodiert, was länger dauert und nicht ganz verlustfrei ist. Das Audio wird in AAC kodiert, in Firefox mangels AAC-Encoder in Opus."
  - q: "Kann ich MKV-Dateien über 500 MB umwandeln?"
    a: "Mit diesem Tool nicht. Die umgewandelte Datei liegt bis zum Download im Arbeitsspeicher, deshalb ist die Eingabe auf 500 MB begrenzt, damit es auf Laptops und Handys zuverlässig läuft."
table:
  caption: "Was mit jedem Stream einer MKV-Datei in der MP4-Datei passiert"
  columns:
    track: "Spur"
    source: "Codec in der MKV-Datei"
    result: "In der MP4-Datei"
    output: "Ausgabe-Codec"
  terms:
    video: "Video"
    audio: "Audio"
    copied: "Ohne Neukodierung kopiert"
    reencoded: "Neu kodiert"
---

## Kopieren oder neu kodieren: Was die Geschwindigkeit bestimmt

MKV kann nahezu jeden Codec enthalten, daher können sich zwei gleich große MKV-Dateien sehr unterschiedlich verhalten. Dateien mit H.264-Video und AAC-Audio – der häufigsten Kombination bei heruntergeladenen und aufgenommenen MKVs – werden einfach umgepackt: Die Streams wandern in Sekunden in einen MP4-Container, ohne Qualitätsänderung. Dateien mit VP9- oder AV1-Video oder mit Opus-, Vorbis- oder FLAC-Audio werden mit WebCodecs dekodiert und neu kodiert, was so lange dauern kann wie das Video selbst.

## Was zurückbleibt

Die MP4-Ausgabe behält eine Videospur und eine Audiospur: jeweils die Hauptspur. Untertitelspuren und alternative Audiosprachen werden nicht übernommen. Wenn Sie eine andere Sprache brauchen, machen Sie sie zuerst in einem Desktop-Programm zur Hauptaudiospur.

## Datenschutz

Die Umwandlung läuft auf Ihrem Gerät in einem Hintergrund-Thread. Die MKV-Datei wird nie hochgeladen, und die Seite setzt keine Cookies.
