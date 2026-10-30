---
review: draft
updated: 2026-10-30
title: Farbkonverter – HEX, RGB, HSL, HWB und OKLCH online umrechnen
description: Rechnen Sie eine CSS-Farbe zwischen HEX, RGB, HSL, HWB und OKLCH um, auch mit Alpha. Kostenlos und privat – alles läuft in Ihrem Browser, nichts wird hochgeladen.
name: Farbkonverter
answer: Fügen Sie eine Farbe in HEX, RGB, HSL, HWB oder OKLCH ein und klicken Sie auf Umrechnen – dieselbe Farbe erscheint in allen fünf Formaten direkt in Ihrem Browser und lässt sich kopieren.
action: Umrechnen
fields:
  value:
    label: Farbe
    placeholder: "#ff5733 oder rgb(255 87 51) oder hsl(11 100% 60%)"
output:
  hex:
    label: HEX
  rgb:
    label: RGB
  hsl:
    label: HSL
  hwb:
    label: HWB
  oklch:
    label: OKLCH
errors:
  invalid_color: "Diese Farbe kann das Tool nicht lesen. Verwenden Sie einen Hex-Code wie #ff5733 (3, 4, 6 oder 8 Ziffern) oder rgb(), hsl(), hwb() oder oklch() mit drei Werten, zum Beispiel rgb(255 87 51) oder hsl(11, 100%, 60%). Farbnamen wie red werden nicht unterstützt."
steps:
  - "Geben Sie eine Farbe in das Feld ein oder fügen Sie sie ein, zum Beispiel #ff5733, rgb(255 87 51), hsl(11 100% 60%), hwb(11 20% 0%) oder oklch(0.68 0.21 34)."
  - Klicken Sie auf Umrechnen.
  - Kopieren Sie das benötigte Format – HEX, RGB, HSL, HWB oder OKLCH.
faq:
  - q: Wird meine Eingabe auf einen Server hochgeladen?
    a: Nein. Die Umrechnung läuft vollständig in Ihrem Browser, Ihre Eingabe verlässt also nie Ihr Gerät. Sie können die Seite sogar offline nutzen, sobald sie geladen ist.
  - q: Welche Farbformate kann ich eingeben?
    a: Hex-Codes mit 3, 4, 6 oder 8 Ziffern sowie die CSS-Funktionen rgb(), rgba(), hsl(), hsla(), hwb() und oklch(). Jede Funktion funktioniert in der Schreibweise mit Kommas, rgb(255, 87, 51), und in der Schreibweise mit Leerzeichen, rgb(255 87 51 / 0.5), wobei der Wert nach dem Schrägstrich der Alphawert ist. Der Farbton kann eine einfache Zahl in Grad sein oder die Einheiten deg, grad, rad oder turn haben.
  - q: Kann ich einen Farbnamen wie red eingeben?
    a: "Nein. Das Tool liest nur Hex-Codes und die fünf genannten Funktionen, Farbnamen werden mit einem Fehler abgelehnt. Verwenden Sie stattdessen #ff0000 oder rgb(255 0 0)."
  - q: Wie wird Transparenz behandelt?
    a: Der Alphawert bleibt in jedem Ergebnis erhalten. HEX erhält ein zusätzliches Ziffernpaar (#ff573380), die anderen Formate einen Wert nach einem Schrägstrich (rgb(255 87 51 / 0.5)). Alpha wird auf drei Nachkommastellen gerundet, und eine vollständig deckende Farbe wird ohne Alpha geschrieben.
  - q: Warum weicht der umgerechnete Wert leicht von meiner Eingabe ab?
    a: Die Kanäle von RGB und HEX sind ganze Zahlen von 0 bis 255. Eine Farbe, die Sie in HSL, HWB oder OKLCH angeben, wird daher zuerst auf den nächsten 8-Bit-Wert gerundet. Die übrigen Formate werden aus dieser gerundeten Farbe berechnet, sodass alle fünf Ergebnisse zueinander passen. HSL- und HWB-Werte zeigen bis zu eine Nachkommastelle, Helligkeit und Chroma von OKLCH bis zu vier.
  - q: Was passiert mit einer OKLCH-Farbe außerhalb des sRGB-Farbumfangs?
    a: OKLCH kann Farben beschreiben, die ein Standardbildschirm nicht darstellen kann. Sie werden kanalweise auf die nächsten sRGB-Werte begrenzt, das Ergebnis ist also eine ähnliche, aber weniger kräftige Farbe als die eingegebene.
---

## Was dieses Farbtool macht

Das Tool wandelt Ihre Eingabe in eine Farbe im sRGB-Farbraum um und schreibt sie in fünf CSS-Formaten. HSL und HWB werden mit den Formeln aus dem [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) aus RGB berechnet. OKLCH ist die Polarform von [Oklab](https://bottosson.github.io/posts/oklab/); für die Umrechnung zwischen sRGB und Oklab dienen die von Björn Ottosson veröffentlichten Matrizen. Die Ergebnisse verwenden die moderne CSS-Schreibweise mit Leerzeichen, zum Beispiel `rgb(255 87 51)`, `hsl(10.6 100% 60%)` und `oklch(0.6804 0.21 33.7)`.

## Optionen und Grenzen

- **Eingabe:** jeweils eine Farbe. Leerzeichen am Anfang und Ende werden ignoriert; bei Funktionsnamen und Hex-Ziffern spielt die Groß- und Kleinschreibung keine Rolle.
- **Unterstützte Formate:** Hex mit 3, 4, 6 oder 8 Ziffern, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hwb()` und `oklch()`. Farbnamen, `color()`, `lab()`, `lch()`, `oklab()` und `var()` werden nicht unterstützt.
- **Werte außerhalb des Bereichs:** RGB-Kanäle, Sättigung, Helligkeit, Weißanteil, Schwarzanteil und Alpha werden auf ihren gültigen Bereich begrenzt. Der Farbton läuft im Kreis, `hsl(-120 100% 50%)` ist also dasselbe Blau wie `hsl(240 100% 50%)`.
- **Genauigkeit:** HEX und RGB haben 8 Bit. Farbton, Sättigung, Helligkeit, Weißanteil und Schwarzanteil zeigen bis zu eine Nachkommastelle; Helligkeit und Chroma von OKLCH bis zu vier.
- **Graue Farben:** Eine Farbe ohne Farbton wird mit Farbton 0 angezeigt.

## Datenschutz

Die Verarbeitung findet nur auf Ihrem Gerät statt. Die Seite lädt Ihre Eingabe nicht hoch, speichert sie nicht und verwendet keine Cookies.
