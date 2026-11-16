---
review: reviewed
updated: 2026-11-16
title: QR-Code-Generator – QR-Codes mit Logo und Farben online erstellen
description: "Machen Sie aus Link oder Text einen QR-Code als PNG oder SVG, mit eigenen Farben, Größe und Logo. Kostenlos und privat – die Verarbeitung erfolgt in Ihrem Browser."
name: QR-Code-Generator
answer: Geben Sie einen Link oder Text ein oder fügen Sie ihn ein – der QR-Code erscheint während der Eingabe. Wählen Sie PNG oder SVG, Größe, Farben und optional ein Logo und klicken Sie auf Herunterladen, um das Bild zu speichern.
action: QR-Code erstellen
fields:
  text:
    label: Text oder URL
    placeholder: https://example.com/
  format:
    label: Format
    options:
      png: PNG
      svg: SVG
  size:
    label: Größe (Pixel)
  errorCorrection:
    label: Fehlerkorrektur
    options:
      L: L – etwa 7 %
      M: M – etwa 15 %
      Q: Q – etwa 25 %
      H: H – etwa 30 %
  margin:
    label: Rand (Module)
  foreground:
    label: Vordergrundfarbe
  background:
    label: Hintergrundfarbe
  logo:
    label: Logo (PNG, JPEG oder WebP, optional)
output:
  file:
    label: QR-Code
errors:
  too_long: Dieser Text ist für einen QR-Code mit dieser Fehlerkorrekturstufe zu lang. Kürzen Sie ihn oder wählen Sie eine niedrigere Stufe – L fasst am meisten.
  too_long_high: Dieser Text ist für einen QR-Code mit der Fehlerkorrekturstufe H zu lang. Kürzen Sie ihn oder wählen Sie eine niedrigere Stufe. Mit einem Logo wird immer Stufe H verwendet; entfernen Sie also zuerst das Logo, um eine niedrigere Stufe zu nutzen.
  too_small: Diese Größe ist für so viel Text zu klein – jedes Modul wäre kleiner als ein Pixel. Wählen Sie eine größere Größe oder kürzen Sie den Text.
  logo_decode_failed: Diese Datei konnte nicht als Bild gelesen werden. Sie ist möglicherweise beschädigt, oder Ihr Browser kann das Format nicht dekodieren. Exportieren Sie sie erneut als PNG und versuchen Sie es noch einmal.
steps:
  - Geben Sie einen Link oder beliebigen Text in Text oder URL ein oder fügen Sie ihn ein. Der QR-Code wird während der Eingabe aktualisiert.
  - Wählen Sie Format, Größe (Pixel), Fehlerkorrektur und Rand (Module) nach Bedarf.
  - Ändern Sie bei Bedarf die Vordergrundfarbe und die Hintergrundfarbe, oder fügen Sie unter Logo (PNG, JPEG oder WebP, optional) ein Logo für die Mitte hinzu.
  - Scannen Sie den QR-Code mit Ihrem Smartphone, um zu prüfen, ob er funktioniert.
  - Klicken Sie auf Herunterladen, um das Bild zu speichern.
faq:
  - q: Laufen die QR-Codes ab?
    a: Nein. Der Text steckt im Muster selbst, daher funktioniert der Code, solange der Link oder Text darin gültig ist. Es wird kein Weiterleitungsdienst verwendet, und es gibt weder ein Scan-Limit noch Tracking.
  - q: Soll ich PNG oder SVG herunterladen?
    a: PNG ist ein normales Bild in der gewählten Größe, für Dokumente, Präsentationen und Websites. SVG ist eine Vektorgrafik, die in jeder Größe scharf bleibt – gut für den Druck und Designprogramme. Manche Apps können keine SVG-Dateien öffnen; nehmen Sie dafür PNG.
  - q: Welche Fehlerkorrekturstufe soll ich wählen?
    a: M, die Voreinstellung, passt für die meisten Zwecke. Eine höhere Stufe sorgt dafür, dass der Code auch dann lesbar bleibt, wenn ein Teil verschmutzt, beschädigt oder verdeckt ist, aber das Muster wird bei gleichem Text dichter. Die Prozentwerte geben den Anteil der Daten an, der wiederhergestellt werden kann, und garantieren nicht, dass jede verdeckte Fläche lesbar bleibt. L fasst am meisten Text und ergibt die größten Module, was bei kleinen gedruckten Codes hilft. Mit einem Logo wird immer H verwendet.
  - q: Funktioniert mein QR-Code mit einem Logo noch?
    a: In der Regel ja. Das Logo bedeckt in der Mitte etwa ein Viertel der Breite des Codes, und die Fehlerkorrekturstufe H kann bis zu etwa 30 % der Daten wiederherstellen. Scannen Sie das Ergebnis vor dem Drucken mit ein oder zwei Smartphones, besonders bei langem Text oder hellen Farben.
  - q: Kann ich beliebige Farben verwenden?
    a: "Jede #RRGGBB-Farbe funktioniert, aber Scanner brauchen einen deutlichen Kontrast. Verwenden Sie einen dunklen Vordergrund auf hellem Hintergrund; helle Module auf dunklem Hintergrund oder zwei ähnliche Farben werden nicht von jeder App erkannt."
  - q: Wie viel Text passt in einen QR-Code?
    a: Das hängt von den Zeichen und der Fehlerkorrekturstufe ab. Bei Stufe L fasst ein Code bis zu 7.089 Ziffern, 4.296 Großbuchstaben und Ziffern, 2.953 Byte anderen Text oder etwa 984 chinesische oder japanische Zeichen. Bei Stufe H ist es weniger als die Hälfte davon.
---

## So wird der QR-Code erstellt

Der Text wird mit [uqr](https://github.com/unjs/uqr) kodiert, einem Open-Source-QR-Code-Encoder nach ISO/IEC 18004. Er wählt die kleinste QR-Code-Version (1 bis 40), die den Text bei der gewählten Fehlerkorrekturstufe fasst. Text nur aus Ziffern nutzt den numerischen Modus, Text nur aus Großbuchstaben, Ziffern, Leerzeichen und $%*+-./: den alphanumerischen Modus, und jeder andere Text wird als UTF-8-Bytes gespeichert. Danach wird das Muster in einem Hintergrund-Thread gezeichnet: als PNG, bei dem jede Modulkante auf einem ganzen Pixel liegt, sodass keine verschwommenen grauen Kanten entstehen, oder als SVG mit einem einzigen Pfad für alle dunklen Module.

## Optionen und Grenzen

- **Text:** bis zu 7.089 Zeichen, in der Praxis begrenzt durch die Kapazität eines QR-Codes – bei Stufe L 2.953 Byte Text wie eine URL, bei Stufe H 1.273 Byte.
- **Formate:** PNG oder SVG. Das SVG hat dieselbe Breite und Höhe wie das PNG und lässt sich ohne Schärfeverlust skalieren.
- **Größe:** 128 bis 4.096 Pixel für das ganze Bild, Rand eingeschlossen. Voreingestellt sind 512. Jedes Modul braucht mindestens ein Pixel, daher wird ein langer Text bei kleiner Größe abgelehnt.
- **Rand:** 0 bis 16 Module in der Hintergrundfarbe rund um den Code; die Voreinstellung 4 ist die Ruhezone, die der Standard verlangt. Ohne Rand findet ein Scanner den Code auf unruhigem Hintergrund möglicherweise nicht.
- **Fehlerkorrektur:** L, M, Q oder H können etwa 7 %, 15 %, 25 % oder 30 % der Daten wiederherstellen. Voreingestellt ist M.
- **Farben:** beliebige #RRGGBB-Farben für Vorder- und Hintergrund.
- **Logo:** ein optionales PNG-, JPEG- oder WebP-Bild bis 5 MB. Es liegt auf einem Quadrat in der Hintergrundfarbe, das etwa 24 % der Breite des Codes einnimmt, und es wird Stufe H verwendet. In einem SVG wird das Logo als Kopie der Originaldatei eingebettet.
- **Browser:** Das PNG wird mit OffscreenCanvas in einem Hintergrund-Thread gezeichnet, und ein Logo wird mit dem Bilddecoder Ihres Browsers gelesen. Die aktuellen Versionen der gängigen Browser unterstützen beides; ein älterer Browser kann das Bild möglicherweise nicht erstellen.
- **Nicht enthalten:** Das Tool erstellt nur Standard-QR-Codes. Abgerundete Module, Farbverläufe und andere Barcode-Typen werden nicht unterstützt.

## Datenschutz

Ihr Text und Ihr Logo werden nur auf Ihrem Gerät verarbeitet. Die Seite lädt sie nicht hoch, speichert sie nicht und verwendet keine Cookies.
