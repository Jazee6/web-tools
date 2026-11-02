---
review: draft
updated: 2026-11-02
title: Cortar vídeo – Recorta clips MP4, MOV, WebM y MKV en línea gratis
description: Corta un vídeo entre un tiempo de inicio y uno de fin, gratis, en MP4, MOV, WebM o MKV. Privado y rápido — todo se hace en tu navegador, así que tu vídeo nunca se sube.
name: Cortar vídeo
answer: Elige un vídeo, indica un tiempo de inicio y uno de fin, como 1:30 y 2:45, y pulsa Cortar vídeo — el clip se corta en tu dispositivo con el mismo formato y descargas el resultado.
action: Cortar vídeo
fields:
  file:
    label: Vídeo (MP4, MOV, WebM o MKV)
  start:
    label: Tiempo de inicio
    placeholder: 0:00
  end:
    label: Tiempo de fin
    placeholder: Final del vídeo
  mode:
    label: Método de corte
    options:
      precise: Preciso (recodifica si hace falta)
      fast: Rápido (puede conservar lo cortado)
output:
  file:
    label: Vídeo cortado
errors:
  invalid_video: No se pudo leer este archivo como vídeo. Puede estar dañado o usar un formato que esta herramienta no admite. Expórtalo de nuevo como MP4 e inténtalo otra vez.
  no_video: Este archivo no tiene pista de vídeo, solo contiene audio. Elige un archivo de vídeo.
  unsupported_codec: "Este navegador no puede decodificar ni codificar una de las pistas de este vídeo. Prueba el método Rápido o la versión más reciente de Chrome. Códec:"
  invalid_time: "Indica el tiempo en segundos (90.5), minutos:segundos (1:30) u horas:minutos:segundos (1:02:03). Este valor no se puede leer:"
  range_required: Indica un tiempo de inicio, un tiempo de fin o ambos.
  end_before_start: El tiempo de fin debe ser posterior al tiempo de inicio.
  start_past_end: "El tiempo de inicio está después del final del vídeo. Duración de este vídeo:"
steps:
  - Elige un vídeo MP4, MOV, WebM o MKV de hasta 500 MB.
  - Indica el tiempo de inicio, el de fin o ambos, en segundos (90.5), minutos:segundos (1:30) u horas:minutos:segundos (1:02:03). Deja uno vacío para conservar el vídeo desde el principio o hasta el final.
  - Elige un método de corte. Preciso corta en los tiempos exactos y Rápido conserva la calidad original. Si el material que quitas es sensible, usa Preciso, porque un clip Rápido aún puede contener parte de él.
  - Pulsa Cortar vídeo. Una barra de progreso muestra cuánto falta y puedes cancelar en cualquier momento.
  - Descarga el vídeo cortado.
faq:
  - q: ¿Se sube mi vídeo a un servidor?
    a: No. El vídeo se lee y se corta dentro de tu navegador, así que nunca sale de tu dispositivo.
  - q: ¿Qué diferencia hay entre Preciso y Rápido?
    a: Preciso empieza y termina exactamente en los tiempos que indicas, pero normalmente tiene que recodificar el vídeo. Rápido copia el vídeo tal cual, así que termina mucho antes y conserva la calidad original, pero solo puede empezar a cortar en un fotograma clave.
  - q: ¿Por qué mi clip Rápido empieza antes de lo que pedí?
    a: Un vídeo solo se puede copiar desde un fotograma clave, así que un clip WebM o MKV empieza en el último fotograma clave anterior a tu tiempo de inicio. En MP4 y MOV esos fotogramas extra se quedan en el archivo pero una lista de edición (edit list) los oculta, así que un reproductor compatible con listas de edición empieza en tu tiempo. Un clip Rápido también puede pasarse unos fotogramas del tiempo de fin.
  - q: ¿Se elimina de verdad el material que corté?
    a: Con Preciso, sí — no queda nada fuera de tus tiempos en el archivo. Con Rápido, no siempre. Los fotogramas entre el último fotograma clave y tu tiempo de inicio se quedan en el archivo, junto con unos pocos fotogramas después del tiempo de fin. En MP4 y MOV solo se ocultan durante la reproducción. Algunos navegadores muestran uno como imagen de vista previa antes de pulsar reproducir, y cualquiera con una herramienta de edición de vídeo podría recuperarlos. Para quitar material sensible antes de compartir un vídeo, usa Preciso.
  - q: ¿Cortar reduce la calidad?
    a: No con Rápido, porque no se recodifica nada. Preciso recodifica con un ajuste de calidad alta, así que la diferencia suele ser difícil de notar, pero recodificar nunca es totalmente sin pérdidas. Preciso también copia sin recodificar cuando tu tiempo de inicio cae en un fotograma clave y no cortas el final.
  - q: ¿Qué pasa si el tiempo de fin es posterior al final del vídeo?
    a: El clip simplemente llega hasta el final del vídeo.
  - q: ¿Puedo cambiar el formato mientras corto?
    a: No. El clip conserva el mismo formato que el original. Para cambiarlo después, usa el [Conversor de vídeo](/es/video-converter).
---

## Cómo funciona el corte

La herramienta lee el vídeo con Mediabunny, una biblioteca multimedia de código abierto. Con Rápido, copia los datos de vídeo y audio existentes de la parte que elegiste. Con Preciso, decodifica esa parte y la vuelve a codificar con la API WebCodecs integrada en tu navegador, a menudo con aceleración por hardware. El trabajo se hace en un hilo en segundo plano, así que la página sigue respondiendo.

## Opciones y límites

- **Entrada:** archivos MP4, MOV, WebM y MKV de hasta 500 MB. El clip conserva el mismo formato.
- **Material cortado:** un clip Rápido puede conservar fotogramas justo fuera de tus tiempos, aunque el reproductor no los muestre. Preciso no deja ninguno.
- **Pistas:** se conservan la pista de vídeo principal y la pista de audio principal; los subtítulos y las pistas de audio adicionales se descartan.
- **Códecs:** con Preciso, los códecs que se pueden decodificar y codificar dependen de tu navegador y dispositivo. Firefox, por ejemplo, no tiene codificador AAC, por lo que allí MP4 y MOV usan audio Opus. Si una pista no se puede procesar, la herramienta se detiene con un mensaje en lugar de crear un archivo sin sonido o sin imagen.
- **Memoria:** el vídeo cortado se guarda en memoria hasta que lo descargas, así que los archivos muy grandes pueden fallar en móviles.

## Privacidad

Tu vídeo se procesa solo en tu dispositivo. La página no lo sube, no lo guarda y no usa cookies.
