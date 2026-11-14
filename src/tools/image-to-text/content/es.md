---
review: reviewed
updated: 2026-11-14
title: Imagen a texto – Extrae texto de fotos y capturas (OCR) online
description: "Copia el texto de una foto, captura o escaneo en español, inglés, chino, japonés y otros idiomas con alfabeto latino. Gratis y privado: el OCR se ejecuta en tu navegador."
name: Imagen a texto
answer: "Elige una imagen y pulsa Extraer texto para que los modelos de IA lean el texto impreso en tu dispositivo, y copia el texto plano sin tener que elegir antes el idioma."
action: Extraer texto
fields:
  file:
    label: Imagen (HEIC, JPEG, PNG, WebP o AVIF)
output:
  text:
    label: Texto extraído
errors:
  decode_failed: No se pudo leer este archivo como imagen. Puede estar dañado, o tu navegador no puede decodificar su formato. Vuelve a exportarlo como JPEG o PNG e inténtalo de nuevo.
  too_large: "Puede que esta imagen tenga más píxeles de los que tu navegador puede manejar. Los navegadores de móvil admiten menos que los de ordenador; prueba con una imagen más pequeña o con un ordenador."
  no_text: No se encontró texto en esta imagen. Comprueba que el texto sea nítido y lo bastante grande, o recorta la imagen a la parte con texto e inténtalo de nuevo.
steps:
  - "Elige una imagen con texto impreso en Imagen (HEIC, JPEG, PNG, WebP o AVIF), de hasta 50 MB."
  - "Pulsa Extraer texto. La primera vez se descargan los modelos de IA y ONNX Runtime (unos 60 MB), y se guardan en tu navegador si hay espacio."
  - "Copia el texto extraído. El texto encontrado se agrupa en líneas, y una línea en blanco marca un hueco mayor, como un nuevo párrafo."
faq:
  - q: ¿Se suben mis imágenes a un servidor?
    a: "No. La imagen se decodifica y se lee dentro de tu navegador, así que nunca sale de tu dispositivo. Solo se descargan los modelos de IA y los archivos que los ejecutan."
  - q: ¿Qué idiomas puede leer?
    a: Chino (simplificado y tradicional), japonés e idiomas escritos con el alfabeto latino, como español, inglés, portugués, alemán y francés, incluidas las letras con tilde. No eliges el idioma, y una misma imagen puede mezclarlos. No puede leer coreano ni las escrituras cirílica, árabe, hebrea, tailandesa o devanagari.
  - q: ¿Funciona con fotos hechas con el móvil?
    a: "Sí. El detector de texto encuentra líneas en fotos además de en capturas y escaneos, también si están inclinadas. Para un mejor resultado, usa una foto nítida en la que el texto sea grande y plano, y revisa el resultado antes de usarlo."
  - q: ¿Puede leer texto escrito a mano?
    a: "No está pensada para eso. La herramienta está pensada para texto impreso, así que la letra manuscrita puede leerse mal; revisa bien el resultado."
  - q: ¿Conserva el diseño, las tablas o el formato?
    a: No. Obtienes texto plano en orden de lectura, de arriba abajo y de izquierda a derecha. La negrita, las fuentes y las celdas de tabla no se conservan, y en una página con varias columnas, las líneas que están a la misma altura se unen entre columnas.
  - q: ¿Por qué la primera vez es más lenta?
    a: "La herramienta descarga primero dos modelos PP-OCRv6 y ONNX Runtime, unos 60 MB en total, y los guarda en tu navegador si hay espacio. Las siguientes veces puede usar la copia guardada mientras tu navegador la conserve. Después, el tiempo depende de la cantidad de texto, porque cada línea se lee por separado."
---

## Cómo funciona la extracción de texto

La herramienta decodifica la imagen con el decodificador integrado de tu navegador, o con una versión WebAssembly de libheif para HEIC, y ejecuta dos modelos de código abierto de PP-OCRv6, de PaddleOCR (licencia Apache-2.0), con ONNX Runtime en un hilo en segundo plano. El modelo de detección marca dónde hay texto; cada zona se convierte en un recuadro, que puede estar inclinado. Después, el modelo de reconocimiento lee cada recuadro, línea a línea: el recuadro se recorta de la imagen a resolución completa y se redimensiona a 48 píxeles de alto (las líneas muy largas se comprimen a un máximo de 3.200 píxeles de ancho), y las líneas se ordenan para la lectura: de arriba abajo y, dentro de una línea, de izquierda a derecha.

## Opciones y límites

- **Entrada:** una imagen HEIC, JPEG, PNG, WebP o AVIF, de hasta 50 MB. Las zonas transparentes se tratan como blancas.
- **Salida:** texto plano, agrupado en líneas según su altura en la imagen, con una línea en blanco donde el hueco entre dos líneas es mayor que una línea de texto.
- **Idiomas:** chino (simplificado y tradicional), japonés, inglés y otros idiomas con alfabeto latino, sin tener que elegir el idioma. No se admiten el coreano ni las escrituras cirílica, árabe, hebrea, tailandesa o devanagari.
- **Orientación:** el texto inclinado se endereza, y una línea cuya altura sea al menos 1,5 veces su anchura se gira 90° en sentido antihorario antes de leerla; la escritura vertical puede leerse mal. El texto boca abajo no se corrige y puede leerse mal.
- **Diseño:** no se conservan las columnas, las tablas ni el formato.
- **Tamaño:** para buscar el texto, la imagen se reduce hasta que su lado mayor mide como mucho 2.048 píxeles; el texto muy pequeño de una imagen grande puede pasarse por alto, así que recórtala antes al texto. Se examinan como máximo 1.000 zonas candidatas, así que en una imagen muy recargada puede quedar texto sin leer.
- **Navegadores:** JPEG, PNG, WebP y AVIF los decodifica tu navegador, así que funcionan donde el navegador los admite; HEIC usa libheif. Los modelos se ejecutan en la CPU, con varios hilos cuando el navegador lo permite.
- **Descarga:** unos 60 MB la primera vez (dos modelos de 10 MB y 21 MB, más ONNX Runtime, que comparten las demás herramientas de IA del sitio).

## Privacidad

Tus imágenes se procesan solo en tu dispositivo. La página no las sube, no las guarda y no usa cookies.
