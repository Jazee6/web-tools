---
review: reviewed
updated: 2026-11-14
title: Gerador de tabelas Markdown – CSV e Excel para tabela Markdown online
description: "Transforme CSV, células copiadas do Excel ou do Google Sheets ou uma tabela Markdown bagunçada em uma tabela Markdown alinhada. Grátis e privado, no seu navegador."
name: Gerador de tabelas Markdown
answer: Cole CSV, células copiadas de uma planilha ou uma tabela Markdown na caixa Dados da tabela — a tabela Markdown alinhada aparece na hora. Clique em Copiar para copiá-la.
action: Gerar tabela
fields:
  data:
    label: Dados da tabela
    placeholder: "Name,Role\nAda,Engineer\nGrace,Admiral"
  from:
    label: Formato de entrada
    options:
      auto: Detectar automaticamente
      csv: CSV (separado por vírgulas)
      tsv: TSV (copiado do Excel ou do Google Sheets)
      markdown: Tabela Markdown
  header:
    label: A primeira linha é o cabeçalho
  align:
    label: Alinhamento
    options:
      none: Não definido
      left: À esquerda
      center: Centralizado
      right: À direita
  pad:
    label: Preencher colunas
output:
  markdown:
    label: Tabela Markdown
errors:
  empty: Nenhuma célula foi encontrada. Cole linhas de CSV, células copiadas de uma planilha ou uma tabela Markdown.
steps:
  - Cole seus dados na caixa Dados da tabela — CSV, células copiadas do Excel ou do Google Sheets, ou uma tabela Markdown.
  - Se a tabela parecer errada, escolha o Formato de entrada correto.
  - Desative A primeira linha é o cabeçalho se os seus dados não tiverem linha de cabeçalho.
  - Escolha um Alinhamento se todas as colunas devem ter o mesmo alinhamento.
  - Clique em Copiar para copiar a tabela Markdown.
faq:
  - q: Como transformo um intervalo do Excel ou do Google Sheets em tabela Markdown?
    a: Selecione as células, copie e cole na caixa Dados da tabela. As planilhas copiam células como texto separado por tabulações (TSV), que o gerador detecta pelas tabulações na primeira linha. Células com quebras de linha ou aspas vão entre aspas na cópia e são lidas corretamente.
  - q: O que acontece com vírgulas, aspas e quebras de linha no CSV?
    a: O gerador segue o RFC 4180. Um campo entre aspas duplas pode conter vírgulas e quebras de linha, e "" representa uma aspa. Um | dentro de uma célula vira \| para não dividir a coluna, e uma quebra de linha dentro de uma célula vira <br>, porque uma linha de tabela Markdown precisa ficar em uma única linha.
  - q: Dá para arrumar uma tabela Markdown bagunçada?
    a: Sim. Cole a tabela e ela é reescrita com espaçamento uniforme. Cada coluna mantém o alinhamento da linha --- a menos que você escolha um Alinhamento para a tabela inteira, e o conteúdo das células, incluindo código inline, links e \| escapados, fica exatamente como foi escrito.
  - q: Por que minha tabela tem uma primeira linha vazia?
    a: Tabelas Markdown precisam de uma linha de cabeçalho. Com A primeira linha é o cabeçalho desativada, o gerador adiciona uma linha de cabeçalho vazia para que sua primeira linha fique no corpo da tabela. Alguns visualizadores mostram essa linha vazia como uma faixa fina.
  - q: Por que as colunas não ficam alinhadas no meu editor?
    a: Preencher colunas adiciona espaços para que todas as células de uma coluna tenham a mesma largura em uma fonte monoespaçada. A largura é estimada por caractere — caracteres chineses, japoneses e coreanos, símbolos de largura total e emoji contam como duas colunas, como a maioria dos editores de código os exibe, e todo o resto como uma. Editores com fonte proporcional, ou que exibem alguns caracteres com outra largura, ainda podem mostrar colunas desalinhadas — a tabela renderizada é a mesma nos dois casos.
---

## Como funciona o gerador de tabelas Markdown

O gerador lê seus dados como CSV seguindo o [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180), como valores separados por tabulações ou como uma [tabela do GitHub Flavored Markdown](https://github.github.com/gfm/#tables-extension-), e gera uma tabela do GitHub Flavored Markdown. Quando o Formato de entrada está em detecção automática, uma primeira linha que começa com | ou uma segunda linha formada por células --- indica Markdown, tabulações na primeira linha indicam TSV e todo o resto é lido como CSV. A largura das colunas é estimada para cada caractere como o leitor o vê, contando caracteres largos do Leste Asiático e emoji como duas colunas, então a maior parte do texto fica alinhada em um editor de código.

## Opções e limites

- **Dados da tabela:** até 200.000 caracteres. Linhas em branco são ignoradas, e linhas com menos células que a mais longa são completadas com células vazias.
- **CSV:** só vírgulas separam campos. Arquivos separados por ponto e vírgula, comuns em algumas versões europeias do Excel, não são divididos; salve-os com vírgulas ou cole as células direto da planilha.
- **Alinhamento:** um único alinhamento para todas as colunas, ou Não definido para deixar as colunas de CSV e TSV sem alinhamento e manter o alinhamento de uma tabela Markdown.
- **Células:** espaços no início e no fim são removidos. Nas células de CSV e TSV, só o | é escapado e as quebras de linha viram <br>; qualquer Markdown ou HTML dentro delas, como **negrito**, é mantido e renderizado.
- **Sem suporte:** células mescladas, alinhamento por coluna para CSV e TSV e conversão de uma tabela Markdown de volta para CSV.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena seus dados e não usa cookies.
