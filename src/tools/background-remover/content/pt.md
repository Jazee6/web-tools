---
review: reviewed
updated: 2026-11-14
title: Removedor de fundo – Remova o fundo de imagens online grátis
description: "Remova o fundo de uma foto e receba um PNG ou WebP com fundo transparente, ou uma cor sólida. Grátis e privado — a IA roda no seu navegador, as fotos não são enviadas."
name: Removedor de fundo
answer: "Escolha uma foto, mantenha PNG para um fundo transparente ou informe uma cor de fundo e toque em Remover o fundo para que um modelo de IA no seu dispositivo remova o fundo e você baixe a imagem."
action: Remover o fundo
fields:
  file:
    label: Imagem (HEIC, JPEG, PNG, WebP ou AVIF)
  format:
    label: Formato de saída
    options:
      png: PNG (transparente)
      webp: "WebP (transparente)"
      jpeg: JPEG (precisa de cor de fundo)
  background:
    label: Cor de fundo (hexadecimal)
    placeholder: "Transparente, ou uma cor como #ffffff"
  quality:
    label: Qualidade (1–100)
output:
  file:
    label: Imagem sem fundo
errors:
  decode_failed: Não foi possível ler este arquivo como imagem. Ele pode estar corrompido, ou seu navegador não consegue decodificar o formato. Exporte de novo como JPEG ou PNG e tente outra vez.
  too_large: Seu navegador não consegue manter tantos pixels. Navegadores de celular permitem menos que os de computador; tente uma imagem menor ou use um computador.
  background_required: "JPEG não tem transparência, então precisa de uma cor de fundo. Informe uma, como #ffffff para branco, ou escolha PNG ou WebP para manter o fundo transparente."
  invalid_color: "Informe a cor de fundo como um código hexadecimal de três ou seis dígitos, como #fff ou #ffffff, ou deixe em branco. Não foi possível ler:"
steps:
  - Escolha uma imagem HEIC, JPEG, PNG, WebP ou AVIF de até 50 MB.
  - "Escolha um formato em Formato de saída. PNG e WebP mantêm o fundo transparente; o JPEG precisa de uma cor de fundo."
  - "Para colocar o objeto principal sobre uma cor sólida, informe-a em Cor de fundo (hexadecimal), como #ffffff."
  - "Toque em Remover o fundo. Na primeira vez, o modelo de IA e seu ambiente de execução (cerca de 125–150 MB) são baixados e salvos no navegador quando há espaço."
  - Baixe a imagem sem fundo.
faq:
  - q: Minhas fotos são enviadas para um servidor?
    a: "Não. A imagem é decodificada, analisada pelo modelo e codificada de novo dentro do seu navegador. A ferramenta baixa o modelo de IA e seu ambiente de execução, mas a sua foto nunca sai do seu dispositivo."
  - q: Como deixo o fundo branco, por exemplo para uma foto de produto?
    a: "Informe #ffffff como cor de fundo. O objeto principal fica sobre branco e o resultado não tem transparência, então você também pode salvá-lo como JPEG."
  - q: Por que a primeira vez é mais lenta?
    a: "A ferramenta primeiro baixa o modelo BiRefNet e seu ambiente de execução, cerca de 125–150 MB conforme o dispositivo, e os guarda no navegador quando há espaço. As vezes seguintes podem usar essa cópia enquanto o navegador a mantiver."
  - q: "Posso escolher qual objeto manter?"
    a: "Não. O modelo escolhe o objeto principal sozinho, e não há como marcar um objeto manualmente. Confira as bordas do resultado antes de usar."
  - q: Posso remover o fundo de várias imagens de uma vez?
    a: Não nesta ferramenta, que processa uma imagem por vez. Depois que o modelo é carregado, as próximas imagens são processadas sem baixá-lo de novo.
  - q: Os dados EXIF da foto são mantidos?
    a: Não. A imagem é codificada de novo a partir dos pixels, então dados EXIF como o modelo da câmera e a localização GPS não ficam no resultado. Em JPEG, PNG, WebP e AVIF, a orientação EXIF é aplicada antes, então o resultado fica na posição certa.
---

## Como a remoção de fundo funciona

A ferramenta decodifica a imagem com o decodificador de imagens do próprio navegador, ou com uma versão em WebAssembly do libheif para HEIC, e passa uma cópia ao BiRefNet_lite, um modelo de segmentação de código aberto (licença MIT). O modelo roda com o ONNX Runtime em uma thread em segundo plano e calcula, para cada pixel, a probabilidade de ele pertencer ao objeto principal. Essa máscara é ampliada de volta ao tamanho total da imagem e vira a transparência dela: o objeto principal permanece, e o fundo fica transparente ou é preenchido com a cor que você informou. O resultado é codificado em PNG (depois otimizado com OxiPNG), WebP ou JPEG.

## Opções e limites

- **Entrada:** uma imagem HEIC, JPEG, PNG, WebP ou AVIF de até 50 MB. Áreas que já são transparentes continuam transparentes, a menos que você informe uma cor de fundo.
- **Saída:** PNG e WebP mantêm o fundo transparente; JPEG não tem transparência e precisa de uma cor de fundo. A imagem mantém a largura e a altura.
- **Cor de fundo:** um código hexadecimal como #ffffff ou #fff. Deixe em branco para um fundo transparente.
- **Qualidade:** vale para WebP e JPEG, com padrão 90. PNG é sempre sem perdas.
- **Navegadores:** com WebGPU e uma GPU que suporte números de ponto flutuante de 16 bits, o modelo roda na GPU e analisa a imagem em 1024 × 1024 pixels. Caso contrário, roda na CPU em 512 × 512 pixels, então as bordas podem ficar menos precisas em imagens grandes. Na CPU, usa várias threads quando o navegador permite.
- **Download:** o modelo e seu ambiente de execução têm cerca de 150 MB com WebGPU ou cerca de 125 MB sem, e são baixados no primeiro uso.
- **Precisão:** o modelo encontra o objeto principal automaticamente; não dá para escolher qual objeto manter.

## Privacidade

Suas imagens são processadas só no seu dispositivo. A página não as envia, não as armazena e não usa cookies.
