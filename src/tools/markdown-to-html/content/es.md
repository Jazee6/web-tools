---
review: reviewed
updated: 2026-11-16
title: Markdown a HTML – Convierte Markdown y previsualiza el HTML online
description: Convierte Markdown en HTML limpio con ID de encabezado, un documento HTML completo opcional y resaltado de sintaxis. Gratis y privado — funciona en tu navegador.
name: Markdown a HTML
answer: Escribe o pega Markdown y el HTML aparece mientras escribes; cambia entre la vista previa y el código HTML y pulsa Copiar HTML para copiar el código.
action: Convertir
fields:
  markdown:
    label: Markdown
    placeholder: "# Title\n\nWrite **Markdown** here…"
  headingIds:
    label: Añadir ID de encabezado
  document:
    label: Documento HTML completo
  highlight:
    label: Resaltado de sintaxis
  theme:
    label: Tema del resaltado
    options:
      github-light: GitHub Light
      github-dark: GitHub Dark
      one-dark-pro: One Dark Pro
      vitesse-light: Vitesse Light
output:
  html:
    label: HTML
steps:
  - Escribe o pega tu Markdown en el cuadro Markdown. El HTML se actualiza mientras escribes.
  - Activa Documento HTML completo si necesitas una página entera en lugar de un fragmento.
  - Activa Resaltado de sintaxis para colorear los bloques de código.
  - Elige un Tema del resaltado.
  - Abre la pestaña HTML para leer el código, o quédate en Vista previa para ver cómo queda.
  - Pulsa Copiar HTML para copiar el código, o Copiar texto enriquecido para pegar el resultado con formato en un editor como Google Docs o Word.
faq:
  - q: ¿Se conserva el HTML que escribo dentro del Markdown?
    a: Sí. El HTML sin procesar, como <details>, <kbd> o un <img> con ancho, pasa al resultado sin cambios, como exige la especificación CommonMark. La vista previa se muestra en un marco aislado sin scripts, así que un <script> de tu Markdown no se ejecuta en esta página. Aun así forma parte del resultado y puede ejecutarse allí donde publiques el HTML, así que convierte solo Markdown de confianza.
  - q: ¿Cómo se crean los ID de encabezado?
    a: Con las reglas que GitHub usa para sus anclas. El texto del encabezado, sin etiquetas Markdown ni HTML, se pasa a minúsculas; se quitan la puntuación, los símbolos y los emoji, salvo los guiones y la puntuación de unión como _; y los espacios pasan a ser guiones. Así, "What's new in v2.0?" se convierte en id="whats-new-in-v20". Se conservan las letras de cualquier alfabeto, por lo que los encabezados en chino o cirílico mantienen su texto. Un encabezado repetido recibe -1, -2, etc., y uno al que no le queda nada, como uno hecho solo de emoji, no recibe ID. Desactiva Añadir ID de encabezado para omitirlos.
  - q: ¿Qué diferencia hay entre un fragmento y un documento HTML completo?
    a: Un fragmento es solo el contenido convertido, listo para pegar en una página, un CMS o una plantilla que ya tiene su propio <head> y sus estilos. Un documento HTML completo añade <!doctype html>, un <head> con un título tomado del primer encabezado 1 que tenga texto ("Document" si no hay ninguno) y una pequeña hoja de estilos predeterminada, para que puedas guardarlo como archivo .html y abrirlo en el navegador.
  - q: ¿Cómo funciona el resaltado de sintaxis?
    a: Los bloques de código que indican un lenguaje tras la valla de apertura, como ```python, se colorean con el resaltador Shiki. Cada color se escribe como estilo en línea, así que el HTML no necesita otra hoja de estilos, aunque los editores que eliminan los estilos en línea también quitan los colores. El código sin lenguaje, o con uno que Shiki no reconoce, queda sin color. El resaltado está desactivado por defecto; entonces los bloques que indican un lenguaje reciben <pre><code class="language-…"> para tu propio resaltador, y los demás un <pre><code> simple.
  - q: ¿Se guarda mi Markdown?
    a: Sí, si tu navegador permite que el sitio guarde datos. El cuadro Markdown se guarda en este dispositivo poco después de que dejes de escribir y se recupera cuando vuelves. Nunca se sube. Si borras los datos locales del sitio, se elimina.
---

## Cómo funciona el conversor de Markdown a HTML

El conversor analiza tu Markdown con [marked](https://marked.js.org/), según [CommonMark](https://commonmark.org/) más las extensiones de GitHub Flavored Markdown para tablas, listas de tareas, tachado y enlaces automáticos. Genera el mismo HTML que marked, añadiendo ID de encabezado al estilo de GitHub y, si lo activas, código resaltado con [Shiki](https://shiki.style/). La conversión se ejecuta en un hilo en segundo plano del navegador, no en la propia página.

## Opciones y límites

- **Markdown:** hasta 200 000 caracteres.
- **HTML sin procesar:** se conserva sin cambios y sin sanear. Los scripts nunca se ejecutan en la vista previa, pero forman parte del resultado.
- **ID de encabezado:** activados por defecto, con las reglas de anclas de GitHub; los encabezados repetidos reciben -1, -2, y los que se quedan vacíos tras aplicarlas no reciben ninguno.
- **Documento HTML completo:** desactivado por defecto; añade un doctype, un título tomado del primer encabezado 1 y una hoja de estilos predeterminada.
- **Resaltado de sintaxis:** desactivado por defecto; GitHub Light, GitHub Dark, One Dark Pro o Vitesse Light, con colores en línea. El tema y la gramática de cada lenguaje se descargan la primera vez que hacen falta, lo que puede tardar un momento; si la descarga falla, por ejemplo sin conexión, los bloques de código quedan sin resaltar.
- **Copiar:** ambos botones usan el portapapeles del navegador, que en algunos navegadores necesita permiso; Copiar texto enriquecido también requiere un navegador que pueda copiar HTML con formato.
- **No compatible:** notas al pie, fórmulas matemáticas y diagramas como Mermaid, que quedan como texto o bloques de código. El front matter YAML no se elimina y se convierte como el resto del Markdown.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube tu Markdown, no lo guarda en un servidor y no usa cookies.
