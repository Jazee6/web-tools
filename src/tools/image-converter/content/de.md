---
review: draft
updated: 2026-10-29
title: Bildkonverter – HEIC, JPEG, PNG, WebP und AVIF online umwandeln
description: "Wandeln Sie HEIC-Fotos vom iPhone oder JPEG-, PNG-, WebP- und AVIF-Bilder um. Kostenlos und privat – läuft in Ihrem Browser, nichts wird hochgeladen."
name: Bildkonverter
answer: Wählen Sie ein Bild, legen Sie das Ausgabeformat fest und klicken Sie auf Bild umwandeln – die HEIC-, JPEG-, PNG-, WebP- oder AVIF-Datei wird auf Ihrem Gerät neu kodiert, und Sie laden die umgewandelte Kopie herunter.
action: Bild umwandeln
fields:
  file:
    label: Bild (HEIC, JPEG, PNG, WebP oder AVIF)
  format:
    label: Umwandeln in
    options:
      jpeg: JPEG (funktioniert überall)
      png: PNG (verlustfrei, behält Transparenz)
      webp: WebP (klein, moderne Browser)
      avif: AVIF (am kleinsten, langsamer)
  quality:
    label: Qualität (1–100)
output:
  file:
    label: Umgewandeltes Bild
errors:
  decode_failed: Dieses Bild konnte nicht gelesen werden. Es ist möglicherweise beschädigt, nutzt eine HEIC-Variante, die der Decoder nicht unterstützt, oder hat ein Format, das Ihr Browser nicht dekodieren kann. Versuchen Sie eine andere Kopie des Bildes oder öffnen Sie die Seite in der neuesten Version von Chrome, Firefox oder Safari.
steps:
  - Wählen Sie ein HEIC-, JPEG-, PNG-, WebP- oder AVIF-Bild bis 50 MB.
  - Wählen Sie das Ausgabeformat. JPEG lässt sich fast überall öffnen; PNG ist verlustfrei und behält die Transparenz; WebP und AVIF ergeben kleinere Dateien.
  - Behalten Sie die Standardqualität 85 bei oder legen Sie einen eigenen Wert fest – niedrigere Werte ergeben kleinere Dateien mit sichtbareren Artefakten. PNG ignoriert diese Einstellung.
  - Klicken Sie auf Bild umwandeln und laden Sie die umgewandelte Datei herunter. Große Bilder, besonders bei der Ausgabe als AVIF, können mehrere Sekunden dauern.
faq:
  - q: Werden meine Bilder auf einen Server hochgeladen?
    a: Nein. Das Bild wird in Ihrem Browser mit WebAssembly dekodiert und neu kodiert und verlässt Ihr Gerät nie. Sobald die Seite geladen ist, funktioniert sie sogar offline.
  - q: Wie wandle ich ein HEIC-Foto vom iPhone in JPG um?
    a: Wählen Sie die .heic-Datei, lassen Sie JPEG ausgewählt und klicken Sie auf Bild umwandeln. HEIC-Dateien werden von der Seite selbst dekodiert, daher funktioniert das auch in Browsern, die HEIC nicht öffnen können, etwa Chrome und Firefox. Bei der ersten HEIC-Umwandlung wird ein Decoder von etwa 2 MB heruntergeladen.
  - q: Kann ich in HEIC umwandeln?
    a: Nein. Browser haben keinen HEIC-Encoder, deshalb kann HEIC nur als Eingabe dienen. Als Ausgabeformate stehen JPEG, PNG, WebP und AVIF zur Verfügung.
  - q: Welches Ausgabeformat sollte ich wählen?
    a: JPEG ist die sicherste Wahl zum Teilen und Drucken. PNG eignet sich am besten für Screenshots, Logos und alles mit Transparenz. WebP und AVIF ergeben kleinere Dateien für Websites, lassen sich aber in manchen älteren Apps nicht öffnen.
  - q: Was passiert mit transparenten Bereichen?
    a: PNG, WebP und AVIF behalten die Transparenz. JPEG kennt keine Transparenz, deshalb werden transparente Pixel mit Weiß gefüllt.
  - q: Bleiben die Metadaten des Fotos erhalten?
    a: Nein. Metadaten wie EXIF-Kameradaten und der GPS-Standort werden nicht in die umgewandelte Datei übernommen, was auch Ihre Privatsphäre schützt. Eingebettete Farbprofile werden ebenfalls nicht übernommen; Fotos mit großem Farbraum, etwa Display-P3-Bilder vom iPhone, wirken daher möglicherweise etwas weniger gesättigt.
---

## So funktioniert die Umwandlung

HEIC- und HEIF-Dateien werden mit [libheif](https://github.com/strukturag/libheif) dekodiert, das zu WebAssembly kompiliert ist und nur geladen wird, wenn Sie eine solche Datei wählen. JPEG-, PNG-, WebP- und AVIF-Dateien dekodiert Ihr Browser. Anschließend werden die Pixel mit MozJPEG, libwebp oder libaom (den Codecs von Googles Squoosh) neu kodiert; bei PNG erzeugt der PNG-Encoder des Browsers die Datei, die danach mit OxiPNG verlustfrei optimiert wird. All das läuft in einem Hintergrund-Thread, die Seite bleibt also bedienbar.

## Optionen und Grenzen

- **Eingabeformate:** HEIC, HEIF, JPEG, PNG, WebP und AVIF. Andere Formate wie GIF, SVG oder BMP werden nicht akzeptiert.
- **Ausgabeformate:** JPEG, PNG, WebP oder AVIF. Die Ausgabe hat dieselben Pixelmaße wie die Eingabe.
- **Größe:** bis zu 50 MB pro Bild. Sehr große Bilder benötigen viel Speicher und können auf Smartphones scheitern.
- **Anzahl:** jeweils ein Bild.
- **Animation und mehrere Bilder:** Nur das erste Bild bzw. der erste Frame wird umgewandelt; animierte WebP- und AVIF-Dateien sowie HEIC-Dateien mit mehreren Bildern ergeben daher ein einzelnes Standbild.
- **Qualität:** gilt für JPEG, WebP und AVIF; die PNG-Ausgabe ist immer verlustfrei.
- **Browser:** HEIC funktioniert in allen unterstützten Browsern. Bei den übrigen Eingabeformaten dekodiert zuerst Ihr Browser das Bild; ein Format, das er nicht anzeigen kann, etwa AVIF in einem älteren Browser, wird daher abgelehnt.

## Datenschutz

Ihr Bild wird nur auf Ihrem Gerät verarbeitet. Die Seite lädt es nicht hoch, speichert es nicht und verwendet keine Cookies.
