---
review: reviewed
updated: 2026-11-09
title: "Gerador de UUID – Gere identificadores UUID v4 aleatórios online"
description: "Gere até 1.000 identificadores UUID v4 aleatórios por vez, em minúsculas ou maiúsculas. Grátis e privado, com geração inteiramente no seu navegador."
name: "Gerador de UUID"
answer: "Escolha uma quantidade e clique em Gerar UUID para criar identificadores UUID v4 aleatórios no seu navegador, um por linha, prontos para copiar."
action: "Gerar UUID"
fields:
  count:
    label: "Quantidade"
  uppercase:
    label: "Maiúsculas"
output:
  uuids:
    label: "UUIDs"
errors: {}
steps:
  - "Defina Quantidade como um número inteiro de 1 a 1.000; o padrão é 1."
  - "Ative Maiúsculas se quiser; o padrão é usar minúsculas."
  - "Clique em Gerar UUID e copie o resultado, com um identificador por linha."
faq:
  - q: "Qual versão de UUID é gerada?"
    a: "Somente a versão 4, usando a API randomUUID criptograficamente segura da plataforma. Não gera UUIDs baseados em tempo ou nomes, como v1, v5 ou v7."
  - q: "Quantos UUIDs posso gerar de uma vez?"
    a: "De 1 a 1.000 por execução. Cada UUID fica em sua própria linha, sem chaves nem prefixo URN."
  - q: "As maiúsculas mudam o UUID?"
    a: "Não. Mudam apenas as letras hexadecimais, não o valor do identificador. As duas formas mantêm os hífens."
  - q: "Os identificadores gerados são enviados ou armazenados?"
    a: "Não. A geração acontece no seu dispositivo, e a página não envia nem armazena os identificadores gerados. Copie os resultados que quiser manter antes de sair da página."
---

## Como funciona a geração de UUID

Cada identificador vem da API Web Crypto `crypto.randomUUID()` da plataforma. O resultado é um UUID v4 no formato `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`, em que `y` é 8, 9, a ou b em minúsculas. Cada clique gera um novo lote; não há texto de entrada nem semente.

## Opções e limites

- **Quantidade:** um inteiro de 1 a 1.000, com padrão de 1.
- **Maiúsculas e minúsculas:** minúsculas por padrão, ou maiúsculas com o mesmo formato com hífens.
- **Não suportado:** versões de UUID diferentes de v4, sementes personalizadas, chaves e prefixos URN.

## Privacidade

A geração acontece somente no seu dispositivo. A página não envia nem armazena os UUIDs gerados nem usa cookies.
