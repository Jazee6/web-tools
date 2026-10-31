---
review: draft
updated: 2026-10-31
title: Conversor de mayúsculas y minúsculas – Title Case, camelCase y más
description: "Cambia un texto a mayúsculas, minúsculas o Title Case, o a camelCase, snake_case y otros estilos. Gratis y privado: se procesa en tu navegador."
name: Conversor de mayúsculas y minúsculas
answer: "Pega tu texto, elige un formato como Title Case o snake_case y pulsa Convertir; el texto convertido aparece en tu navegador, listo para copiar."
action: Convertir
fields:
  text:
    label: Texto
    placeholder: Pega o escribe tu texto aquí
  mode:
    label: Formato
    options:
      title: Title Case (mayúscula inicial en cada palabra)
      sentence: Sentence case (mayúscula solo al inicio de la oración)
      upper: MAYÚSCULAS
      lower: minúsculas
      camel: camelCase
      pascal: PascalCase
      snake: snake_case
      kebab: kebab-case
      constant: CONSTANT_CASE
output:
  result:
    label: Resultado
steps:
  - Pega o escribe tu texto en el campo Texto.
  - Elige un Formato; hay Title Case, Sentence case, MAYÚSCULAS, minúsculas, camelCase, PascalCase, snake_case, kebab-case y CONSTANT_CASE.
  - Pulsa Convertir y copia el resultado.
faq:
  - q: ¿Se sube mi texto a un servidor?
    a: No. La conversión se hace por completo en tu navegador, así que tu texto no sale de tu dispositivo. Una vez cargada la página, incluso puedes usarla sin conexión.
  - q: ¿Qué diferencia hay entre Title Case y Sentence case?
    a: Title Case pone en mayúscula la primera letra de cada palabra y deja el resto en minúscula, así que "the cat's hat" pasa a "The Cat's Hat". Sentence case solo pone en mayúscula la primera letra de cada oración y de cada línea y deja todo lo demás en minúscula, así que "THE CAT. IT SLEPT" pasa a "The cat. It slept".
  - q: ¿Title Case deja en minúscula palabras pequeñas como "a" o "of"?
    a: No. Todas las palabras llevan mayúscula inicial, porque la herramienta no tiene una lista de excepciones y las guías de estilo no coinciden en qué palabras omitir. Si tu estilo lo exige, vuelve a poner en minúscula esas pocas palabras a mano.
  - q: ¿Cómo se separan las palabras en camelCase, snake_case y los demás estilos de código?
    a: El texto se corta en los espacios, en la puntuación y en cualquier otro carácter que no sea letra o dígito, y entre una letra minúscula y una mayúscula. Una serie de mayúsculas seguida de una palabra en minúscula se corta antes de su última mayúscula, así que XMLHttpRequest pasa a XML, Http y Request. Los dígitos se quedan con la palabra anterior, por lo que "utf8" es una palabra, mientras que un número al principio de una palabra queda solo. La puntuación se elimina.
  - q: ¿Funciona con varias líneas?
    a: Sí. Los estilos de código convierten cada línea por separado, de modo que cada línea se convierte en un identificador y los saltos de línea quedan donde están. Es útil para convertir una lista de nombres en constantes.
  - q: ¿Funciona con letras con acento y de otros idiomas?
    a: Sí, con todas las escrituras que distinguen mayúsculas y minúsculas, como el latín con acentos, el griego y el cirílico. La ß alemana se convierte en SS en mayúsculas. Las escrituras sin mayúsculas, como el chino y el japonés, no cambian, y los estilos de código tratan una serie continua de ellas como una palabra.
---

## Qué hace este conversor de mayúsculas y minúsculas

Mayúsculas y minúsculas usan la conversión de cadenas estándar del navegador, que sigue las correspondencias de mayúsculas y minúsculas de Unicode y no depende de tu configuración de idioma. Title Case busca cada palabra, una serie de letras y dígitos que puede contener apóstrofos, y pone en mayúscula su primera letra. Sentence case pasa el texto a minúsculas y luego pone en mayúscula la primera letra después de un punto, un signo de exclamación, un signo de interrogación o unos puntos suspensivos (…) seguidos de un espacio, después de `。`, `！` y `？`, y al principio del texto y de cada línea. Los estilos de código separan el texto en palabras como se explica en las preguntas anteriores y las unen con el separador del estilo elegido.

## Opciones y límites

- **Entrada:** un texto cada vez, del tamaño que quepa en tu dispositivo. Un texto vacío no se convierte.
- **Reglas de mayúsculas:** son las mismas para todos los idiomas. La i turca con punto y sin punto no recibe un trato especial, y la herramienta no reconoce nombres propios, siglas ni abreviaturas, así que en Sentence case "Mr." también hace que la palabra siguiente empiece con mayúscula.
- **Sentence case:** un punto dentro de un número o de un dominio, como 3.14 o example.com, no inicia una oración nueva.
- **Estilos de código:** la puntuación se elimina, una línea sin letras ni dígitos queda vacía y un nombre como "iOS" se divide en "i" y "OS".
- **Saltos de línea:** `\n`, `\r\n` y `\r` se conservan tal cual.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda tu texto y no usa cookies.
