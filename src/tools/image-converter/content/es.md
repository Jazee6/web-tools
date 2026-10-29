---
review: draft
updated: 2026-10-29
title: Conversor de imágenes – HEIC, JPEG, PNG, WebP y AVIF en línea
description: "Convierte fotos HEIC del iPhone, o imágenes JPEG, PNG, WebP y AVIF, a JPEG, PNG, WebP o AVIF. Gratis y privado: se procesa en tu navegador y no se sube nada."
name: Conversor de imágenes
answer: "Elige una imagen, selecciona el formato de salida y pulsa Convertir imagen: el archivo HEIC, JPEG, PNG, WebP o AVIF se recodifica en tu dispositivo y después descargas la copia convertida."
action: Convertir imagen
fields:
  file:
    label: Imagen (HEIC, JPEG, PNG, WebP o AVIF)
  format:
    label: Convertir a
    options:
      jpeg: JPEG (se abre en todas partes)
      png: PNG (sin pérdida, conserva la transparencia)
      webp: WebP (pequeño, navegadores modernos)
      avif: AVIF (el más pequeño, más lento)
  quality:
    label: Calidad (1–100)
output:
  file:
    label: Imagen convertida
errors:
  decode_failed: No se pudo leer esta imagen. Puede estar dañada, usar una variante de HEIC que el decodificador no admite o tener un formato que tu navegador no puede decodificar. Prueba con otra copia de la imagen o abre la página en la última versión de Chrome, Firefox o Safari.
steps:
  - Elige una imagen HEIC, JPEG, PNG, WebP o AVIF de hasta 50 MB.
  - Elige el formato de salida. JPEG se abre casi en todas partes; PNG es sin pérdida y conserva la transparencia; WebP y AVIF dan archivos más pequeños.
  - Deja la calidad predeterminada de 85 o ajústala tú. Los valores bajos dan archivos más pequeños con artefactos más visibles. PNG ignora este ajuste.
  - Pulsa Convertir imagen y descarga el archivo convertido. Las imágenes grandes, y sobre todo la salida en AVIF, pueden tardar varios segundos.
faq:
  - q: ¿Se suben mis imágenes a un servidor?
    a: No. La imagen se decodifica y se recodifica dentro de tu navegador con WebAssembly, así que nunca sale de tu dispositivo. Incluso puedes usar la página sin conexión una vez cargada.
  - q: ¿Cómo convierto una foto HEIC del iPhone a JPG?
    a: Elige el archivo .heic, deja seleccionado JPEG y pulsa Convertir imagen. La propia página decodifica los archivos HEIC, así que funciona en navegadores que no pueden abrir HEIC, como Chrome y Firefox. La primera conversión de HEIC descarga un decodificador de unos 2 MB.
  - q: ¿Puedo convertir a HEIC?
    a: No. Los navegadores no tienen un codificador de HEIC, por lo que HEIC solo se puede usar como entrada. Los formatos de salida son JPEG, PNG, WebP y AVIF.
  - q: ¿Qué formato de salida debo elegir?
    a: JPEG es la opción más segura para compartir e imprimir. PNG es lo mejor para capturas de pantalla, logotipos y cualquier imagen con transparencia. WebP y AVIF generan archivos más pequeños para sitios web, pero algunas aplicaciones antiguas no pueden abrirlos.
  - q: ¿Qué pasa con las zonas transparentes?
    a: PNG, WebP y AVIF conservan la transparencia. JPEG no tiene transparencia, así que los píxeles transparentes se rellenan de blanco.
  - q: ¿Se conservan los metadatos de la foto?
    a: No. Los metadatos, como los datos EXIF de la cámara y la ubicación GPS, no se copian al archivo convertido, lo que además protege tu privacidad. Tampoco se conservan los perfiles de color incrustados, así que las fotos de gama amplia, como las imágenes Display P3 del iPhone, pueden verse algo menos saturadas.
---

## Cómo funciona la conversión

Los archivos HEIC y HEIF se decodifican con [libheif](https://github.com/strukturag/libheif), compilado a WebAssembly y cargado solo cuando eliges uno de esos archivos. Los archivos JPEG, PNG, WebP y AVIF los decodifica tu navegador. Después, los píxeles se recodifican con MozJPEG, libwebp o libaom (los códecs que usa Squoosh, de Google) o, en el caso de PNG, con el codificador PNG del navegador seguido de una optimización sin pérdida con OxiPNG. Todo esto se ejecuta en un hilo en segundo plano, por lo que la página sigue respondiendo.

## Opciones y límites

- **Formatos de entrada:** HEIC, HEIF, JPEG, PNG, WebP y AVIF. No se aceptan otros formatos, como GIF, SVG o BMP.
- **Formatos de salida:** JPEG, PNG, WebP o AVIF. La salida tiene las mismas dimensiones en píxeles que la entrada.
- **Tamaño:** hasta 50 MB por imagen. Las imágenes muy grandes necesitan mucha memoria y pueden fallar en el móvil.
- **Cantidad:** una imagen cada vez.
- **Animación e imágenes múltiples:** solo se convierte la primera imagen o el primer fotograma, así que los archivos WebP y AVIF animados, y los archivos HEIC que contienen varias imágenes, dan una única imagen fija.
- **Calidad:** se aplica a JPEG, WebP y AVIF; la salida PNG siempre es sin pérdida.
- **Navegadores:** HEIC funciona en todos los navegadores compatibles. En los demás formatos de entrada, tu navegador decodifica la imagen primero, por lo que un formato que no puede mostrar, como AVIF en un navegador antiguo, se rechaza.

## Privacidad

Tu imagen se procesa únicamente en tu dispositivo. La página no la sube ni la guarda y no usa cookies.
