---
review: reviewed
updated: 2026-11-16
title: Generador de códigos QR – Códigos QR online con logotipo y colores
description: "Convierte un enlace o texto en un código QR PNG o SVG, con tus colores, el tamaño que quieras y un logotipo en el centro. Gratis y privado: funciona en tu navegador."
name: Generador de códigos QR
answer: Escribe o pega un enlace o un texto y el código QR aparece mientras escribes; elige PNG o SVG, el tamaño, los colores y un logotipo opcional, y pulsa Descargar para guardar la imagen.
action: Generar código QR
fields:
  text:
    label: Texto o URL
    placeholder: https://example.com/
  format:
    label: Formato
    options:
      png: PNG
      svg: SVG
  size:
    label: Tamaño (píxeles)
  errorCorrection:
    label: Corrección de errores
    options:
      L: L – aprox. 7 %
      M: M – aprox. 15 %
      Q: Q – aprox. 25 %
      H: H – aprox. 30 %
  margin:
    label: Margen (módulos)
  foreground:
    label: Color de primer plano
  background:
    label: Color de fondo
  logo:
    label: Logotipo (PNG, JPEG o WebP, opcional)
output:
  file:
    label: Código QR
errors:
  too_long: El texto es demasiado largo para un código QR con este nivel de corrección de errores. Acórtalo o elige un nivel más bajo; L es el que admite más contenido.
  too_long_high: El texto es demasiado largo para un código QR con el nivel de corrección de errores H. Acórtalo o elige un nivel más bajo. Con un logotipo siempre se usa el nivel H, así que quita primero el logotipo para usar un nivel más bajo.
  too_small: Este tamaño es demasiado pequeño para tanto texto; cada módulo ocuparía menos de un píxel. Elige un tamaño mayor o acorta el texto.
  logo_decode_failed: No se pudo leer este archivo como imagen. Puede estar dañado o tu navegador no puede decodificar su formato. Expórtalo de nuevo como PNG y vuelve a intentarlo.
steps:
  - Escribe o pega un enlace o cualquier texto en Texto o URL. El código QR se actualiza mientras escribes.
  - Elige el Formato, el Tamaño (píxeles), la Corrección de errores y el Margen (módulos) que necesites.
  - Si quieres, cambia el Color de primer plano y el Color de fondo, o añade un Logotipo (PNG, JPEG o WebP, opcional) para el centro.
  - Escanea el código QR con tu teléfono para comprobar que funciona.
  - Pulsa Descargar para guardar la imagen.
faq:
  - q: ¿Los códigos QR caducan?
    a: No. El texto se guarda en el propio dibujo, así que el código funciona mientras el enlace o el texto que contiene sigan siendo válidos. No pasa por ningún servicio de redirección y no hay límite de escaneos ni seguimiento.
  - q: ¿Descargo PNG o SVG?
    a: PNG es una imagen normal del tamaño que elijas, para documentos, presentaciones y sitios web. SVG es una imagen vectorial que se mantiene nítida a cualquier tamaño, ideal para imprenta y programas de diseño. Algunas aplicaciones no abren archivos SVG; para ellas, usa PNG.
  - q: ¿Qué nivel de corrección de errores elijo?
    a: M, el predeterminado, sirve para la mayoría de los usos. Un nivel más alto permite leer el código aunque una parte esté sucia, dañada o tapada, pero el dibujo es más denso para el mismo texto. Los porcentajes indican qué parte de los datos del código se puede recuperar, no garantizan que cualquier zona tapada se pueda leer. L admite más texto y da los módulos más grandes, lo que ayuda en códigos impresos pequeños. Con un logotipo siempre se usa H.
  - q: ¿Mi código QR funcionará con un logotipo?
    a: Debería. El logotipo cubre aproximadamente una cuarta parte del ancho del código en el centro, y el nivel de corrección de errores H puede recuperar hasta aproximadamente el 30 % de los datos del código. Escanea el resultado con uno o dos teléfonos antes de imprimirlo, sobre todo si el texto es largo o los colores son claros.
  - q: ¿Puedo usar cualquier color?
    a: "Funciona cualquier color #RRGGBB, pero los lectores necesitan un buen contraste. Usa un primer plano oscuro sobre un fondo claro; los módulos claros sobre fondo oscuro, o dos colores parecidos, puede que no se lean en todas las aplicaciones."
  - q: ¿Cuánto texto cabe en un código QR?
    a: Depende de los caracteres y del nivel de corrección de errores. Con el nivel L, un código admite hasta 7089 dígitos, 4296 letras mayúsculas y dígitos, 2953 bytes de otro texto o unos 984 caracteres chinos o japoneses. Con el nivel H cabe menos de la mitad.
---

## Cómo se crea el código QR

El texto se codifica con [uqr](https://github.com/unjs/uqr), un codificador de códigos QR de código abierto que sigue la norma ISO/IEC 18004. Elige la versión de código QR más pequeña (de 1 a 40) que admite el texto con el nivel de corrección de errores elegido. El texto formado solo por dígitos usa el modo numérico; el formado solo por letras mayúsculas, dígitos, espacios y $%*+-./: usa el modo alfanumérico, y el resto se guarda como bytes UTF-8. Después, el dibujo se genera en un hilo en segundo plano: como PNG, con cada borde de módulo en un píxel entero para que no haya bordes grises borrosos, o como SVG, con un único trazado para todos los módulos oscuros.

## Opciones y límites

- **Texto:** hasta 7089 caracteres, y en la práctica limitado por lo que cabe en un código QR: con el nivel L, 2953 bytes de texto como una URL; con el nivel H, 1273 bytes.
- **Formatos:** PNG o SVG. El SVG tiene el mismo ancho y alto que el PNG y puedes escalarlo sin perder nitidez.
- **Tamaño:** de 128 a 4096 píxeles para toda la imagen, margen incluido. El predeterminado es 512. Cada módulo necesita al menos un píxel, así que un texto largo con un tamaño pequeño se rechaza.
- **Margen:** de 0 a 16 módulos de color de fondo alrededor del código; el valor predeterminado de 4 es la zona de silencio que pide la norma. Sin margen, puede que un lector no encuentre el código sobre un fondo recargado.
- **Corrección de errores:** L, M, Q o H pueden recuperar aproximadamente el 7 %, 15 %, 25 % o 30 % de los datos del código. El predeterminado es M.
- **Colores:** cualquier color #RRGGBB de primer plano y de fondo.
- **Logotipo:** una imagen PNG, JPEG o WebP opcional de hasta 5 MB. Se coloca sobre un cuadrado del color de fondo que ocupa aproximadamente el 24 % del ancho del código, y se usa el nivel H. En un SVG, el logotipo se incrusta como copia del archivo original.
- **Navegadores:** el PNG se dibuja con OffscreenCanvas en un hilo en segundo plano, y el logotipo se lee con el decodificador de imágenes de tu navegador. Las versiones actuales de los principales navegadores admiten ambas cosas; un navegador antiguo puede no generar la imagen.
- **No incluido:** la herramienta solo crea códigos QR estándar. No admite módulos redondeados, degradados ni otros tipos de códigos de barras.

## Privacidad

Tu texto y tu logotipo se procesan solo en tu dispositivo. La página no los sube, no los guarda y no usa cookies.
