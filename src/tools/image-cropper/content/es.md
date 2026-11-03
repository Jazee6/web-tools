---
review: draft
updated: 2026-11-03
title: Recortar imágenes – Recorta, gira y voltea JPEG, PNG y WebP gratis
description: "Recorta una imagen a cualquier área o a una relación de aspecto como 1:1 o 16:9, y gírala o voltéala antes. Gratis y privado: todo ocurre en tu navegador."
name: Recortar imágenes
answer: "Elige una imagen, arrastra el marco de recorte o elige una relación de aspecto, gírala o voltéala si hace falta y pulsa Recortar imagen: se recorta en tu dispositivo, en el mismo formato, y descargas el resultado."
action: Recortar imagen
fields:
  file:
    label: Imagen (JPEG, PNG, WebP o AVIF)
  rotate:
    label: Girar en sentido horario
    options:
      "0": Sin girar
      "90": 90°
      "180": 180°
      "270": 270°
  flipHorizontal:
    label: Voltear horizontalmente
  flipVertical:
    label: Voltear verticalmente
  aspect:
    label: Relación de aspecto
    options:
      free: Libre
      "1:1": 1:1 (cuadrado)
      "4:3": 4:3 (horizontal)
      "3:4": 3:4 (vertical)
      "3:2": 3:2 (horizontal)
      "2:3": 2:3 (vertical)
      "16:9": 16:9 (panorámico)
      "9:16": 9:16 (vertical)
  crop:
    label: Área de recorte (x, y, ancho, alto en px)
    placeholder: Toda la imagen, o centrada con la relación
  quality:
    label: Calidad (1–100)
output:
  file:
    label: Imagen recortada
errors:
  decode_failed: No se pudo leer este archivo como imagen. Puede estar dañado. Expórtalo de nuevo e inténtalo otra vez.
  too_large: Tu navegador no puede manejar tantos píxeles. Los navegadores de móviles permiten menos que los de ordenador; prueba con un área de recorte más pequeña o en un ordenador.
  crop_out_of_range: "El área de recorte se sale del borde de la imagen. Mantenla dentro del tamaño de la imagen después de girarla, en píxeles:"
  invalid_crop: "Indica el área de recorte con cuatro números enteros (x, y, ancho y alto), por ejemplo 40, 0, 240, 240. No se pudo leer:"
steps:
  - Elige una imagen JPEG, PNG, WebP o AVIF de hasta 50 MB.
  - Si hace falta, elige cuánto girarla en sentido horario y si quieres voltearla. La vista previa muestra el resultado, y el recorte se mide sobre ella.
  - Elige una relación de aspecto o deja Libre. Arrastra el marco de recorte para moverlo y sus esquinas para cambiar su tamaño, o escribe el área como x, y, ancho, alto.
  - Pulsa Recortar imagen y descarga la imagen recortada.
faq:
  - q: ¿Se suben mis imágenes a un servidor?
    a: No. La imagen se decodifica, se recorta y se vuelve a codificar dentro de tu navegador, así que nunca sale de tu dispositivo.
  - q: ¿Cómo recorto una imagen en forma de cuadrado?
    a: Elige 1:1 (cuadrado) como relación de aspecto. El marco de recorte pasa a ser el cuadrado más grande del centro de la imagen, y puedes arrastrarlo a la parte que quieres conservar antes de pulsar Recortar imagen.
  - q: ¿Cómo cambio entre horizontal y vertical, por ejemplo de 16:9 a 9:16?
    a: Elige la otra relación en la lista o pulsa el botón de cambio que hay bajo la vista previa. Al cambiar la relación de aspecto, el giro o el volteo, el marco de recorte vuelve al área centrada.
  - q: ¿Recortar reduce la calidad?
    a: Los píxeles que conservas se copian uno a uno, sin escalar. Después, JPEG, WebP y AVIF se vuelven a codificar con la calidad que elijas (85 por defecto), lo que añade una pequeña pérdida por compresión; PNG sigue sin pérdida.
  - q: ¿Puedo recortar y redimensionar a la vez?
    a: No en esta herramienta, que mantiene los píxeles recortados a su tamaño. Recorta primero y luego usa [Redimensionar imágenes](/es/image-resizer) para cambiar el ancho y el alto.
  - q: ¿Se conservan los datos EXIF de la foto?
    a: No. La imagen se vuelve a codificar a partir de sus píxeles, así que los datos EXIF, como el modelo de cámara y la ubicación GPS, no aparecen en el resultado. Antes se aplica la orientación EXIF, así que la vista previa y el resultado salen derechos.
---

## Cómo funciona el recorte

La herramienta decodifica la imagen con el decodificador de imágenes integrado en tu navegador, que también aplica la orientación EXIF. Gira la imagen en sentido horario en pasos de 90°, voltea la imagen girada y copia los píxeles del área de recorte en un lienzo (canvas) sin suavizado, de modo que ningún píxel se mezcla ni se desplaza. El recorte se mide sobre la imagen tal como la ves en la vista previa, después de girarla y voltearla. El resultado se vuelve a codificar con versiones WebAssembly de MozJPEG, libwebp y libaom, y la salida PNG pasa por OxiPNG. El trabajo se hace en un hilo en segundo plano.

## Opciones y límites

- **Entrada:** una imagen JPEG, PNG, WebP o AVIF de hasta 50 MB. El formato de salida es siempre el mismo que el de entrada.
- **Área de recorte:** x e y son la esquina superior izquierda, en píxeles enteros, y el área debe quedar dentro de la imagen. Déjala vacía para conservar toda la imagen, o el área centrada más grande con la relación de aspecto elegida. Si escribes un área, la relación de aspecto solo guía el marco de recorte.
- **Girar y voltear:** el giro es de 90°, 180° o 270° en sentido horario; el volteo refleja la imagen girada de izquierda a derecha o de arriba abajo.
- **Calidad:** se aplica a JPEG, WebP y AVIF, con un valor predeterminado de 85. PNG siempre es sin pérdida.
- **Transparencia:** se conserva en PNG, WebP y AVIF.
- **Navegadores:** los navegadores de móviles permiten menos píxeles en total que los de ordenador, así que las imágenes muy grandes pueden detenerse con un mensaje. La codificación AVIF y PNG usa varios hilos cuando el navegador lo permite; los navegadores basados en WebKit, como Safari, usan uno, así que esos formatos tardan más allí.

## Privacidad

Tus imágenes se procesan solo en tu dispositivo. La página no las sube, no las guarda y no usa cookies.
