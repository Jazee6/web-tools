---
review: reviewed
updated: 2026-11-16
title: Gerador de QR code – Crie QR codes com logotipo e cores online
description: "Transforme um link ou texto em um QR code PNG ou SVG, com suas cores, o tamanho que quiser e um logotipo no centro. Grátis e privado: é processado no seu navegador."
name: Gerador de QR code
answer: Digite ou cole um link ou texto e o QR code aparece enquanto você escreve; escolha PNG ou SVG, o tamanho, as cores e um logotipo opcional e clique em Baixar para salvar a imagem.
action: Gerar QR code
fields:
  text:
    label: Texto ou URL
    placeholder: https://example.com/
  format:
    label: Formato
    options:
      png: PNG
      svg: SVG
  size:
    label: Tamanho (pixels)
  errorCorrection:
    label: Correção de erros
    options:
      L: L – cerca de 7%
      M: M – cerca de 15%
      Q: Q – cerca de 25%
      H: H – cerca de 30%
  margin:
    label: Margem (módulos)
  foreground:
    label: Cor de primeiro plano
  background:
    label: Cor de fundo
  logo:
    label: Logotipo (PNG, JPEG ou WebP, opcional)
output:
  file:
    label: QR code
errors:
  too_long: Este texto é longo demais para um QR code com este nível de correção de erros. Encurte o texto ou escolha um nível mais baixo; o L comporta mais conteúdo.
  too_long_high: Este texto é longo demais para um QR code com o nível de correção de erros H. Encurte o texto ou escolha um nível mais baixo. Com um logotipo, o nível H é sempre usado, então remova o logotipo primeiro para usar um nível mais baixo.
  too_small: Este tamanho é pequeno demais para tanto texto; cada módulo teria menos de um pixel. Escolha um tamanho maior ou encurte o texto.
  logo_decode_failed: Não foi possível ler este arquivo como imagem. Ele pode estar danificado, ou seu navegador não consegue decodificar o formato. Exporte de novo como PNG e tente outra vez.
steps:
  - Digite ou cole um link ou qualquer texto em Texto ou URL. O QR code é atualizado enquanto você escreve.
  - Escolha o Formato, o Tamanho (pixels), a Correção de erros e a Margem (módulos) de que você precisa.
  - Se quiser, mude a Cor de primeiro plano e a Cor de fundo, ou adicione um Logotipo (PNG, JPEG ou WebP, opcional) no centro.
  - Escaneie o QR code com o celular para conferir se ele funciona.
  - Clique em Baixar para salvar a imagem.
faq:
  - q: Os QR codes expiram?
    a: Não. O texto fica gravado no próprio desenho, então o código funciona enquanto o link ou o texto dentro dele continuar válido. Nada passa por um serviço de redirecionamento, e não há limite de leituras nem rastreamento.
  - q: Devo baixar PNG ou SVG?
    a: PNG é uma imagem comum no tamanho que você escolher, para documentos, apresentações e sites. SVG é uma imagem vetorial que continua nítida em qualquer tamanho, boa para impressão e programas de design. Alguns apps não abrem arquivos SVG; nesses casos, use PNG.
  - q: Qual nível de correção de erros devo escolher?
    a: O M, que é o padrão, serve para a maioria dos usos. Um nível mais alto permite ler o código mesmo quando parte dele está suja, danificada ou coberta, mas o desenho fica mais denso para o mesmo texto. As porcentagens são a parte dos dados do código que pode ser recuperada, não uma garantia para qualquer área coberta. O L comporta mais texto e gera os maiores módulos, o que ajuda em códigos impressos pequenos. Com um logotipo, o H é sempre usado.
  - q: Meu QR code vai funcionar com um logotipo?
    a: Deve funcionar. O logotipo cobre cerca de um quarto da largura do código, no centro, e o nível de correção de erros H consegue recuperar até cerca de 30% dos dados do código. Escaneie o resultado com um ou dois celulares antes de imprimir, principalmente com texto longo ou cores claras.
  - q: Posso usar qualquer cor?
    a: "Qualquer cor #RRGGBB funciona, mas os leitores precisam de bom contraste. Use um primeiro plano escuro sobre fundo claro; módulos claros sobre fundo escuro, ou duas cores parecidas, podem não ser lidos em todos os apps."
  - q: Quanto texto cabe em um QR code?
    a: Depende dos caracteres e do nível de correção de erros. No nível L, um código comporta até 7.089 dígitos, 4.296 letras maiúsculas e dígitos, 2.953 bytes de outro texto ou cerca de 984 caracteres chineses ou japoneses. No nível H cabe menos da metade disso.
---

## Como o QR code é criado

O texto é codificado com o [uqr](https://github.com/unjs/uqr), um codificador de QR code de código aberto que segue a ISO/IEC 18004. Ele escolhe a menor versão de QR code (de 1 a 40) que comporta o texto no nível de correção de erros escolhido. Texto só com dígitos usa o modo numérico; texto só com letras maiúsculas, dígitos, espaços e $%*+-./: usa o modo alfanumérico; e todo o resto é gravado como bytes UTF-8. Depois o desenho é feito em uma thread em segundo plano: como PNG, com cada borda de módulo em um pixel inteiro, sem bordas cinza borradas, ou como SVG, com um único caminho para todos os módulos escuros.

## Opções e limites

- **Texto:** até 7.089 caracteres e, na prática, limitado pelo que cabe em um QR code: no nível L, 2.953 bytes de texto como uma URL; no nível H, 1.273 bytes.
- **Formatos:** PNG ou SVG. O SVG tem a mesma largura e altura do PNG, e você pode redimensioná-lo sem perder nitidez.
- **Tamanho:** de 128 a 4.096 pixels para a imagem inteira, com a margem. O padrão é 512. Cada módulo precisa de pelo menos um pixel, então um texto longo em um tamanho pequeno é recusado.
- **Margem:** de 0 a 16 módulos da cor de fundo em volta do código; o padrão de 4 é a zona de silêncio que a norma pede. Sem margem, um leitor pode não encontrar o código sobre um fundo carregado.
- **Correção de erros:** L, M, Q ou H conseguem recuperar cerca de 7%, 15%, 25% ou 30% dos dados do código. O padrão é M.
- **Cores:** qualquer cor #RRGGBB de primeiro plano e de fundo.
- **Logotipo:** uma imagem PNG, JPEG ou WebP opcional de até 5 MB. Ela fica sobre um quadrado da cor de fundo que ocupa cerca de 24% da largura do código, e o nível H é usado. No SVG, o logotipo é incorporado como cópia do arquivo original.
- **Navegadores:** o PNG é desenhado com OffscreenCanvas em uma thread em segundo plano, e o logotipo é lido pelo decodificador de imagens do navegador. As versões atuais dos principais navegadores têm suporte aos dois; um navegador antigo pode não conseguir gerar a imagem.
- **Não incluído:** a ferramenta cria só QR codes padrão. Módulos arredondados, degradês e outros tipos de código de barras não são suportados.

## Privacidade

Seu texto e seu logotipo são processados só no seu dispositivo. A página não os envia, não os armazena e não usa cookies.
