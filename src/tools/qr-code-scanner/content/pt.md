---
review: reviewed
updated: 2026-11-16
title: Leitor de QR code – Escaneie QR codes e códigos de barras on-line
description: "Leia QR codes e códigos de barras em uma captura de tela, uma foto ou pela câmera e copie o conteúdo. Grátis e privado: o escaneamento acontece no seu navegador."
name: Leitor de QR code
answer: Escolha uma imagem com um QR code ou código de barras, ou clique em Usar a câmera e aponte para o código; o texto decodificado aparece na hora, com o tipo do código, pronto para copiar.
action: Escanear
fields:
  file:
    label: Imagem (JPEG, PNG, WebP, GIF, BMP ou AVIF)
output:
  codes:
    label: Códigos encontrados
    columns:
      text: Conteúdo
      format: Tipo
errors:
  decode_failed: Não foi possível ler este arquivo como imagem. Ele pode estar danificado, ou seu navegador não consegue decodificar o formato. Exporte de novo como JPEG ou PNG e tente outra vez.
  too_large: Esta imagem pode ter mais pixels do que seu navegador consegue processar. Navegadores de celular aceitam menos que os de computador; tente uma imagem menor ou um computador.
  not_found: Nenhum QR code ou código de barras foi encontrado nesta imagem. Verifique se o código aparece inteiro, nítido e não muito pequeno, ou recorte a imagem ao redor do código e tente outra vez.
steps:
  - Escolha uma imagem em Imagem (JPEG, PNG, WebP, GIF, BMP ou AVIF), como uma captura de tela ou uma foto de um código. A imagem é escaneada assim que você a escolhe.
  - Ou clique em Usar a câmera, permita o acesso à câmera e mostre o código para ela. A câmera desliga assim que um código é lido.
  - Confira o Conteúdo e o Tipo de cada código encontrado e copie o texto de que precisa.
faq:
  - q: É seguro abrir o link de um QR code?
    a: Confira antes. A ferramenta só mostra o texto gravado no código e nunca abre links sozinha, então você vê para onde o link leva antes de acessá-lo. Cuidado com links encurtados e endereços que imitam um site conhecido.
  - q: Ele também lê códigos de barras?
    a: Sim. Além de QR codes, lê Micro QR, rMQR, Data Matrix, Aztec, PDF417 e MaxiCode, e códigos de barras como EAN-13, EAN-8, UPC-A, UPC-E, Code 39, Code 93, Code 128, Codabar, ITF e DataBar. A coluna Tipo mostra de que tipo é cada código.
  - q: O que acontece com vários códigos em uma imagem?
    a: Todos aparecem na lista, cada um com seu conteúdo e tipo, até 255 códigos por imagem.
  - q: Por que a câmera não funciona?
    a: O navegador precisa permitir que a página use a câmera; se você bloqueou, permita o acesso à câmera nas configurações do site e clique em Usar a câmera de novo. O botão não fica disponível em navegadores sem suporte a câmera. Você sempre pode tirar uma foto ou uma captura de tela do código e escolhê-la como imagem.
  - q: Por que nenhum código foi encontrado?
    a: O código pode estar borrado, pequeno demais, cortado na borda da imagem ou com pouco contraste. Use uma imagem mais nítida, recorte a imagem ao redor do código ou aproxime a câmera. A ferramenta também tenta ler códigos com módulos claros sobre fundo escuro.
---

## Como o escaneamento funciona

A imagem é decodificada pelo decodificador de imagens do seu navegador e analisada pelo [zxing-cpp](https://github.com/zxing-cpp/zxing-cpp), uma biblioteca de código de barras de código aberto compilada para WebAssembly e executada em uma thread em segundo plano. Ela procura todos os tipos de código suportados de uma vez, também tenta códigos girados, espelhados e invertidos, e devolve o texto decodificado de cada código que consegue ler por completo. No modo câmera, os quadros da câmera são reduzidos para no máximo 1.280 pixels no lado maior e escaneados um após o outro; o primeiro quadro com um código fica como imagem, e os códigos dele são exibidos.

## Opções e limites

- **Entrada:** uma imagem JPEG, PNG, WebP, GIF, BMP ou AVIF de até 20 MB, ou a câmera. Em um GIF animado, só o primeiro quadro é escaneado. Imagens HEIC não são suportadas; converta antes com o [Conversor de imagens](/pt/image-converter).
- **Saída:** uma tabela com o texto e o tipo de cada código encontrado, até 255 por imagem. Conteúdo binário que não é texto pode não aparecer corretamente.
- **Tipos de código:** QR Code, Micro QR, rMQR, Data Matrix, Aztec, PDF417, MaxiCode, EAN-13, EAN-8, UPC-A, UPC-E, Code 39, Code 93, Code 128, Codabar, ITF, DataBar e outros suportados pelo zxing-cpp.
- **Câmera:** pede a câmera traseira quando existe uma e para depois do primeiro escaneamento bem-sucedido; clique em Usar a câmera de novo para escanear outro código. Precisa de um navegador com suporte a câmera e da sua permissão.
- **Navegadores:** JPEG, PNG, GIF e BMP funcionam em todos os navegadores atuais; AVIF funciona onde o navegador tem suporte.
- **Download:** o leitor em WebAssembly, de cerca de 950 KB, é baixado no primeiro escaneamento.

## Privacidade

Suas imagens e os quadros da câmera são processados só no seu dispositivo. A página não os envia, não os armazena e não usa cookies.
