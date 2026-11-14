---
review: reviewed
updated: 2026-11-14
title: HTML a Markdown – Convierte HTML y texto enriquecido en Markdown
description: Pega código HTML o copia texto enriquecido de una web, Word o Google Docs y obtén Markdown limpio con tablas. Gratis y privado — funciona en tu navegador.
name: HTML a Markdown
answer: Pega código HTML, o copia texto enriquecido de una página web o un documento y pégalo en el cuadro HTML; el Markdown aparece al instante. Pulsa Copiar para copiarlo.
action: Convertir
fields:
  html:
    label: HTML
    placeholder: "<h1>Title</h1>\n<p>Paste HTML, or copy formatted text from a page and paste it here.</p>"
output:
  markdown:
    label: Markdown
errors:
  empty: No queda nada que convertir. El HTML solo contiene scripts, estilos u otro contenido que se descarta; pega la parte de la página con el texto que quieres.
steps:
  - Pega HTML en el cuadro HTML, o selecciona texto enriquecido en una web, en Word o en Google Docs, cópialo y pégalo en el cuadro.
  - Lee el Markdown que aparece en el cuadro Markdown.
  - Pulsa Copiar para copiar el Markdown.
faq:
  - q: ¿Puedo pegar texto enriquecido en lugar de código HTML?
    a: Sí. Cuando copias de una página web, Word, Google Docs o un correo, el portapapeles también guarda el HTML que hay detrás del formato. Al pegar en el cuadro HTML se inserta ese HTML en lugar del texto sin formato, así que se conservan títulos, enlaces, listas y tablas. Si el portapapeles solo tiene texto sin formato, se pega como siempre.
  - q: ¿Cómo se convierten las tablas?
    a: Toda tabla que tenga celdas se convierte en una tabla Markdown, y su primera fila pasa a ser la fila de encabezado aunque use celdas normales, como ocurre con las tablas copiadas de Word y Google Docs. Un | dentro de una celda se escapa como \|, varios párrafos o saltos de línea en una celda se unen con <br>, y a una celda que ocupa varias columnas le siguen celdas vacías. Se conserva la alineación a la izquierda, al centro o a la derecha definida en las celdas de encabezado.
  - q: ¿Qué se elimina?
    a: <script>, <style>, <noscript>, <iframe>, <template> y el <head> de la página, título incluido. Todo lo demás se convierte, incluidos los menús de navegación y los pies de página, así que pega solo la parte de la página que necesitas.
  - q: ¿Qué estilo de Markdown genera?
    a: "GitHub Flavored Markdown con encabezados #, viñetas -, *cursiva*, **negrita**, bloques de código con vallas ``` que incluyen el lenguaje cuando el elemento code tiene una clase como language-js, enlaces en línea, ~~tachado~~ y elementos de lista de tareas - [x] a partir de casillas. El estilo es fijo, así que el resultado tiene siempre el mismo aspecto."
  - q: ¿Por qué algunos elementos HTML desaparecen sin dejar rastro?
    a: Markdown no tiene sintaxis para colores, fuentes, formularios o diseño, así que solo se conserva su texto. Las imágenes mantienen su dirección y su texto alternativo; una dirección que apunta a un archivo de tu ordenador no funciona en ningún otro sitio.
---

## Cómo funciona el conversor de HTML a Markdown

El conversor lee tu HTML con el propio analizador HTML de tu navegador y lo convierte en Markdown con [Turndown](https://github.com/mixmark-io/turndown), así que el HTML desordenado o incompleto se interpreta igual que lo mostraría tu navegador. Las reglas de GitHub Flavored Markdown para tablas, tachado y listas de tareas son propias de este sitio, de modo que las tablas sin celdas de encabezado se convierten en lugar de quedarse como HTML.

## Opciones y límites

- **Entrada:** fragmentos HTML o páginas completas, hasta 1.000.000 de caracteres.
- **Pegar:** el texto enriquecido se pega como su HTML cuando el portapapeles lo tiene; el texto sin formato se pega sin cambios.
- **Se elimina:** scripts, estilos, noscript, iframes, plantillas y el head de la página. La navegación, las cabeceras y los pies de página se convierten como cualquier otro contenido.
- **Tablas:** la primera fila es siempre la fila de encabezado; una celda que ocupa varias filas no se repite, y una tabla dentro de una celda acaba como texto en esa celda.
- **Listas:** las listas HTML (<ul> y <ol>) se convierten en listas Markdown. Las listas que llegan como párrafos que empiezan por una viñeta o un número, como suele copiarlas Word, siguen siendo párrafos.
- **No compatible:** elegir otro estilo de Markdown, como viñetas *, encabezados setext o enlaces de referencia.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda tu HTML y no usa cookies.
