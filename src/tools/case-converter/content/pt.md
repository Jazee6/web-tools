---
review: draft
updated: 2026-10-31
title: Conversor de maiúsculas e minúsculas – Title Case, camelCase e mais
description: "Mude um texto para maiúsculas, minúsculas ou Title Case, ou para camelCase, snake_case e outros estilos. Grátis e privado: roda no seu navegador."
name: Conversor de maiúsculas e minúsculas
answer: "Cole seu texto, escolha um formato como Title Case ou snake_case e clique em Converter: o texto convertido aparece no seu navegador, pronto para copiar."
action: Converter
fields:
  text:
    label: Texto
    placeholder: Cole ou digite seu texto aqui
  mode:
    label: Formato
    options:
      title: Title Case (inicial maiúscula em cada palavra)
      sentence: Sentence case (só a primeira letra da frase)
      upper: MAIÚSCULAS
      lower: minúsculas
      camel: camelCase
      pascal: PascalCase
      snake: snake_case
      kebab: kebab-case
      constant: CONSTANT_CASE
output:
  result:
    label: Resultado
steps:
  - Cole ou digite seu texto no campo Texto.
  - Escolha um Formato; há Title Case, Sentence case, MAIÚSCULAS, minúsculas, camelCase, PascalCase, snake_case, kebab-case e CONSTANT_CASE.
  - Clique em Converter e copie o resultado.
faq:
  - q: Meu texto é enviado para um servidor?
    a: Não. A conversão acontece inteiramente no seu navegador, então o texto não sai do seu dispositivo. Depois que a página carrega, você pode até usá-la offline.
  - q: Qual é a diferença entre Title Case e Sentence case?
    a: Title Case coloca em maiúscula a primeira letra de cada palavra e deixa o resto em minúscula, então "the cat's hat" vira "The Cat's Hat". Sentence case coloca em maiúscula só a primeira letra de cada frase e de cada linha e deixa todo o resto em minúscula, então "THE CAT. IT SLEPT" vira "The cat. It slept".
  - q: O Title Case deixa em minúscula palavras pequenas como "a" e "of"?
    a: Não. Todas as palavras ganham inicial maiúscula, porque a ferramenta não tem uma lista de exceções e os guias de estilo divergem sobre quais palavras omitir. Se o seu estilo exigir, volte essas poucas palavras para minúscula manualmente.
  - q: Como as palavras são separadas em camelCase, snake_case e nos outros estilos de código?
    a: O texto é cortado nos espaços, na pontuação e em qualquer outro caractere que não seja letra ou dígito, e entre uma letra minúscula e uma maiúscula. Uma sequência de maiúsculas seguida de uma palavra em minúsculas é cortada antes da última maiúscula, então XMLHttpRequest vira XML, Http e Request. Os dígitos ficam com a palavra anterior, então "utf8" é uma palavra, enquanto um número no início de uma palavra fica sozinho. A pontuação é removida.
  - q: Funciona com várias linhas?
    a: Sim. Os estilos de código convertem cada linha separadamente, então cada linha vira um identificador e as quebras de linha ficam onde estão. É útil para transformar uma lista de nomes em constantes.
  - q: Funciona com letras acentuadas e de outros idiomas?
    a: Sim, com todas as escritas que distinguem maiúsculas de minúsculas, como o latim com acentos, o grego e o cirílico. O ß alemão vira SS em maiúsculas. Escritas sem maiúsculas, como o chinês e o japonês, não mudam, e os estilos de código tratam uma sequência contínua delas como uma palavra.
---

## O que este conversor de maiúsculas e minúsculas faz

Maiúsculas e minúsculas usam a conversão de strings padrão do navegador, que segue as correspondências de maiúsculas e minúsculas do Unicode e não depende das suas configurações de idioma. O Title Case encontra cada palavra, uma sequência de letras e dígitos que pode conter apóstrofos, e coloca sua primeira letra em maiúscula. O Sentence case converte o texto para minúsculas e depois coloca em maiúscula a primeira letra após um ponto final, ponto de exclamação, ponto de interrogação ou reticências (…) seguidos de espaço, após `。`, `！` e `？`, e no início do texto e de cada linha. Os estilos de código dividem o texto em palavras como explicado nas perguntas acima e as unem com o separador do estilo escolhido.

## Opções e limites

- **Entrada:** um texto por vez, do tamanho que couber no seu dispositivo. Um texto vazio não é convertido.
- **Regras de maiúsculas:** são as mesmas para todos os idiomas. O i turco com ponto e sem ponto não recebe tratamento especial, e a ferramenta não reconhece nomes próprios, siglas nem abreviaturas, então no Sentence case "Mr." também faz a palavra seguinte começar com maiúscula.
- **Sentence case:** um ponto dentro de um número ou de um domínio, como 3.14 ou example.com, não inicia uma nova frase.
- **Estilos de código:** a pontuação é removida, uma linha sem letras nem dígitos fica vazia e um nome como "iOS" é dividido em "i" e "OS".
- **Quebras de linha:** `\n`, `\r\n` e `\r` são mantidas como estão.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena seu texto e não usa cookies.
