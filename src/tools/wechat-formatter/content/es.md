---
review: reviewed
updated: 2026-11-14
title: Formateador para WeChat – Markdown a artículos de WeChat en línea
description: Escribe tu artículo en Markdown y cópialo como texto enriquecido con el estilo del editor de cuentas oficiales de WeChat. Gratis y privado, en tu navegador.
name: Formateador para WeChat
answer: Escribe o pega tu artículo en Markdown, elige un color de acento y pulsa Copiar texto enriquecido para pegar un artículo con estilo en el editor de cuentas oficiales de WeChat; la vista previa se actualiza mientras escribes.
action: Formatear artículo
fields:
  markdown:
    label: Markdown
    placeholder: "# Título\n\nEscribe tu artículo en **Markdown**…"
  accent:
    label: Color de acento
    options:
      neutral: Neutro
      blue: Azul
      green: Verde
      orange: Naranja
      red: Rojo
      rose: Rosa
      violet: Violeta
      yellow: Amarillo
output:
  html:
    label: Vista previa de WeChat
steps:
  - Escribe o pega tu artículo en el cuadro Markdown. La vista previa de WeChat se actualiza mientras escribes.
  - Elige un Color de acento para la barra del encabezado de nivel 2, los bordes de las citas, el código en línea y los números de referencia.
  - Pulsa Copiar texto enriquecido.
  - Pégalo en el cuerpo de tu artículo en el editor de cuentas oficiales de WeChat.
  - Para usar el artículo en otro editor o plantilla, pulsa Copiar HTML para obtener el código fuente con todos los estilos en línea.
faq:
  - q: ¿Por qué mis enlaces se convierten en números?
    a: El editor de cuentas oficiales de WeChat no permite que los lectores hagan clic en enlaces a otros sitios dentro del cuerpo del artículo. El formateador conserva el texto del enlace, añade detrás un número como [1] y enumera todas las direcciones al final, para que los lectores puedan encontrar la fuente. Los enlaces a artículos de mp.weixin.qq.com siguen siendo clicables.
  - q: ¿Por qué desaparece el formato cuando pego el HTML en el editor?
    a: Copiar HTML pone el código fuente en el portapapeles, y el editor lo muestra como texto sin formato. Para el editor de WeChat usa Copiar texto enriquecido; copia el artículo con formato, igual que cuando copias desde una página web.
  - q: ¿Puedo añadir imágenes de mi computadora?
    a: No. Las imágenes deben ser direcciones web http o https, escritas como ![pie de foto](https://…). El formateador no sube archivos. Una imagen sola en un párrafo se centra y su texto alternativo aparece debajo como pie de foto.
  - q: ¿Qué lenguajes de programación se resaltan?
    a: Cualquier lenguaje que conozca el resaltador Shiki, desde JavaScript y Python hasta SQL y Bash. Escribe el lenguaje después de la valla de apertura, por ejemplo ```python. El código sin lenguaje, o con uno que Shiki no reconoce, se muestra como texto monoespaciado sin resaltar.
  - q: ¿Se guarda mi borrador?
    a: Sí, si tu navegador permite que el sitio guarde datos. El contenido del cuadro Markdown se guarda en este dispositivo poco después de que dejes de escribir y se restaura cuando vuelves, así que espera un momento antes de cerrar la página. El borrador nunca se sube. Si borras los datos locales del sitio, se elimina.
  - q: ¿Puedo escribir HTML dentro del Markdown?
    a: No. Las etiquetas HTML se muestran como texto en lugar de interpretarse, lo que además mantiene segura la vista previa. Usa Markdown para encabezados, listas, enlaces, imágenes y tablas.
---

## Cómo funciona el formateador para WeChat

El editor de cuentas oficiales de WeChat elimina las hojas de estilo y los nombres de clase del contenido pegado, así que todo el formato del artículo se escribe como estilos en línea. El formateador lee tu Markdown con [marked](https://marked.js.org/) y escribe cada encabezado, párrafo, lista, tabla, cita y bloque de código con los estilos tipográficos de este sitio: texto de 16 px, interlineado de 1,75, una paleta neutra y fuentes del sistema, porque el editor no puede cargar fuentes web. Los bloques de código se resaltan con [Shiki](https://shiki.style/) usando los colores de GitHub Light.

## Opciones y límites

- **Markdown:** CommonMark más las tablas, listas de tareas y tachado de GitHub, hasta 200.000 caracteres. Los elementos de las listas de tareas muestran ☑ o ☐ porque el editor elimina las casillas.
- **Color de acento:** neutro, azul, verde, naranja, rojo, rosa, violeta o amarillo. Colorea la barra junto al encabezado de nivel 2, los bordes de las citas, el código en línea, los enlaces de WeChat y los números de referencia; el texto del cuerpo se mantiene casi negro.
- **Enlaces:** los enlaces a mp.weixin.qq.com siguen siendo clicables; los demás enlaces http y https se convierten en referencias numeradas al final del artículo. Los otros enlaces conservan solo su texto.
- **Imágenes:** solo direcciones http y https; de cualquier otra se conserva solo el texto alternativo.
- **Copia:** ambos botones usan el portapapeles del navegador, que en algunos navegadores necesita permiso; Copiar texto enriquecido además requiere un navegador que pueda copiar HTML con formato. Si no se puede copiar, permite el acceso al portapapeles e inténtalo de nuevo.
- **No compatible:** HTML sin procesar (se muestra como texto), fórmulas matemáticas y diagramas.

## Privacidad

Tu artículo se procesa solo en tu dispositivo. La página no lo sube, no lo guarda en un servidor y no usa cookies.
