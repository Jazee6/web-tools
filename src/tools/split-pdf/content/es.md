---
review: draft
updated: 2026-11-03
title: Dividir PDF – Extrae páginas o divide un PDF en línea gratis
description: Divide un PDF en varios archivos o extrae las páginas que necesitas. Gratis y privado — todo se hace en tu navegador, así que tu documento nunca se sube.
name: Dividir PDF
answer: Elige un PDF, indica las páginas que quieres — por ejemplo 1-3, 5, 8- — y pulsa Dividir PDF. Cada intervalo se convierte en su propio archivo en tu dispositivo, o deja las páginas vacías para dividir todas.
action: Dividir PDF
fields:
  file:
    label: Archivo PDF
  pages:
    label: Páginas
    placeholder: 1-3, 5, 8-
  mode:
    label: Salida
    options:
      separate: Un PDF por intervalo
      combined: Todas las páginas indicadas en un PDF
output:
  files:
    label: Archivos PDF
errors:
  encrypted: "Este PDF está protegido con contraseña. Quita la contraseña e inténtalo de nuevo:"
  invalid_pdf: "No se pudo leer este archivo como PDF. Puede estar dañado. Expórtalo de nuevo e inténtalo otra vez:"
  invalid_pages: "Indica las páginas como números e intervalos separados por comas, por ejemplo 1-3, 5, 8-. Esta parte no se puede leer:"
  page_out_of_range: "Esa página no existe. Número de páginas de este PDF:"
  pages_required: Indica las páginas que irán en el PDF, por ejemplo 1-3, 5.
  too_many_files: Esto crearía más de 500 archivos. Indica menos intervalos o usa intervalos más grandes, como 1-100, 101-200.
steps:
  - Elige un archivo PDF de hasta 50 MB.
  - Indica las páginas, por ejemplo 1-3, 5, 8-. Las páginas se cuentan desde 1 y 8- llega hasta la última página. Deja Páginas vacío para dividir todas las páginas.
  - En Salida, elige Un PDF por intervalo para obtener un archivo distinto por cada parte entre comas, o Todas las páginas indicadas en un PDF para extraerlas en un único archivo.
  - Pulsa Dividir PDF y descarga cada archivo o todos juntos en un archivo ZIP.
faq:
  - q: ¿Se sube mi PDF a un servidor?
    a: No. El archivo se lee y se divide dentro de tu navegador con PDFium compilado a WebAssembly, así que nunca sale de tu dispositivo.
  - q: ¿Cómo extraigo solo unas pocas páginas?
    a: Indícalas en Páginas, por ejemplo 2, 5-7, y elige Todas las páginas indicadas en un PDF. Obtienes un archivo con esas páginas.
  - q: ¿Cómo divido un PDF en páginas sueltas?
    a: Deja Páginas vacío, mantén seleccionado Un PDF por intervalo y pulsa Dividir PDF. Cada página se convierte en su propio archivo. Los archivos por ejecución están limitados a 500, así que para documentos más largos usa intervalos.
  - q: ¿Puedo reordenar o repetir páginas?
    a: Sí, cuando las pones en un solo PDF. Las páginas salen en el orden en que las escribes, así que 5, 1-2, 1 da la página 5, las páginas 1 y 2, y después otra vez la página 1.
  - q: ¿Dividir reduce la calidad?
    a: No. Las páginas se copian tal cual — el texto sigue siendo seleccionable y las imágenes no se vuelven a comprimir.
  - q: ¿Se conservan los marcadores y los campos de formulario?
    a: Las páginas pasan con su texto e imágenes sin cambios, pero los marcadores no se añaden a los archivos nuevos. Los campos de formulario rellenables conservan su contenido, aunque puede que ya no se puedan editar.
---

## Cómo funciona la división

La herramienta usa PDFium — el motor de PDF de Google Chrome — compilado a WebAssembly. Abre tu archivo, copia las páginas que pediste a un documento nuevo por cada archivo de salida y guarda el resultado. El trabajo se hace en un hilo en segundo plano, así que la página sigue respondiendo.

## Opciones y límites

- **Entrada:** un archivo PDF de hasta 50 MB.
- **Páginas:** páginas sueltas e intervalos separados por comas. Un intervalo debe ir de una página menor a otra mayor, y todas las páginas deben existir en el archivo.
- **Salida:** hasta 500 archivos PDF por ejecución.
- **Contraseñas:** los archivos que necesitan contraseña para abrirse no se pueden dividir.
- **Tamaño del archivo:** cada archivo puede contener recursos compartidos por todo el documento, como las fuentes, así que las partes juntas pueden ocupar más que el original.
- **Memoria:** el archivo y todos los resultados se mantienen en memoria, así que los documentos muy grandes pueden fallar en móviles.

Para volver a combinar las partes, o para unir otros documentos, usa [Unir PDF](/es/merge-pdf).

Para reordenar, girar o eliminar páginas dentro de un mismo documento, usa [Organizar PDF](/es/organize-pdf).

## Privacidad

Tu documento se procesa solo en tu dispositivo. La página no lo sube, no lo guarda y no usa cookies.
