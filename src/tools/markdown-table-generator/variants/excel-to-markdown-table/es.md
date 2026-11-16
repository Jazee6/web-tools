---
review: reviewed
updated: 2026-11-16
title: Excel a tabla Markdown – Pega celdas de tu hoja de cálculo online
description: Copia celdas de Excel o Google Sheets y pégalas para obtener una tabla Markdown, sin exportar a CSV. Gratis, y tus datos nunca salen de tu dispositivo.
name: Excel a tabla Markdown
answer: Selecciona las celdas en Excel o Google Sheets, cópialas y pégalas en el cuadro Datos de la tabla; TSV ya está seleccionado, así que la tabla Markdown aparece al instante. Pulsa Copiar para copiarla.
steps:
  - En Excel, Google Sheets, Numbers o LibreOffice Calc, selecciona el rango de celdas que necesitas, con la fila de encabezado.
  - Copia las celdas y pégalas en el cuadro Datos de la tabla; TSV ya está seleccionado como Formato de entrada.
  - Pulsa Copiar y pega la tabla en GitHub, GitLab, Notion, Obsidian o cualquier editor Markdown.
faq:
  - q: ¿Tengo que guardar primero la hoja como CSV?
    a: No. Al copiar celdas, la hoja de cálculo las pone en el portapapeles como texto separado por tabulaciones, una fila por línea y una tabulación entre celdas. Ese texto es justo lo que lee este ajuste predefinido, así que basta con copiar y pegar.
  - q: ¿Por qué los números con separador de miles se quedan en una sola celda?
    a: En el texto separado por tabulaciones solo las tabulaciones dividen celdas, así que 1,234.50 o una lista como "red, green" se quedan en una celda. Es la razón principal por la que pegar desde una hoja de cálculo es más fiable que exportar CSV en un idioma que usa la coma como separador decimal.
  - q: ¿Se copian las fórmulas, los colores y las celdas combinadas?
    a: No. El portapapeles guarda los valores que muestran las celdas, así que obtienes el resultado de las fórmulas, no las fórmulas. El formato, como negrita, colores o bordes, no forma parte del texto, y una celda combinada llega como un valor seguido de celdas vacías.
  - q: Una celda con varias líneas me rompió la tabla. ¿Cómo lo arreglo?
    a: Las hojas de cálculo ponen entre comillas dobles las celdas con saltos de línea al copiarlas, y este ajuste predefinido convierte cada salto en <br>. Si un salto de línea sigue partiendo una fila, el programa del que copiaste no puso comillas a la celda; quita los saltos de línea en la hoja y vuelve a copiar.
table:
  caption: Cómo quedan las celdas copiadas de una hoja de cálculo en la tabla Markdown
  columns:
    clipboard: Celda copiada (TSV)
    cell: Celda Markdown
    rule: Por qué
  terms:
    commaKept: Las comas nunca dividen celdas en texto separado por tabulaciones
    lineBreak: Un salto de línea entre comillas se convierte en <br>
    doubledQuote: Dos comillas dentro de comillas equivalen a una
    pipe: "| se escapa para no dividir la columna"
    trimmed: Se quitan los espacios alrededor del valor
---

## Por qué copiar celdas funciona mejor que exportar

Una tabla Markdown necesita texto sin formato, y el portapapeles ya lo tiene. Las hojas de cálculo copian un rango como valores separados por tabulaciones: cada fila en su línea y una tabulación entre celdas. Como las tabulaciones no aparecen dentro de los valores normales, números como 1,234.50, direcciones y listas separadas por comas quedan intactos, algo que una exportación a CSV puede estropear cuando la hoja usa la coma como separador decimal o la exportación usa punto y coma.

## Opciones y límites

- **Tamaño del rango:** hasta 200 000 caracteres de celdas copiadas, suficiente para miles de celdas cortas.
- **Qué se copia:** solo los valores que se muestran, así que define en la hoja el formato de números, las fechas y el redondeo antes de copiar.
- **Filas en blanco:** se omiten; una fila más corta que las demás recibe celdas vacías al final.
- **Números:** elige Derecha como Alineación cuando la tabla sea sobre todo de números, para que queden alineados en la tabla renderizada.
- **No compatible:** fórmulas, formato como negrita o colores, celdas combinadas, imágenes y comentarios.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda las celdas copiadas y no usa cookies.
