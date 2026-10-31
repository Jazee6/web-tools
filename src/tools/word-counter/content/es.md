---
review: draft
updated: 2026-10-31
title: Contador de palabras – Cuenta palabras, caracteres y oraciones
description: "Cuenta palabras, caracteres, bytes, líneas, oraciones y párrafos de un texto, también en chino y japonés. Gratis y privado: se procesa en tu navegador."
name: Contador de palabras
answer: Pega tu texto y pulsa Contar; las palabras, los caracteres con y sin espacios, los bytes, las líneas, las oraciones y los párrafos aparecen en tu navegador.
action: Contar
fields:
  text:
    label: Texto
    placeholder: Pega o escribe tu texto aquí
output:
  words:
    label: Palabras
  characters:
    label: Caracteres
  charactersNoSpaces:
    label: Caracteres (sin espacios)
  bytes:
    label: Bytes (UTF-8)
  lines:
    label: Líneas
  sentences:
    label: Oraciones
  paragraphs:
    label: Párrafos
steps:
  - Pega o escribe tu texto en el campo Texto.
  - Pulsa Contar.
  - Lee los números que necesites; hay Palabras, Caracteres, Caracteres (sin espacios), Bytes (UTF-8), Líneas, Oraciones y Párrafos.
faq:
  - q: ¿Se sube mi texto a un servidor?
    a: No. El recuento se hace por completo en tu navegador, así que tu texto no sale de tu dispositivo. Una vez cargada la página, incluso puedes usarla sin conexión.
  - q: ¿Cómo se cuentan las palabras?
    a: Una palabra es cualquier tramo de caracteres entre espacios o saltos de línea que contenga una letra o un dígito, así que "well-known", "don't" y "3.14" cuentan como una palabra cada una, y un guion suelto no cuenta. Los caracteres chinos y los kana y kanji japoneses no llevan espacios entre palabras, por lo que cada uno cuenta como una palabra, igual que en Microsoft Word. El coreano se separa con espacios, así que se cuenta como el inglés.
  - q: ¿Por qué hay menos caracteres que unidades de código en mi texto?
    a: Los caracteres se cuentan como los ve un lector. Un emoji como 😀, un emoji de familia formado por varios emojis unidos o una letra seguida de un acento cuentan como un carácter cada uno, y un salto de línea de Windows (CRLF) cuenta como uno. Los espacios, tabuladores y saltos de línea se incluyen en Caracteres y se dejan fuera de Caracteres (sin espacios).
  - q: ¿Por qué los bytes son distintos de los caracteres?
    a: Los bytes son el tamaño del texto guardado en UTF-8. Las letras inglesas ocupan 1 byte, las letras con acento 2, la mayoría de los caracteres chinos y japoneses 3 y los emojis 4. Es el número que importa para los límites de tamaño de archivo o de campos de bases de datos.
  - q: ¿Cómo cuenta las oraciones la herramienta?
    a: Una oración termina en un punto, un signo de exclamación, un signo de interrogación o unos puntos suspensivos (…) seguidos de un espacio o del final del texto, o en 。, ！ o ？ en chino y japonés. Un número como 3.14 o un dominio como example.com no cierra la oración, pero una abreviatura como "Mr." sí, así que los textos llenos de abreviaturas salen con un recuento alto.
  - q: ¿Qué cuenta como párrafo?
    a: Un bloque de texto separado del siguiente por al menos una línea en blanco; una línea con solo espacios cuenta como en blanco. Líneas cuenta todas las líneas, también las vacías, y un salto de línea al final del texto no añade otra línea.
---

## Qué hace este contador de palabras

La herramienta lee tu texto una sola vez y da siete números. Los caracteres se cuentan como grupos de grafemas, las unidades que un lector ve como un solo carácter, con `Intl.Segmenter` del navegador según el [Anexo n.º 29 del estándar Unicode](https://www.unicode.org/reports/tr29/). Las palabras, oraciones y párrafos siguen reglas fijas que no dependen del navegador ni del idioma, así que el mismo texto da los mismos números en cualquier sitio. Los bytes se miden codificando el texto en UTF-8.

## Opciones y límites

- **Entrada:** un texto cada vez, del tamaño que quepa en tu dispositivo. Un texto vacío no se cuenta.
- **Palabras:** fragmentos separados por espacios que contienen una letra o un dígito. Los caracteres chinos y los kana y kanji japoneses cuentan una palabra cada uno; el tailandés y otras escrituras sin espacios se cuentan como fragmentos separados por espacios, por lo que su número de palabras sale demasiado bajo.
- **Oraciones:** se cuentan a partir de la puntuación, así que abreviaturas como "Mr." o "e.g." cierran una oración, y un texto sin puntuación cuenta como una sola oración.
- **Saltos de línea:** `\n`, `\r\n` y `\r` empiezan una línea nueva.
- **No incluye:** tiempo de lectura, tiempo de locución ni densidad de palabras clave.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda tu texto y no usa cookies.
