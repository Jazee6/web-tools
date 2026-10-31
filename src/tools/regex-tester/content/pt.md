---
review: draft
updated: 2026-10-31
title: Testador de expressões regulares – Teste regex JavaScript online
description: "Teste uma expressão regular JavaScript no seu texto e liste cada correspondência com sua posição e seus grupos de captura. Grátis e privado: roda no seu navegador."
name: Testador de expressões regulares
answer: "Digite um padrão e um texto, mantenha ou altere as flags e clique em Testar: cada correspondência aparece com sua posição e seus grupos de captura no seu navegador."
action: Testar
fields:
  pattern:
    label: Padrão
    placeholder: '(\d{4})-(\d{2})-(\d{2})'
  flags:
    label: Flags
    placeholder: gi
  text:
    label: Texto
    placeholder: Cole aqui o texto em que buscar
output:
  count:
    label: Correspondências encontradas
  matches:
    label: Correspondências
    columns:
      index: Posição
      match: Correspondência
      groups: Grupos
errors:
  invalid_pattern: Este padrão não é uma expressão regular JavaScript válida. Verifique se colchetes e parênteses estão equilibrados, se não há um quantificador sem nada antes dele, se não sobrou uma barra invertida e se as flags podem ser combinadas; u e v, por exemplo, não podem.
  invalid_flags: Estas flags não são válidas. Use somente d, g, i, m, s, u, v e y, cada uma no máximo uma vez.
  text_too_long: O texto tem mais de 100.000 caracteres. Teste o padrão com uma amostra menor.
steps:
  - Digite a expressão regular em Padrão, sem as barras ao redor.
  - Mantenha as Flags como estão (g encontra todas as correspondências) ou altere-as, por exemplo para gi, para ignorar maiúsculas e minúsculas.
  - Cole o texto em Texto e clique em Testar.
  - Leia o número de correspondências e, na tabela, cada correspondência com sua posição e o texto capturado por cada grupo.
faq:
  - q: Meu texto é enviado para um servidor?
    a: Não. O padrão roda inteiramente no seu navegador, então nem o padrão nem o seu texto saem do seu dispositivo. Depois que a página carrega, você pode até usá-la offline.
  - q: Qual sintaxe de expressões regulares é usada?
    a: A do mecanismo JavaScript do seu navegador, definida pelo padrão ECMAScript. Ela inclui lookahead e lookbehind, grupos nomeados e, com a flag u ou v, escapes de propriedades Unicode como \p{L}. Não é igual a PCRE, Python ou Java, então recursos como quantificadores possessivos ou flags embutidas como (?i) podem não funcionar.
  - q: O que significam as flags?
    a: g encontra todas as correspondências, e não só a primeira; i ignora maiúsculas e minúsculas; m faz ^ e $ valerem em cada linha; s deixa o ponto corresponder a quebras de linha; u e v ativam o modo Unicode (use uma das duas, não ambas); y corresponde apenas na posição exata em que a busca começa; e d registra os índices dos grupos. Cada flag pode ser usada uma vez.
  - q: Por que vejo só uma correspondência?
    a: Sem a flag g, uma expressão regular JavaScript para na primeira correspondência, e esta ferramenta também. Acrescente g em Flags para listar todas as correspondências.
  - q: O que a coluna Grupos mostra?
    a: O texto capturado por cada grupo entre parênteses, em JSON. Um padrão com grupos comuns dá uma lista em ordem, como ["2024","02","29"]. Um padrão com grupos nomeados dá um objeto, como {"year":"2024"}. Um grupo que não participou da correspondência aparece como null, e a coluna fica vazia se o padrão não tem grupos.
  - q: Por que a página trava com alguns padrões?
    a: Alguns padrões com repetições aninhadas, como (a+)+$, levam um tempo exponencialmente maior conforme o texto cresce, e um navegador não consegue interromper uma expressão regular no meio da execução. Se a aba parar de responder, feche-a ou recarregue-a e simplifique o padrão.
---

## O que este testador de expressões regulares faz

A ferramenta monta uma expressão regular a partir do seu padrão e das suas flags com o `RegExp` do próprio navegador e a executa uma vez sobre o seu texto. Com a flag g, reúne todas as correspondências com `matchAll`; sem ela, pega a primeira, exatamente como `RegExp.prototype.exec`. De cada correspondência informa a posição (a partir de 0), o texto correspondente e os grupos capturados. A sintaxe e o comportamento são os do seu navegador, descritos no [guia de expressões regulares da MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_expressions).

## Opções e limites

- **Entrada:** um padrão de até 1.000 caracteres e um texto de até 100.000 caracteres. Nenhum dos dois pode ficar vazio.
- **Tamanho do resultado:** a contagem inclui todas as correspondências, mas a tabela lista somente as 200 primeiras.
- **Posição:** contada em unidades de código UTF-16, como o JavaScript conta os índices de strings, então um emoji ocupa duas posições.
- **Diferenças entre navegadores:** a flag v e algumas sintaxes mais novas funcionam apenas em navegadores atuais. Um padrão que um navegador recusa como inválido pode ser aceito por outro.
- **Não incluído:** substituir texto, dividir texto e explicar o padrão.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena seu padrão ou texto e não usa cookies.
