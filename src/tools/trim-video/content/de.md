---
review: draft
updated: 2026-11-03
title: Video schneiden – MP4-, MOV-, WebM- und MKV-Clips online kostenlos
description: Schneiden Sie ein Video kostenlos auf Start- und Endzeit, in MP4, MOV, WebM oder MKV. Privat und schnell – alles läuft in Ihrem Browser, Ihr Video wird nie hochgeladen.
name: Video schneiden
answer: Wählen Sie ein Video, geben Sie eine Startzeit und eine Endzeit wie 1:30 und 2:45 ein und klicken Sie auf Video schneiden – der Clip wird auf Ihrem Gerät im selben Format geschnitten, und Sie laden das Ergebnis herunter.
action: Video schneiden
fields:
  file:
    label: Video (MP4, MOV, WebM oder MKV)
  start:
    label: Startzeit
    placeholder: 0:00
  end:
    label: Endzeit
    placeholder: Ende des Videos
  mode:
    label: Schneidemethode
    options:
      precise: Präzise (kodiert bei Bedarf neu)
      fast: Schnell (kann Reste behalten)
output:
  file:
    label: Geschnittenes Video
errors:
  invalid_video: Diese Datei konnte nicht als Video gelesen werden. Sie ist möglicherweise beschädigt oder hat ein Format, das dieses Tool nicht unterstützt. Exportieren Sie sie erneut als MP4 und versuchen Sie es noch einmal.
  no_video: Diese Datei hat keine Videospur – sie enthält nur Audio. Wählen Sie eine Videodatei.
  unsupported_codec: "Dieser Browser kann eine Spur dieses Videos nicht dekodieren oder kodieren. Versuchen Sie die Methode Schnell oder die neueste Version von Chrome. Codec:"
  invalid_time: "Geben Sie eine Zeit als Sekunden (90.5), Minuten:Sekunden (1:30) oder Stunden:Minuten:Sekunden (1:02:03) ein. Dieser Wert kann nicht gelesen werden:"
  range_required: Geben Sie eine Startzeit, eine Endzeit oder beides ein.
  end_before_start: Die Endzeit muss nach der Startzeit liegen.
  start_past_end: "Die Startzeit liegt nach dem Ende des Videos. Länge dieses Videos:"
steps:
  - Wählen Sie ein MP4-, MOV-, WebM- oder MKV-Video mit bis zu 500 MB.
  - Geben Sie die Startzeit, die Endzeit oder beides ein, als Sekunden (90.5), Minuten:Sekunden (1:30) oder Stunden:Minuten:Sekunden (1:02:03). Lassen Sie ein Feld leer, um das Video vom Anfang an oder bis zum Ende zu behalten.
  - Wählen Sie eine Schneidemethode. Präzise schneidet zu den genauen Zeiten, und Schnell behält die Originalqualität. Wenn das Material, das Sie entfernen, sensibel ist, nutzen Sie Präzise, denn ein Clip mit Schnell kann noch Teile davon enthalten.
  - Klicken Sie auf Video schneiden. Ein Fortschrittsbalken zeigt den Stand, und Sie können jederzeit abbrechen.
  - Laden Sie das geschnittene Video herunter.
faq:
  - q: Wird mein Video auf einen Server hochgeladen?
    a: Nein. Das Video wird in Ihrem Browser gelesen und geschnitten und verlässt Ihr Gerät nie.
  - q: Was ist der Unterschied zwischen Präzise und Schnell?
    a: Präzise beginnt und endet genau zu den eingegebenen Zeiten, muss das Video dafür aber meist neu kodieren. Schnell kopiert das Video unverändert, ist deshalb viel schneller fertig und behält die Originalqualität, kann aber nur an einem Keyframe zu schneiden beginnen.
  - q: Warum beginnt mein Clip mit Schnell früher als gewünscht?
    a: Kopiert wird nur ab einem Keyframe, daher startet ein WebM- oder MKV-Clip beim letzten Keyframe vor Ihrer Zeit. Bei MP4 und MOV bleiben die zusätzlichen Frames in der Datei, werden aber durch eine Bearbeitungsliste ausgeblendet, sodass Player, die Bearbeitungslisten unterstützen, bei Ihrer Zeit starten. Am Ende kann der Clip einige Frames zu lang sein.
  - q: Ist das herausgeschnittene Material wirklich weg?
    a: Mit Präzise ja – außerhalb Ihrer Zeiten bleibt nichts in der Datei. Mit Schnell nicht immer, denn Frames zwischen dem letzten Keyframe und Ihrer Startzeit bleiben in der Datei, ebenso einige Frames nach der Endzeit. Bei MP4 und MOV sind sie nur bei der Wiedergabe ausgeblendet. Manche Browser zeigen vor dem Abspielen einen davon als Vorschaubild, und mit einem Videoeditor sind sie wiederherstellbar. Nutzen Sie Präzise, bevor Sie ein Video mit sensiblem Material teilen.
  - q: Verringert das Schneiden die Qualität?
    a: Nicht mit Schnell, weil nichts neu kodiert wird. Präzise kodiert mit hoher Qualität neu, der Unterschied ist meist kaum zu sehen, ganz verlustfrei ist eine Neukodierung aber nie. Präzise kopiert auch ohne Neukodierung, wenn Ihre Startzeit auf einem Keyframe liegt und Sie das Ende nicht abschneiden.
  - q: Was passiert, wenn die Endzeit nach dem Ende des Videos liegt?
    a: Der Clip läuft dann einfach bis zum Ende des Videos.
  - q: Kann ich beim Schneiden das Format ändern?
    a: Nein. Der Clip bleibt im selben Format wie das Original. Um es danach zu ändern, nutzen Sie den [Video-Konverter](/de/video-converter). Wenn Sie nur den Ton brauchen, etwa als MP3, nutzen Sie [Audio extrahieren](/de/extract-audio).
---

## So funktioniert das Schneiden

Das Tool liest das Video mit Mediabunny, einer Open-Source-Medienbibliothek. Mit Schnell kopiert es die vorhandenen Video- und Audiodaten für den gewählten Abschnitt. Mit Präzise dekodiert es diesen Abschnitt und kodiert ihn mit der in Ihren Browser eingebauten WebCodecs-API neu, oft mit Hardwarebeschleunigung. Die Arbeit läuft in einem Hintergrund-Thread, sodass die Seite reaktionsfähig bleibt.

## Optionen und Grenzen

- **Eingabe:** MP4-, MOV-, WebM- und MKV-Dateien mit bis zu 500 MB. Der Clip behält dasselbe Format.
- **Geschnittenes Material:** Ein Clip mit Schnell kann Frames von knapp außerhalb Ihrer Zeiten behalten, auch wenn ein Player sie nicht anzeigt. Präzise lässt keine übrig.
- **Spuren:** Die Haupt-Videospur und die Haupt-Audiospur bleiben erhalten; Untertitel und zusätzliche Audiospuren entfallen.
- **Codecs:** Mit Präzise hängt es von Ihrem Browser und Gerät ab, welche Codecs dekodiert und kodiert werden können. Firefox hat zum Beispiel keinen AAC-Encoder, daher erhalten MP4 und MOV dort Opus-Audio. Lässt sich eine Spur nicht verarbeiten, bricht das Tool mit einer Meldung ab, statt eine Datei ohne Ton oder Bild zu erzeugen.
- **Speicher:** Das geschnittene Video bleibt bis zum Herunterladen im Arbeitsspeicher, sodass sehr große Dateien auf Smartphones scheitern können.

## Datenschutz

Ihr Video wird nur auf Ihrem Gerät verarbeitet. Die Seite lädt es nicht hoch, speichert es nicht und verwendet keine Cookies.
