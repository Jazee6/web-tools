---
review: draft
updated: 2026-11-02
title: PDF a imagen – Convierte PDF a JPG, PNG o WebP en línea
description: Convierte las páginas de un PDF en imágenes JPG, PNG o WebP a 72, 150 o 300 DPI. Gratis y privado — todo se hace en tu navegador y el documento nunca se sube.
name: PDF a imagen
answer: Elige un PDF, selecciona JPEG, PNG o WebP y una resolución, y pulsa Convertir a imágenes. Cada página se convierte en una imagen en tu dispositivo; indica páginas como 1-3, 5 para convertir solo esas.
action: Convertir a imágenes
fields:
  file:
    label: Archivo PDF
  pages:
    label: Páginas
    placeholder: Todas, o 1-3, 5, 8-
  format:
    label: Formato de imagen
    options:
      jpeg: JPEG (se abre en todas partes)
      png: PNG (sin pérdida, texto más nítido)
      webp: WebP (pequeño, navegadores modernos)
  dpi:
    label: Resolución
    options:
      "72": 72 DPI (pantalla, el más pequeño)
      "150": 150 DPI (nítido en pantalla)
      "300": 300 DPI (calidad de impresión)
  quality:
    label: Calidad (1–100)
output:
  files:
    label: Imágenes
errors:
  encrypted: "Este PDF está protegido con contraseña. Quita la contraseña e inténtalo de nuevo:"
  invalid_pdf: "No se pudo leer este archivo como PDF. Puede estar dañado. Expórtalo de nuevo e inténtalo otra vez:"
  invalid_pages: "Indica las páginas como números e intervalos separados por comas, por ejemplo 1-3, 5, 8-. Esta parte no se puede leer:"
  page_out_of_range: "Esa página no existe. Número de páginas de este PDF:"
  too_many_files: Esto crearía más de 500 imágenes. Indica un intervalo de páginas más pequeño, como 1-100, y convierte el resto en otra pasada.
  too_large: "Esta página es demasiado grande con la resolución elegida: un lado superaría los 10 000 píxeles, o tu navegador no puede manejar tantos píxeles. Elige una resolución más baja o deja fuera esta página. Página:"
steps:
  - Elige un archivo PDF de hasta 50 MB.
  - Deja Páginas vacío para convertir todas las páginas, o indica páginas como 1-3, 5, 8-. Las páginas se cuentan desde 1, y 8- llega hasta la última página.
  - Elige el Formato de imagen y la Resolución. 150 DPI se ve nítido en pantalla; 300 DPI es para imprimir y genera cuatro veces más píxeles.
  - Para JPEG y WebP, deja la calidad predeterminada de 85 o indica la tuya. PNG ignora este ajuste.
  - Pulsa Convertir a imágenes y descarga cada imagen o todas juntas en un archivo ZIP.
faq:
  - q: ¿Se sube mi PDF a un servidor?
    a: No. Las páginas se renderizan dentro de tu navegador con PDFium compilado a WebAssembly, así que el archivo nunca sale de tu dispositivo.
  - q: ¿Qué formato debo elegir?
    a: JPEG se abre casi en cualquier sitio y va bien para páginas con fotos. PNG es sin pérdida y mantiene el texto y las líneas más nítidos, pero los archivos son más grandes. WebP da archivos más pequeños que JPEG con una calidad similar y se abre en los navegadores actuales.
  - q: ¿Qué tamaño tendrán las imágenes?
    a: El tamaño en píxeles es el tamaño de la página en puntos multiplicado por la resolución y dividido entre 72. Una página A4 queda en 595 × 842 píxeles a 72 DPI, 1240 × 1754 a 150 DPI y 2480 × 3508 a 300 DPI.
  - q: ¿Puedo convertir solo una página?
    a: Sí. Escribe su número en Páginas, por ejemplo 4. Puedes indicar varias páginas e intervalos, como 1, 3-5; cada página se convierte una vez, en el orden en que las escribes.
  - q: ¿Por qué el fondo es blanco y no transparente?
    a: Cada página se dibuja sobre blanco, como la muestran los lectores de PDF, así que JPEG, PNG y WebP se ven igual. Las zonas transparentes de la página no se conservan.
  - q: ¿Puedo seleccionar o copiar el texto de las imágenes?
    a: No. Las imágenes son una captura de las páginas, así que el texto se convierte en píxeles. Para que el texto siga siendo seleccionable, extrae las páginas como PDF con Dividir PDF.
---

## Cómo funciona la conversión

La herramienta usa PDFium, el motor de PDF de Google Chrome, compilado a WebAssembly. Dibuja cada página elegida sobre un fondo blanco con la resolución seleccionada, incluidas las anotaciones guardadas en el archivo, como resaltados y campos de formulario rellenados, y endereza las páginas configuradas para mostrarse giradas. Después codifica cada página como JPEG o WebP con la calidad elegida, o como PNG sin pérdida. El trabajo se hace en un hilo en segundo plano, así que la página sigue respondiendo.

## Opciones y límites

- **Entrada:** un archivo PDF de hasta 50 MB.
- **Páginas:** páginas sueltas e intervalos separados por comas. Todas las páginas deben existir en el archivo; una página indicada dos veces se convierte una sola vez.
- **Salida:** hasta 500 imágenes por pasada, con el nombre del archivo y el número de página, como report-3.jpg.
- **Resolución:** 72, 150 o 300 DPI. Ningún lado de una imagen puede superar los 10 000 píxeles, así que las páginas muy grandes, como pósteres y planos, necesitan una resolución más baja.
- **Contraseñas:** los archivos que piden contraseña para abrirse no se pueden convertir.
- **Memoria:** el archivo y todas las imágenes se guardan en memoria, así que los documentos largos a 300 DPI pueden fallar en el móvil. Conviértelos en intervalos de páginas más pequeños.

Para conservar las páginas como PDF, usa [Dividir PDF](/es/split-pdf); para cambiar después el formato de las imágenes, usa el [Conversor de imágenes](/es/image-converter).

## Privacidad

Tu documento se procesa solo en tu dispositivo. La página no lo sube, no lo guarda y no usa cookies.
