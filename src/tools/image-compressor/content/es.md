---
review: draft
updated: 2026-10-30
title: Compresor de imágenes – Comprime JPEG, PNG, WebP y AVIF en línea
description: Comprime imágenes JPEG, PNG, WebP y AVIF sin subirlas. Gratis y privado — la compresión se procesa en tu navegador con los mismos códecs que Squoosh.
name: Compresor de imágenes
answer: Elige una o varias imágenes, ajusta la calidad si quieres y pulsa Comprimir imágenes — cada archivo se vuelve a codificar en tu dispositivo con el mismo formato y luego descargas las copias más ligeras.
action: Comprimir imágenes
fields:
  files:
    label: Imágenes (JPEG, PNG, WebP o AVIF)
  quality:
    label: Calidad (1–100)
output:
  files:
    label: Imágenes comprimidas
errors:
  decode_failed: No se pudo leer esta imagen. Puede estar dañada o usar un formato que tu navegador no puede decodificar. Prueba con otra copia de la imagen o abre la página en la última versión de Chrome, Firefox o Safari.
steps:
  - Elige hasta 20 imágenes JPEG, PNG, WebP o AVIF, de hasta 50 MB cada una. Puedes añadir archivos en varias tandas y hacer clic en una miniatura para ampliarla.
  - Deja la calidad predeterminada de 75 o pon la tuya — los valores bajos dan archivos más pequeños con más artefactos visibles. PNG ignora este ajuste porque siempre se comprime sin pérdida.
  - Revisa el tamaño estimado que aparece bajo cada archivo; se actualiza cuando cambias la calidad.
  - Pulsa Comprimir imágenes y espera un momento; los archivos AVIF grandes pueden tardar varios segundos.
  - Compara cada original con su copia comprimida y descarga los archivos uno a uno o todos juntos en un ZIP.
faq:
  - q: ¿Se suben mis imágenes a un servidor?
    a: No. La imagen se decodifica y se vuelve a codificar dentro de tu navegador con códecs WebAssembly, así que nunca sale de tu dispositivo.
  - q: ¿Qué calidad debo usar?
    a: 75 es un buen valor para fotos — la diferencia apenas se nota y el archivo suele ser mucho más pequeño. Usa 85–90 para imágenes con texto fino o bordes nítidos, y 50–65 cuando el tamaño importa más que el detalle, como en miniaturas.
  - q: ¿Por qué mi PNG apenas se reduce?
    a: Aquí la compresión de PNG es sin pérdida — cada píxel queda exactamente igual y solo se optimiza la codificación. Los archivos ya guardados con una herramienta de optimización pueden reducirse muy poco. Para fotos, convertir a JPEG, WebP o AVIF ahorra mucho más.
  - q: ¿La compresión cambia las dimensiones o el formato?
    a: No. El resultado mantiene el formato y las dimensiones originales en píxeles. Si al volver a codificar el archivo fuera a crecer, recibes el archivo original sin cambios.
  - q: ¿Se conservan los metadatos de la foto?
    a: En JPEG, WebP y AVIF se eliminan metadatos como los datos EXIF de la cámara y la ubicación GPS, lo que además protege tu privacidad. Antes se gira la imagen según su orientación EXIF, así que se sigue viendo derecha.
  - q: ¿Qué tan preciso es el tamaño estimado?
    a: Las imágenes de hasta 1 megapíxel aproximadamente se codifican de verdad una vez para la estimación, así que la cifra coincide con el resultado. Las más grandes se estiman codificando unos pocos fragmentos a resolución original y escalando a toda la imagen — suele ser una cifra cercana, pero una foto con el detalle muy desigual puede diferir más. La estimación nunca supera el tamaño original, porque si recodificar lo aumentaría se devuelve el original sin cambios.
---

## Cómo funciona la compresión

Los JPEG se vuelven a codificar con MozJPEG, los WebP con libwebp y los AVIF con libaom — los códecs que usa Squoosh de Google, compilados a WebAssembly. Los PNG se optimizan sin pérdida con OxiPNG. Todo se ejecuta en un hilo en segundo plano, así que la página sigue respondiendo mientras se procesa una imagen grande.

## Límites

- **Formatos:** entran JPEG, PNG, WebP y AVIF; sale el mismo formato. No se aceptan otros formatos como GIF, SVG o BMP.
- **Tamaño:** hasta 50 MB por imagen. Las imágenes muy grandes necesitan mucha memoria y pueden fallar en móviles.
- **Cantidad:** hasta 20 imágenes a la vez, procesadas una tras otra. Descarga los resultados uno a uno o en un único ZIP.
- **Animación:** los WebP y AVIF animados se reducen a su primer fotograma.
- **Velocidad:** la codificación AVIF es la más lenta. En navegadores que permiten varios hilos usa varios núcleos de la CPU.
- **Navegadores:** tu navegador decodifica primero la imagen, así que un formato que no puede mostrar, como AVIF en un navegador antiguo, se rechaza.

## Privacidad

Tus imágenes se procesan solo en tu dispositivo. La página no las sube, no las guarda y no usa cookies.
