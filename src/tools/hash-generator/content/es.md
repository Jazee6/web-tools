---
review: reviewed
updated: 2026-10-30
title: Generador de hash – Genera hashes MD5, SHA-1, SHA-256 y SHA-512 online
description: "Genera el hash MD5, SHA-1, SHA-256, SHA-384 o SHA-512 de cualquier texto en hex o Base64. Gratis y privado: se procesa en tu navegador y no se sube nada."
name: Generador de hash
answer: "Escribe o pega tu texto, elige un algoritmo como SHA-256 y un formato de salida, y pulsa Generar hash: el hash aparece en tu navegador."
action: Generar hash
fields:
  text:
    label: Texto
    placeholder: Texto del que calcular el hash
  algorithm:
    label: Algoritmo
    options:
      md5: MD5
      sha-1: SHA-1
      sha-256: SHA-256
      sha-384: SHA-384
      sha-512: SHA-512
  format:
    label: Formato de salida
    options:
      hex: Hex (minúsculas)
      hex-upper: Hex (mayúsculas)
      base64: Base64
output:
  hash:
    label: Hash
errors: {}
steps:
  - Escribe o pega en el cuadro de entrada el texto del que quieres calcular el hash.
  - Elige un algoritmo. SHA-256 es el predeterminado; MD5 y SHA-1 solo sirven para sumas de comprobación y compatibilidad.
  - "Elige un formato de salida: Hex (minúsculas), Hex (mayúsculas) o Base64."
  - Pulsa Generar hash y copia el resultado.
faq:
  - q: ¿Se sube mi texto a un servidor?
    a: No. El hash se calcula por completo en tu navegador, así que tu texto nunca sale de tu dispositivo. Incluso puedes usar la página sin conexión una vez cargada.
  - q: ¿Qué algoritmo debo usar?
    a: Usa SHA-256 salvo que algo requiera otro. SHA-384 y SHA-512 producen hashes más largos de la misma familia. MD5 y SHA-1 ya no son seguros para usos de seguridad porque un atacante puede generar colisiones, así que resérvalos para sumas de comprobación y compatibilidad con sistemas antiguos.
  - q: ¿Puedo usarlo para calcular el hash de contraseñas?
    a: No. Son hashes rápidos de propósito general, y un hash rápido es fácil de atacar por fuerza bruta. Para almacenar contraseñas, usa en el servidor una función de hash de contraseñas lenta y con sal, como Argon2, scrypt o bcrypt.
  - q: ¿Por qué el hash es distinto del que da otra herramienta?
    a: El hash se calcula a partir de los bytes UTF-8 del texto exactamente tal como lo escribes, así que un salto de línea final, un espacio de más o finales de línea distintos cambian el resultado. Otra herramienta también puede leer el texto con otra codificación.
  - q: ¿Puedo calcular el hash de un archivo?
    a: Con esta herramienta no, porque solo procesa texto.
---

## Qué hace esta herramienta de hash

Convierte tu texto en bytes UTF-8 y calcula el hash de esos bytes. SHA-1, SHA-256, SHA-384 y SHA-512 usan la API Web Crypto integrada en tu navegador, que implementa [FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final). MD5 no forma parte de Web Crypto, así que la página incluye su propia implementación de la [RFC 1321](https://www.rfc-editor.org/rfc/rfc1321), verificada con los vectores de prueba oficiales.

## Opciones y límites

- **Algoritmos:** MD5, SHA-1, SHA-256, SHA-384, SHA-512.
- **Formatos de salida:** hex en minúsculas, hex en mayúsculas o Base64.
- **Solo texto:** no se admiten archivos, y el hash se calcula exactamente sobre el texto que escribes, con espacios y saltos de línea incluidos.
- **No es para contraseñas:** los hashes son rápidos por diseño y no llevan sal, así que no sirven para almacenar contraseñas.
- **Tamaño:** solo lo limita la memoria de tu dispositivo.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda tu texto y no usa cookies.
