---
review: reviewed
updated: 2026-10-29
title: "Convertir MOV a MP4 – Vídeos de QuickTime gratis y en línea"
description: "Convierte MOV a MP4 gratis en tu navegador. Los vídeos de iPhone y QuickTime suelen convertirse en segundos sin recodificar y no se sube nada."
name: "MOV a MP4"
answer: "Elige un archivo .mov y pulsa Convertir vídeo: MP4 ya viene seleccionado. La mayoría de las grabaciones de iPhone y Mac usan H.264 o HEVC con audio AAC, que MP4 admite tal cual, así que el vídeo se reempaqueta en segundos sin pérdida de calidad."
steps:
  - "Elige un vídeo MOV de tu iPhone, Mac o cámara, de hasta 500 MB."
  - "Deja MP4 como formato de salida y pulsa Convertir vídeo."
  - "Descarga el archivo MP4 y reprodúcelo o compártelo donde quieras."
faq:
  - q: "¿Por qué convertir MOV a MP4?"
    a: "MOV es el formato QuickTime de Apple. Windows, Android, las smart TV y muchos formularios de subida manejan MP4 con más fiabilidad, aunque el vídeo que contienen sea exactamente el mismo."
  - q: "¿Perderá calidad mi vídeo del iPhone?"
    a: "Normalmente no. Los iPhone graban vídeo H.264 o HEVC con audio AAC, y esos flujos se copian al MP4 sin recodificar, así que cada fotograma queda idéntico."
  - q: "¿Por qué falla la conversión de mi MOV en ProRes?"
    a: "Apple ProRes es un códec profesional de edición que los navegadores no pueden decodificar. Exporta antes el clip como H.264 o HEVC desde tu programa de edición y luego conviértelo aquí."
  - q: "¿Qué pasa con el audio PCM sin comprimir?"
    a: "Los reproductores de MP4 esperan audio comprimido, así que el PCM se codifica a AAC. Firefox no tiene codificador AAC, por lo que allí el audio se codifica a Opus."
table:
  caption: "Qué ocurre con cada flujo de un archivo MOV en el MP4"
  columns:
    track: "Pista"
    source: "Códec en el MOV"
    result: "En el MP4"
    output: "Códec de salida"
  terms:
    video: "Vídeo"
    audio: "Audio"
    copied: "Copiado sin recodificar"
    reencoded: "Recodificado"
    unsupported: "No compatible con los navegadores"
---

## Por qué de MOV a MP4 suele ser instantáneo

MOV y MP4 son parientes cercanos: ambos derivan del formato de archivo QuickTime de Apple y guardan los flujos de la misma manera. Cuando los flujos de un MOV son vídeo H.264 o HEVC y audio AAC, el conversor solo reescribe el contenedor que los envuelve. No se decodifica ni se recodifica ningún fotograma, así que un clip largo del iPhone pasa a MP4 en segundos y se ve exactamente igual que el original.

## Qué archivos MOV necesitan recodificarse

Los archivos de grabadores de pantalla, cámaras antiguas e interfaces de audio a veces llevan audio PCM o MP3. Ese audio se codifica a AAC (a Opus en Firefox), mientras que el vídeo se sigue copiando. El vídeo Apple ProRes no se puede decodificar en ningún navegador, así que la herramienta se detiene con un mensaje en lugar de generar un archivo roto.

## Privacidad

El archivo MOV se lee y se reempaqueta en tu dispositivo. Nunca se sube y la página no usa cookies.
