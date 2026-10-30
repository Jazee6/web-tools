---
review: draft
updated: 2026-10-30
title: Conversor de cores – HEX, RGB, HSL, HWB e OKLCH online
description: "Converta uma cor CSS entre HEX, RGB, HSL, HWB e OKLCH, com alfa. Grátis e privado: funciona no seu navegador e nada é enviado."
name: Conversor de cores
answer: "Cole uma cor em HEX, RGB, HSL, HWB ou OKLCH e clique em Converter: a mesma cor aparece nos cinco formatos no seu navegador, pronta para copiar."
action: Converter
fields:
  value:
    label: Cor
    placeholder: "#ff5733 ou rgb(255 87 51) ou hsl(11 100% 60%)"
output:
  hex:
    label: HEX
  rgb:
    label: RGB
  hsl:
    label: HSL
  hwb:
    label: HWB
  oklch:
    label: OKLCH
errors:
  invalid_color: "Não foi possível ler esta cor. Use um código hexadecimal como #ff5733 (3, 4, 6 ou 8 dígitos) ou rgb(), hsl(), hwb() ou oklch() com três valores, por exemplo rgb(255 87 51) ou hsl(11, 100%, 60%). Nomes de cores como red não são aceitos."
steps:
  - "Digite ou cole uma cor no campo, por exemplo #ff5733, rgb(255 87 51), hsl(11 100% 60%), hwb(11 20% 0%) ou oklch(0.68 0.21 34)."
  - Clique em Converter.
  - "Copie o formato de que precisa: HEX, RGB, HSL, HWB ou OKLCH."
faq:
  - q: O que eu digito é enviado para um servidor?
    a: Não. A conversão acontece inteiramente no seu navegador, então o que você digita nunca sai do seu dispositivo. Você pode até usar a página offline depois que ela for carregada.
  - q: Quais formatos de cor posso informar?
    a: Códigos hexadecimais de 3, 4, 6 ou 8 dígitos e as funções CSS rgb(), rgba(), hsl(), hsla(), hwb() e oklch(). Cada função aceita a sintaxe com vírgulas, rgb(255, 87, 51), e a sintaxe com espaços, rgb(255 87 51 / 0.5), em que o que vem depois da barra é o alfa. O matiz pode ser um número de graus ou usar as unidades deg, grad, rad ou turn.
  - q: Posso digitar um nome de cor como red?
    a: "Não. A ferramenta lê apenas códigos hexadecimais e as cinco funções acima, então nomes de cores são rejeitados com um erro. Use #ff0000 ou rgb(255 0 0)."
  - q: Como a transparência é tratada?
    a: O alfa é mantido em todos os resultados. O HEX ganha mais um par de dígitos (#ff573380) e os outros formatos ganham um valor depois de uma barra (rgb(255 87 51 / 0.5)). O alfa é arredondado para três casas decimais, e uma cor totalmente opaca é escrita sem alfa.
  - q: Por que o valor convertido é um pouco diferente do que informei?
    a: Os canais de RGB e HEX são números inteiros de 0 a 255, então uma cor informada em HSL, HWB ou OKLCH é arredondada primeiro para o valor de 8 bits mais próximo. Os outros formatos são calculados a partir dessa cor arredondada, o que mantém os cinco resultados coerentes entre si. Os valores de HSL e HWB mostram até uma casa decimal, e a luminosidade e o croma do OKLCH, até quatro.
  - q: O que acontece com uma cor OKLCH fora do gamut sRGB?
    a: O OKLCH consegue descrever cores que uma tela comum não exibe. Elas são ajustadas canal por canal aos valores sRGB mais próximos, então o resultado é uma cor parecida, porém menos vívida do que a que você informou.
---

## O que esta ferramenta de cores faz

A ferramenta converte sua entrada em uma cor no espaço de cor sRGB e a escreve em cinco formatos CSS. HSL e HWB são calculados a partir do RGB com as fórmulas do [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/). OKLCH é a forma polar do [Oklab](https://bottosson.github.io/posts/oklab/); a conversão entre sRGB e Oklab usa as matrizes publicadas por Björn Ottosson. Os resultados usam a sintaxe CSS moderna com espaços, por exemplo `rgb(255 87 51)`, `hsl(10.6 100% 60%)` e `oklch(0.6804 0.21 33.7)`.

## Opções e limites

- **Entrada:** uma cor por vez. Espaços no início e no fim são ignorados, e os nomes das funções e os dígitos hexadecimais não diferenciam maiúsculas de minúsculas.
- **Formatos aceitos:** hexadecimal de 3, 4, 6 ou 8 dígitos, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hwb()` e `oklch()`. Nomes de cores, `color()`, `lab()`, `lch()`, `oklab()` e `var()` não são aceitos.
- **Valores fora do intervalo:** os canais RGB, a saturação, a luminosidade, a brancura, a negrura e o alfa são ajustados ao intervalo válido. O matiz dá a volta, então `hsl(-120 100% 50%)` é o mesmo azul que `hsl(240 100% 50%)`.
- **Precisão:** HEX e RGB têm 8 bits. O matiz, a saturação, a luminosidade, a brancura e a negrura mostram até uma casa decimal; a luminosidade e o croma do OKLCH, até quatro.
- **Cores cinza:** uma cor sem matiz é mostrada com matiz 0.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena sua entrada e não usa cookies.
