---
review: reviewed
updated: 2026-11-09
title: "Drittanbieterlizenzen – Software, Modelle und Schriften"
description: "Hier finden Sie Lizenzen und Quellcode für Software, Modelle und Schriften von Web Tools sowie die gesonderten Bedingungen für libheif und LAME."
name: "Drittanbieterlizenzen"
---

Die folgende Liste wird beim Erstellen der Website automatisch aus dem enthaltenen Drittanbietercode, den Modellen und Schriften erzeugt. Paketversionen werden dabei ausgelesen. Vollständige Lizenztexte stehen im englischen Original bereit, mit Quellcode-Links für LGPL- und MPL-Komponenten.

Dieses Verzeichnis dient der Information und ist weder eine Rechtsberatung noch ein Nachweis für die vollständige Erfüllung der Lizenzpflichten. Einige eingebundene native Abhängigkeiten und die Bedingungen für Modellkonvertierungen werden noch geprüft.

## Komponenten mit gesonderten Bedingungen

- **PDFium:** Der Wrapper nutzt MIT. Der mitgelieferte PDFium-Hinweis enthält BSD-artige Bedingungen und den Apache-2.0-Text sowie Hinweise zu eingebundenen Bibliotheken.
- **jSquash:** Die Verarbeitungsbibliotheken haben eigene Lizenzen, zusätzlich zu Apache-2.0 für die Wrapper.
- **libheif und libde265:** Sie nutzen LGPL-3.0 und sind in JavaScript eingebunden. Ihre Bedingungen umfassen Rechte zur Änderung und zum Austausch der betroffenen Komponenten.
- **LAME:** Der MP3-Encoder nutzt GNU Library GPL Version 2 oder neuer, getrennt von den MPL-2.0-Bedingungen für Mediabunny und dessen MP3-Wrapper. Auch der Encoder ist in JavaScript eingebunden.

Für libheif, libde265 und LAME bieten wir derzeit keinen Mechanismus zum Austausch oder erneuten Linken der eingebundenen Komponenten an. Die entsprechenden LGPL-Anforderungen bleiben ein vor der Veröffentlichung zu klärender Punkt; Quellcode-Links allein belegen nicht, dass diese Anforderungen erfüllt sind.

This software is based in part on the work of the Independent JPEG Group.
