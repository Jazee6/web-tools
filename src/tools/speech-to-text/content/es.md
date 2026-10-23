---
review: draft
updated: 2026-10-23
title: Voz a texto – Transcribe audio y vídeo online gratis
description: Transcribe audio y vídeo a texto y subtítulos SRT gratis. Privado — el modelo de reconocimiento de voz Whisper funciona en tu navegador y tu archivo nunca se sube.
name: Voz a texto
answer: Elige un archivo de audio o vídeo, deja el idioma en Detectar automáticamente o elige el idioma hablado y pulsa Transcribir. Whisper convierte la voz en texto en tu dispositivo, y puedes copiar la transcripción o descargarla como subtítulos SRT.
action: Transcribir
fields:
  file:
    label: Audio o vídeo (MP3, M4A, WAV, OGG, FLAC, MP4, MOV, WebM o MKV)
  language:
    label: Idioma hablado
    options:
      auto: Detectar automáticamente
output:
  text:
    label: Transcripción
  subtitles:
    label: Subtítulos (SRT)
errors:
  invalid_audio: No se pudo leer este archivo como audio. Puede estar dañado o usar un formato que esta herramienta no admite.
  no_audio: Este archivo no tiene pista de audio, así que no hay nada que transcribir.
  unsupported_codec: "Este navegador no puede decodificar el audio de este archivo. Prueba con otro formato de archivo o con la última versión de Chrome. Códec:"
  too_long: La grabación dura más de 60 minutos. Divídela en partes más cortas y transcríbelas una a una.
  no_speech: No se encontró voz en esta grabación.
steps:
  - Elige un archivo de audio o vídeo de hasta 1 GB y 60 minutos.
  - Deja el idioma en Detectar automáticamente o elige el idioma que se habla. Elegirlo ayuda con clips cortos y acentos marcados.
  - Pulsa Transcribir. La primera vez se descarga el modelo de reconocimiento de voz (unos 105–125 MB) y se guarda en tu navegador; después empieza al instante.
  - Copia la transcripción o descarga el archivo SRT para usarlo como subtítulos en un reproductor o editor de vídeo.
faq:
  - q: ¿Se sube mi grabación a un servidor?
    a: No. El audio se decodifica y se transcribe dentro de tu navegador, así que el archivo nunca sale de tu dispositivo. Solo se descarga el modelo de reconocimiento de voz, una única vez.
  - q: ¿Qué idiomas admite?
    a: Los 99 idiomas con los que se entrenó Whisper, entre ellos español, inglés, chino, alemán, francés, japonés y portugués. La precisión es mayor en los idiomas más hablados y con grabaciones claras.
  - q: ¿Por qué la primera transcripción tarda más?
    a: La herramienta descarga primero el modelo Whisper, de unos 105–125 MB según tu dispositivo, y lo guarda en tu navegador. Las siguientes transcripciones usan la copia guardada y empiezan al instante.
  - q: ¿Qué precisión tiene la transcripción?
    a: La herramienta usa Whisper base, un modelo compacto que funciona bien en el navegador. Reconoce bien la voz clara, pero puede fallar con grabaciones ruidosas, varias voces a la vez o nombres poco comunes, así que revisa la transcripción antes de publicarla.
  - q: ¿Qué es un archivo SRT?
    a: SRT es el formato de subtítulos más habitual. Cada línea de la transcripción tiene una hora de inicio y de fin, de modo que reproductores como VLC y editores como Premiere Pro o CapCut pueden mostrarla como subtítulos.
---

## Cómo funciona la transcripción

La herramienta decodifica el audio con Mediabunny y la API WebCodecs, lo convierte a 16 kHz mono y se lo pasa a Whisper base, un modelo de reconocimiento de voz de código abierto de OpenAI. El modelo se ejecuta con ONNX Runtime en un hilo en segundo plano. Si tu dispositivo tiene una GPU con capacidad suficiente, parte del modelo se ejecuta en ella con WebGPU, que es más rápido; si no, todo se ejecuta en la CPU con WebAssembly. Las grabaciones largas se dividen en ventanas de 30 segundos que se solapan y luego se vuelven a unir.

## Límites

- **Entrada:** audio MP3, M4A, AAC, WAV, OGG, Opus, FLAC y WebM, o la pista de audio de un vídeo MP4, MOV, WebM o MKV, de hasta 1 GB y 60 minutos.
- **Velocidad:** en un portátil reciente, un minuto de audio tarda unos segundos con WebGPU y hasta unos 20 segundos sin él.
- **Descarga:** el modelo ocupa unos 105–125 MB y se descarga la primera vez.
- **Precisión:** Whisper base es un modelo pequeño. El ruido de fondo, la música y varias personas hablando a la vez reducen la calidad.

## Privacidad

Tu grabación se procesa solo en tu dispositivo. La página no la sube, no la guarda y no usa cookies.
