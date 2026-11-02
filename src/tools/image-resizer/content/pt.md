---
review: draft
updated: 2026-11-02
title: Redimensionador de imagens – JPEG, PNG, WebP e AVIF online grátis
description: Redimensione imagens para uma largura e altura exatas, grátis. Privado e rápido — o redimensionamento é processado no seu navegador, então suas fotos nunca são enviadas.
name: Redimensionador de imagens
answer: Escolha suas imagens, informe uma largura, uma altura ou as duas e clique em Redimensionar imagens — elas são redimensionadas no seu dispositivo, no mesmo formato, e você baixa os resultados.
action: Redimensionar imagens
fields:
  files:
    label: Imagens (JPEG, PNG, WebP ou AVIF)
  width:
    label: Largura (px)
    placeholder: Auto
  height:
    label: Altura (px)
    placeholder: Auto
  fit:
    label: Quando os dois tamanhos são informados
    options:
      contain: Ajustar dentro e manter as proporções
      cover: Preencher o tamanho e recortar o excesso
      stretch: Esticar até o tamanho exato
  quality:
    label: Qualidade (1–100)
output:
  files:
    label: Imagens redimensionadas
errors:
  decode_failed: "Não foi possível ler este arquivo como imagem. Ele pode estar danificado. Exporte-o novamente ou remova-o e tente de novo:"
  too_large: "A imagem redimensionada ficaria grande demais: um lado passaria de 10.000 pixels, ou seu navegador não consegue manter tantos pixels. Informe um tamanho menor e tente de novo:"
  size_required: Informe uma largura, uma altura ou as duas.
steps:
  - Escolha até 20 imagens JPEG, PNG, WebP ou AVIF, de até 50 MB cada.
  - Informe uma largura, uma altura ou as duas, em pixels. Se informar só uma, a outra é calculada pelas proporções de cada imagem.
  - Se informou as duas, escolha como a imagem deve usar esse tamanho. Ajustar dentro mantém a imagem inteira, Preencher recorta o excesso igualmente dos dois lados e Esticar ignora as proporções.
  - Clique em Redimensionar imagens e baixe cada imagem ou todas juntas em um ZIP.
faq:
  - q: Minhas imagens são enviadas para um servidor?
    a: Não. As imagens são decodificadas, redimensionadas e codificadas dentro do seu navegador, então nunca saem do seu dispositivo.
  - q: Como mantenho as proporções?
    a: Informe só a largura ou só a altura, e o outro lado é calculado pelas proporções de cada imagem. Se informar os dois, deixe "Ajustar dentro e manter as proporções" selecionado. A imagem então cabe dentro desse tamanho, e um lado pode ficar menor do que você informou.
  - q: Como obtenho um tamanho exato sem distorcer a imagem?
    a: Informe largura e altura e escolha "Preencher o tamanho e recortar o excesso". A imagem é ampliada ou reduzida até cobrir o tamanho, e o que sobra é cortado igualmente dos dois lados.
  - q: Posso aumentar uma imagem?
    a: Sim, até 10.000 pixels por lado. Aumentar apenas espalha os pixels existentes por uma área maior, então a imagem fica mais suave e não ganha nenhum detalhe novo.
  - q: Posso redimensionar fotos HEIC do iPhone?
    a: Não diretamente. Converta-as antes com o [Conversor de imagens](/pt/image-converter) e depois redimensione o resultado.
  - q: Os dados EXIF da foto são mantidos?
    a: Não. A imagem é codificada de novo a partir dos pixels, então dados EXIF como o modelo da câmera e a localização GPS não ficam no resultado. A orientação EXIF é aplicada à imagem antes, então as fotos continuam na posição certa.
---

## Como o redimensionamento funciona

A ferramenta decodifica cada imagem com o decodificador de imagens integrado ao seu navegador, que também aplica a orientação EXIF. Ela desenha a imagem no novo tamanho em um canvas e faz grandes reduções em etapas de no máximo metade, o que evita que detalhes finos fiquem serrilhados. O resultado é codificado de novo com versões WebAssembly do MozJPEG, do libwebp e do libaom, e a saída PNG passa pelo OxiPNG. O trabalho roda em uma thread em segundo plano, uma imagem por vez.

## Opções e limites

- **Entrada:** de 1 a 20 imagens JPEG, PNG, WebP ou AVIF, de até 50 MB cada. O formato de saída é sempre o mesmo da entrada.
- **Tamanho:** de 1 a 10.000 pixels por lado. Navegadores de celular podem permitir menos pixels no total; nesse caso a ferramenta para com uma mensagem.
- **Qualidade:** vale para JPEG, WebP e AVIF, com padrão 85. O PNG é sempre sem perdas.
- **Transparência:** mantida em PNG, WebP e AVIF.
- **Navegadores:** a codificação de AVIF e PNG usa várias threads quando o navegador permite; navegadores baseados em WebKit, como o Safari, usam uma só, então esses formatos demoram mais lá.

## Privacidade

Suas imagens são processadas só no seu dispositivo. A página não as envia, não as armazena e não usa cookies.
