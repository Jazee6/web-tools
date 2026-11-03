---
review: draft
updated: 2026-11-03
title: Imagem para PDF – Converta JPG, PNG e WebP em PDF online grátis
description: Transforme imagens JPG, PNG, WebP e AVIF em um único PDF com páginas A4, Carta ou do tamanho da imagem. Grátis e privado — suas imagens nunca são enviadas.
name: Imagem para PDF
answer: Escolha suas imagens, coloque-as em ordem, escolha um tamanho de página e clique em Criar PDF — cada imagem vira uma página de um único PDF, criado no seu dispositivo e pronto para baixar.
action: Criar PDF
fields:
  files:
    label: Imagens (JPEG, PNG, WebP ou AVIF)
  pageSize:
    label: Tamanho da página
    options:
      a4: A4 (210 × 297 mm)
      letter: Carta EUA (8,5 × 11 pol.)
      fit: Igual à imagem
  orientation:
    label: Orientação
    options:
      auto: Automática (conforme cada imagem)
      portrait: Retrato
      landscape: Paisagem
  margin:
    label: Margem
    options:
      none: Nenhuma
      small: Pequena (0,5 pol.)
      large: Grande (1 pol.)
output:
  file:
    label: PDF
errors:
  decode_failed: "Não foi possível ler este arquivo como imagem. Ele pode estar danificado. Exporte-o novamente ou remova-o da lista e tente de novo:"
  too_large: "Esta imagem tem pixels demais para o seu navegador processar. Reduza-a com o Redimensionador de imagens ou remova-a da lista e tente de novo:"
steps:
  - Escolha até 50 imagens JPEG, PNG, WebP ou AVIF, com até 50 MB cada. Você pode adicioná-las em várias etapas.
  - Use as setas para cima e para baixo para ordenar as imagens. A primeira imagem vira a primeira página.
  - Escolha o Tamanho da página. A4 e Carta EUA servem para documentos que você vai imprimir; Igual à imagem deixa cada página exatamente do tamanho da sua imagem.
  - Em A4 e Carta EUA, deixe a Orientação em Automática para virar a página nas imagens largas, ou escolha Retrato ou Paisagem para todas as páginas. Adicione uma Margem se quiser espaço em branco ao redor das imagens.
  - Clique em Criar PDF e baixe o arquivo.
faq:
  - q: Minhas imagens são enviadas para um servidor?
    a: Não. O PDF é criado dentro do seu navegador com o PDFium compilado para WebAssembly, então suas imagens nunca saem do seu dispositivo.
  - q: Converter para PDF reduz a qualidade das imagens?
    a: Não em JPEG, PNG e WebP sem perdas. Os arquivos JPEG são colocados no PDF byte a byte, sem nova compressão, e as imagens PNG e WebP sem perdas mantêm toda a qualidade. Imagens WebP com perdas e AVIF sem transparência são convertidas para JPEG com qualidade 90 para manter o arquivo pequeno, o que pode adicionar leves artefatos de compressão.
  - q: A foto do meu celular aparece deitada em outras ferramentas. Aqui ela fica em pé?
    a: Sim. Celulares costumam salvar fotos na orientação do sensor, com uma etiqueta de rotação. A ferramenta lê essa etiqueta e coloca a foto na posição certa, sem recodificá-la.
  - q: Como as imagens são posicionadas em páginas A4 ou Carta?
    a: Cada imagem é ajustada para caber dentro das margens, mantendo as proporções, e centralizada na página. Imagens pequenas são ampliadas para preencher o espaço, então imagens muito pequenas podem ficar borradas na impressão.
  - q: Qual é o tamanho de uma página com Igual à imagem?
    a: A página assume o tamanho da imagem a 96 pixels por polegada, mais a margem escolhida. Uma captura de tela de 1920 × 1080 pixels vira uma página de 20 × 11,25 polegadas.
  - q: Posso adicionar fotos HEIC de um iPhone?
    a: Não diretamente. Converta-as primeiro para JPEG com o Conversor de imagens e depois adicione os arquivos JPEG aqui.
---

## Como o PDF é criado

A ferramenta usa o PDFium — o mecanismo de PDF do Google Chrome — compilado para WebAssembly e cria uma página por imagem, na ordem da sua lista. Primeiro, o navegador decodifica cada arquivo para confirmar que é uma imagem legível. Depois, os arquivos JPEG são incorporados sem alterações, e a etiqueta de rotação é aplicada girando a imagem na página. Imagens PNG, imagens WebP sem perdas e qualquer imagem com transparência são guardadas sem perdas; nas áreas transparentes aparece o branco da página. Imagens WebP com perdas e AVIF sem transparência são convertidas para JPEG com qualidade 90. O trabalho acontece em uma thread em segundo plano, então a página continua respondendo.

## Opções e limites

- **Entrada:** de 1 a 50 imagens JPEG, PNG, WebP ou AVIF, com até 50 MB cada. HEIC não é aceito; converta antes com o [Conversor de imagens](/pt/image-converter).
- **Páginas:** A4 (210 × 297 mm), Carta EUA (8,5 × 11 pol.) ou o tamanho de cada imagem a 96 pixels por polegada. As margens são de 0,5 pol. (12,7 mm) ou 1 pol. (25,4 mm) em todos os lados.
- **Posicionamento:** as imagens mantêm as proporções, ficam centralizadas e são ampliadas ou reduzidas para caber dentro das margens. Nada é cortado.
- **Saída:** um PDF com o nome da primeira imagem. O texto das imagens não pode ser pesquisado nem selecionado.
- **Memória:** imagens guardadas sem perdas ficam sem compressão na memória até o PDF ser salvo, então muitas capturas de tela grandes podem falhar no celular. Crie o PDF em lotes menores e junte-os com o [Juntar PDF](/pt/merge-pdf).

Para reduzir as fotos antes de adicioná-las, use o [Redimensionador de imagens](/pt/image-resizer); para transformar páginas de PDF de volta em imagens, use o [PDF para imagem](/pt/pdf-to-image).

## Privacidade

Suas imagens são processadas apenas no seu dispositivo. A página não as envia, não as armazena e não usa cookies.
