---
review: draft
updated: 2026-11-03
title: Conversor de audio – Convierte WAV, M4A, OGG y FLAC a MP3 gratis
description: Convierte audio entre MP3, M4A, WAV y OGG gratis, desde MP3, M4A, AAC, WAV, OGG, Opus o FLAC. Privado y rápido, se procesa en tu navegador y no se sube nada.
name: Conversor de audio
answer: Elige un archivo de audio, escoge MP3, M4A, WAV u OGG y una tasa de bits, y pulsa Convertir audio. El archivo se convierte en tu dispositivo y descargas el resultado. Por defecto es MP3 a 192 kbps, que se reproduce en cualquier sitio.
action: Convertir audio
fields:
  file:
    label: Audio (MP3, M4A, AAC, WAV, OGG, Opus o FLAC)
  format:
    label: Formato de salida
    options:
      mp3: MP3
      m4a: M4A (AAC)
      wav: WAV (sin compresión)
      ogg: OGG (Opus)
  bitrate:
    label: Tasa de bits
    options:
      "128": 128 kbps (más pequeño)
      "192": 192 kbps (recomendado)
      "320": 320 kbps (máxima)
output:
  file:
    label: Audio convertido
errors:
  invalid_audio: No se pudo leer este archivo como audio. Puede estar dañado o usar un formato que esta herramienta no admite. Expórtalo de nuevo como MP3 o WAV e inténtalo otra vez.
  unsupported_codec: "Este navegador no puede decodificar ni codificar este audio. Prueba otro formato de salida o la versión más reciente de Chrome. Códec:"
  aac_unavailable: Este navegador no puede codificar AAC; Firefox, por ejemplo, no tiene codificador AAC. Elige MP3, WAV u OGG, o usa Chrome o Safari.
steps:
  - Elige un archivo de audio MP3, M4A, AAC, WAV, OGG, Opus, FLAC o WebM de hasta 500 MB.
  - Escoge el formato de salida. MP3 se reproduce en cualquier sitio, M4A (AAC) va bien en iPhone y Mac, WAV no tiene compresión y sirve para editar, y OGG (Opus) da el mejor sonido para su tamaño.
  - Escoge una tasa de bits para MP3, M4A u OGG. 192 kbps va bien para casi toda la música, 128 kbps crea archivos más pequeños y 320 kbps es la máxima. WAV la ignora.
  - Pulsa Convertir audio. Una barra de progreso muestra cuánto falta y puedes cancelar en cualquier momento.
  - Descarga el archivo convertido.
faq:
  - q: ¿Se sube mi audio a un servidor?
    a: No. El archivo se decodifica y codifica dentro de tu navegador, así que nunca sale de tu dispositivo.
  - q: ¿Cómo convierto WAV a MP3?
    a: Elige el archivo WAV, deja MP3 como formato de salida, escoge una tasa de bits y pulsa Convertir audio. Un minuto de WAV estéreo ocupa unos 10 MB, mientras que el mismo minuto en MP3 a 192 kbps ocupa unos 1,4 MB.
  - q: ¿Qué tasa de bits debo elegir?
    a: Con 192 kbps es difícil distinguir la mayoría de la música del original. 128 kbps basta para voz y pódcasts y crea archivos más pequeños. 320 kbps es el ajuste máximo de MP3, para cuando el tamaño no importa.
  - q: ¿Convertir a una tasa de bits más alta mejora el sonido?
    a: No. Convertir un MP3 de 128 kbps a 320 kbps hace el archivo más grande, pero el detalle perdido en la primera codificación no vuelve. Pasar de un formato con pérdida a otro siempre pierde algo de calidad, así que parte de WAV o FLAC cuando puedas.
  - q: ¿Puedo cambiar la tasa de bits de un MP3?
    a: Sí. Elige el MP3, deja MP3 como formato de salida y escoge otra tasa de bits. El sonido se recodifica a esa tasa, una forma sencilla de reducir un MP3 grande.
  - q: ¿Puedo convertir archivos FLAC?
    a: Sí, en Chrome, Edge y Firefox. Safari no puede decodificar FLAC, así que allí la herramienta muestra un mensaje. FLAC se puede convertir a MP3, M4A, OGG o WAV; esta herramienta no genera FLAC.
  - q: ¿Qué pasa con el sonido envolvente?
    a: MP3, M4A y OGG se escriben con hasta 2 canales, así que el sonido envolvente se mezcla en estéreo. WAV conserva todos los canales.
---

## Cómo funciona la conversión

La herramienta lee el archivo con Mediabunny, una biblioteca multimedia de código abierto, decodifica el sonido con la API WebCodecs integrada en tu navegador y lo vuelve a codificar en el formato que elegiste. Los navegadores no pueden codificar MP3, así que para MP3 la herramienta usa un codificador creado a partir de LAME, un codificador de MP3 de código abierto. El trabajo se hace en un hilo en segundo plano, así que la página sigue respondiendo.

Para sacar el sonido de un vídeo, usa [Extraer audio](/es/extract-audio).

## Opciones y límites

- **Entrada:** archivos de audio MP3, M4A, AAC, WAV, OGG, Opus, FLAC y WebM de hasta 500 MB. Solo se convierte la pista de audio principal.
- **MP3:** 128, 192 o 320 kbps y hasta 2 canales. Las frecuencias de muestreo poco habituales se convierten a 48 kHz.
- **M4A:** AAC a la tasa de bits elegida, hasta 2 canales, a 44,1 o 48 kHz. Firefox no tiene codificador AAC, así que allí M4A no está disponible.
- **OGG:** Opus a la tasa de bits elegida, hasta 2 canales, siempre a 48 kHz. El sonido mono se codifica como máximo a 256 kbps.
- **WAV:** sonido sin compresión de 16 bits con los canales y la frecuencia de muestreo originales, unos 10 MB por minuto de audio estéreo.
- **Recodificación:** MP3, M4A y OGG siempre se codifican a la tasa de bits que elegiste, aunque el origen tenga el mismo formato. Un WAV que ya es de 16 bits se copia tal cual.
- **Navegadores:** Safari no puede decodificar FLAC ni Vorbis. Si un archivo no se puede decodificar o codificar, la herramienta se detiene con un mensaje.
- **Memoria:** el archivo convertido se guarda en memoria hasta que lo descargas, así que las grabaciones muy largas pueden fallar en teléfonos.

## Privacidad

Tu audio se procesa solo en tu dispositivo. La página no lo sube, no lo guarda y no usa cookies.
