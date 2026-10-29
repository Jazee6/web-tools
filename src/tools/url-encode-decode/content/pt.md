---
review: reviewed
updated: 2026-10-29
title: Codificar e decodificar URL – Codificação por porcentagem online
description: "Codifique texto para uma URL ou query string, ou decodifique sequências como %20 de volta em texto. Grátis e privado: é processado no seu navegador e nada é enviado."
name: Codificar e decodificar URL
answer: "Cole seu texto ou sua URL, escolha Codificar ou Decodificar e um escopo, e clique em Converter: o resultado codificado ou decodificado aparece no seu navegador."
action: Converter
fields:
  text:
    label: Texto ou URL
    placeholder: https://example.com/search?q=café & tea
  mode:
    label: Modo
    options:
      encode: Codificar (texto em %XX)
      decode: Decodificar (%XX em texto)
  scope:
    label: Escopo
    options:
      component: Componente de URL (valor de consulta, segmento de caminho)
      url: "URL completa (mantém : / ? # & =)"
      form: Dados de formulário (espaços como +)
output:
  result:
    label: Resultado
errors:
  invalid_encoding: Não foi possível converter este texto. Ao decodificar, procure um % que não seja seguido de dois dígitos hexadecimais ou bytes codificados em porcentagem que não sejam UTF-8 válido. Ao codificar, procure caracteres corrompidos, como um substituto isolado.
steps:
  - Cole ou digite na caixa de entrada seu texto, sua URL ou sua string codificada em porcentagem.
  - "Escolha um modo: Codificar (texto em %XX) ou Decodificar (%XX em texto)."
  - "Escolha um escopo. Use Componente de URL (valor de consulta, segmento de caminho) para um único valor de consulta ou segmento de caminho, URL completa (mantém : / ? # & =) para preservar a pontuação da própria URL, ou Dados de formulário (espaços como +) para valores application/x-www-form-urlencoded."
  - Clique em Converter e copie o resultado. Se falhar, o erro explica o que verificar.
faq:
  - q: Meu texto é enviado para um servidor?
    a: Não. A codificação e a decodificação são processadas inteiramente no seu navegador, então seu texto nunca sai do seu dispositivo. Você pode até usar a página offline depois que ela for carregada.
  - q: Qual é a diferença entre Componente de URL e URL completa?
    a: "Componente de URL escapa tudo, exceto letras, dígitos e - _ . ! ~ * ' ( ), então caracteres como / ? & = # também são escapados. Use para um único valor dentro de uma URL. URL completa deixa intactos os caracteres que estruturam uma URL (: / ? # & = e outros) e escapa apenas o resto, para que o endereço inteiro continue funcionando."
  - q: Quando devo usar Dados de formulário?
    a: Use para valores application/x-www-form-urlencoded, o formato dos envios de formulários HTML e de muitas query strings. Ele codifica o espaço como + em vez de %20 e também escapa ! ' ( ) ~. Ao decodificar, o + volta a ser espaço.
  - q: Por que a decodificação falha com uma sequência %?
    a: Um sinal de porcentagem deve ser seguido por exatamente dois dígitos hexadecimais, e os bytes que eles formam precisam ser UTF-8 válido. Um % solto em texto comum, como "100%", ou uma sequência truncada, como %E4%B8, é rejeitado. Para um sinal de porcentagem literal, use %25.
  - q: Decodificar com URL completa transforma %2F de volta em barra?
    a: Não. A decodificação no escopo URL completa mantém como estão os escapes de caracteres reservados, como %2F, %3F e %23, porque transformá-los em separadores reais mudaria o significado da URL. Para decodificá-los, use Componente de URL.
---

## O que esta ferramenta de URL faz

Ela aplica a codificação por porcentagem definida na [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986): o texto é convertido em bytes UTF-8 e cada byte não permitido é escrito como %XX. Os escopos Componente de URL e URL completa usam as funções internas do navegador `encodeURIComponent` e `encodeURI`; Dados de formulário segue as regras do [URL Standard](https://url.spec.whatwg.org/#application/x-www-form-urlencoded). Os resultados coincidem com o que essas mesmas funções retornam no seu próprio JavaScript.

## Opções e limites

- **Modos:** codificar texto em porcentagem ou decodificá-lo de volta em texto.
- **Escopos:** Componente de URL, URL completa ou Dados de formulário (espaços como +). O escopo vale nos dois modos.
- **Somente texto:** converte uma string por vez; não divide uma URL em partes nem a acessa.
- **Tamanho:** limitado apenas pela memória do seu dispositivo.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena seu texto e não usa cookies.
