---
review: draft
updated: 2026-10-23
title: Compresor de imágenes – Comprime JPEG, PNG, WebP y AVIF
description: Reduce imágenes JPEG, PNG, WebP y AVIF sin subirlas. Gratis y privado — la compresión se hace en tu navegador con los mismos códecs que Squoosh.
name: Compresor de imágenes
answer: Elige una imagen, ajusta la calidad si quieres y pulsa Comprimir imagen — el archivo se vuelve a codificar en tu dispositivo con el mismo formato y luego descargas la copia más ligera.
action: Comprimir imagen
fields:
  file:
    label: Imagen (JPEG, PNG, WebP o AVIF)
  quality:
    label: Calidad (1–100)
output:
  file:
    label: Imagen comprimida
errors:
  decode_failed: No se pudo leer esta imagen. Puede estar dañada o usar un formato que tu navegador no sabe decodificar.
steps:
  - Elige una imagen JPEG, PNG, WebP o AVIF de hasta 50 MB.
  - Deja la calidad predeterminada de 75 o pon la tuya — los valores bajos dan archivos más pequeños con más artefactos visibles. PNG ignora este ajuste porque siempre se comprime sin pérdida.
  - Pulsa Comprimir imagen y espera un momento; los archivos AVIF grandes pueden tardar varios segundos.
  - Revisa el nuevo tamaño y descarga la imagen comprimida.
faq:
  - q: ¿Se suben mis imágenes a un servidor?
    a: No. La imagen se decodifica y se vuelve a codificar dentro de tu navegador con códecs WebAssembly, así que nunca sale de tu dispositivo.
  - q: ¿Qué calidad debo usar?
    a: 75 es un buen valor para fotos — la diferencia apenas se nota y el archivo suele ser mucho más pequeño. Usa 85–90 para imágenes con texto fino o bordes nítidos, y 50–65 cuando el tamaño importa más que el detalle, como en miniaturas.
  - q: ¿Por qué mi PNG apenas se reduce?
    a: Aquí la compresión de PNG es sin pérdida — cada píxel queda exactamente igual y solo se optimiza la codificación. Los archivos ya guardados con una herramienta de optimización pueden reducirse muy poco. Para fotos, convertir a JPEG, WebP o AVIF ahorra mucho más.
  - q: ¿La compresión cambia las dimensiones o el formato?
    a: No. El resultado mantiene el formato y las dimensiones en píxeles originales. Si al volver a codificar el archivo fuera a crecer, recibes el original sin cambios.
  - q: ¿Se conservan los metadatos de la foto?
    a: En JPEG, WebP y AVIF se eliminan metadatos como los datos EXIF de la cámara y la ubicación GPS, lo que además protege tu privacidad. Antes se gira la imagen según su orientación EXIF, así que se sigue viendo derecha.
---

## Cómo funciona la compresión

Los JPEG se vuelven a codificar con MozJPEG, los WebP con libwebp y los AVIF con libaom — los códecs que usa Squoosh de Google, compilados a WebAssembly. Los PNG se optimizan sin pérdida con OxiPNG. Todo se ejecuta en un hilo en segundo plano, así que la página sigue respondiendo mientras se procesa una imagen grande.

## Límites

- **Formatos:** entran JPEG, PNG, WebP y AVIF; sale el mismo formato.
- **Tamaño:** hasta 50 MB por imagen. Las imágenes muy grandes necesitan mucha memoria y pueden fallar en móviles.
- **Una imagen a la vez.** Los WebP y AVIF animados se reducen a su primer fotograma.
- **Velocidad:** la codificación AVIF es la más lenta. En navegadores que permiten varios hilos usa varios núcleos de la CPU.

## Privacidad

Tu imagen se procesa solo en tu dispositivo. La página no la sube, no la guarda y no usa cookies.
