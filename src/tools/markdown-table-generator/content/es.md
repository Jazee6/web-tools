---
review: reviewed
updated: 2026-11-14
title: Generador de tablas Markdown – CSV y Excel a tabla Markdown online
description: Convierte CSV, celdas copiadas de Excel o Google Sheets o una tabla Markdown desordenada en una tabla Markdown bien alineada. Gratis y privado — funciona en tu navegador.
name: Generador de tablas Markdown
answer: Pega CSV, celdas copiadas de una hoja de cálculo o una tabla Markdown en el cuadro Datos de la tabla; la tabla Markdown alineada aparece al instante. Pulsa Copiar para copiarla.
action: Generar tabla
fields:
  data:
    label: Datos de la tabla
    placeholder: "Name,Role\nAda,Engineer\nGrace,Admiral"
  from:
    label: Formato de entrada
    options:
      auto: Detectar automáticamente
      csv: CSV (separado por comas)
      tsv: TSV (copiado de Excel o Google Sheets)
      markdown: Tabla Markdown
  header:
    label: La primera fila es el encabezado
  align:
    label: Alineación
    options:
      none: Sin definir
      left: Izquierda
      center: Centro
      right: Derecha
  pad:
    label: Rellenar columnas
output:
  markdown:
    label: Tabla Markdown
errors:
  empty: No se encontró ninguna celda. Pega filas de CSV, celdas copiadas de una hoja de cálculo o una tabla Markdown.
steps:
  - Pega tus datos en el cuadro Datos de la tabla — CSV, celdas copiadas de Excel o Google Sheets, o una tabla Markdown.
  - Si la tabla no se ve bien, elige el Formato de entrada correcto.
  - Desactiva La primera fila es el encabezado si tus datos no tienen fila de encabezado.
  - Elige una Alineación si todas las columnas deben alinearse igual.
  - Pulsa Copiar para copiar la tabla Markdown.
faq:
  - q: ¿Cómo convierto un rango de Excel o Google Sheets en una tabla Markdown?
    a: Selecciona las celdas, cópialas y pégalas en el cuadro Datos de la tabla. Las hojas de cálculo copian las celdas como texto separado por tabulaciones (TSV), que el generador detecta por las tabulaciones de la primera línea. Las celdas con saltos de línea o comillas van entre comillas al copiarlas y se leen correctamente.
  - q: ¿Qué pasa con las comas, las comillas y los saltos de línea en un CSV?
    a: El generador sigue el RFC 4180. Un campo entre comillas dobles puede contener comas y saltos de línea, y "" representa una comilla. Un | dentro de una celda se escapa como \| para que no divida la columna, y un salto de línea dentro de una celda se convierte en <br>, porque una fila de tabla Markdown tiene que ocupar una sola línea.
  - q: ¿Puede arreglar una tabla Markdown desordenada?
    a: Sí. Pega la tabla y se reescribe con un espaciado uniforme. Cada columna conserva la alineación de la fila --- salvo que elijas una Alineación para toda la tabla, y el contenido de las celdas, incluidos el código en línea, los enlaces y los \| escapados, se mantiene tal como está.
  - q: ¿Por qué mi tabla tiene una primera fila vacía?
    a: Las tablas Markdown necesitan una fila de encabezado. Si desactivas La primera fila es el encabezado, el generador añade una fila de encabezado vacía para que tu primera fila quede en el cuerpo. Algunos visores muestran esa fila vacía como una franja fina.
  - q: ¿Por qué las columnas no quedan alineadas en mi editor?
    a: Rellenar columnas añade espacios para que todas las celdas de una columna tengan el mismo ancho con una fuente monoespaciada. El ancho se estima carácter por carácter — los caracteres chinos, japoneses y coreanos, los símbolos de ancho completo y los emoji cuentan como dos columnas, como los muestran la mayoría de los editores de código, y el resto como una. En editores con fuente proporcional, o que muestran algunos caracteres con otro ancho, puede seguir viéndose desigual; la tabla renderizada es la misma en ambos casos.
---

## Cómo funciona el generador de tablas Markdown

El generador lee tus datos como CSV según el [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180), como valores separados por tabulaciones o como una [tabla de GitHub Flavored Markdown](https://github.github.com/gfm/#tables-extension-), y escribe una tabla de GitHub Flavored Markdown. Cuando el Formato de entrada está en detección automática, una primera línea que empieza por | o una segunda línea formada por celdas --- indica Markdown, las tabulaciones en la primera línea indican TSV y todo lo demás se lee como CSV. El ancho de las columnas se estima por cada carácter tal como lo ve quien lee, contando los caracteres anchos de Asia oriental y los emoji como dos columnas, así que la mayoría del texto queda alineado en un editor de código.

## Opciones y límites

- **Datos de la tabla:** hasta 200.000 caracteres. Las líneas en blanco se omiten y las filas con menos celdas que la más larga se completan con celdas vacías.
- **CSV:** solo las comas separan campos. Los archivos separados por punto y coma, habituales en algunas versiones europeas de Excel, no se dividen; guárdalos con comas o pega las celdas desde la hoja de cálculo.
- **Alineación:** una misma alineación para todas las columnas, o Sin definir para dejar sin alinear las columnas de CSV y TSV y conservar la alineación de una tabla Markdown.
- **Celdas:** se quitan los espacios al principio y al final. En las celdas de CSV y TSV solo se escapa | y los saltos de línea se convierten en <br>; el Markdown o el HTML que contengan, como **negrita**, se conserva y se muestra.
- **No compatible:** celdas combinadas, alineación por columna para CSV y TSV, y convertir una tabla Markdown de vuelta a CSV.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda tus datos y no usa cookies.
