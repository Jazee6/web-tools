---
review: draft
updated: 2026-11-03
title: Recortador de imagens – Recorte, gire e espelhe JPEG, PNG e WebP
description: "Recorte uma imagem em qualquer área ou numa proporção como 1:1 ou 16:9, e gire ou espelhe antes. Grátis e privado: tudo roda no seu navegador, nada é enviado."
name: Recortador de imagens
answer: Escolha uma imagem, arraste a moldura de recorte ou escolha uma proporção, gire ou espelhe se precisar e clique em Recortar imagem — a imagem é recortada no seu dispositivo, no mesmo formato, e você baixa o resultado.
action: Recortar imagem
fields:
  file:
    label: Imagem (JPEG, PNG, WebP ou AVIF)
  rotate:
    label: Girar no sentido horário
    options:
      "0": Sem girar
      "90": 90°
      "180": 180°
      "270": 270°
  flipHorizontal:
    label: Espelhar na horizontal
  flipVertical:
    label: Espelhar na vertical
  aspect:
    label: Proporção
    options:
      free: Livre
      "1:1": 1:1 (quadrado)
      "4:3": 4:3 (paisagem)
      "3:4": 3:4 (retrato)
      "3:2": 3:2 (paisagem)
      "2:3": 2:3 (retrato)
      "16:9": 16:9 (widescreen)
      "9:16": 9:16 (vertical)
  crop:
    label: Área de recorte (x, y, largura, altura em px)
    placeholder: Imagem inteira, ou centralizada na proporção
  quality:
    label: Qualidade (1–100)
output:
  file:
    label: Imagem recortada
errors:
  decode_failed: Não foi possível ler este arquivo como imagem. Ele pode estar danificado. Exporte-o novamente e tente de novo.
  too_large: Seu navegador não consegue manter tantos pixels. Navegadores de celular permitem menos que os de computador; tente uma área de recorte menor ou use um computador.
  crop_out_of_range: "A área de recorte passa da borda da imagem. Mantenha-a dentro do tamanho da imagem depois de girar, em pixels:"
  invalid_crop: "Informe a área de recorte com quatro números inteiros — x, y, largura e altura —, como 40, 0, 240, 240. Não foi possível ler:"
steps:
  - Escolha uma imagem JPEG, PNG, WebP ou AVIF de até 50 MB.
  - Se precisar, escolha quanto girar no sentido horário e se quer espelhar. A prévia mostra o resultado, e o recorte é medido nela.
  - Escolha uma proporção ou deixe Livre. Arraste a moldura de recorte para movê-la e os cantos para mudar o tamanho, ou digite a área como x, y, largura, altura.
  - Clique em Recortar imagem e baixe a imagem recortada.
faq:
  - q: Minhas imagens são enviadas para um servidor?
    a: Não. A imagem é decodificada, recortada e codificada de novo dentro do seu navegador, então nunca sai do seu dispositivo.
  - q: Como recorto uma imagem em formato quadrado?
    a: Escolha 1:1 (quadrado) como proporção. A moldura de recorte vira o maior quadrado no centro da imagem, e você pode arrastá-la até a parte que quer manter antes de clicar em Recortar imagem.
  - q: Como alterno entre paisagem e retrato, como 16:9 e 9:16?
    a: Escolha a outra proporção na lista ou clique no botão de troca abaixo da prévia. Mudar a proporção, o giro ou o espelhamento leva a moldura de recorte de volta à área centralizada.
  - q: Recortar reduz a qualidade?
    a: Os pixels que você mantém são copiados um a um, sem redimensionar. Depois, JPEG, WebP e AVIF são codificados de novo na qualidade definida (85 por padrão), o que adiciona uma pequena perda de compressão; o PNG continua sem perdas.
  - q: Posso recortar e redimensionar ao mesmo tempo?
    a: Não nesta ferramenta, que mantém os pixels recortados no tamanho original. Recorte primeiro e depois use o [Redimensionador de imagens](/pt/image-resizer) para mudar a largura e a altura.
  - q: Os dados EXIF da foto são mantidos?
    a: Não. A imagem é codificada de novo a partir dos pixels, então dados EXIF como o modelo da câmera e a localização GPS não ficam no resultado. A orientação EXIF é aplicada antes, então a prévia e o resultado ficam na posição certa.
---

## Como o recorte funciona

A ferramenta decodifica a imagem com o decodificador de imagens integrado ao seu navegador, que também aplica a orientação EXIF. Ela gira a imagem no sentido horário em passos de 90°, espelha a imagem girada e copia os pixels dentro da área de recorte para um canvas sem suavização, então nenhum pixel é misturado nem deslocado. O recorte é medido na imagem como você a vê na prévia, depois de girar e espelhar. O resultado é codificado de novo com versões WebAssembly do MozJPEG, do libwebp e do libaom, e a saída PNG passa pelo OxiPNG. O trabalho roda em uma thread em segundo plano.

## Opções e limites

- **Entrada:** uma imagem JPEG, PNG, WebP ou AVIF de até 50 MB. O formato de saída é sempre o mesmo da entrada.
- **Área de recorte:** x e y são o canto superior esquerdo, em pixels inteiros, e a área precisa ficar dentro da imagem. Deixe vazia para manter a imagem inteira, ou a maior área centralizada na proporção escolhida. Quando você informa uma área, a proporção só orienta a moldura de recorte.
- **Girar e espelhar:** o giro é de 90°, 180° ou 270° no sentido horário; o espelhamento inverte a imagem girada da esquerda para a direita ou de cima para baixo.
- **Qualidade:** vale para JPEG, WebP e AVIF, com padrão 85. O PNG é sempre sem perdas.
- **Transparência:** mantida em PNG, WebP e AVIF.
- **Navegadores:** navegadores de celular permitem menos pixels no total que os de computador, então imagens muito grandes podem parar com uma mensagem. A codificação de AVIF e PNG usa várias threads quando o navegador permite; navegadores baseados em WebKit, como o Safari, usam uma só, então esses formatos demoram mais lá.

## Privacidade

Suas imagens são processadas só no seu dispositivo. A página não as envia, não as armazena e não usa cookies.
