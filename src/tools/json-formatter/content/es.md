---
review: draft
updated: 2026-10-22
title: Formateador JSON – Formatea, valida y minifica JSON online
description: "Pega JSON para embellecerlo, validarlo, minificarlo u ordenar sus claves. Gratis, instantáneo y privado: los datos se procesan en tu navegador y nunca se suben."
name: Formateador JSON
answer: "Pega tu JSON, elige una sangría y pulsa Formatear JSON: la herramienta lo valida y devuelve JSON bien sangrado o minificado directamente en tu navegador."
action: Formatear JSON
fields:
  json:
    label: JSON
    placeholder: '{"name": "Ada", "langs": ["en", "fr"]}'
  indent:
    label: Sangría
    options:
      "2": 2 espacios
      "4": 4 espacios
      tab: Tabulaciones
      minify: Minificar (una línea)
  sortKeys:
    label: Ordenar claves alfabéticamente
output:
  formatted:
    label: JSON formateado
errors:
  invalid_json: Esto no es JSON válido.
steps:
  - Pega o escribe tu JSON en el cuadro de entrada.
  - "Elige una sangría: 2 espacios, 4 espacios, tabulaciones o Minificar para dejarlo todo en una línea."
  - Si quieres, activa Ordenar claves alfabéticamente para ordenar las claves de cada objeto en todos los niveles.
  - Pulsa Formatear JSON y copia el resultado. Si el JSON no es válido, el error indica qué encontró el analizador y dónde.
faq:
  - q: ¿Se sube mi JSON a un servidor?
    a: No. El formateo se hace por completo en tu navegador con su analizador JSON integrado, así que los datos nunca salen de tu dispositivo. Incluso puedes usar la página sin conexión una vez cargada.
  - q: ¿Qué diferencia hay entre formatear y minificar?
    a: Formatear (embellecer) añade saltos de línea y sangría para que las personas puedan leer la estructura. Minificar elimina todos los espacios opcionales y produce el JSON válido más pequeño para almacenarlo o transferirlo. En ambos casos los datos son exactamente los mismos.
  - q: ¿Ordenar las claves cambia mis datos?
    a: Solo cambia el orden de las claves dentro de los objetos; los valores, el anidamiento y el orden de los arrays se mantienen. Los objetos JSON no tienen orden por definición, así que el resultado ordenado es equivalente y facilita mucho comparar dos documentos.
  - q: ¿Por qué dice el formateador que mi JSON no es válido?
    a: Las causas habituales son comas finales, comillas simples en lugar de dobles, claves sin comillas, comentarios y valores como NaN o undefined. Están permitidos en JavaScript, pero no en JSON. El mensaje de error muestra qué rechazó el analizador y dónde.
  - q: ¿Se conservan con exactitud los números muy grandes?
    a: Los números se analizan como coma flotante estándar de 64 bits, así que los enteros mayores que 9.007.199.254.740.991 pueden perder precisión. Si trabajas con identificadores grandes, guárdalos como cadenas.
---

## Qué hace este formateador JSON

Analiza tu entrada con el mismo analizador JSON estricto que usan los navegadores, así que todo lo que acepta es JSON válido según la [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259). La entrada válida se vuelve a serializar con la sangría que elijas; la no válida se rechaza con el mensaje de error del analizador en lugar de "corregirse" en silencio.

## Opciones y límites

- **Sangría:** 2 espacios, 4 espacios, tabulaciones o minificado en una sola línea.
- **Ordenar claves:** de forma recursiva y alfabética por punto de código; el orden de los arrays nunca cambia.
- **Tamaño:** solo lo limita la memoria de tu dispositivo. Entradas de varios megabytes se formatean en menos de un segundo en un portátil normal.
- **No compatible:** extensiones de JSON5 o JSONC como comentarios y comas finales; elimínalas antes.

## Privacidad

Todo ocurre en tu dispositivo. La página no envía tu JSON a ningún sitio, no lo guarda y no usa cookies.
