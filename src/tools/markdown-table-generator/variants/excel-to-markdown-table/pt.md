---
review: reviewed
updated: 2026-11-14
title: Excel para tabela Markdown – Cole células da planilha online
description: Copie células do Excel ou do Google Sheets e cole para receber uma tabela Markdown, sem exportar CSV. Grátis, e seus dados nunca saem do seu dispositivo.
name: Excel para tabela Markdown
answer: Selecione as células no Excel ou no Google Sheets, copie e cole na caixa Dados da tabela — TSV já está selecionado, então a tabela Markdown aparece na hora. Clique em Copiar para copiá-la.
steps:
  - No Excel, Google Sheets, Numbers ou LibreOffice Calc, selecione o intervalo de células de que precisa, incluindo a linha de cabeçalho.
  - Copie as células e cole na caixa Dados da tabela; TSV já está selecionado como Formato de entrada.
  - Clique em Copiar e cole a tabela no GitHub, GitLab, Notion, Obsidian ou em qualquer editor Markdown.
faq:
  - q: Preciso salvar a planilha como CSV antes?
    a: Não. Quando você copia células, a planilha coloca na área de transferência um texto separado por tabulações, uma linha por linha da planilha e uma tabulação entre as células. É exatamente esse texto que esta predefinição lê, então basta copiar e colar.
  - q: Por que números com separador de milhar ficam em uma única célula?
    a: Em texto separado por tabulações, só as tabulações dividem células, então 1,234.50 ou uma lista como "red, green" fica em uma célula. Esse é o principal motivo de colar da planilha ser mais confiável do que exportar CSV em um idioma que usa vírgula como separador decimal.
  - q: Fórmulas, cores e células mescladas são copiadas?
    a: Não. A área de transferência guarda os valores que as células mostram, então você recebe o resultado das fórmulas, não as fórmulas. Formatação como negrito, cores e bordas não faz parte do texto, e uma célula mesclada chega como um valor seguido de células vazias.
  - q: Uma célula com várias linhas quebrou minha tabela. Como resolvo?
    a: As planilhas colocam entre aspas duplas a célula que tem quebras de linha ao copiá-la, e esta predefinição transforma cada quebra em <br>. Se uma quebra de linha ainda dividir uma linha, o programa de onde você copiou não colocou aspas na célula; tire as quebras de linha na planilha e copie de novo.
table:
  caption: Como as células copiadas da planilha ficam na tabela Markdown
  columns:
    clipboard: Célula copiada (TSV)
    cell: Célula Markdown
    rule: Por quê
  terms:
    commaKept: Vírgulas nunca dividem células em texto separado por tabulações
    lineBreak: Uma quebra de linha entre aspas vira <br>
    doubledQuote: Duas aspas dentro de aspas valem por uma
    pipe: "| é escapado para não dividir a coluna"
    trimmed: Os espaços em volta do valor são removidos
---

## Por que copiar células funciona melhor que exportar

Uma tabela Markdown precisa de texto simples, e a área de transferência já tem isso. Os aplicativos de planilha copiam um intervalo como valores separados por tabulações: cada linha na sua própria linha e uma tabulação entre as células. Como tabulações não aparecem dentro de valores normais, números como 1,234.50, endereços e listas separadas por vírgulas ficam intactos — algo que uma exportação CSV pode estragar quando a planilha usa vírgula como separador decimal ou a exportação usa ponto e vírgula.

## Opções e limites

- **Tamanho do intervalo:** até 200.000 caracteres de células copiadas, o suficiente para milhares de células curtas.
- **O que é copiado:** só os valores exibidos, então ajuste na planilha o formato dos números, as datas e o arredondamento antes de copiar.
- **Linhas em branco:** são ignoradas; uma linha mais curta que as outras recebe células vazias no fim.
- **Números:** escolha À direita como Alinhamento quando a tabela for quase toda de números, para que fiquem alinhados na tabela renderizada.
- **Sem suporte:** fórmulas, formatação como negrito ou cores, células mescladas, imagens e comentários.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena as células copiadas e não usa cookies.
