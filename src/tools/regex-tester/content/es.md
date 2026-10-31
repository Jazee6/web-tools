---
review: draft
updated: 2026-10-31
title: Probador de expresiones regulares – Prueba regex de JavaScript
description: "Prueba una expresión regular de JavaScript con tu texto y lista cada coincidencia con su posición y sus grupos de captura. Gratis y privado: se procesa en tu navegador."
name: Probador de expresiones regulares
answer: Escribe un patrón y un texto, mantén o cambia los indicadores y pulsa Probar; cada coincidencia aparece con su posición y sus grupos de captura en tu navegador.
action: Probar
fields:
  pattern:
    label: Patrón
    placeholder: '(\d{4})-(\d{2})-(\d{2})'
  flags:
    label: Indicadores
    placeholder: gi
  text:
    label: Texto
    placeholder: Pega aquí el texto en el que buscar
output:
  count:
    label: Coincidencias encontradas
  matches:
    label: Coincidencias
    columns:
      index: Posición
      match: Coincidencia
      groups: Grupos
errors:
  invalid_pattern: Este patrón no es una expresión regular válida de JavaScript. Revisa que los corchetes y paréntesis estén equilibrados, que no haya un cuantificador sin nada delante, que no sobre una barra invertida y que los indicadores se puedan combinar; u y v, por ejemplo, no.
  invalid_flags: Estos indicadores no son válidos. Usa solo d, g, i, m, s, u, v e y, cada uno como máximo una vez.
  text_too_long: El texto supera los 100.000 caracteres. Prueba el patrón con una muestra más corta.
steps:
  - Escribe la expresión regular en Patrón, sin las barras que la rodean.
  - Mantén los Indicadores como están (g encuentra todas las coincidencias) o cámbialos, por ejemplo a gi para ignorar mayúsculas y minúsculas.
  - Pega el texto en Texto y pulsa Probar.
  - Lee el número de coincidencias y, en la tabla, cada coincidencia con su posición y el texto capturado por cada grupo.
faq:
  - q: ¿Se sube mi texto a un servidor?
    a: No. El patrón se ejecuta por completo en tu navegador, así que ni el patrón ni tu texto salen de tu dispositivo. Una vez cargada la página, incluso puedes usarla sin conexión.
  - q: ¿Qué sintaxis de expresiones regulares usa?
    a: La del motor de JavaScript de tu navegador, definida por el estándar ECMAScript. Incluye aserciones de anticipación y de retroceso, grupos con nombre y, con el indicador u o v, escapes de propiedades Unicode como \p{L}. No es igual que PCRE, Python o Java, así que funciones como los cuantificadores posesivos o los indicadores en línea como (?i) pueden no funcionar.
  - q: ¿Qué significan los indicadores?
    a: g encuentra todas las coincidencias y no solo la primera, i ignora mayúsculas y minúsculas, m hace que ^ y $ valgan en cada línea, s deja que el punto coincida con los saltos de línea, u y v activan el modo Unicode (usa uno de los dos, no ambos), y solo coincide en la posición exacta donde empieza la búsqueda y d registra los índices de los grupos. Cada indicador se puede usar una vez.
  - q: ¿Por qué solo veo una coincidencia?
    a: Sin el indicador g, una expresión regular de JavaScript se detiene en la primera coincidencia, y esta herramienta también. Añade g en Indicadores para listar todas las coincidencias.
  - q: ¿Qué muestra la columna Grupos?
    a: El texto capturado por cada grupo entre paréntesis, en formato JSON. Un patrón con grupos normales da una lista en orden, como ["2024","02","29"]. Un patrón con grupos con nombre da un objeto, como {"year":"2024"}. Un grupo que no participó en la coincidencia aparece como null, y la columna queda vacía si el patrón no tiene grupos.
  - q: ¿Por qué la página se queda colgada con algunos patrones?
    a: Algunos patrones con repeticiones anidadas, como (a+)+$, tardan exponencialmente más cuanto más largo es el texto, y un navegador no puede detener una expresión regular a mitad de su ejecución. Si la pestaña deja de responder, ciérrala o recárgala y simplifica el patrón.
---

## Qué hace este probador de expresiones regulares

La herramienta construye una expresión regular a partir de tu patrón y tus indicadores con el `RegExp` del propio navegador y la ejecuta una vez sobre tu texto. Con el indicador g reúne todas las coincidencias con `matchAll`; sin él toma la primera, igual que `RegExp.prototype.exec`. De cada coincidencia informa de la posición (empezando en 0), el texto coincidente y los grupos capturados. La sintaxis y el comportamiento son los de tu navegador, descritos en la [guía de expresiones regulares de MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_expressions).

## Opciones y límites

- **Entrada:** un patrón de hasta 1.000 caracteres y un texto de hasta 100.000 caracteres. Ninguno puede estar vacío.
- **Tamaño del resultado:** el recuento incluye todas las coincidencias, pero la tabla muestra solo las 200 primeras.
- **Posición:** se cuenta en unidades de código UTF-16, como JavaScript cuenta los índices de las cadenas, así que un emoji ocupa dos posiciones.
- **Diferencias entre navegadores:** el indicador v y algo de sintaxis más reciente solo funcionan en navegadores actuales. Un patrón que un navegador rechaza por inválido puede ser aceptado por otro.
- **No incluye:** reemplazar texto, dividir texto ni explicar el patrón.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda tu patrón ni tu texto y no usa cookies.
