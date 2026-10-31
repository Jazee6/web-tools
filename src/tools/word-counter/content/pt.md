---
review: draft
updated: 2026-10-31
title: Contador de palavras – Conte palavras, caracteres e frases online
description: "Conte palavras, caracteres, bytes, linhas, frases e parágrafos de um texto, inclusive em chinês e japonês. Grátis e privado: tudo no seu navegador."
name: Contador de palavras
answer: "Cole seu texto e clique em Contar: as palavras, os caracteres com e sem espaços, os bytes, as linhas, as frases e os parágrafos aparecem no seu navegador."
action: Contar
fields:
  text:
    label: Texto
    placeholder: Cole ou digite seu texto aqui
output:
  words:
    label: Palavras
  characters:
    label: Caracteres
  charactersNoSpaces:
    label: Caracteres (sem espaços)
  bytes:
    label: Bytes (UTF-8)
  lines:
    label: Linhas
  sentences:
    label: Frases
  paragraphs:
    label: Parágrafos
steps:
  - Cole ou digite seu texto no campo Texto.
  - Clique em Contar.
  - Leia os números de que precisa; há Palavras, Caracteres, Caracteres (sem espaços), Bytes (UTF-8), Linhas, Frases e Parágrafos.
faq:
  - q: Meu texto é enviado para um servidor?
    a: Não. A contagem acontece inteiramente no seu navegador, então o texto não sai do seu dispositivo. Depois que a página carrega, você pode até usá-la offline.
  - q: Como as palavras são contadas?
    a: Uma palavra é qualquer trecho de caracteres entre espaços ou quebras de linha que contenha uma letra ou um dígito, então "well-known", "don't" e "3.14" contam como uma palavra cada, e um travessão solto não conta. Os caracteres chineses e os kana e kanji japoneses não têm espaços entre as palavras, por isso cada um conta como uma palavra, como no Microsoft Word. O coreano é separado por espaços e é contado como o inglês.
  - q: Por que há menos caracteres do que unidades de código no meu texto?
    a: Os caracteres são contados como um leitor os vê. Um emoji como 😀, um emoji de família formado por vários emojis unidos ou uma letra seguida de um acento contam como um caractere cada, e uma quebra de linha do Windows (CRLF) conta como um. Espaços, tabulações e quebras de linha entram em Caracteres e ficam fora de Caracteres (sem espaços).
  - q: Por que os bytes são diferentes dos caracteres?
    a: Bytes são o tamanho do texto salvo em UTF-8. As letras do inglês ocupam 1 byte, as letras acentuadas 2, a maioria dos caracteres chineses e japoneses 3 e os emojis 4. É o número que importa para limites de tamanho de arquivo ou de campos de banco de dados.
  - q: Como a ferramenta conta as frases?
    a: Uma frase termina em um ponto final, ponto de exclamação, ponto de interrogação ou reticências (…) seguidos de um espaço ou do fim do texto, ou em 。, ！ ou ？ no chinês e no japonês. Um número como 3.14 ou um domínio como example.com não encerra a frase, mas uma abreviatura como "Mr." encerra, então textos cheios de abreviaturas têm uma contagem alta.
  - q: O que conta como parágrafo?
    a: Um bloco de texto separado do seguinte por pelo menos uma linha em branco; uma linha só com espaços conta como em branco. Linhas conta todas as linhas, inclusive as vazias, e uma quebra de linha no fim do texto não acrescenta outra linha.
---

## O que este contador de palavras faz

A ferramenta lê o seu texto uma só vez e informa sete números. Os caracteres são contados como grafemas, as unidades que o leitor vê como um único caractere, com o `Intl.Segmenter` do navegador, conforme o [Anexo nº 29 do padrão Unicode](https://www.unicode.org/reports/tr29/). Palavras, frases e parágrafos seguem regras fixas que não dependem do navegador nem do idioma, então o mesmo texto dá os mesmos números em qualquer lugar. Os bytes são medidos codificando o texto em UTF-8.

## Opções e limites

- **Entrada:** um texto por vez, do tamanho que couber no seu dispositivo. Um texto vazio não é contado.
- **Palavras:** trechos separados por espaços que contêm uma letra ou um dígito. Os caracteres chineses e os kana e kanji japoneses contam uma palavra cada; o tailandês e outras escritas sem espaços são contados como trechos separados por espaços, então o número de palavras fica baixo demais.
- **Frases:** contadas a partir da pontuação, então abreviaturas como "Mr." ou "e.g." encerram uma frase, e um texto sem pontuação conta como uma frase só.
- **Quebras de linha:** `\n`, `\r\n` e `\r` iniciam uma nova linha.
- **Não incluído:** tempo de leitura, tempo de fala e densidade de palavras-chave.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena seu texto e não usa cookies.
