---
review: draft
updated: 2026-11-03
title: Organizar PDF – Reordenar, girar y eliminar páginas de un PDF
description: "Reordena, gira y elimina las páginas de un PDF viendo una vista previa de cada una. Gratis y privado: todo se hace en tu navegador y el documento nunca se sube."
name: Organizar PDF
answer: Elige un PDF, usa los botones bajo la vista previa de cada página para moverla, girarla o quitarla, y pulsa Organizar PDF. El nuevo PDF se crea en tu dispositivo y está listo para descargar al instante.
action: Organizar PDF
fields:
  file:
    label: Archivo PDF
  pages:
    label: Páginas
    placeholder: 3, 1-2 r90, 5-
output:
  file:
    label: PDF
errors:
  encrypted: "Este PDF está protegido con contraseña. Quita la contraseña e inténtalo de nuevo:"
  invalid_pdf: "No se pudo leer este archivo como PDF. Puede estar dañado. Expórtalo de nuevo e inténtalo otra vez:"
  invalid_pages: "Indica las páginas como números e intervalos separados por comas, con r90, r180 o r270 para girarlas, por ejemplo 3, 1-2 r90, 5-. Esta parte no se puede leer:"
  page_out_of_range: "Esa página no existe. Número de páginas de este PDF:"
steps:
  - Elige un archivo PDF de hasta 50 MB. Debajo de Páginas aparece una vista previa de cada página.
  - Usa las flechas bajo una página para moverla antes o después, el botón de girar para rotarla 90° en sentido horario y la cruz para quitarla.
  - Comprueba el orden en el cuadro Páginas, que se actualiza a medida que editas. También puedes escribir en él directamente, por ejemplo 3, 1-2 r90, 5-.
  - Pulsa Organizar PDF y descarga el archivo.
faq:
  - q: ¿Se sube mi PDF a un servidor?
    a: No. Tanto las vistas previas como el nuevo PDF se crean dentro de tu navegador con PDFium compilado a WebAssembly, así que el documento nunca sale de tu dispositivo.
  - q: ¿Girar una página reduce la calidad?
    a: No. Girar solo cambia el ajuste de rotación de la página, así que el texto sigue siendo seleccionable y las imágenes no se vuelven a comprimir. Al mover y eliminar páginas, se copian tal cual.
  - q: ¿Qué significan los números del cuadro Páginas?
    a: Son las páginas del nuevo PDF, en orden. 3, 1-2 r90, 5- significa la página 3, luego las páginas 1 y 2 giradas 90° en sentido horario y después de la página 5 a la última. Las páginas que no aparecen se eliminan. Deja el cuadro vacío para conservar todas las páginas tal como están.
  - q: ¿Puedo poner la misma página dos veces?
    a: Sí. Escribe su número dos veces en el cuadro Páginas, por ejemplo 1, 2, 1. Cada copia puede tener su propio giro.
  - q: Una página ya estaba de lado. ¿Qué hace el botón de girar?
    a: Cada pulsación añade 90° en sentido horario a la orientación con la que se ve la página ahora, así que la vista previa siempre coincide con el resultado. Al girar una página cuatro veces vuelve a su posición inicial.
  - q: ¿Se conservan los marcadores y los campos de formulario?
    a: Las páginas pasan con su texto e imágenes sin cambios, pero los marcadores no se añaden al archivo nuevo. Los campos de formulario rellenables conservan su contenido, aunque puede que ya no se puedan editar.
---

## Cómo funciona la organización

La herramienta usa PDFium —el motor de PDF de Google Chrome— compilado a WebAssembly. Al elegir un archivo, dibuja una pequeña vista previa de cada página en un hilo en segundo plano, unas pocas páginas cada vez. Al pulsar Organizar PDF, copia las páginas a un documento nuevo en el orden que hayas fijado, aplica el giro de cada página y guarda el resultado. La página sigue respondiendo en todo momento.

## Opciones y límites

- **Entrada:** un archivo PDF de hasta 50 MB.
- **Páginas:** páginas sueltas e intervalos separados por comas, cada uno seguido opcionalmente de r90, r180 o r270 para girarlo en sentido horario. Un intervalo debe ir de una página menor a una mayor, y todas las páginas deben existir en el archivo. Debe quedar al menos una página.
- **Salida:** un PDF con el nombre del original terminado en -organized.
- **Contraseñas:** los archivos que necesitan contraseña para abrirse no se pueden organizar y no muestran vista previa.
- **Memoria:** el archivo se mantiene en memoria mientras editas, así que los documentos muy grandes pueden fallar en el móvil.

Para sacar algunas páginas a archivos separados, usa [Dividir PDF](/es/split-pdf). Para añadir páginas de otros documentos, usa [Unir PDF](/es/merge-pdf).

## Privacidad

Tu documento se procesa solo en tu dispositivo. La página no lo sube, no lo guarda y no usa cookies.
