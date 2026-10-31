---
review: draft
updated: 2026-10-31
title: "Consulta DNS – Comprueba registros A, MX, TXT y más en línea"
description: "Consulta los registros A, AAAA, CNAME, MX, TXT, NS, SOA y CAA de cualquier dominio con el DNS de Cloudflare o Google. Gratis y directo desde tu navegador."
name: "Consulta DNS"
answer: "Escribe un dominio, elige un tipo de registro y pulsa Consultar; los registros, sus TTL y el código de respuesta DNS aparecen en tu navegador."
action: "Consultar"
fields:
  domain:
    label: "Dominio"
    placeholder: "example.com"
  type:
    label: "Tipo de registro"
    options:
      A: "A – direcciones IPv4"
      AAAA: "AAAA – direcciones IPv6"
      CNAME: "CNAME – alias de otro nombre"
      MX: "MX – servidores de correo"
      TXT: "TXT – registros de texto"
      NS: "NS – servidores de nombres"
      SOA: "SOA – autoridad de la zona"
      CAA: "CAA – autoridades de certificación permitidas"
  resolver:
    label: "Resolvedor"
    options:
      cloudflare: "Cloudflare (1.1.1.1)"
      google: "DNS público de Google (8.8.8.8)"
output:
  status:
    label: "Código de respuesta"
  records:
    label: "Registros"
    columns:
      name: "Nombre"
      type: "Tipo"
      ttl: "TTL (segundos)"
      data: "Datos"
errors:
  invalid_domain: "Este no es un nombre de dominio válido. Escribe un nombre como example.com o www.example.com, o pega una URL completa. Los nombres pueden usar letras, dígitos, guiones y guiones bajos, y cada parte entre puntos puede tener como máximo 63 caracteres."
  lookup_failed: "No se pudo conectar con el resolvedor o no dio una respuesta utilizable. Revisa tu conexión y vuelve a intentarlo, o cambia el Resolvedor por el otro; algunas redes bloquean uno de los dos."
steps:
  - "Escribe el dominio en Dominio, por ejemplo example.com. También sirve una URL completa."
  - "Elige el Tipo de registro: A para direcciones IPv4, MX para servidores de correo, TXT para SPF y registros de verificación, etc."
  - "Elige el Resolvedor, Cloudflare o Google, y pulsa Consultar."
  - "Lee el Código de respuesta y la tabla de registros, con el TTL de cada uno en segundos."
faq:
  - q: "¿Se sube mi dominio a un servidor?"
    a: "El dominio va de tu navegador directamente al resolvedor que elijas, Cloudflare o Google, por HTTPS. No pasa por nuestros servidores y no lo guardamos. El resolvedor ve el dominio y tu dirección IP y los trata según su propia política de privacidad."
  - q: "¿Por qué usa Cloudflare o Google en lugar de los servidores de nombres del propio dominio?"
    a: "Un navegador no puede enviar consultas DNS normales, solo peticiones web. Cloudflare y Google ofrecen DNS sobre HTTPS (DoH), una interfaz web a sus resolvedores públicos. Estos resolvedores guardan las respuestas en caché, así que ves lo que ve un visitante típico, que puede ir por detrás de un cambio que acabas de hacer. Además, los dos pueden dar respuestas distintas mientras un cambio se propaga."
  - q: "¿Qué significan los tipos de registro?"
    a: "A y AAAA dan las direcciones IPv4 e IPv6 del nombre. CNAME convierte el nombre en un alias de otro. MX enumera los servidores de correo con su prioridad. TXT guarda texto libre, como valores de SPF, DKIM y verificación de sitios. NS enumera los servidores de nombres del dominio. SOA describe la zona, con su servidor de nombres primario, el contacto del administrador y los temporizadores. CAA indica las autoridades de certificación que pueden emitir certificados."
  - q: "¿Qué significan NOERROR y NXDOMAIN?"
    a: "NOERROR significa que la consulta recibió respuesta. Si la tabla está vacía, el nombre existe pero no tiene registros del tipo que pediste. NXDOMAIN significa que el nombre no existe. SERVFAIL y REFUSED significan que el resolvedor no pudo obtener una respuesta, a menudo por un problema en los servidores de nombres del dominio."
  - q: "¿Por qué cambia el TTL cada vez que consulto?"
    a: "El resolvedor conserva cada respuesta durante el TTL del registro y lo va descontando. Si el TTL es menor que el configurado en el registro, la respuesta se guardó en caché hace unos segundos."
  - q: "¿Puedo consultar una dirección IP o un nombre de host interno?"
    a: "No. No se admiten las consultas inversas de direcciones IP, y los resolvedores solo conocen el DNS público, así que los nombres que solo existen en tu red privada devolverán NXDOMAIN."
---

## Qué hace esta consulta DNS

La herramienta envía una consulta DNS del dominio y el tipo de registro al resolvedor que elijas, mediante su API JSON: [Cloudflare](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/) o [Google](https://developers.google.com/speed/public-dns/docs/doh/json). La petición la hace tu propio navegador, así que la respuesta es la que ese resolvedor te devuelve a ti. La tabla muestra cada registro de la respuesta, y una cadena de CNAME enumera los CNAME antes de los registros finales. Los valores TXT que el resolvedor divide en varias cadenas se unen en un solo texto, y se quita el punto final de los destinos de CNAME, NS y MX.

## Opciones y límites

- **Dominio:** un nombre de dominio o una URL, de hasta 2.048 caracteres. El esquema, la ruta y el puerto se ignoran, y un nombre internacionalizado se convierte a punycode (bücher.example pasa a xn--bcher-kva.example).
- **Tipos de registro:** A, AAAA, CNAME, MX, TXT, NS, SOA y CAA. No se admiten las consultas inversas (PTR) ni los registros DNSSEC.
- **Resolvedores:** solo Cloudflare y Google, sin posibilidad de escribir el tuyo. La herramienta no indica si la respuesta se validó con DNSSEC.
- **Tiempo de espera:** una consulta que no recibe respuesta en 10 segundos falla.
- **Conexión:** la consulta necesita conexión a internet, así que no funciona sin conexión.

## Privacidad

El dominio que escribes se envía desde tu navegador al resolvedor que elijas, Cloudflare o Google, que ve el dominio y tu dirección IP. No llega a nuestros servidores, y la página no guarda lo que escribes ni usa cookies.
