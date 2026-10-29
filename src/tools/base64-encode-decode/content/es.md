---
review: reviewed
updated: 2026-10-29
title: Codificar y decodificar Base64 – Convierte texto a Base64 online
description: "Codifica texto a Base64 o decodifica Base64 a texto, con salida segura para URL y UTF-8. Gratis y privado: se procesa en tu navegador y no se sube nada."
name: Codificar y decodificar Base64
answer: "Pega tu texto o tu cadena Base64, elige Codificar o Decodificar y pulsa Convertir: el resultado aparece en tu navegador, con soporte completo para caracteres no ingleses."
action: Convertir
fields:
  text:
    label: Texto o Base64
    placeholder: Hello, 世界!
  mode:
    label: Modo
    options:
      encode: Codificar texto a Base64
      decode: Decodificar Base64 a texto
  urlSafe:
    label: Salida segura para URL (- y _, sin relleno)
output:
  result:
    label: Resultado
errors:
  invalid_base64: Esto no es Base64 válido. Elimina los caracteres que no sean letras, dígitos, + / - _ y = (los espacios y saltos de línea no importan), comprueba que no se haya cortado nada y vuelve a intentarlo.
  invalid_utf8: El Base64 es válido, pero los bytes que contiene no son texto UTF-8. Probablemente sean datos binarios, como una imagen o un archivo, que esta herramienta no puede mostrar como texto.
steps:
  - Pega o escribe en el cuadro de entrada el texto que quieres codificar o la cadena Base64 que quieres decodificar.
  - "Elige un modo: Codificar texto a Base64 o Decodificar Base64 a texto."
  - Al codificar, activa Salida segura para URL (- y _, sin relleno) si el resultado irá en una URL, un nombre de archivo o un JWT.
  - Pulsa Convertir y copia el resultado. Si la decodificación falla, el error te indica si el problema está en el Base64 o en el texto que contiene.
faq:
  - q: ¿Se sube mi texto a un servidor?
    a: No. La codificación y la decodificación se procesan por completo en tu navegador, así que tu texto nunca sale de tu dispositivo. Incluso puedes usar la página sin conexión una vez cargada.
  - q: ¿Funciona con emojis y caracteres no ingleses?
    a: Sí. El texto se convierte a bytes UTF-8 antes de codificarse, y los bytes decodificados se leen como UTF-8, de modo que caracteres como 世界 o 😀 sobreviven a la ida y vuelta.
  - q: ¿Qué es el Base64 seguro para URL?
    a: El Base64 estándar usa + y /, que tienen un significado especial en las URL, además de = como relleno. La variante segura para URL de la RFC 4648 los sustituye por - y _ y elimina el relleno, de modo que el resultado se puede usar en URL, nombres de archivo y JWT sin escapar.
  - q: ¿Por qué al decodificar dice que los bytes no son texto UTF-8?
    a: Base64 puede contener cualquier byte, no solo texto. Si la cadena procede de una imagen, un PDF o datos cifrados, sus bytes no son UTF-8 válido y no se pueden mostrar como texto. Esta herramienta solo decodifica texto.
  - q: ¿Es Base64 una forma de cifrado?
    a: No. Cualquiera puede decodificar Base64 sin clave, así que no oculta nada. Solo convierte bytes en caracteres normales que sobreviven en sistemas pensados para texto, como el correo, JSON y las URL. No lo uses para proteger secretos.
---

## Qué hace esta herramienta de Base64

Al codificar, convierte tu texto en bytes UTF-8 y los escribe con el alfabeto de 64 caracteres definido en la [RFC 4648](https://www.rfc-editor.org/rfc/rfc4648), añadiendo el relleno =. Al decodificar hace lo contrario y lee los bytes como texto UTF-8. La decodificación es tolerante: acepta tanto el alfabeto estándar como el seguro para URL, ignora espacios y saltos de línea, y funciona aunque falte el relleno.

## Opciones y límites

- **Modos:** codificar texto a Base64 o decodificar Base64 a texto.
- **Salida segura para URL:** solo se aplica al codificar; usa - y _ y omite el relleno =. Para decodificar no hace falta ningún ajuste.
- **Solo texto:** no se admiten archivos ni datos binarios. Si el Base64 se decodifica en bytes que no son UTF-8 válido, se rechaza en lugar de mostrar texto ilegible.
- **Tamaño:** solo lo limita la memoria de tu dispositivo.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda tu texto y no usa cookies.
