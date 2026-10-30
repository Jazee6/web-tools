---
review: reviewed
updated: 2026-10-30
title: Conversor de marcas de tiempo – Convierte Unix a fecha y fecha a Unix
description: "Convierte una marca de tiempo Unix en fecha, o una fecha en segundos Unix, en cualquier zona horaria. Gratis y privado: se procesa en tu navegador y no se sube nada."
name: Conversor de marcas de tiempo
answer: Escribe una marca de tiempo Unix o una fecha, elige una zona horaria y pulsa Convertir; los segundos y milisegundos Unix, la hora UTC y la hora de tu zona aparecen en tu navegador.
action: Convertir
fields:
  value:
    label: Marca de tiempo o fecha
    placeholder: 1700000000 o 2024-02-29 12:30:00+08:00
  unit:
    label: Unidad de la marca de tiempo
    options:
      auto: Detectar automáticamente
      seconds: Segundos
      milliseconds: Milisegundos
  timezone:
    label: Zona horaria
    placeholder: Asia/Shanghai
output:
  seconds:
    label: Tiempo Unix (segundos)
  milliseconds:
    label: Tiempo Unix (milisegundos)
  utc:
    label: Hora UTC
  zoned:
    label: Hora en la zona horaria elegida
errors:
  invalid_value: La herramienta no puede leer esta marca de tiempo o fecha. Escribe dígitos como 1700000000, o una fecha como 2024-02-29, 2024-02-29 12:30:00 o 2024-02-29T12:30:00+08:00. El mes, el día, la hora, los minutos y los segundos deben ser valores reales (no existe 2023-02-29 ni 24:00).
  invalid_timezone: No se reconoce esta zona horaria. Usa un nombre IANA como Asia/Shanghai, America/New_York o Europe/Berlin, o UTC.
  out_of_range: Este instante queda fuera del rango admitido, de los años 0001 a 9999. Revisa el número o cambia la unidad entre segundos y milisegundos.
steps:
  - Escribe o pega en el primer campo una marca de tiempo Unix (por ejemplo, 1700000000) o una fecha (por ejemplo, 2024-02-29 12:30:00+08:00).
  - Si el valor es un número, deja la Unidad de la marca de tiempo en Detectar automáticamente o elige Segundos o Milisegundos.
  - Escribe la zona horaria en la que quieres ver el resultado, como Asia/Shanghai. UTC es el valor predeterminado.
  - Pulsa Convertir y copia el valor que necesites.
faq:
  - q: ¿Se sube lo que escribo a un servidor?
    a: No. La conversión se hace por completo en tu navegador, así que lo que escribes nunca sale de tu dispositivo. Incluso puedes usar la página sin conexión una vez cargada.
  - q: ¿Mi marca de tiempo está en segundos o en milisegundos?
    a: Una marca de tiempo Unix actual tiene 10 dígitos en segundos (1700000000) y 13 dígitos en milisegundos (1700000000000). Detectar automáticamente interpreta como milisegundos los valores de 100.000.000.000 o más, y como segundos los menores. Por eso los valores en milisegundos anteriores al 1973-03-03 parecen segundos; para esos, elige Milisegundos tú mismo.
  - q: ¿En qué zona horaria está una fecha sin desfase?
    a: En UTC. Una fecha como 2024-02-29 12:30:00 no tiene zona, así que se lee como UTC en lugar de deducirla de tu dispositivo. Para convertir una hora local, añade su desfase, por ejemplo 2024-02-29 12:30:00+08:00, o usa Z para UTC.
  - q: ¿Qué cambia el campo Zona horaria?
    a: Solo el último resultado. Los segundos y milisegundos Unix y la hora UTC no cambian; el resultado con zona horaria muestra ese mismo instante como hora local con el desfase de la zona en esa fecha, de modo que el horario de verano se aplica donde la zona lo tenga.
  - q: ¿Se admiten marcas de tiempo negativas y fracciones?
    a: Sí. Un número negativo es un instante anterior al 1970-01-01 UTC, y 1700000000.5 es medio segundo después de 1700000000. El resultado en segundos se redondea hacia abajo a un segundo entero.
  - q: ¿Por qué falla una marca de tiempo muy grande?
    a: Los resultados se limitan a los años 0001 a 9999 para que la salida ISO 8601 conserve años de cuatro dígitos. Un valor fuera de ese rango, como una marca de tiempo en milisegundos con Segundos como unidad, se rechaza con un error de fuera de rango.
---

## Qué hace esta herramienta de marcas de tiempo

El tiempo Unix cuenta los segundos desde el 1970-01-01 00:00:00 UTC, sin contar los segundos intercalares. La herramienta convierte tu entrada a ese instante y lo escribe como segundos Unix, milisegundos Unix, una hora UTC en [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) y una hora ISO 8601 con el desfase de la zona horaria elegida. Las fechas se leen con los formatos `YYYY-MM-DD`, `YYYY-MM-DD HH:MM[:SS[.fff]]` o `YYYY-MM-DDTHH:MM[:SS[.fff]]`, seguidos de una `Z` o un desfase opcional como `+08:00`. Los desfases de las zonas horarias salen de los datos de zonas horarias integrados en tu navegador, a través de `Intl.DateTimeFormat`.

## Opciones y límites

- **Entrada:** una marca de tiempo o una fecha cada vez. Las fechas se comprueban con el calendario, incluidos los años bisiestos. Las fracciones de segundo más allá de los milisegundos se descartan en las fechas y se redondean en los números.
- **Unidad:** solo se aplica a los números. Detectar automáticamente pasa de segundos a milisegundos en 100.000.000.000.
- **Rango:** instantes desde 0001-01-01T00:00:00Z hasta 9999-12-31T23:59:59.999Z.
- **Zonas horarias:** nombres IANA como Asia/Shanghai, o UTC. Los desfases de fechas pasadas siguen los datos de zonas horarias integrados en tu navegador.
- **Sin hora actual:** la herramienta no lee tu reloj ni compara el resultado con el momento presente.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda tu entrada y no usa cookies.
