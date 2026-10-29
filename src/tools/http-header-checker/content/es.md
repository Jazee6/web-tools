---
review: reviewed
updated: 2026-10-29
title: Comprobador de cabeceras HTTP – Ver cabeceras y redirecciones
description: "Consulta el código de estado HTTP, las cabeceras de respuesta y la cadena de redirecciones de cualquier URL pública. Gratis, al instante, sin registro y sin guardar nada."
name: Comprobador de cabeceras HTTP
answer: Escribe una URL y pulsa Comprobar cabeceras — la herramienta la solicita desde nuestro servidor y muestra el código de estado final, todas las cabeceras de respuesta y cada redirección intermedia.
action: Comprobar cabeceras
fields:
  url:
    label: URL
    placeholder: example.com
  followRedirects:
    label: Seguir redirecciones
output:
  status:
    label: Código de estado
  url:
    label: URL final
  headers:
    label: Cabeceras de respuesta
    columns:
      name: Cabecera
      value: Valor
  redirects:
    label: Cadena de redirecciones
    columns:
      status: Estado
      url: URL
errors:
  invalid_url: Esta no es una URL válida. Introduce una dirección que empiece por http:// o https:// y tenga hasta 2.048 caracteres.
  blocked_url: "No se puede comprobar esta dirección. No se permiten direcciones privadas, locales ni puertos no estándar: usa una URL pública http:// o https:// en el puerto 80 o 443."
  timeout: El servidor tardó demasiado en responder. Comprueba que el sitio esté en línea y vuelve a intentarlo en un momento.
  fetch_failed: No se pudo conectar con el servidor. Comprueba que la URL esté bien escrita y que el sitio esté en línea, y vuelve a intentarlo.
  too_many_redirects: La URL redirigió más de 5 veces. Desactiva Seguir redirecciones para ver la primera respuesta o revisa si el sitio tiene un bucle de redirecciones.
steps:
  - Escribe la URL que quieres revisar. Si omites el esquema, se usa https://.
  - Deja activado Seguir redirecciones para rastrear cada salto hasta la página final, o desactívalo para ver solo la primera respuesta.
  - Pulsa Comprobar cabeceras y revisa el código de estado, la URL final, las cabeceras de respuesta y la cadena de redirecciones.
faq:
  - q: ¿Por qué la comprobación se hace en un servidor y no en mi navegador?
    a: Por seguridad, los navegadores ocultan a los scripts la mayoría de las cabeceras de respuesta de otros sitios, así que una página no puede leerlas directamente. Nuestro servidor envía la solicitud y devuelve solo el estado, las cabeceras y las ubicaciones de redirección, nunca el contenido de la página.
  - q: ¿Qué método de solicitud se usa?
    a: Cada comprobación es una solicitud HEAD, que pide las cabeceras sin descargar la página. Algunos servidores responden a HEAD de forma distinta que a GET, por ejemplo con 405 Method Not Allowed; en ese caso el resultado muestra exactamente lo que devolvió el servidor.
  - q: ¿Puedo comprobar localhost o direcciones de mi red?
    a: No. Para proteger las redes privadas se rechazan direcciones como localhost, 10.x.x.x, 192.168.x.x, las de enlace local y otros rangos reservados, así como los puertos distintos de 80 y 443.
  - q: ¿Qué significan los códigos de redirección?
    a: 301 y 308 son redirecciones permanentes que los buscadores siguen y consolidan; 302, 303 y 307 son temporales. Además, 307 y 308 exigen mantener el mismo método de solicitud.
  - q: ¿Hay un límite de comprobaciones?
    a: Sí. Para mantener el servicio gratuito y evitar solicitudes repetidas al mismo sitio, las comprobaciones se limitan por visitante y por sitio de destino. Si llegas al límite, espera un minuto y vuelve a intentarlo.
---

## Qué muestra este comprobador de cabeceras

Envía una solicitud HEAD ([RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#name-head)) a la dirección que escribes e informa de lo que respondió el servidor: el código de estado HTTP, las cabeceras de respuesta tal como las envió el servidor (con nombres en minúsculas) y, si se siguen las redirecciones, cada salto con su código de estado. Sirve para revisar cabeceras de caché como `cache-control`, cabeceras de seguridad como `strict-transport-security` y `content-security-policy`, y si una URL antigua redirige a donde esperas.

## Opciones y límites

- **Redirecciones:** se siguen hasta 5 saltos y cada uno se vuelve a validar antes de solicitarlo.
- **Tiempo de espera:** toda la comprobación, redirecciones incluidas, debe terminar en 8 segundos.
- **Direcciones:** solo URL públicas `http://` y `https://` de hasta 2.048 caracteres, en los puertos predeterminados 80 y 443.
- **Límites de uso:** unas pocas comprobaciones por minuto por visitante y un tope por sitio de destino.
- **No incluye:** el contenido de la página, las cookies de tu navegador ni detalles de protocolo HTTP/2 o HTTP/3.

## Privacidad

La URL que escribes se envía a nuestro servidor solo para hacer la solicitud; no se guarda y el contenido de tu solicitud no se registra. El sitio de destino ve la solicitud llegar desde nuestro servidor, identificado como WebToolsBot, no desde ti.
