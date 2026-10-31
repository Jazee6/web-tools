---
review: draft
updated: 2026-10-31
title: "Consulta DNS – Verifique registros A, MX, TXT e outros online"
description: "Consulte os registros A, AAAA, CNAME, MX, TXT, NS, SOA e CAA de qualquer domínio pelo DNS da Cloudflare ou do Google. Grátis e direto do seu navegador."
name: "Consulta DNS"
answer: "Digite um domínio, escolha um tipo de registro e clique em Consultar: os registros, seus TTLs e o código de resposta DNS aparecem no seu navegador."
action: "Consultar"
fields:
  domain:
    label: "Domínio"
    placeholder: "example.com"
  type:
    label: "Tipo de registro"
    options:
      A: "A – endereços IPv4"
      AAAA: "AAAA – endereços IPv6"
      CNAME: "CNAME – apelido de outro nome"
      MX: "MX – servidores de e-mail"
      TXT: "TXT – registros de texto"
      NS: "NS – servidores de nomes"
      SOA: "SOA – autoridade da zona"
      CAA: "CAA – autoridades certificadoras permitidas"
  resolver:
    label: "Resolvedor"
    options:
      cloudflare: "Cloudflare (1.1.1.1)"
      google: "DNS público do Google (8.8.8.8)"
output:
  status:
    label: "Código de resposta"
  records:
    label: "Registros"
    columns:
      name: "Nome"
      type: "Tipo"
      ttl: "TTL (segundos)"
      data: "Dados"
errors:
  invalid_domain: "Este não é um nome de domínio válido. Digite um nome como example.com ou www.example.com, ou cole uma URL completa. Os nomes podem usar letras, dígitos, hifens e sublinhados, e cada parte entre pontos pode ter no máximo 63 caracteres."
  lookup_failed: "Não foi possível conectar ao resolvedor ou ele não deu uma resposta utilizável. Verifique sua conexão e tente de novo, ou troque o Resolvedor pelo outro; algumas redes bloqueiam um dos dois."
steps:
  - "Digite o domínio em Domínio, por exemplo example.com. Uma URL completa também serve."
  - "Escolha o Tipo de registro: A para endereços IPv4, MX para servidores de e-mail, TXT para SPF e registros de verificação, e assim por diante."
  - "Escolha o Resolvedor, Cloudflare ou Google, e clique em Consultar."
  - "Leia o Código de resposta e a tabela de registros, com o TTL de cada um em segundos."
faq:
  - q: "Meu domínio é enviado para um servidor?"
    a: "O domínio vai do seu navegador direto para o resolvedor que você escolher, Cloudflare ou Google, por HTTPS. Ele não passa pelos nossos servidores e não o armazenamos. O resolvedor vê o domínio e o seu endereço IP e os trata conforme a própria política de privacidade."
  - q: "Por que usa a Cloudflare ou o Google em vez dos servidores de nomes do próprio domínio?"
    a: "Um navegador não consegue enviar consultas DNS comuns, só requisições web. A Cloudflare e o Google oferecem DNS sobre HTTPS (DoH), uma interface web para seus resolvedores públicos. Esses resolvedores guardam as respostas em cache, então você vê o que um visitante comum vê, o que pode atrasar em relação a uma mudança que você acabou de fazer. Os dois também podem dar respostas diferentes enquanto uma mudança se propaga."
  - q: "O que significam os tipos de registro?"
    a: "A e AAAA dão os endereços IPv4 e IPv6 do nome. CNAME torna o nome um apelido de outro. MX lista os servidores de e-mail com sua prioridade. TXT guarda texto livre, como valores de SPF, DKIM e verificação de site. NS lista os servidores de nomes do domínio. SOA descreve a zona, com seu servidor de nomes primário, o contato do administrador e os temporizadores. CAA indica as autoridades certificadoras que podem emitir certificados."
  - q: "O que significam NOERROR e NXDOMAIN?"
    a: "NOERROR significa que a consulta foi respondida. Se a tabela estiver vazia, o nome existe, mas não tem registro do tipo pedido. NXDOMAIN significa que o nome não existe. SERVFAIL e REFUSED significam que o resolvedor não conseguiu uma resposta, muitas vezes por um problema nos servidores de nomes do domínio."
  - q: "Por que o TTL muda a cada consulta?"
    a: "O resolvedor guarda cada resposta durante o TTL do registro e faz a contagem regressiva. Se o TTL for menor que o configurado no registro, a resposta foi colocada em cache alguns segundos atrás."
  - q: "Posso consultar um endereço IP ou um nome de host interno?"
    a: "Não. Consultas reversas de endereços IP não são aceitas, e os resolvedores só conhecem o DNS público, então nomes que existem apenas na sua rede privada voltarão como NXDOMAIN."
---

## O que esta consulta DNS faz

A ferramenta envia uma consulta DNS do domínio e do tipo de registro ao resolvedor que você escolher, pela API JSON dele: [Cloudflare](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/) ou [Google](https://developers.google.com/speed/public-dns/docs/doh/json). A requisição é feita pelo seu próprio navegador, então a resposta é a que esse resolvedor devolve a você. A tabela mostra cada registro da resposta, e uma cadeia de CNAME lista os CNAME antes dos registros finais. Os valores TXT que o resolvedor divide em várias cadeias são unidos em um só texto, e o ponto final dos destinos de CNAME, NS e MX é removido.

## Opções e limites

- **Domínio:** um nome de domínio ou uma URL, com até 2.048 caracteres. O esquema, o caminho e a porta são ignorados, e um nome internacionalizado é convertido para punycode (bücher.example vira xn--bcher-kva.example).
- **Tipos de registro:** A, AAAA, CNAME, MX, TXT, NS, SOA e CAA. Consultas reversas (PTR) e registros DNSSEC não são aceitos.
- **Resolvedores:** somente Cloudflare e Google, sem a possibilidade de informar o seu. A ferramenta não mostra se a resposta foi validada com DNSSEC.
- **Tempo limite:** uma consulta sem resposta em 10 segundos falha.
- **Conexão:** a consulta precisa de conexão com a internet, então não funciona offline.

## Privacidade

O domínio que você digita é enviado do seu navegador ao resolvedor que você escolher, Cloudflare ou Google, que vê o domínio e o seu endereço IP. Ele não chega aos nossos servidores, e a página não armazena o que você digita nem usa cookies.
