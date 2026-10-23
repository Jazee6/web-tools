---
review: draft
updated: 2026-10-23
title: Conversor de vídeo – Convierte MP4, WebM, MOV y MKV gratis
description: Convierte vídeos entre MP4, WebM, MOV y MKV gratis. Privado y rápido — la conversión se hace en tu navegador con WebCodecs, así que tu vídeo nunca se sube.
name: Conversor de vídeo
answer: Elige un vídeo MP4, MOV o WebM, selecciona el formato de salida y pulsa Convertir vídeo — el archivo se convierte en tu dispositivo y lo descargas al momento. Si solo cambia el contenedor, tarda unos segundos.
action: Convertir vídeo
fields:
  file:
    label: Vídeo (MP4, MOV o WebM)
  format:
    label: Formato de salida
    options:
      mp4: MP4 (H.264 + AAC)
      webm: WebM (VP9 + Opus)
      mov: MOV (QuickTime)
      mkv: MKV (Matroska)
output:
  file:
    label: Vídeo convertido
errors:
  invalid_video: No se pudo leer este archivo como vídeo. Puede estar dañado o usar un formato que esta herramienta no admite.
  no_video: Este archivo no tiene pista de vídeo, solo contiene audio.
  unsupported_codec: "Este navegador no puede decodificar ni codificar una de las pistas de este vídeo. Prueba otro formato de salida o la versión más reciente de Chrome. Códec:"
steps:
  - Elige un vídeo MP4, MOV o WebM de hasta 500 MB.
  - Selecciona el formato de salida. MP4 se reproduce casi en cualquier sitio, WebM es ideal para la web, MOV para las apps de Apple y MKV conserva intactas las pistas originales.
  - Pulsa Convertir vídeo. Una barra de progreso muestra cuánto falta y puedes cancelar en cualquier momento.
  - Descarga el vídeo convertido.
faq:
  - q: ¿Se sube mi vídeo a un servidor?
    a: No. El vídeo se lee, decodifica y codifica dentro de tu navegador con la API WebCodecs, así que nunca sale de tu dispositivo.
  - q: ¿Por qué a veces la conversión es casi instantánea?
    a: Si el vídeo y el audio ya usan un códec que el nuevo formato admite — por ejemplo H.264 y AAC al pasar de MOV a MP4 — las pistas se copian tal cual y solo se reescribe el contenedor. No se vuelve a codificar nada, así que es rápido y la calidad no cambia.
  - q: ¿La conversión reduce la calidad?
    a: Solo cuando hay que volver a codificar el vídeo, por ejemplo de WebM a MP4. La herramienta codifica con una calidad alta, así que la diferencia suele ser difícil de notar, pero recodificar nunca es totalmente sin pérdidas.
  - q: ¿Qué códecs usa el archivo de salida?
    a: MP4 y MOV usan vídeo H.264 y audio AAC cuando tu navegador puede codificarlos. Si no puede — Firefox, por ejemplo, no tiene codificador AAC — la herramienta usa otro códec que el formato admita, como audio Opus. WebM usa VP9 y Opus. MKV conserva los códecs originales.
  - q: ¿Puedo convertir archivos MKV?
    a: Todavía no. MKV está disponible como formato de salida, pero por ahora no se pueden elegir archivos MKV como entrada.
---

## Cómo funciona la conversión

La herramienta lee el vídeo con Mediabunny, una biblioteca multimedia de código abierto, y usa la API WebCodecs integrada en tu navegador para decodificar y codificar las pistas, a menudo con aceleración por hardware. Las pistas que el formato de destino ya admite se copian sin recodificar. El trabajo se hace en un hilo en segundo plano, así que la página sigue respondiendo.

## Límites

- **Entrada:** archivos MP4, MOV y WebM de hasta 500 MB.
- **Pistas:** se convierten la pista de vídeo principal y la pista de audio principal; los subtítulos y las pistas de audio adicionales se descartan.
- **Códecs:** los códecs que se pueden decodificar y codificar dependen de tu navegador y dispositivo. Si una pista no se puede convertir, la herramienta se detiene con un mensaje en lugar de crear un archivo sin sonido o sin imagen.
- **Memoria:** el vídeo convertido se guarda en memoria hasta que lo descargas, así que los archivos muy grandes pueden fallar en móviles.

## Privacidad

Tu vídeo se procesa solo en tu dispositivo. La página no lo sube, no lo guarda y no usa cookies.
