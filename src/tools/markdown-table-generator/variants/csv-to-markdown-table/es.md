---
review: reviewed
updated: 2026-11-16
title: Conversor de CSV a tabla Markdown – Gratis y online
description: "Pega el contenido de un archivo CSV y obtén una tabla Markdown de GitHub. Admite campos entre comillas con comas, comillas y saltos de línea. Gratis y sin subir nada."
name: CSV a tabla Markdown
answer: Pega el contenido de tu archivo CSV en el cuadro Datos de la tabla; CSV ya está seleccionado, así que la tabla Markdown aparece al instante. Pulsa Copiar para copiarla.
steps:
  - Abre el archivo .csv en un editor de texto, selecciónalo todo y cópialo.
  - Pégalo en el cuadro Datos de la tabla; CSV ya está seleccionado como Formato de entrada.
  - Pulsa Copiar y pega la tabla en tu README, wiki o notas.
faq:
  - q: Mi CSV tiene comas dentro de algunos valores. ¿Se romperán las columnas?
    a: No, si esos valores van entre comillas dobles, como los escriben las hojas de cálculo, las bases de datos y la mayoría de los programas al exportar CSV. "Smith, Ada" sigue siendo una sola celda. Una coma fuera de las comillas siempre empieza una columna nueva.
  - q: Mi archivo usa punto y coma en lugar de comas. ¿Qué hago?
    a: El punto y coma no se trata como separador, así que cada línea acaba en una sola columna. Vuelve a exportar el archivo con comas, o ábrelo en tu hoja de cálculo y copia las celdas; el ajuste predefinido Excel a tabla Markdown las lee directamente.
  - q: ¿Por qué aparece <br> en algunas celdas?
    a: Un campo CSV entre comillas puede ocupar varias líneas, pero una fila de tabla Markdown no. Cada salto de línea dentro de un campo se convierte en <br>, que GitHub y la mayoría de los visores de Markdown muestran como un salto de línea dentro de la celda.
  - q: ¿Puedo convertir un CSV con miles de filas?
    a: Hasta 200 000 caracteres de CSV, que equivalen a unos pocos miles de filas cortas. Una tabla Markdown tan grande es difícil de leer, así que para conjuntos de datos grandes conviene enlazar al archivo CSV.
table:
  caption: Cómo quedan los campos CSV en las celdas de la tabla Markdown
  columns:
    field: Campo en el CSV
    cell: Celda Markdown
    rule: Por qué
  terms:
    quotedComma: Una coma entre comillas se queda en la celda
    doubledQuote: Dos comillas dentro de comillas equivalen a una
    lineBreak: Un salto de línea entre comillas se convierte en <br>
    pipe: "| se escapa para no dividir la columna"
    trimmed: Se quitan los espacios alrededor del valor
    semicolon: El punto y coma no separa campos
---

## Leer CSV como lo define el RFC 4180

El CSV parece sencillo hasta que un valor contiene una coma, una comilla o un salto de línea. El conversor sigue el [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180), el formato que escriben la mayoría de los programas: los campos se separan con comas, un campo entre comillas dobles puede contener comas y saltos de línea, y una comilla dentro de un campo entre comillas se escribe dos veces. Las líneas pueden terminar en CRLF, LF o CR, así que funcionan los archivos de Windows, macOS y Linux.

## Opciones y límites

- **Tamaño del CSV:** hasta 200 000 caracteres.
- **Encabezado:** la primera fila del CSV pasa a ser la fila de encabezado; si desactivas La primera fila es el encabezado, se añade en su lugar una fila de encabezado vacía.
- **Archivos irregulares:** las filas con menos campos que la más larga reciben celdas vacías al final, y las líneas vacías se omiten.
- **Separadores:** solo comas. Este ajuste predefinido no divide archivos separados por punto y coma ni por tabulaciones.
- **Comillas sin cerrar:** un campo al que le falta la comilla de cierre llega hasta el final del archivo; revisa el origen si la última celda se traga varias filas.
- **No compatible:** leer el encabezado de otro archivo, omitir columnas y volver a convertir a CSV.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda tu CSV y no usa cookies.
