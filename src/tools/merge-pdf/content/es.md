---
review: reviewed
updated: 2026-10-29
title: Unir PDF – Combina archivos PDF en línea gratis
description: "Combina varios archivos PDF en uno, en el orden que elijas. Gratis y privado: la unión se hace en tu navegador, así que tus documentos nunca se suben."
name: Unir PDF
answer: Añade dos o más archivos PDF, ordénalos como quieras y pulsa Unir PDF. Las páginas se combinan en tu dispositivo en un solo PDF que puedes descargar al instante.
action: Unir PDF
fields:
  files:
    label: Archivos PDF
output:
  file:
    label: PDF unido
errors:
  encrypted: "Este PDF está protegido con contraseña. Quita la contraseña e inténtalo de nuevo:"
  invalid_pdf: "No se pudo leer este archivo como PDF. Puede estar dañado. Expórtalo de nuevo o quítalo de la lista y vuelve a intentarlo:"
steps:
  - "Elige los archivos PDF que quieres combinar: entre 2 y 20 archivos, de hasta 50 MB cada uno. Puedes añadirlos en varias tandas."
  - Usa las flechas arriba y abajo para ordenar los archivos, o quita uno que hayas añadido por error.
  - Pulsa Unir PDF. Primero van todas las páginas del primer archivo, luego las del siguiente, y así sucesivamente.
  - Descarga el PDF unido.
faq:
  - q: ¿Se suben mis archivos PDF a un servidor?
    a: No. Los archivos se leen y se combinan dentro de tu navegador con PDFium compilado a WebAssembly, así que nunca salen de tu dispositivo.
  - q: ¿Puedo cambiar el orden de los archivos?
    a: Sí. La lista muestra los archivos en el orden en que se unirán. Sube o baja un archivo con los botones de flecha antes de pulsar Unir PDF.
  - q: ¿Puedo unir PDF protegidos con contraseña?
    a: No si hace falta una contraseña para abrir el archivo. Ábrelo en un lector de PDF, guarda una copia sin contraseña y añade esa copia.
  - q: ¿Unir PDF reduce la calidad?
    a: "No. Las páginas se copian tal cual: el texto sigue siendo seleccionable y las imágenes no se vuelven a comprimir, así que el archivo unido se ve exactamente como los originales."
  - q: ¿Se conservan los marcadores y los campos de formulario?
    a: Las páginas pasan con su texto e imágenes sin cambios, pero los marcadores de los archivos originales no se añaden al PDF unido. Los campos de formulario rellenables conservan su contenido, aunque puede que ya no se puedan editar.
---

## Cómo funciona la unión

La herramienta usa PDFium, el motor de PDF de Google Chrome, compilado a WebAssembly. Abre cada archivo, copia todas sus páginas a un documento nuevo en el orden de tu lista y guarda el resultado. El trabajo se hace en un hilo en segundo plano, así que la página sigue respondiendo mientras se unen archivos grandes.

## Límites

- **Archivos:** de 2 a 20 archivos PDF por unión, de hasta 50 MB cada uno.
- **Solo archivos completos:** se incluyen todas las páginas de cada archivo. Para dejar fuera algunas páginas, divide u organiza el PDF primero.
- **Contraseñas:** los archivos que necesitan contraseña para abrirse no se pueden unir.
- **Memoria:** todos los archivos se mantienen en memoria durante la unión, así que unir archivos muy grandes puede fallar en móviles.

## Privacidad

Tus documentos se procesan solo en tu dispositivo. La página no los sube, no los guarda y no usa cookies.
