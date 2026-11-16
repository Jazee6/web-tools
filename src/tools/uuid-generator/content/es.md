---
review: reviewed
updated: 2026-11-16
title: "Generador de UUID – Genera identificadores UUID v4 aleatorios online"
description: "Genera hasta 1000 identificadores UUID v4 aleatorios por lote, en minúsculas o mayúsculas. Gratis y privado, con generación íntegramente en tu navegador."
name: "Generador de UUID"
answer: "Elige una cantidad y pulsa Generar UUID para crear identificadores UUID v4 aleatorios en tu navegador, uno por línea, listos para copiar."
action: "Generar UUID"
fields:
  count:
    label: "Cantidad"
  uppercase:
    label: "Mayúsculas"
output:
  uuids:
    label: "UUID"
errors: {}
steps:
  - "Establece Cantidad en un número entero de 1 a 1000; el valor predeterminado es 1."
  - "Activa Mayúsculas si lo necesitas; se usan minúsculas de forma predeterminada."
  - "Pulsa Generar UUID y copia el resultado, con un identificador por línea."
faq:
  - q: "¿Qué versión de UUID genera?"
    a: "Solo la versión 4, mediante la API randomUUID criptográficamente segura de la plataforma. No genera UUID basados en tiempo o nombres, como v1, v5 o v7."
  - q: "¿Cuántos UUID puedo generar a la vez?"
    a: "De 1 a 1000 por ejecución. Cada UUID ocupa su propia línea, sin llaves ni prefijo URN."
  - q: "¿Las mayúsculas cambian el UUID?"
    a: "No. Solo cambian las letras hexadecimales, no el valor del identificador. Ambas formas conservan los guiones."
  - q: "¿Se suben o guardan los identificadores generados?"
    a: "No. La generación se realiza en tu dispositivo y la página no sube ni guarda los identificadores generados. Copia los resultados que quieras conservar antes de salir de la página."
---

## Cómo funciona la generación de UUID

Cada identificador procede de la API Web Crypto `crypto.randomUUID()` de la plataforma. El resultado es un UUID v4 con el formato `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`, donde `y` es 8, 9, a o b en minúsculas. Cada pulsación genera un nuevo lote; no hay texto de entrada ni semilla.

## Opciones y límites

- **Cantidad:** un entero de 1 a 1000; el valor predeterminado es 1.
- **Mayúsculas y minúsculas:** minúsculas de forma predeterminada, o mayúsculas con el mismo formato con guiones.
- **No compatible:** versiones de UUID distintas de v4, semillas personalizadas, llaves y prefijos URN.

## Privacidad

La generación se realiza solo en tu dispositivo. La página no sube ni guarda los UUID generados ni usa cookies.
