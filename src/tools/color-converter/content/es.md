---
review: draft
updated: 2026-10-30
title: Conversor de colores – HEX, RGB, HSL, HWB y OKLCH en línea
description: "Convierte un color CSS entre HEX, RGB, HSL, HWB y OKLCH, con alfa. Gratis y privado: funciona en tu navegador y no se sube nada."
name: Conversor de colores
answer: "Pega un color en HEX, RGB, HSL, HWB u OKLCH y pulsa Convertir: el mismo color aparece en los cinco formatos en tu navegador, listo para copiar."
action: Convertir
fields:
  value:
    label: Color
    placeholder: "#ff5733 o rgb(255 87 51) o hsl(11 100% 60%)"
output:
  hex:
    label: HEX
  rgb:
    label: RGB
  hsl:
    label: HSL
  hwb:
    label: HWB
  oklch:
    label: OKLCH
errors:
  invalid_color: "No se puede leer este color. Usa un código hexadecimal como #ff5733 (3, 4, 6 u 8 dígitos) o rgb(), hsl(), hwb() u oklch() con tres valores, por ejemplo rgb(255 87 51) o hsl(11, 100%, 60%). Los nombres de color como red no son compatibles."
steps:
  - "Escribe o pega un color en el campo, por ejemplo #ff5733, rgb(255 87 51), hsl(11 100% 60%), hwb(11 20% 0%) u oklch(0.68 0.21 34)."
  - Pulsa Convertir.
  - "Copia el formato que necesites: HEX, RGB, HSL, HWB u OKLCH."
faq:
  - q: ¿Se sube lo que escribo a un servidor?
    a: No. La conversión se hace por completo en tu navegador, así que lo que escribes nunca sale de tu dispositivo. Incluso puedes usar la página sin conexión una vez cargada.
  - q: ¿Qué formatos de color puedo introducir?
    a: Códigos hexadecimales de 3, 4, 6 u 8 dígitos y las funciones CSS rgb(), rgba(), hsl(), hsla(), hwb() y oklch(). Cada función admite la sintaxis con comas, rgb(255, 87, 51), y la sintaxis con espacios, rgb(255 87 51 / 0.5), donde lo que va tras la barra es el alfa. El tono puede ser un número de grados o llevar las unidades deg, grad, rad o turn.
  - q: ¿Puedo escribir un nombre de color como red?
    a: "No. La herramienta solo lee códigos hexadecimales y las cinco funciones anteriores, así que los nombres de color se rechazan con un error. Usa #ff0000 o rgb(255 0 0)."
  - q: ¿Cómo se trata la transparencia?
    a: El alfa se conserva en todos los resultados. HEX añade un par de dígitos (#ff573380) y los demás formatos añaden un valor tras una barra (rgb(255 87 51 / 0.5)). El alfa se redondea a tres decimales y un color totalmente opaco se escribe sin alfa.
  - q: ¿Por qué el valor convertido difiere un poco del que introduje?
    a: Los canales de RGB y HEX son números enteros de 0 a 255, así que un color dado en HSL, HWB u OKLCH se redondea primero al valor de 8 bits más cercano. Los demás formatos se calculan a partir de ese color redondeado, lo que mantiene coherentes los cinco resultados. Los valores de HSL y HWB muestran hasta un decimal, y la luminosidad y el croma de OKLCH, hasta cuatro.
  - q: ¿Qué pasa con un color OKLCH fuera del gamut sRGB?
    a: OKLCH puede describir colores que una pantalla estándar no puede mostrar. Se ajustan canal por canal a los valores sRGB más cercanos, así que el resultado es un color parecido pero menos vivo que el que introdujiste.
---

## Qué hace esta herramienta de colores

La herramienta convierte tu entrada en un color del espacio de color sRGB y lo escribe en cinco formatos CSS. HSL y HWB se calculan a partir de RGB con las fórmulas de [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/). OKLCH es la forma polar de [Oklab](https://bottosson.github.io/posts/oklab/); la conversión entre sRGB y Oklab usa las matrices publicadas por Björn Ottosson. Los resultados usan la sintaxis CSS moderna con espacios, por ejemplo `rgb(255 87 51)`, `hsl(10.6 100% 60%)` y `oklch(0.6804 0.21 33.7)`.

## Opciones y límites

- **Entrada:** un color cada vez. Se ignoran los espacios al principio y al final, y los nombres de función y los dígitos hexadecimales no distinguen mayúsculas de minúsculas.
- **Formatos compatibles:** hexadecimal de 3, 4, 6 u 8 dígitos, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hwb()` y `oklch()`. No son compatibles los nombres de color, `color()`, `lab()`, `lch()`, `oklab()` ni `var()`.
- **Valores fuera de rango:** los canales RGB, la saturación, la luminosidad, la blancura, la negrura y el alfa se ajustan a su rango válido. El tono da la vuelta, así que `hsl(-120 100% 50%)` es el mismo azul que `hsl(240 100% 50%)`.
- **Precisión:** HEX y RGB son de 8 bits. El tono, la saturación, la luminosidad, la blancura y la negrura muestran hasta un decimal; la luminosidad y el croma de OKLCH, hasta cuatro.
- **Colores grises:** un color sin tono se muestra con tono 0.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda tu entrada y no usa cookies.
