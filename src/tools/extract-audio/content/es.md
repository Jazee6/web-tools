---
review: draft
updated: 2026-11-03
title: Extraer audio de un vídeo – Convierte MP4 a MP3 gratis online
description: Extrae gratis el sonido de un vídeo MP4, MOV, WebM o MKV en MP3, M4A o WAV. Privado y rápido, se procesa en tu navegador y tu vídeo nunca se sube.
name: Extraer audio
answer: Elige un vídeo MP4, MOV, WebM o MKV, escoge MP3, M4A, WAV o la pista original y pulsa Extraer audio. El sonido se guarda en tu dispositivo como un archivo de audio que puedes descargar, sin la imagen.
action: Extraer audio
fields:
  file:
    label: Vídeo (MP4, MOV, WebM o MKV)
  format:
    label: Formato de audio
    options:
      mp3: MP3 (192 kbps)
      m4a: M4A (AAC, 192 kbps)
      wav: WAV (sin compresión)
      original: Pista original (sin recodificar)
output:
  file:
    label: Audio extraído
errors:
  invalid_video: No se pudo leer este archivo como vídeo. Puede estar dañado o usar un formato que esta herramienta no admite. Expórtalo de nuevo como MP4 e inténtalo otra vez.
  no_audio: Este vídeo no tiene pista de audio, así que no hay sonido que extraer.
  unsupported_codec: "Este navegador no puede decodificar ni codificar el audio de este vídeo. Prueba con Pista original o con la versión más reciente de Chrome. Códec:"
  aac_unavailable: Este navegador no puede codificar AAC; Firefox, por ejemplo, no tiene codificador AAC. Elige MP3, WAV o Pista original, o usa Chrome o Safari.
steps:
  - Elige un vídeo MP4, MOV, WebM o MKV de hasta 500 MB.
  - Escoge el formato de audio. MP3 se reproduce en cualquier sitio, M4A (AAC) va bien en iPhone y Mac, WAV no tiene compresión y sirve para editar, y Pista original conserva el sonido tal como está en el vídeo.
  - Pulsa Extraer audio. Una barra de progreso muestra cuánto falta y puedes cancelar en cualquier momento.
  - Descarga el archivo de audio.
faq:
  - q: ¿Se sube mi vídeo a un servidor?
    a: No. El vídeo se lee y su sonido se codifica dentro de tu navegador, así que el archivo nunca sale de tu dispositivo.
  - q: ¿Cómo convierto un vídeo MP4 a MP3?
    a: Elige el archivo MP4, deja MP3 como formato de audio y pulsa Extraer audio. El sonido se codifica como MP3 de 192 kbps y la imagen se descarta. Funciona igual con vídeos MOV, WebM y MKV.
  - q: ¿Qué formato debo elegir?
    a: MP3 si solo quieres un archivo que se reproduzca en cualquier dispositivo. M4A (AAC) suena algo mejor con el mismo tamaño y va bien en iPhone y Mac. WAV no tiene compresión y ocupa mucho más, lo que conviene a los editores de audio. Pista original es lo más rápido y no pierde calidad.
  - q: ¿Qué hace Pista original?
    a: Copia los datos de audio del vídeo sin recodificarlos, así que termina en segundos y el sonido no cambia. El tipo de archivo depende del audio del vídeo; por ejemplo, M4A para sonido AAC en un MP4 y OGG para sonido Opus en un WebM.
  - q: ¿Extraer el audio reduce la calidad del sonido?
    a: No con Pista original, ni con WAV más allá de los 16 bits que guarda. MP3 y M4A recodifican el sonido a 192 kbps, algo difícil de distinguir del original en la mayoría de los casos. Si el audio del vídeo ya es MP3 o AAC, elegir ese mismo formato lo copia sin recodificar.
  - q: ¿Qué pasa si el vídeo tiene varias pistas de audio?
    a: Solo se extrae la pista de audio principal. Las demás, como otros idiomas o comentarios, se descartan.
  - q: ¿Puedo quedarme solo con una parte del sonido?
    a: Aquí no. Primero corta el vídeo a la parte que quieras con [Cortar vídeo](/es/trim-video) y luego extrae el audio del clip.
---

## Cómo funciona la extracción

La herramienta lee el vídeo con Mediabunny, una biblioteca multimedia de código abierto, y se queda solo con la pista de audio principal. Para WAV y M4A, decodifica y codifica el sonido con la API WebCodecs integrada en tu navegador. Los navegadores no pueden codificar MP3, así que para MP3 la herramienta carga, la primera vez que lo necesitas, un codificador creado a partir de LAME, un codificador de MP3 de código abierto. Con Pista original no se decodifica nada: los datos de audio se copian tal cual. El trabajo se hace en un hilo en segundo plano, así que la página sigue respondiendo.

## Opciones y límites

- **Entrada:** archivos MP4, MOV, WebM y MKV de hasta 500 MB.
- **MP3:** 192 kbps y hasta 2 canales. El sonido envolvente se mezcla en estéreo y las frecuencias de muestreo poco habituales se convierten a 48 kHz.
- **M4A:** AAC a 192 kbps. Firefox no tiene codificador AAC, así que allí M4A solo funciona cuando el sonido del vídeo ya es AAC, que entonces se copia.
- **WAV:** sonido sin compresión de 16 bits, unos 10 MB por minuto de audio estéreo.
- **Pista original:** AAC va a M4A, MP3 a MP3, Opus y Vorbis a OGG, FLAC a FLAC y PCM a WAV. Otros códecs, como AC-3 o DTS, van a un archivo MKA (audio Matroska).
- **Pistas:** solo se extrae la pista de audio principal. Si el vídeo no tiene sonido, la herramienta te lo indica en lugar de crear un archivo vacío.
- **Memoria:** el archivo de audio se guarda en memoria hasta que lo descargas. Un vídeo largo extraído como WAV puede ser muy grande y fallar en teléfonos.

## Privacidad

Tu vídeo se procesa solo en tu dispositivo. La página no lo sube, no lo guarda y no usa cookies.
