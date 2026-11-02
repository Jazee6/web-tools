---
review: draft
updated: 2026-11-02
title: Dividir PDF – Extraia páginas ou divida um PDF online grátis
description: Divida um PDF em vários arquivos ou extraia as páginas de que precisa. Grátis e privado — a divisão acontece no seu navegador, e seu documento nunca é enviado.
name: Dividir PDF
answer: Escolha um PDF, informe as páginas desejadas — como 1-3, 5, 8- — e clique em Dividir PDF. Cada intervalo vira um arquivo no seu dispositivo; deixe as páginas vazias para dividir todas as páginas.
action: Dividir PDF
fields:
  file:
    label: Arquivo PDF
  pages:
    label: Páginas
    placeholder: 1-3, 5, 8-
  mode:
    label: Saída
    options:
      separate: Um PDF por intervalo
      combined: Todas as páginas listadas em um PDF
output:
  files:
    label: Arquivos PDF
errors:
  encrypted: "Este PDF está protegido por senha. Remova a senha e tente de novo:"
  invalid_pdf: "Não foi possível ler este arquivo como PDF. Ele pode estar danificado. Exporte-o novamente e tente de novo:"
  invalid_pages: "Informe as páginas como números e intervalos separados por vírgulas, como 1-3, 5, 8-. Não foi possível ler esta parte:"
  page_out_of_range: "Essa página não existe. Número de páginas deste PDF:"
  pages_required: Informe as páginas que devem ir para o PDF, como 1-3, 5.
  too_many_files: Isso criaria mais de 500 arquivos. Informe menos intervalos ou use intervalos maiores, como 1-100, 101-200.
steps:
  - Escolha um arquivo PDF de até 50 MB.
  - Informe as páginas, como 1-3, 5, 8-. As páginas começam a contar em 1, e 8- vai até a última página. Deixe Páginas vazio para dividir todas as páginas.
  - Em Saída, escolha Um PDF por intervalo para obter um arquivo separado para cada parte entre vírgulas, ou Todas as páginas listadas em um PDF para extraí-las em um único arquivo.
  - Clique em Dividir PDF e baixe cada arquivo ou todos juntos em um ZIP.
faq:
  - q: Meu PDF é enviado para um servidor?
    a: Não. O arquivo é lido e dividido dentro do seu navegador com o PDFium compilado para WebAssembly, então nunca sai do seu dispositivo.
  - q: Como extraio só algumas páginas?
    a: Informe-as em Páginas, como 2, 5-7, e escolha Todas as páginas listadas em um PDF. Você recebe um arquivo com essas páginas.
  - q: Como divido um PDF em páginas avulsas?
    a: Deixe Páginas vazio, mantenha Um PDF por intervalo selecionado e clique em Dividir PDF. Cada página vira um arquivo. O limite é de 500 arquivos por vez, então em documentos mais longos use intervalos.
  - q: Posso reordenar ou repetir páginas?
    a: Sim, quando as páginas vão para um único PDF. As páginas saem na ordem em que você as digita, então 5, 1-2, 1 gera a página 5, as páginas 1 e 2 e, de novo, a página 1.
  - q: Dividir reduz a qualidade?
    a: Não. As páginas são copiadas como estão — o texto continua selecionável e as imagens não são recomprimidas.
  - q: Os marcadores e campos de formulário são mantidos?
    a: As páginas chegam com texto e imagens inalterados, mas os marcadores não são adicionados aos novos arquivos. Campos de formulário preenchíveis mantêm o conteúdo, mas podem deixar de ser editáveis.
---

## Como a divisão funciona

A ferramenta usa o PDFium — o mecanismo de PDF do Google Chrome — compilado para WebAssembly. Ele abre seu arquivo, copia as páginas pedidas para um novo documento por arquivo de saída e salva o resultado. O trabalho acontece em uma thread em segundo plano, então a página continua respondendo.

## Opções e limites

- **Entrada:** um arquivo PDF de até 50 MB.
- **Páginas:** páginas avulsas e intervalos separados por vírgulas. Um intervalo deve ir de uma página menor para uma maior, e todas as páginas devem existir no arquivo.
- **Saída:** até 500 arquivos PDF por vez.
- **Senhas:** arquivos que precisam de senha para abrir não podem ser divididos.
- **Tamanho do arquivo:** cada arquivo pode conter recursos compartilhados por todo o documento, como fontes, então as partes juntas podem ficar maiores que o original.
- **Memória:** o arquivo e todos os resultados ficam na memória, então documentos muito grandes podem falhar em celulares.

Para combinar as partes de novo ou juntar outros documentos, use o [Juntar PDF](/pt/merge-pdf).

## Privacidade

Seu documento é processado apenas no seu dispositivo. A página não o envia, não o armazena e não usa cookies.
