---
review: reviewed
updated: 2026-10-29
title: PDF zusammenfügen – PDF-Dateien kostenlos online kombinieren
description: Fügen Sie mehrere PDF-Dateien in Ihrer Reihenfolge zu einer zusammen. Kostenlos und privat – alles wird in Ihrem Browser verarbeitet und nie hochgeladen.
name: PDF zusammenfügen
answer: Fügen Sie zwei oder mehr PDF-Dateien hinzu, bringen Sie sie in die gewünschte Reihenfolge und klicken Sie auf PDF zusammenfügen – die Seiten werden auf Ihrem Gerät zu einer PDF kombiniert, die Sie sofort herunterladen können.
action: PDF zusammenfügen
fields:
  files:
    label: PDF-Dateien
output:
  file:
    label: Zusammengefügte PDF
errors:
  encrypted: "Diese PDF ist mit einem Passwort geschützt. Entfernen Sie das Passwort und versuchen Sie es erneut:"
  invalid_pdf: "Diese Datei konnte nicht als PDF gelesen werden. Sie ist möglicherweise beschädigt. Exportieren Sie sie erneut oder entfernen Sie sie aus der Liste und versuchen Sie es noch einmal:"
steps:
  - Wählen Sie die PDF-Dateien aus, die Sie kombinieren möchten – 2 bis 20 Dateien mit je bis zu 50 MB. Sie können Dateien auch in mehreren Schritten hinzufügen.
  - Bringen Sie die Dateien mit den Pfeilen nach oben und unten in die richtige Reihenfolge oder entfernen Sie eine versehentlich hinzugefügte Datei.
  - Klicken Sie auf PDF zusammenfügen. Zuerst kommen alle Seiten der ersten Datei, danach die Seiten der nächsten Datei und so weiter.
  - Laden Sie die zusammengefügte PDF herunter.
faq:
  - q: Werden meine PDF-Dateien auf einen Server hochgeladen?
    a: Nein. Die Dateien werden in Ihrem Browser mit dem zu WebAssembly kompilierten PDFium gelesen und kombiniert. Sie verlassen Ihr Gerät also nie.
  - q: Kann ich die Reihenfolge der Dateien ändern?
    a: Ja. Die Liste zeigt die Dateien in der Reihenfolge, in der sie zusammengefügt werden. Verschieben Sie eine Datei mit den Pfeilen nach oben oder unten, bevor Sie auf PDF zusammenfügen klicken.
  - q: Kann ich passwortgeschützte PDFs zusammenfügen?
    a: Nicht, wenn zum Öffnen ein Passwort nötig ist. Öffnen Sie die Datei in einem PDF-Reader, speichern Sie eine Kopie ohne Passwort und fügen Sie diese Kopie hinzu.
  - q: Verringert das Zusammenfügen die Qualität?
    a: Nein. Die Seiten werden unverändert übernommen – Text bleibt markierbar und Bilder werden nicht neu komprimiert. Die zusammengefügte Datei sieht genauso aus wie die Originale.
  - q: Bleiben Lesezeichen und Formularfelder erhalten?
    a: Die Seiten werden mit Text und Bildern unverändert übernommen, die Lesezeichen der Originaldateien jedoch nicht. Ausfüllbare Formularfelder behalten ihren Inhalt, lassen sich aber möglicherweise nicht mehr bearbeiten.
---

## So funktioniert das Zusammenfügen

Das Tool verwendet das zu WebAssembly kompilierte PDFium – die PDF-Engine von Google Chrome. Es öffnet jede Datei, kopiert alle Seiten in der Reihenfolge Ihrer Liste in ein neues Dokument und speichert das Ergebnis. Die Arbeit läuft in einem Hintergrund-Thread, sodass die Seite auch bei großen Dateien reaktionsfähig bleibt.

## Einschränkungen

- **Dateien:** 2 bis 20 PDF-Dateien pro Vorgang, je bis zu 50 MB.
- **Nur ganze Dateien:** Alle Seiten jeder Datei werden übernommen. Um Seiten wegzulassen, teilen oder organisieren Sie die PDF zuerst.
- **Passwörter:** Dateien, die zum Öffnen ein Passwort benötigen, können nicht zusammengefügt werden.
- **Arbeitsspeicher:** Alle Dateien werden beim Zusammenfügen im Speicher gehalten. Sehr große Vorgänge können auf Smartphones fehlschlagen.

## Datenschutz

Ihre Dokumente werden nur auf Ihrem Gerät verarbeitet. Die Seite lädt sie nicht hoch, speichert sie nicht und verwendet keine Cookies.
