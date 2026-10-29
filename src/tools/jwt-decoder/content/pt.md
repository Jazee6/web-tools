---
review: draft
updated: 2026-10-29
title: Decodificador de JWT – Decodifique o cabeçalho e as claims de um token
description: "Decodifique um JWT e leia cabeçalho, claims e assinatura, com exp, nbf e iat em UTC. Grátis e privado: é processado no seu navegador e nada é enviado."
name: Decodificador de JWT
answer: "Cole seu JSON Web Token e clique em Decodificar: o cabeçalho, as claims do payload e a assinatura aparecem no seu navegador, com exp, nbf e iat convertidos para UTC. A assinatura não é verificada."
action: Decodificar
fields:
  token:
    label: JWT
    placeholder: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature
output:
  header:
    label: Cabeçalho
  payload:
    label: Payload
  signature:
    label: Assinatura (não verificada)
  times:
    label: Claims de tempo (UTC)
    columns:
      claim: Claim
      time: Horário
errors:
  invalid_token: Este não é um JWT válido. Um token tem três partes separadas por pontos, cada uma escrita em base64url (apenas letras, dígitos, - e _, sem preenchimento =) e que se decodifica como texto UTF-8. Copie o token inteiro novamente e remova aspas ou quebras de linha que estejam dentro dele.
  invalid_json: O cabeçalho ou o payload não é um objeto JSON. Um JWT carrega o cabeçalho e as claims como objetos JSON; verifique se o token não foi cortado nem alterado ao ser copiado.
  encrypted_token: Este token tem cinco partes, então é um JWT criptografado (JWE) e seu conteúdo não pode ser lido sem a chave de descriptografia. Aqui só é possível decodificar tokens assinados de três partes.
steps:
  - Copie o token e cole-o na caixa de entrada. Um "Bearer " no início, vindo de um cabeçalho Authorization, é removido automaticamente.
  - Clique em Decodificar.
  - Leia o cabeçalho (o algoritmo e o tipo do token) e o payload (as claims); se o token tiver as claims exp, nbf ou iat, esses mesmos momentos também aparecem convertidos para UTC.
  - Trate o resultado como não verificado. Decodificar apenas lê o token; isso não prova quem o emitiu.
faq:
  - q: Meu token é enviado para um servidor?
    a: Não. O token é decodificado inteiramente no seu navegador, então nunca sai do seu dispositivo. Você pode até usar a página offline depois que ela for carregada. Mesmo assim, evite colar em sites em que você não confia tokens que ainda sejam válidos em sistemas de produção.
  - q: Esta ferramenta verifica a assinatura?
    a: Não. Ela apenas decodifica as três partes, e a assinatura é exibida exatamente como aparece no token. Qualquer pessoa pode criar um token com as claims que quiser, então verifique a assinatura com a chave do emissor no seu próprio código antes de confiar em um token.
  - q: O que significam exp, nbf e iat?
    a: São claims de tempo registradas na RFC 7519, escritas em segundos desde 1970-01-01 UTC. exp é quando o token expira, nbf (not before) é quando ele passa a ser válido e iat (issued at) é quando foi criado. A tabela converte cada uma para um horário UTC legível, mas não informa se o token está expirado agora.
  - q: Por que recebo um erro com um token de cinco partes?
    a: Um token de cinco partes é um JWT criptografado (JWE). O payload está criptografado, então não há nada para ler sem a chave de descriptografia. Os JWTs assinados (JWS) têm três partes.
  - q: Ele decodifica um token com a assinatura vazia?
    a: Sim. Um token sem proteção (com "alg":"none") termina com um ponto e uma assinatura vazia. Ele é decodificado normalmente, mas nada protege suas claims, então nunca confie nele para controle de acesso.
---

## O que esta ferramenta de JWT faz

Um JSON Web Token ([RFC 7519](https://www.rfc-editor.org/rfc/rfc7519)) são três partes codificadas em base64url unidas por pontos: um cabeçalho com o algoritmo de assinatura, um payload com as claims e uma assinatura. O decodificador divide o token, decodifica o cabeçalho e o payload de base64url para UTF-8 e os exibe como JSON indentado. Entre as claims, `iat`, `nbf` e `exp` são datas numéricas, por isso também são listadas como horários UTC.

## Opções e limites

- **Somente decodifica:** a assinatura nunca é conferida, e a ferramenta não busca chaves nem compara o token com o horário atual.
- **Tokens assinados:** tokens de três partes podem ser decodificados, inclusive os sem assinatura, com a assinatura vazia. Tokens criptografados de cinco partes (JWE) são rejeitados.
- **Formato estrito:** o cabeçalho e o payload precisam ser objetos JSON. Os caracteres do Base64 padrão (+, / e =) não são aceitos no lugar de base64url.
- **Números grandes:** os valores das claims são exibidos como números do JavaScript, então inteiros acima de 9.007.199.254.740.991 podem perder precisão.
- **Tamanho:** limitado apenas pela memória do seu dispositivo.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena seu token e não usa cookies.
