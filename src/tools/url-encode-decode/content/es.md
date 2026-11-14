---
review: reviewed
updated: 2026-10-29
title: Codificar y decodificar URL – Codificación porcentual de URL online
description: "Codifica texto para una URL o una cadena de consulta, o decodifica secuencias como %20 a texto. Gratis y privado: se procesa en tu navegador y no se sube nada."
name: Codificar y decodificar URL
answer: "Pega tu texto o tu URL, elige Codificar o Decodificar y un ámbito, y pulsa Convertir: el resultado con codificación porcentual o decodificado aparece en tu navegador."
action: Convertir
fields:
  text:
    label: Texto o URL
    placeholder: https://example.com/search?q=café & tea
  mode:
    label: Modo
    options:
      encode: Codificar (texto a %XX)
      decode: Decodificar (%XX a texto)
  scope:
    label: Ámbito
    options:
      component: Componente de URL (valor de consulta, segmento de ruta)
      url: "URL completa (conserva : / ? # & =)"
      form: Datos de formulario (espacios como +)
output:
  result:
    label: Resultado
errors:
  invalid_encoding: No se puede convertir este texto. Al decodificar, busca un % que no vaya seguido de dos dígitos hexadecimales o bytes con codificación porcentual que no sean UTF-8 válido. Al codificar, busca caracteres dañados, como un sustituto suelto.
steps:
  - Pega o escribe en el cuadro de entrada tu texto, tu URL o tu cadena con codificación porcentual.
  - "Elige un modo: Codificar (texto a %XX) o Decodificar (%XX a texto)."
  - "Elige un ámbito. Usa Componente de URL (valor de consulta, segmento de ruta) para un único valor de consulta o segmento de ruta, URL completa (conserva : / ? # & =) para respetar la puntuación propia de la URL, o Datos de formulario (espacios como +) para valores application/x-www-form-urlencoded."
  - Pulsa Convertir y copia el resultado. Si falla, el error explica qué debes revisar.
faq:
  - q: ¿Se sube mi texto a un servidor?
    a: No. La codificación y la decodificación se procesan por completo en tu navegador, así que tu texto nunca sale de tu dispositivo. Incluso puedes usar la página sin conexión una vez cargada.
  - q: ¿Qué diferencia hay entre Componente de URL y URL completa?
    a: "Componente de URL escapa todo salvo letras, dígitos y - _ . ! ~ * ' ( ), así que caracteres como / ? & = # también se escapan. Úsalo para un único valor dentro de una URL. URL completa deja intactos los caracteres que estructuran una URL (: / ? # & = y otros) y solo escapa el resto, de modo que una dirección entera sigue funcionando."
  - q: ¿Cuándo debo usar Datos de formulario?
    a: Úsalo para valores application/x-www-form-urlencoded, el formato de los formularios HTML y de muchas cadenas de consulta. Codifica el espacio como + en lugar de %20 y también escapa ! ' ( ) ~. Al decodificar, el + vuelve a ser un espacio.
  - q: ¿Por qué falla la decodificación con una secuencia %?
    a: Un signo de porcentaje debe ir seguido de exactamente dos dígitos hexadecimales, y los bytes que forman deben ser UTF-8 válido. Se rechaza un % suelto en texto normal, como "100%", o una secuencia truncada, como %E4%B8. Para un signo de porcentaje literal, usa %25.
  - q: ¿Decodificar con URL completa convierte %2F otra vez en una barra?
    a: No. La decodificación con el ámbito URL completa deja tal cual los escapes de caracteres reservados como %2F, %3F y %23, porque convertirlos en separadores reales cambiaría el significado de la URL. Para decodificarlos, usa Componente de URL.
---

## Qué hace esta herramienta de URL

Aplica la codificación porcentual definida en la [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986): el texto se convierte en bytes UTF-8 y cada byte no permitido se escribe como %XX. Los ámbitos Componente de URL y URL completa usan las funciones integradas del navegador `encodeURIComponent` y `encodeURI`; Datos de formulario sigue las reglas del [URL Standard](https://url.spec.whatwg.org/#application/x-www-form-urlencoded). Los resultados coinciden con los que devuelven esas mismas funciones en tu propio JavaScript.

## Opciones y límites

- **Modos:** codificar texto con codificación porcentual o decodificarlo a texto.
- **Ámbitos:** Componente de URL, URL completa o Datos de formulario (espacios como +). El ámbito se aplica en ambos modos.
- **Solo texto:** convierte una cadena cada vez; no divide una URL en partes ni la descarga.
- **Tamaño:** solo lo limita la memoria de tu dispositivo.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda tu texto y no usa cookies.
