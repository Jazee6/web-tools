---
review: reviewed
updated: 2026-11-16
title: Lector de códigos QR – Escanea códigos QR y de barras online
description: "Lee códigos QR y de barras de una captura de pantalla, una foto o tu cámara y copia lo que dicen. Gratis y privado: el escaneo se hace en tu navegador."
name: Lector de códigos QR
answer: Elige una imagen con un código QR o de barras, o pulsa Usar la cámara y apúntala al código; el texto decodificado aparece al instante con el tipo de código, listo para copiar.
action: Escanear
fields:
  file:
    label: Imagen (JPEG, PNG, WebP, GIF, BMP o AVIF)
output:
  codes:
    label: Códigos encontrados
    columns:
      text: Contenido
      format: Tipo
errors:
  decode_failed: No se pudo leer este archivo como imagen. Puede estar dañado o tu navegador no puede decodificar su formato. Expórtalo de nuevo como JPEG o PNG y vuelve a intentarlo.
  too_large: Puede que esta imagen tenga más píxeles de los que tu navegador puede manejar. Los navegadores de los teléfonos admiten menos que los de los ordenadores; prueba con una imagen más pequeña o con un ordenador.
  not_found: No se encontró ningún código QR ni de barras en esta imagen. Asegúrate de que el código se vea entero, nítido y no demasiado pequeño, o recorta la imagen al código y vuelve a intentarlo.
steps:
  - Elige una imagen en Imagen (JPEG, PNG, WebP, GIF, BMP o AVIF), como una captura de pantalla o una foto de un código. La imagen se escanea en cuanto la eliges.
  - O pulsa Usar la cámara, permite el acceso a la cámara y pon el código delante de ella. La cámara se apaga en cuanto se lee un código.
  - Revisa el Contenido y el Tipo de cada código encontrado y copia el texto que necesites.
faq:
  - q: ¿Es seguro abrir el enlace de un código QR?
    a: Revísalo primero. La herramienta solo muestra el texto guardado en el código y nunca abre enlaces por sí sola, así que puedes ver adónde lleva un enlace antes de visitarlo. Ten cuidado con los enlaces acortados y con las direcciones que imitan un sitio conocido.
  - q: ¿También lee códigos de barras?
    a: Sí. Además de códigos QR, lee Micro QR, rMQR, Data Matrix, Aztec, PDF417 y MaxiCode, y códigos de barras como EAN-13, EAN-8, UPC-A, UPC-E, Code 39, Code 93, Code 128, Codabar, ITF y DataBar. La columna Tipo indica de qué clase es cada código.
  - q: ¿Qué pasa si hay varios códigos en una imagen?
    a: Se muestran todos, cada uno con su contenido y su tipo, hasta 255 códigos por imagen.
  - q: ¿Por qué no funciona la cámara?
    a: Tu navegador tiene que permitir que la página use la cámara; si lo bloqueaste, permite el acceso a la cámara en la configuración del sitio y pulsa Usar la cámara otra vez. El botón no está disponible en navegadores sin compatibilidad con cámara. Siempre puedes hacer una foto o una captura de pantalla del código y elegirla como imagen.
  - q: ¿Por qué no se encontró ningún código?
    a: Puede que el código esté borroso, sea demasiado pequeño, esté cortado en el borde de la imagen o tenga poco contraste. Usa una imagen más nítida, recórtala al código o acerca la cámara. También se prueban los códigos con módulos claros sobre fondo oscuro.
---

## Cómo funciona el escaneo

La imagen se decodifica con el decodificador de imágenes integrado en tu navegador y se analiza con [zxing-cpp](https://github.com/zxing-cpp/zxing-cpp), una biblioteca de códigos de barras de código abierto compilada a WebAssembly y ejecutada en un hilo en segundo plano. Busca todos los tipos de código admitidos a la vez, prueba también códigos girados, reflejados e invertidos, y devuelve el texto decodificado de cada código que puede leer por completo. En el modo cámara, los fotogramas de la cámara se reducen a 1280 píxeles como máximo en el lado más largo y se escanean uno tras otro; el primer fotograma con un código se guarda como imagen y se muestran sus códigos.

## Opciones y límites

- **Entrada:** una imagen JPEG, PNG, WebP, GIF, BMP o AVIF de hasta 20 MB, o la cámara. De un GIF animado solo se escanea el primer fotograma. Las imágenes HEIC no son compatibles; conviértelas antes con el [Conversor de imágenes](/es/image-converter).
- **Salida:** una tabla con el texto y el tipo de cada código encontrado, hasta 255 por imagen. El contenido binario que no es texto puede no mostrarse correctamente.
- **Tipos de código:** QR Code, Micro QR, rMQR, Data Matrix, Aztec, PDF417, MaxiCode, EAN-13, EAN-8, UPC-A, UPC-E, Code 39, Code 93, Code 128, Codabar, ITF, DataBar y otros compatibles con zxing-cpp.
- **Cámara:** pide la cámara trasera cuando la hay y se detiene tras el primer escaneo correcto; pulsa Usar la cámara otra vez para escanear otro código. Necesita un navegador compatible con cámara y tu permiso.
- **Navegadores:** JPEG, PNG, GIF y BMP funcionan en todos los navegadores actuales; AVIF funciona donde el navegador lo admite.
- **Descarga:** el escáner en WebAssembly, de unos 950 KB, se descarga la primera vez que escaneas.

## Privacidad

Tus imágenes y los fotogramas de la cámara se procesan solo en tu dispositivo. La página no los sube, no los guarda y no usa cookies.
