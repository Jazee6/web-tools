---
review: reviewed
updated: 2026-10-29
title: "Convertir MKV a MP4 – Vídeos Matroska gratis y en línea"
description: "Convierte MKV a MP4 gratis en tu navegador. H.264 y AAC se copian sin recodificar: la mayoría de los archivos tardan segundos. Sin subir nada ni registrarte."
name: "MKV a MP4"
answer: "Elige un archivo .mkv y pulsa Convertir vídeo con MP4 seleccionado. Si el vídeo es H.264 o HEVC y el audio es AAC, los flujos se copian al MP4 sin tocarlos; las pistas VP9, AV1, Opus o FLAC se recodifican para que el archivo se reproduzca en móviles, televisores y editores."
steps:
  - "Elige un archivo MKV de hasta 500 MB."
  - "Deja MP4 como formato de salida y pulsa Convertir vídeo."
  - "Espera a que termine la barra de progreso: los archivos que se recodifican tardan más que los que solo se copian."
  - "Descarga el MP4."
faq:
  - q: "¿Por qué mi MKV no se reproduce en el televisor o el móvil?"
    a: "Matroska (MKV) es un contenedor flexible que muchos dispositivos y aplicaciones no abren, aunque puedan reproducir el vídeo que contiene. Pasar los mismos flujos a MP4 suele solucionarlo."
  - q: "¿Qué pasa con los subtítulos y los audios en otros idiomas?"
    a: "Solo se conservan la pista de vídeo principal y la pista de audio principal. Los subtítulos incrustados y las pistas de audio adicionales se descartan, porque el conversor genera un MP4 con una pista de vídeo y una de audio."
  - q: "¿Por qué mi archivo se recodifica en lugar de copiarse?"
    a: "Aquí el MP4 se limita a vídeo H.264 o HEVC y audio AAC, la combinación que se reproduce en casi todos los dispositivos. El vídeo VP9 o AV1 y el audio Opus, Vorbis o FLAC se recodifican, lo que tarda más y no es perfectamente sin pérdidas. El audio se codifica a AAC, o a Opus en Firefox, que no tiene codificador AAC."
  - q: "¿Puedo convertir archivos MKV de más de 500 MB?"
    a: "Con esta herramienta no. El archivo convertido se mantiene en memoria hasta que lo descargas, por eso la entrada está limitada a 500 MB para que funcione bien en portátiles y móviles."
table:
  caption: "Qué ocurre con cada flujo de un archivo MKV en el MP4"
  columns:
    track: "Pista"
    source: "Códec en el MKV"
    result: "En el MP4"
    output: "Códec de salida"
  terms:
    video: "Vídeo"
    audio: "Audio"
    copied: "Copiado sin recodificar"
    reencoded: "Recodificado"
---

## Copiar o recodificar: qué decide la velocidad

MKV puede contener casi cualquier códec, así que dos archivos MKV del mismo tamaño pueden comportarse de forma muy distinta. Los archivos con vídeo H.264 y audio AAC, la combinación más común en los MKV descargados y grabados, simplemente se remultiplexan: los flujos pasan a un contenedor MP4 en segundos y sin cambios de calidad. Los archivos con vídeo VP9 o AV1, o con audio Opus, Vorbis o FLAC, se decodifican y se codifican de nuevo con WebCodecs, lo que puede tardar tanto como el propio vídeo.

## Qué se queda fuera

La salida MP4 conserva una pista de vídeo y una de audio: la principal de cada tipo. Las pistas de subtítulos y los audios en otros idiomas no se trasladan, así que, si necesitas otro idioma, conviértelo antes en la pista de audio principal con una herramienta de escritorio.

## Privacidad

La conversión se hace en tu dispositivo, en un hilo en segundo plano. El MKV nunca se sube y la página no usa cookies.
