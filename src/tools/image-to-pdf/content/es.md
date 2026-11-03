---
review: draft
updated: 2026-11-03
title: Imagen a PDF – Convierte JPG, PNG y WebP a PDF en línea gratis
description: "Convierte imágenes JPG, PNG, WebP y AVIF en un solo PDF con páginas A4, Carta o del tamaño de la imagen. Gratis y privado: tus imágenes nunca se suben."
name: Imagen a PDF
answer: Elige tus imágenes, ordénalas, escoge un tamaño de página y pulsa Crear PDF. Cada imagen se convierte en una página de un solo PDF, creado en tu dispositivo y listo para descargar.
action: Crear PDF
fields:
  files:
    label: Imágenes (JPEG, PNG, WebP o AVIF)
  pageSize:
    label: Tamaño de página
    options:
      a4: A4 (210 × 297 mm)
      letter: Carta EE. UU. (8,5 × 11 in)
      fit: Igual que la imagen
  orientation:
    label: Orientación
    options:
      auto: Automática (según cada imagen)
      portrait: Vertical
      landscape: Horizontal
  margin:
    label: Margen
    options:
      none: Ninguno
      small: Pequeño (0,5 in)
      large: Grande (1 in)
output:
  file:
    label: PDF
errors:
  decode_failed: "No se pudo leer este archivo como imagen. Puede estar dañado. Expórtalo de nuevo o quítalo de la lista e inténtalo otra vez:"
  too_large: "Esta imagen tiene demasiados píxeles para que tu navegador la procese. Redúcela con Redimensionar imágenes o quítala de la lista e inténtalo otra vez:"
steps:
  - Elige hasta 50 imágenes JPEG, PNG, WebP o AVIF, de hasta 50 MB cada una. Puedes añadirlas en varias tandas.
  - Usa las flechas arriba y abajo para ordenar las imágenes. La primera imagen será la primera página.
  - Escoge el Tamaño de página. A4 y Carta EE. UU. sirven para documentos que vas a imprimir; Igual que la imagen hace que cada página tenga exactamente el tamaño de su imagen.
  - Con A4 y Carta EE. UU., deja la Orientación en Automática para girar la página en las imágenes anchas, o elige Vertical u Horizontal para todas las páginas. Añade un Margen si quieres espacio en blanco alrededor de las imágenes.
  - Pulsa Crear PDF y descarga el archivo.
faq:
  - q: ¿Se suben mis imágenes a un servidor?
    a: No. El PDF se crea dentro de tu navegador con PDFium compilado a WebAssembly, así que tus imágenes nunca salen de tu dispositivo.
  - q: ¿Convertir a PDF reduce la calidad de las imágenes?
    a: No en JPEG, PNG ni WebP sin pérdida. Los archivos JPEG se colocan en el PDF byte a byte, sin volver a comprimirlos, y las imágenes PNG y WebP sin pérdida conservan toda su calidad. Las imágenes WebP con pérdida y AVIF sin transparencia se convierten a JPEG con calidad 90 para que el archivo no crezca, lo que puede añadir ligeros artefactos de compresión.
  - q: La foto de mi móvil sale de lado en otras herramientas. ¿Aquí saldrá derecha?
    a: Sí. Los móviles suelen guardar las fotos con la orientación del sensor y una etiqueta de rotación. La herramienta lee esa etiqueta y coloca la foto derecha, sin volver a codificarla.
  - q: ¿Cómo se colocan las imágenes en páginas A4 o Carta?
    a: Cada imagen se escala para caber dentro de los márgenes, manteniendo sus proporciones, y se centra en la página. Las imágenes pequeñas se amplían hasta llenar el espacio, así que las muy pequeñas pueden verse borrosas al imprimirlas.
  - q: ¿Qué tamaño tiene una página con Igual que la imagen?
    a: La página toma el tamaño de la imagen a 96 píxeles por pulgada, más el margen que elijas. Una captura de pantalla de 1920 × 1080 píxeles se convierte en una página de 20 × 11,25 pulgadas.
  - q: ¿Puedo añadir fotos HEIC de un iPhone?
    a: No directamente. Conviértelas antes a JPEG con el Conversor de imágenes y añade aquí los archivos JPEG.
---

## Cómo se crea el PDF

La herramienta usa PDFium, el motor de PDF de Google Chrome, compilado a WebAssembly, y crea una página por imagen en el orden de tu lista. Primero tu navegador decodifica cada archivo para comprobar que es una imagen legible. Después, los archivos JPEG se incrustan sin cambios y su etiqueta de rotación se aplica girando la imagen en la página. Las imágenes PNG, las WebP sin pérdida y cualquier imagen con transparencia se guardan sin pérdida; en las zonas transparentes se ve el blanco de la página. Las imágenes WebP con pérdida y AVIF sin transparencia se convierten a JPEG con calidad 90. El trabajo se hace en un hilo en segundo plano, así que la página sigue respondiendo.

## Opciones y límites

- **Entrada:** de 1 a 50 imágenes JPEG, PNG, WebP o AVIF, de hasta 50 MB cada una. No se acepta HEIC; conviértelo antes con el [Conversor de imágenes](/es/image-converter).
- **Páginas:** A4 (210 × 297 mm), Carta EE. UU. (8,5 × 11 in) o el tamaño de cada imagen a 96 píxeles por pulgada. Los márgenes son de 0,5 in (12,7 mm) o 1 in (25,4 mm) en cada lado.
- **Colocación:** las imágenes mantienen sus proporciones, se centran y se amplían o reducen para caber dentro de los márgenes. No se recorta nada.
- **Salida:** un PDF con el nombre de la primera imagen. El texto de las imágenes no se puede buscar ni seleccionar.
- **Memoria:** las imágenes guardadas sin pérdida se mantienen sin comprimir hasta que se guarda el PDF, así que muchas capturas grandes pueden fallar en el móvil. Crea el PDF en tandas más pequeñas y combínalas con [Unir PDF](/es/merge-pdf).

Para reducir las fotos antes de añadirlas, usa [Redimensionar imágenes](/es/image-resizer); para volver a convertir páginas PDF en imágenes, usa [PDF a imagen](/es/pdf-to-image).

## Privacidad

Tus imágenes se procesan solo en tu dispositivo. La página no las sube, no las guarda y no usa cookies.
