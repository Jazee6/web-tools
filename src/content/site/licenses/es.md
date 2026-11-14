---
review: reviewed
updated: 2026-11-09
title: "Licencias de terceros – Software, modelos y fuentes"
description: "Consulta licencias y enlaces al código fuente del software, modelos y fuentes de Web Tools, incluidas las condiciones propias de libheif y LAME."
name: "Licencias de terceros"
---

La lista siguiente se genera automáticamente al compilar el sitio, a partir del código, los modelos y las fuentes de terceros incluidos. Las versiones de los paquetes se leen durante la compilación. Los textos completos de las licencias se ofrecen en inglés, con enlaces al código fuente de los componentes LGPL y MPL.

Este inventario es informativo, no es asesoramiento jurídico ni prueba del cumplimiento completo de las licencias. Algunas dependencias nativas incorporadas y las condiciones de las conversiones de modelos siguen en revisión.

## Componentes con condiciones propias

- **PDFium:** la capa de integración usa MIT; el aviso de PDFium incluido contiene condiciones de tipo BSD y el texto Apache-2.0, junto con avisos de las bibliotecas incorporadas.
- **jSquash:** sus bibliotecas de procesamiento tienen licencias propias, además de las condiciones Apache-2.0 de sus capas de integración.
- **libheif y libde265:** usan LGPL-3.0 y se integran en JavaScript. Sus condiciones incluyen derechos de modificación y sustitución de los componentes cubiertos.
- **LAME:** el codificador MP3 usa GNU Library GPL versión 2 o posterior, por separado de MPL-2.0, que se aplica a Mediabunny y su capa de integración MP3. El codificador también se integra en JavaScript.

Para libheif, libde265 y LAME, aún no ofrecemos un mecanismo para sustituir o volver a enlazar los componentes incorporados. Los requisitos LGPL correspondientes siguen siendo un asunto pendiente antes del lanzamiento; los enlaces al código fuente por sí solos no demuestran que se hayan cumplido.

This software is based in part on the work of the Independent JPEG Group.
