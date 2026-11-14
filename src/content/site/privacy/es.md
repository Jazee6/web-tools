---
review: reviewed
updated: 2026-11-09
title: "Privacidad – Archivos, estadísticas y datos del navegador"
description: "Consulta qué funciones de Web Tools se conectan a servidores, qué incluyen las estadísticas anónimas y cómo borrar preferencias y datos del navegador."
name: "Privacidad"
---

## Tus archivos se quedan en tu dispositivo

Las herramientas de archivos trabajan en tu navegador sin subir tus archivos a nuestro servidor. El navegador sí descarga el código y, en algunas herramientas, los modelos necesarios para procesarlos.

## Funciones que se conectan a servidores

- **Comprobador de cabeceras HTTP** envía la URL que introduces a nuestro servidor para consultar las cabeceras de respuesta del destino. Se elimina la parte posterior a `#`, pero se envían la ruta y los parámetros de consulta. Evita URL con secretos. Cloudflare Turnstile comprueba posibles abusos y recibe un token de verificación y tu dirección IP. Consulta la [política de privacidad de Turnstile](https://www.cloudflare.com/turnstile-privacy-policy/).
- **Consulta DNS** envía el dominio y el tipo de registro directamente al proveedor DNS de Cloudflare o Google que elijas, sin pasar por nuestro servidor. Cloudflare es la opción predeterminada. El proveedor también ve tu dirección IP. Consulta la [política de privacidad de Cloudflare](https://www.cloudflare.com/privacypolicy/) y la [información de privacidad de Google Public DNS](https://developers.google.com/speed/public-dns/privacy).
- **MCP remoto** envía el nombre de la herramienta y tus argumentos a nuestro servidor, donde se ejecuta la herramienta. Esto también se aplica a herramientas que normalmente funcionan en el navegador. No envíes información sensible.

## Estadísticas anónimas de uso

Recogemos estadísticas limitadas para entender el uso y los errores de las herramientas, sin un identificador de visitante.

| Qué se informa      | Qué contiene                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| Uso de herramientas | Nombre, idioma de la interfaz, categoría del resultado e intervalo de duración                  |
| Errores inesperados | Tipo y origen del error, herramienta si se conoce, idioma y funciones disponibles del navegador |
| No se incluye       | Tus entradas, resultados, archivos, dirección IP, mensaje de error ni traza detallada del error |

Cada uso terminado tiene un 10% de probabilidad de notificarse; no se selecciona al 10% de los visitantes. Los errores inesperados no se muestrean. Se suprimen los repetidos y se notifican como máximo 20 errores distintos por sesión. Los informes pueden perderse y no se reenvían.

## Cloudflare Web Analytics

Cloudflare Web Analytics mide visitas y rendimiento de carga sin cookies. Cloudflare puede añadir su script de medición automáticamente, por separado de las estadísticas anteriores. Consulta cómo trata los datos en su [política de privacidad](https://www.cloudflare.com/privacypolicy/).

## Registros del servidor y direcciones IP

Nuestro servidor usa tu IP para limitar solicitudes y evitar abusos, pero no la añade a las estadísticas de uso. Cloudflare trata datos de conexión, incluidas las direcciones IP, al servir el sitio y comprobar solicitudes.

Los registros del servidor incluyen la herramienta, el tiempo empleado y el resultado. Los errores inesperados del servidor también pueden incluir mensajes y trazas detalladas. El tratamiento y la conservación de estos datos por Cloudflare se explican en su [política de privacidad](https://www.cloudflare.com/privacypolicy/).

## Qué guarda tu navegador

El navegador recuerda favoritos, hasta 20 herramientas usadas recientemente y opciones de formulario como selecciones, interruptores y números. No guarda archivos ni texto libre como preferencias, ni las opciones predefinidas.

Las páginas visitadas y sus recursos se guardan para usarlos sin conexión. Los modelos descargados se guardan aparte. También se conserva información temporal para evitar informes de error repetidos durante una sesión.

Usa **Borrar datos locales** en el pie de página para eliminar preferencias, favoritos, herramientas recientes, cachés sin conexión, modelos y archivos locales temporales, y detener el servicio sin conexión antes de recargar. Las restricciones del navegador pueden impedir que se borren algunos archivos temporales. Esto no borra la caché web habitual, las cookies, las marcas de errores de la sesión ni los registros del servidor. Al recargar, los datos pueden volver a guardarse en caché.
