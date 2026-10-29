---
review: reviewed
updated: 2026-10-29
title: Verificador de cabeçalhos HTTP – Veja cabeçalhos e redirecionamentos
description: Confira o código de status HTTP, os cabeçalhos de resposta e a cadeia de redirecionamentos de qualquer URL pública. Grátis, instantâneo, sem cadastro e sem armazenamento.
name: Verificador de cabeçalhos HTTP
answer: Digite uma URL e clique em Verificar cabeçalhos — a ferramenta faz a requisição a partir do nosso servidor e mostra o status final, todos os cabeçalhos de resposta e cada redirecionamento no caminho.
action: Verificar cabeçalhos
fields:
  url:
    label: URL
    placeholder: example.com
  followRedirects:
    label: Seguir redirecionamentos
output:
  status:
    label: Código de status
  url:
    label: URL final
  headers:
    label: Cabeçalhos de resposta
    columns:
      name: Cabeçalho
      value: Valor
  redirects:
    label: Cadeia de redirecionamentos
    columns:
      status: Status
      url: URL
errors:
  invalid_url: Esta não é uma URL válida. Digite um endereço que comece com http:// ou https:// e tenha até 2.048 caracteres.
  blocked_url: Não é possível verificar este endereço. Endereços privados, locais e portas fora do padrão não são permitidos — use uma URL pública http:// ou https:// na porta 80 ou 443.
  timeout: O servidor demorou demais para responder. Verifique se o site está no ar e tente novamente em instantes.
  fetch_failed: Não foi possível conectar ao servidor. Verifique se a URL está escrita corretamente e se o site está no ar, e tente novamente.
  too_many_redirects: A URL redirecionou mais de 5 vezes. Desative Seguir redirecionamentos para ver a primeira resposta ou verifique se o site tem um loop de redirecionamento.
steps:
  - Digite a URL que você quer inspecionar. Se omitir o esquema, será usado https://.
  - Mantenha Seguir redirecionamentos ativado para rastrear cada salto até a página final, ou desative para ver só a primeira resposta.
  - Clique em Verificar cabeçalhos e confira o código de status, a URL final, os cabeçalhos de resposta e a cadeia de redirecionamentos.
faq:
  - q: Por que a verificação roda em um servidor e não no meu navegador?
    a: Por segurança, os navegadores escondem dos scripts a maior parte dos cabeçalhos de resposta de outros sites, então uma página não consegue lê-los diretamente. Nosso servidor envia a requisição e devolve só o status, os cabeçalhos e os destinos de redirecionamento — nunca o conteúdo da página.
  - q: Qual método de requisição é usado?
    a: Toda verificação é uma requisição HEAD, que pede os cabeçalhos sem baixar a página. Alguns servidores respondem ao HEAD de forma diferente do GET, por exemplo com 405 Method Not Allowed; nesse caso o resultado mostra exatamente o que o servidor devolveu.
  - q: Posso verificar localhost ou endereços da minha rede?
    a: Não. Para proteger redes privadas, endereços como localhost, 10.x.x.x, 192.168.x.x, link-local e outras faixas reservadas são recusados, assim como portas diferentes de 80 e 443.
  - q: O que significam os códigos de redirecionamento?
    a: 301 e 308 são redirecionamentos permanentes, que os buscadores seguem e consolidam; 302, 303 e 307 são temporários. Além disso, 307 e 308 exigem que o método da requisição seja mantido.
  - q: Existe limite de verificações?
    a: Sim. Para manter o serviço gratuito e evitar requisições repetidas ao mesmo site, as verificações são limitadas por visitante e por site de destino. Se atingir o limite, espere um minuto e tente de novo.
---

## O que este verificador de cabeçalhos mostra

Ele envia uma requisição HEAD ([RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#name-head)) ao endereço informado e mostra o que o servidor respondeu: o código de status HTTP, os cabeçalhos de resposta como o servidor os enviou (com nomes em minúsculas) e, quando os redirecionamentos são seguidos, cada salto com seu código de status. É útil para conferir cabeçalhos de cache como `cache-control`, cabeçalhos de segurança como `strict-transport-security` e `content-security-policy`, e se uma URL antiga redireciona para onde você espera.

## Opções e limites

- **Redirecionamentos:** até 5 saltos são seguidos, e cada um é validado de novo antes da requisição.
- **Tempo limite:** a verificação inteira, incluindo redirecionamentos, precisa terminar em 8 segundos.
- **Endereços:** apenas URLs públicas `http://` e `https://` de até 2.048 caracteres, nas portas padrão 80 e 443.
- **Limites de uso:** algumas verificações por minuto por visitante e um teto por site de destino.
- **Não inclui:** o conteúdo da página, os cookies do seu navegador e detalhes dos protocolos HTTP/2 ou HTTP/3.

## Privacidade

A URL que você digita é enviada ao nosso servidor apenas para fazer a requisição; ela não é armazenada e o conteúdo da sua verificação não é registrado. O site de destino vê a requisição vindo do nosso servidor, identificado como WebToolsBot, e não de você.
