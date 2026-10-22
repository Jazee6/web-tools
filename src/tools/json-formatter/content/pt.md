---
review: draft
updated: 2026-10-22
title: Formatador de JSON – Formate, valide e minifique JSON online
description: Cole JSON para formatar, validar, minificar ou ordenar as chaves. Grátis, instantâneo e privado — os dados são processados no seu navegador e nunca enviados.
name: Formatador de JSON
answer: Cole seu JSON, escolha a indentação e clique em Formatar JSON — a ferramenta valida o conteúdo e devolve o JSON bem indentado ou minificado direto no seu navegador.
action: Formatar JSON
fields:
  json:
    label: JSON
    placeholder: '{"name": "Ada", "langs": ["en", "fr"]}'
  indent:
    label: Indentação
    options:
      "2": 2 espaços
      "4": 4 espaços
      tab: Tabulações
      minify: Minificar (uma linha)
  sortKeys:
    label: Ordenar chaves em ordem alfabética
output:
  formatted:
    label: JSON formatado
errors:
  invalid_json: Isto não é um JSON válido.
steps:
  - Cole ou digite seu JSON na caixa de entrada.
  - Escolha a indentação — 2 espaços, 4 espaços, tabulações ou Minificar para deixar tudo em uma linha.
  - Se quiser, ative Ordenar chaves em ordem alfabética para ordenar as chaves de todos os objetos, em todos os níveis.
  - Clique em Formatar JSON e copie o resultado. Se o JSON for inválido, o erro mostra o que o analisador encontrou e onde.
faq:
  - q: Meu JSON é enviado para um servidor?
    a: Não. A formatação acontece inteiramente no seu navegador, com o analisador de JSON embutido, então os dados nunca saem do seu dispositivo. Depois que a página carrega, dá para usar até offline.
  - q: Qual é a diferença entre formatar e minificar?
    a: Formatar adiciona quebras de linha e indentação para que as pessoas consigam ler a estrutura. Minificar remove todos os espaços opcionais e gera o menor JSON válido possível para armazenar ou transferir. Nos dois casos os dados são exatamente os mesmos.
  - q: Ordenar as chaves altera meus dados?
    a: Só muda a ordem das chaves dentro dos objetos; os valores, o aninhamento e a ordem dos arrays continuam iguais. Objetos JSON não têm ordem por definição, então o resultado ordenado é equivalente e fica muito mais fácil comparar dois documentos.
  - q: Por que o formatador diz que meu JSON é inválido?
    a: As causas mais comuns são vírgulas sobrando no final, aspas simples em vez de duplas, chaves sem aspas, comentários e valores como NaN ou undefined. Eles são permitidos em JavaScript, mas não em JSON. A mensagem de erro mostra o que o analisador rejeitou e onde.
  - q: Números muito grandes são mantidos com exatidão?
    a: Os números são lidos como ponto flutuante padrão de 64 bits, então inteiros maiores que 9.007.199.254.740.991 podem perder precisão. Se você trabalha com IDs grandes, guarde-os como strings.
---

## O que este formatador de JSON faz

Ele analisa a entrada com o mesmo analisador de JSON rigoroso que os navegadores usam, então tudo o que ele aceita é JSON válido segundo a [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259). Uma entrada válida é serializada de novo com a indentação escolhida; uma entrada inválida é rejeitada com a mensagem de erro do analisador, em vez de ser "corrigida" sem aviso.

## Opções e limites

- **Indentação:** 2 espaços, 4 espaços, tabulações ou minificado em uma única linha.
- **Ordenar chaves:** de forma recursiva, em ordem alfabética por ponto de código; a ordem dos arrays nunca muda.
- **Tamanho:** limitado apenas pela memória do seu dispositivo. Entradas de vários megabytes são formatadas em bem menos de um segundo em um notebook comum.
- **Não suportado:** extensões de JSON5 ou JSONC, como comentários e vírgulas no final — remova-as antes.

## Privacidade

Tudo acontece no seu dispositivo. A página não envia seu JSON para lugar nenhum, não o armazena e não usa cookies.
