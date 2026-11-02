---
review: draft
updated: 2026-11-02
title: Redimensionar imágenes – Cambia el tamaño de JPEG, PNG, WebP y AVIF
description: Cambia el tamaño de tus imágenes a un ancho y alto exactos, gratis. Privado y rápido — todo se procesa en tu navegador, así que tus fotos nunca se suben.
name: Redimensionar imágenes
answer: Elige tus imágenes, indica un ancho, un alto o ambos y pulsa Redimensionar imágenes — se redimensionan en tu dispositivo, con el mismo formato, y descargas los resultados.
action: Redimensionar imágenes
fields:
  files:
    label: Imágenes (JPEG, PNG, WebP o AVIF)
  width:
    label: Ancho (px)
    placeholder: Auto
  height:
    label: Alto (px)
    placeholder: Auto
  fit:
    label: Cuando se indican ambas medidas
    options:
      contain: Ajustar dentro y mantener las proporciones
      cover: Rellenar el tamaño y recortar lo que sobre
      stretch: Estirar al tamaño exacto
  quality:
    label: Calidad (1–100)
output:
  files:
    label: Imágenes redimensionadas
errors:
  decode_failed: "No se pudo leer este archivo como imagen. Puede estar dañado. Expórtalo de nuevo o quítalo e inténtalo otra vez:"
  too_large: "La imagen redimensionada sería demasiado grande: un lado superaría los 10 000 píxeles, o tu navegador no puede manejar tantos píxeles. Indica un tamaño menor e inténtalo de nuevo:"
  size_required: Indica un ancho, un alto o ambos.
steps:
  - Elige hasta 20 imágenes JPEG, PNG, WebP o AVIF, de hasta 50 MB cada una.
  - Indica un ancho, un alto o ambos, en píxeles. Si indicas solo uno, el otro se calcula según las proporciones de cada imagen.
  - Si indicaste ambos, elige cómo debe usar la imagen ese tamaño. Ajustar dentro conserva la imagen completa, Rellenar recorta lo que sobre por igual en ambos lados y Estirar ignora las proporciones.
  - Pulsa Redimensionar imágenes y descarga cada imagen o todas juntas en un archivo ZIP.
faq:
  - q: ¿Se suben mis imágenes a un servidor?
    a: No. Las imágenes se decodifican, se redimensionan y se codifican dentro de tu navegador, así que nunca salen de tu dispositivo.
  - q: ¿Cómo mantengo las proporciones?
    a: Indica solo un ancho o solo un alto, y el otro lado se calcula a partir de las proporciones de cada imagen. Si indicas ambos, deja seleccionado "Ajustar dentro y mantener las proporciones". La imagen cabe entonces en ese tamaño, así que un lado puede quedar más pequeño de lo que indicaste.
  - q: ¿Cómo consigo un tamaño exacto sin deformar la imagen?
    a: Indica un ancho y un alto, y elige "Rellenar el tamaño y recortar lo que sobre". La imagen se escala hasta cubrir el tamaño y lo que sobresale se corta por igual en ambos lados.
  - q: ¿Puedo hacer más grande una imagen?
    a: Sí, hasta 10 000 píxeles por lado. Ampliar solo reparte los píxeles existentes en un área mayor, así que la imagen se ve más borrosa y no gana detalle.
  - q: ¿Puedo redimensionar fotos HEIC del iPhone?
    a: No directamente. Conviértelas primero con el [Conversor de imágenes](/es/image-converter) y luego redimensiona el resultado.
  - q: ¿Se conservan los datos EXIF de la foto?
    a: No. La imagen se vuelve a codificar a partir de sus píxeles, así que los datos EXIF, como el modelo de cámara y la ubicación GPS, no están en el resultado. Antes se aplica a la imagen la orientación EXIF, así que las fotos se siguen viendo derechas.
---

## Cómo funciona el redimensionado

La herramienta decodifica cada imagen con el decodificador de imágenes integrado en tu navegador, que también aplica la orientación EXIF. Dibuja la imagen con el nuevo tamaño en un lienzo (canvas) y reduce las disminuciones grandes por pasos de como máximo la mitad, lo que evita que los detalles finos se vean dentados. El resultado se vuelve a codificar con versiones WebAssembly de MozJPEG, libwebp y libaom, y la salida PNG pasa por OxiPNG. El trabajo se hace en un hilo en segundo plano, una imagen cada vez.

## Opciones y límites

- **Entrada:** de 1 a 20 imágenes JPEG, PNG, WebP o AVIF, de hasta 50 MB cada una. El formato de salida es siempre el mismo que el de entrada.
- **Tamaño:** de 1 a 10 000 píxeles por lado. Los navegadores de móviles pueden permitir menos píxeles en total; en ese caso la herramienta se detiene con un mensaje.
- **Calidad:** se aplica a JPEG, WebP y AVIF, con un valor predeterminado de 85. PNG siempre es sin pérdida.
- **Transparencia:** se conserva en PNG, WebP y AVIF.
- **Navegadores:** la codificación AVIF y PNG usa varios hilos cuando el navegador lo permite; los navegadores basados en WebKit, como Safari, usan uno, así que esos formatos tardan más allí.

## Privacidad

Tus imágenes se procesan solo en tu dispositivo. La página no las sube, no las guarda y no usa cookies.
