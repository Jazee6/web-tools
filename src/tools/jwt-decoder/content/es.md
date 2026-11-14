---
review: reviewed
updated: 2026-10-29
title: Decodificador de JWT – Decodifica el encabezado y los claims
description: "Decodifica un JWT y lee su encabezado, claims y firma, con exp, nbf e iat en hora UTC. Gratis y privado: se procesa en tu navegador y no se sube nada."
name: Decodificador de JWT
answer: "Pega tu JSON Web Token y pulsa Decodificar: el encabezado, los claims de la carga útil y la firma aparecen en tu navegador, con exp, nbf e iat convertidos a UTC. La firma no se verifica."
action: Decodificar
fields:
  token:
    label: JWT
    placeholder: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature
output:
  header:
    label: Encabezado
  payload:
    label: Carga útil
  signature:
    label: Firma (sin verificar)
  times:
    label: Claims de tiempo (UTC)
    columns:
      claim: Claim
      time: Hora
errors:
  invalid_token: Este no es un JWT válido. Un token tiene tres partes separadas por puntos, cada una escrita en base64url (solo letras, dígitos, - y _, sin relleno =) y que se decodifica como texto UTF-8. Vuelve a copiar el token completo y quita las comillas o los saltos de línea que tenga dentro.
  invalid_json: El encabezado o la carga útil no es un objeto JSON. Un JWT lleva su encabezado y sus claims como objetos JSON; comprueba que el token no se haya cortado ni alterado al copiarlo.
  encrypted_token: Este token tiene cinco partes, así que es un JWT cifrado (JWE) y su contenido no se puede leer sin la clave de descifrado. Aquí solo se pueden decodificar tokens firmados de tres partes.
steps:
  - Copia el token y pégalo en el cuadro de entrada. Si empieza por "Bearer " de una cabecera Authorization, se quita automáticamente.
  - Pulsa Decodificar.
  - Lee el encabezado (el algoritmo y el tipo de token) y la carga útil (los claims); si el token tiene claims exp, nbf o iat, verás también esos momentos convertidos a UTC.
  - Trata el resultado como no verificado. Decodificar solo lee el token; no demuestra quién lo emitió.
faq:
  - q: ¿Se sube mi token a un servidor?
    a: No. El token se decodifica por completo en tu navegador, así que nunca sale de tu dispositivo. Incluso puedes usar la página sin conexión una vez cargada. Aun así, evita pegar tokens válidos de sistemas en producción en sitios web en los que no confíes.
  - q: ¿Esta herramienta verifica la firma?
    a: No. Solo decodifica las tres partes, y la firma se muestra tal como aparece en el token. Cualquiera puede crear un token con los claims que quiera, así que verifica la firma con la clave del emisor en tu propio código antes de confiar en un token.
  - q: ¿Qué significan exp, nbf e iat?
    a: Son claims de tiempo registrados en la RFC 7519, escritos en segundos desde el 1970-01-01 UTC. exp es cuándo caduca el token, nbf (not before) es cuándo empieza a ser válido e iat (issued at) es cuándo se creó. La tabla convierte cada uno a una hora UTC legible, pero no indica si el token ha caducado ahora.
  - q: ¿Por qué da error un token de cinco partes?
    a: Un token de cinco partes es un JWT cifrado (JWE). Su carga útil está cifrada, así que no hay nada que leer sin la clave de descifrado. Los JWT firmados (JWS) tienen tres partes.
  - q: ¿Puede decodificar un token con la firma vacía?
    a: Sí. Un token sin proteger (con "alg":"none") termina en un punto y tiene la firma vacía. Se decodifica con normalidad, pero nada protege sus claims, así que nunca confíes en él para controlar accesos.
---

## Qué hace esta herramienta de JWT

Un JSON Web Token ([RFC 7519](https://www.rfc-editor.org/rfc/rfc7519)) son tres partes codificadas en base64url unidas por puntos: un encabezado con el algoritmo de firma, una carga útil con los claims y una firma. El decodificador divide el token, decodifica el encabezado y la carga útil de base64url a UTF-8 y los muestra como JSON con sangría. Entre los claims, `iat`, `nbf` y `exp` son fechas numéricas, así que también se listan como horas UTC.

## Opciones y límites

- **Solo decodifica:** nunca se comprueba la firma, y la herramienta no obtiene claves ni compara el token con la hora actual.
- **Tokens firmados:** se pueden decodificar tokens de tres partes, incluidos los que no están firmados y tienen la firma vacía. Los tokens cifrados de cinco partes (JWE) se rechazan.
- **Formato estricto:** el encabezado y la carga útil deben ser objetos JSON. No se aceptan los caracteres del Base64 estándar (+, / y =) en lugar de base64url.
- **Números grandes:** los valores de los claims se muestran como números de JavaScript, así que los enteros mayores que 9.007.199.254.740.991 pueden perder precisión.
- **Tamaño:** solo lo limita la memoria de tu dispositivo.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda tu token y no usa cookies.
