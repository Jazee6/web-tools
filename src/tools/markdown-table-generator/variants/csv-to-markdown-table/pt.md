---
review: reviewed
updated: 2026-11-14
title: Conversor de CSV para tabela Markdown – Grátis e online
description: Cole o conteúdo de um arquivo CSV e receba uma tabela Markdown do GitHub. Campos entre aspas com vírgulas, aspas e quebras de linha são tratados. Grátis e sem envio.
name: CSV para tabela Markdown
answer: Cole o conteúdo do seu arquivo CSV na caixa Dados da tabela — CSV já está selecionado, então a tabela Markdown aparece na hora. Clique em Copiar para copiá-la.
steps:
  - Abra o arquivo .csv em um editor de texto, selecione tudo e copie.
  - Cole na caixa Dados da tabela; CSV já está selecionado como Formato de entrada.
  - Clique em Copiar e cole a tabela no seu README, wiki ou anotações.
faq:
  - q: Meu CSV tem vírgulas dentro de alguns valores. As colunas vão quebrar?
    a: Não, se esses valores estiverem entre aspas duplas, como planilhas, bancos de dados e a maioria dos programas os exportam. "Smith, Ada" continua sendo uma célula só. Uma vírgula fora das aspas sempre começa uma nova coluna.
  - q: Meu arquivo usa ponto e vírgula em vez de vírgula. O que faço?
    a: O ponto e vírgula não é tratado como separador, então cada linha acaba em uma única coluna. Exporte o arquivo de novo com vírgulas, ou abra-o na sua planilha e copie as células — a predefinição Excel para tabela Markdown lê essas células diretamente.
  - q: Por que aparece <br> em algumas células?
    a: Um campo CSV entre aspas pode ocupar várias linhas, mas uma linha de tabela Markdown não. Cada quebra de linha dentro de um campo vira <br>, que o GitHub e a maioria dos visualizadores de Markdown mostram como quebra de linha dentro da célula.
  - q: Posso converter um CSV com milhares de linhas?
    a: Até 200.000 caracteres de CSV, o que dá alguns milhares de linhas curtas. Uma tabela Markdown desse tamanho é difícil de ler, então, para conjuntos de dados grandes, considere colocar um link para o arquivo CSV.
table:
  caption: Como os campos do CSV ficam nas células da tabela Markdown
  columns:
    field: Campo no CSV
    cell: Célula Markdown
    rule: Por quê
  terms:
    quotedComma: Uma vírgula entre aspas fica na célula
    doubledQuote: Duas aspas dentro de aspas valem por uma
    lineBreak: Uma quebra de linha entre aspas vira <br>
    pipe: "| é escapado para não dividir a coluna"
    trimmed: Os espaços em volta do valor são removidos
    semicolon: Ponto e vírgula não separa campos
---

## Lendo CSV do jeito que o RFC 4180 define

O CSV parece simples até um valor conter uma vírgula, uma aspa ou uma quebra de linha. O conversor segue o [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180), o formato que a maioria dos programas grava: campos são separados por vírgulas, um campo entre aspas duplas pode conter vírgulas e quebras de linha, e uma aspa dentro de um campo entre aspas é escrita duas vezes. As linhas podem terminar em CRLF, LF ou CR, então arquivos do Windows, macOS e Linux funcionam.

## Opções e limites

- **Tamanho do CSV:** até 200.000 caracteres.
- **Cabeçalho:** a primeira linha do CSV vira a linha de cabeçalho; com A primeira linha é o cabeçalho desativada, uma linha de cabeçalho vazia é adicionada no lugar.
- **Arquivos irregulares:** linhas com menos campos que a mais longa recebem células vazias no fim, e linhas vazias são ignoradas.
- **Separadores:** só vírgulas. Esta predefinição não divide arquivos separados por ponto e vírgula nem por tabulação.
- **Aspas sem fechamento:** um campo sem a aspa de fechamento vai até o fim do arquivo; confira a origem se a última célula engolir várias linhas.
- **Sem suporte:** ler o cabeçalho de outro arquivo, pular colunas e converter de volta para CSV.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena seu CSV e não usa cookies.
