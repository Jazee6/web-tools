---
review: draft
updated: 2026-11-02
title: PDF para imagem – Converta PDF em JPG, PNG ou WebP online
description: Transforme páginas de PDF em imagens JPG, PNG ou WebP a 72, 150 ou 300 DPI. Grátis e privado — as páginas são renderizadas no seu navegador e o documento nunca é enviado.
name: PDF para imagem
answer: Escolha um PDF, selecione JPEG, PNG ou WebP e uma resolução e clique em Converter em imagens. Cada página vira uma imagem no seu dispositivo; informe páginas como 1-3, 5 para converter só essas.
action: Converter em imagens
fields:
  file:
    label: Arquivo PDF
  pages:
    label: Páginas
    placeholder: Todas, ou 1-3, 5, 8-
  format:
    label: Formato da imagem
    options:
      jpeg: JPEG (abre em qualquer lugar)
      png: PNG (sem perdas, texto mais nítido)
      webp: WebP (pequeno, navegadores modernos)
  dpi:
    label: Resolução
    options:
      "72": 72 DPI (tela, o menor)
      "150": 150 DPI (nítido na tela)
      "300": 300 DPI (qualidade de impressão)
  quality:
    label: Qualidade (1–100)
output:
  files:
    label: Imagens
errors:
  encrypted: "Este PDF está protegido por senha. Remova a senha e tente de novo:"
  invalid_pdf: "Não foi possível ler este arquivo como PDF. Ele pode estar danificado. Exporte-o novamente e tente de novo:"
  invalid_pages: "Informe as páginas como números e intervalos separados por vírgulas, como 1-3, 5, 8-. Não foi possível ler esta parte:"
  page_out_of_range: "Essa página não existe. Número de páginas deste PDF:"
  too_many_files: Isso criaria mais de 500 imagens. Informe um intervalo de páginas menor, como 1-100, e converta o restante em outra execução.
  too_large: "Esta página é grande demais na resolução escolhida: um lado passaria de 10.000 pixels, ou o seu navegador não comporta tantos pixels. Escolha uma resolução menor ou deixe esta página de fora. Página:"
steps:
  - Escolha um arquivo PDF de até 50 MB.
  - Deixe Páginas vazio para converter todas as páginas, ou informe páginas como 1-3, 5, 8-. As páginas contam a partir de 1, e 8- vai até a última página.
  - Escolha o Formato da imagem e a Resolução. 150 DPI fica nítido na tela; 300 DPI é para impressão e gera quatro vezes mais pixels.
  - Para JPEG e WebP, mantenha a qualidade padrão de 85 ou defina a sua. O PNG ignora essa configuração.
  - Clique em Converter em imagens e baixe cada imagem ou todas em um arquivo ZIP.
faq:
  - q: Meu PDF é enviado para um servidor?
    a: Não. As páginas são renderizadas dentro do seu navegador com o PDFium compilado para WebAssembly, então o arquivo nunca sai do seu dispositivo.
  - q: Qual formato devo escolher?
    a: JPEG abre em quase qualquer lugar e combina com páginas com fotos. PNG é sem perdas e deixa texto e linhas mais nítidos, mas os arquivos são maiores. WebP gera arquivos menores que JPEG com qualidade parecida e abre nos navegadores atuais.
  - q: Qual será o tamanho das imagens?
    a: O tamanho em pixels é o tamanho da página em pontos vezes a resolução, dividido por 72. Uma página A4 fica com 595 × 842 pixels a 72 DPI, 1240 × 1754 a 150 DPI e 2480 × 3508 a 300 DPI.
  - q: Posso converter só uma página?
    a: Sim. Digite o número dela em Páginas, como 4. Você pode listar várias páginas e intervalos, como 1, 3-5; cada página é convertida uma vez, na ordem em que você digitar.
  - q: Por que o fundo é branco e não transparente?
    a: Cada página é desenhada sobre branco, como os leitores de PDF mostram, então JPEG, PNG e WebP ficam iguais. As áreas transparentes da página não são mantidas.
  - q: Posso selecionar ou copiar o texto das imagens?
    a: Não. As imagens são retratos das páginas, então o texto vira pixels. Para manter o texto selecionável, extraia as páginas como PDF com o Dividir PDF.
---

## Como a conversão funciona

A ferramenta usa o PDFium — o mecanismo de PDF do Google Chrome — compilado para WebAssembly. Ela desenha cada página escolhida sobre um fundo branco na resolução selecionada, incluindo anotações salvas no arquivo, como destaques e campos de formulário preenchidos, e deixa na posição certa as páginas configuradas para aparecer giradas. Depois, cada página é codificada como JPEG ou WebP com a qualidade escolhida, ou como PNG sem perdas. O trabalho acontece em uma thread em segundo plano, então a página continua respondendo.

## Opções e limites

- **Entrada:** um arquivo PDF de até 50 MB.
- **Páginas:** páginas avulsas e intervalos separados por vírgulas. Todas as páginas precisam existir no arquivo; uma página listada duas vezes é convertida uma vez só.
- **Saída:** até 500 imagens por execução, com o nome do arquivo e o número da página, como report-3.jpg.
- **Resolução:** 72, 150 ou 300 DPI. Nenhum lado de uma imagem pode passar de 10.000 pixels, então páginas muito grandes, como pôsteres e plantas, precisam de uma resolução menor.
- **Senhas:** arquivos que pedem senha para abrir não podem ser convertidos.
- **Memória:** o arquivo e todas as imagens ficam na memória, então documentos longos a 300 DPI podem falhar no celular. Converta-os em intervalos de páginas menores.

Para manter as páginas como PDF, use o [Dividir PDF](/pt/split-pdf); para mudar depois o formato das imagens, use o [Conversor de imagens](/pt/image-converter).

## Privacidade

Seu documento é processado apenas no seu dispositivo. A página não o envia, não o armazena e não usa cookies.
