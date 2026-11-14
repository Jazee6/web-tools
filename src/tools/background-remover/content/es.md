---
review: reviewed
updated: 2026-11-14
title: Quitar fondo – Elimina el fondo de imágenes en línea gratis
description: "Quita el fondo de una foto y obtén un PNG o WebP con fondo transparente, o un color sólido. Gratis y privado: la IA funciona en tu navegador y tus fotos no se suben."
name: Quitar fondo
answer: "Elige una foto, deja PNG para un fondo transparente o escribe un color de fondo, y pulsa Quitar el fondo para que un modelo de IA en tu dispositivo quite el fondo y puedas descargar la imagen."
action: Quitar el fondo
fields:
  file:
    label: Imagen (HEIC, JPEG, PNG, WebP o AVIF)
  format:
    label: Formato de salida
    options:
      png: PNG (transparente)
      webp: "WebP (transparente)"
      jpeg: JPEG (necesita un color de fondo)
  background:
    label: Color de fondo (hexadecimal)
    placeholder: "Transparente, o un color como #ffffff"
  quality:
    label: Calidad (1–100)
output:
  file:
    label: Imagen sin fondo
errors:
  decode_failed: No se pudo leer este archivo como imagen. Puede estar dañado o tu navegador no puede decodificar su formato. Expórtalo de nuevo como JPEG o PNG e inténtalo otra vez.
  too_large: Tu navegador no puede manejar tantos píxeles. Los navegadores de móviles permiten menos que los de ordenador; prueba con una imagen más pequeña o en un ordenador.
  background_required: "JPEG no admite transparencia, así que necesita un color de fondo. Escribe uno, como #ffffff para blanco, o elige PNG o WebP para mantener el fondo transparente."
  invalid_color: "Escribe el color de fondo como un código hexadecimal de tres o seis dígitos, como #fff o #ffffff, o déjalo vacío. No se pudo leer:"
steps:
  - Elige una imagen HEIC, JPEG, PNG, WebP o AVIF de hasta 50 MB.
  - "Elige un formato en Formato de salida. PNG y WebP mantienen el fondo transparente; JPEG necesita un color de fondo."
  - "Para poner el sujeto sobre un color sólido, escríbelo en Color de fondo (hexadecimal), como #ffffff."
  - "Pulsa Quitar el fondo. La primera vez se descargan el modelo de IA y su entorno de ejecución (unos 125–150 MB), y se guardan en tu navegador si hay espacio."
  - Descarga la imagen sin fondo.
faq:
  - q: ¿Se suben mis fotos a un servidor?
    a: "No. La imagen se decodifica, el modelo la analiza y se vuelve a codificar dentro de tu navegador. La herramienta descarga el modelo de IA y su entorno de ejecución, pero tu foto nunca sale de tu dispositivo."
  - q: ¿Cómo pongo un fondo blanco, por ejemplo para una foto de producto?
    a: "Escribe #ffffff como color de fondo. El sujeto queda sobre blanco y el resultado no tiene transparencia, así que también puedes guardarlo como JPEG."
  - q: ¿Por qué la primera vez es más lenta?
    a: "La herramienta primero descarga el modelo BiRefNet y su entorno de ejecución, unos 125–150 MB según tu dispositivo, y los guarda en tu navegador si hay espacio. Las siguientes veces puede usar esa copia mientras tu navegador la conserve."
  - q: "¿Puedo elegir qué objeto conservar?"
    a: "No. El modelo elige el sujeto principal por sí solo y no hay forma de marcar un objeto a mano. Revisa los bordes del resultado antes de usarlo."
  - q: ¿Puedo quitar el fondo de varias imágenes a la vez?
    a: No con esta herramienta, que procesa una imagen cada vez. Una vez cargado el modelo, las siguientes imágenes se procesan sin volver a descargarlo.
  - q: ¿Se conservan los datos EXIF de la foto?
    a: No. La imagen se vuelve a codificar a partir de sus píxeles, así que los datos EXIF, como el modelo de cámara y la ubicación GPS, no aparecen en el resultado. En JPEG, PNG, WebP y AVIF, antes se aplica la orientación EXIF, así que el resultado sale derecho.
---

## Cómo se quita el fondo

La herramienta decodifica la imagen con el decodificador integrado de tu navegador, o con una versión en WebAssembly de libheif para HEIC, y pasa una copia a BiRefNet_lite, un modelo de segmentación de código abierto (licencia MIT). El modelo funciona con ONNX Runtime en un hilo en segundo plano y calcula, para cada píxel, la probabilidad de que pertenezca al sujeto. Esa máscara se amplía al tamaño completo de tu imagen y se convierte en su transparencia: el sujeto se mantiene y el fondo pasa a ser transparente o se rellena con el color que escribiste. El resultado se codifica como PNG (optimizado después con OxiPNG), WebP o JPEG.

## Opciones y límites

- **Entrada:** una imagen HEIC, JPEG, PNG, WebP o AVIF de hasta 50 MB. Las zonas que ya son transparentes siguen siéndolo, salvo que escribas un color de fondo.
- **Salida:** PNG y WebP mantienen el fondo transparente; JPEG no admite transparencia y necesita un color de fondo. La imagen conserva su ancho y alto.
- **Color de fondo:** un código hexadecimal como #ffffff o #fff. Déjalo vacío para un fondo transparente.
- **Calidad:** se aplica a WebP y JPEG, con 90 por defecto. PNG es siempre sin pérdida.
- **Navegadores:** con WebGPU y una GPU que admita números de 16 bits en coma flotante, el modelo funciona en la GPU y analiza la imagen a 1024 × 1024 píxeles. Si no, funciona en la CPU a 512 × 512 píxeles, por lo que los bordes pueden ser menos precisos en imágenes grandes. En la CPU usa varios hilos cuando el navegador lo permite.
- **Descarga:** el modelo y su entorno de ejecución ocupan unos 150 MB con WebGPU o unos 125 MB sin ella, y se descargan la primera vez.
- **Precisión:** el modelo encuentra el sujeto principal automáticamente; no puedes elegir qué objeto conservar.

## Privacidad

Tus imágenes se procesan solo en tu dispositivo. La página no las sube, no las guarda y no usa cookies.
