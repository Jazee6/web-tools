---
review: reviewed
updated: 2026-11-14
title: HTML para Markdown – Converta HTML e texto formatado em Markdown
description: Cole código HTML ou copie texto formatado de uma página, do Word ou do Google Docs e receba Markdown limpo com tabelas. Grátis e privado — processado no seu navegador.
name: HTML para Markdown
answer: Cole código HTML, ou copie texto formatado de uma página ou documento e cole na caixa HTML — o Markdown aparece na hora. Clique em Copiar para copiá-lo.
action: Converter
fields:
  html:
    label: HTML
    placeholder: "<h1>Title</h1>\n<p>Paste HTML, or copy formatted text from a page and paste it here.</p>"
output:
  markdown:
    label: Markdown
errors:
  empty: Não sobrou nada para converter. O HTML só tem scripts, estilos ou outro conteúdo que é descartado — cole a parte da página com o texto que você quer.
steps:
  - Cole HTML na caixa HTML, ou selecione texto formatado em uma página, no Word ou no Google Docs, copie e cole na caixa.
  - Leia o Markdown que aparece na caixa Markdown.
  - Clique em Copiar para copiar o Markdown.
faq:
  - q: Posso colar texto formatado em vez de código HTML?
    a: Sim. Quando você copia de uma página, do Word, do Google Docs ou de um e-mail, a área de transferência também guarda o HTML por trás da formatação. Colar na caixa HTML insere esse HTML em vez do texto simples, então títulos, links, listas e tabelas são mantidos. Se a área de transferência tiver só texto simples, ele é colado normalmente.
  - q: Como as tabelas são convertidas?
    a: Toda tabela com células vira uma tabela Markdown, e a primeira linha vira a linha de cabeçalho mesmo usando células comuns, como acontece em tabelas copiadas do Word e do Google Docs. Um | dentro de uma célula vira \|, vários parágrafos ou quebras de linha em uma célula são unidos com <br>, e uma célula que ocupa várias colunas é seguida de células vazias. O alinhamento à esquerda, centralizado ou à direita definido nas células de cabeçalho é mantido.
  - q: O que é removido?
    a: <script>, <style>, <noscript>, <iframe>, <template> e o <head> da página, incluindo o título. Todo o resto é convertido, inclusive menus de navegação e rodapés, então cole só a parte da página de que você precisa.
  - q: Qual estilo de Markdown é gerado?
    a: "GitHub Flavored Markdown com títulos #, marcadores -, *itálico*, **negrito**, blocos de código cercados por ``` com a linguagem quando o elemento code tem uma classe como language-js, links inline, ~~tachado~~ e itens de lista de tarefas - [x] a partir de caixas de seleção. O estilo é fixo, então o resultado tem sempre a mesma cara."
  - q: Por que alguns elementos HTML somem sem deixar rastro?
    a: O Markdown não tem sintaxe para cores, fontes, formulários ou layout, então só o texto deles é mantido. Imagens mantêm o endereço e o texto alternativo; um endereço que aponta para um arquivo no seu computador não funciona em nenhum outro lugar.
---

## Como funciona o conversor de HTML para Markdown

O conversor lê seu HTML com o próprio analisador de HTML do navegador e o transforma em Markdown com o [Turndown](https://github.com/mixmark-io/turndown), então HTML bagunçado ou incompleto é lido do jeito que o navegador o exibiria. As regras do GitHub Flavored Markdown para tabelas, tachado e listas de tarefas são próprias deste site, por isso tabelas sem células de cabeçalho são convertidas em vez de ficarem como HTML.

## Opções e limites

- **Entrada:** fragmentos de HTML ou páginas inteiras, até 1.000.000 de caracteres.
- **Colar:** texto formatado é colado como HTML quando a área de transferência o tem; texto simples é colado sem mudanças.
- **Removido:** scripts, estilos, noscript, iframes, templates e o head da página. Navegação, cabeçalhos e rodapés são convertidos como qualquer outro conteúdo.
- **Tabelas:** a primeira linha é sempre a linha de cabeçalho; uma célula que ocupa várias linhas não é repetida, e uma tabela dentro de uma célula vira texto nessa célula.
- **Listas:** listas HTML (<ul> e <ol>) viram listas Markdown. Listas que chegam como parágrafos começando com um marcador ou número, como o Word costuma copiar, continuam sendo parágrafos.
- **Sem suporte:** escolher outro estilo de Markdown, como marcadores *, títulos setext ou links de referência.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena seu HTML e não usa cookies.
