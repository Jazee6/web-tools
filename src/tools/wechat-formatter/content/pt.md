---
review: reviewed
updated: 2026-11-14
title: Formatador para WeChat – Markdown para artigos do WeChat online
description: Escreva seu artigo em Markdown e copie como texto formatado no estilo do editor de contas oficiais do WeChat. Grátis e privado, roda no seu navegador.
name: Formatador para WeChat
answer: Digite ou cole seu artigo em Markdown, escolha uma cor de destaque e clique em Copiar texto formatado para colar um artigo com estilo no editor de contas oficiais do WeChat — a prévia é atualizada enquanto você escreve.
action: Formatar artigo
fields:
  markdown:
    label: Markdown
    placeholder: "# Título\n\nEscreva seu artigo em **Markdown**…"
  accent:
    label: Cor de destaque
    options:
      neutral: Neutro
      blue: Azul
      green: Verde
      orange: Laranja
      red: Vermelho
      rose: Rosa
      violet: Violeta
      yellow: Amarelo
output:
  html:
    label: Prévia do WeChat
steps:
  - Digite ou cole seu artigo na caixa Markdown. A prévia do WeChat é atualizada enquanto você escreve.
  - Escolha uma opção em Cor de destaque para a barra do título de nível 2, as bordas das citações, o código embutido e os números das referências.
  - Clique em Copiar texto formatado.
  - Cole no corpo do seu artigo no editor de contas oficiais do WeChat.
  - Para usar o artigo em outro editor ou modelo, clique em Copiar HTML para obter o código-fonte com todos os estilos embutidos.
faq:
  - q: Por que meus links viram números?
    a: O editor de contas oficiais do WeChat não deixa os leitores clicarem em links para outros sites no corpo do artigo. O formatador mantém o texto do link, coloca um número como [1] depois dele e lista todos os endereços no final, para que os leitores ainda encontrem a fonte. Links para artigos do mp.weixin.qq.com continuam clicáveis.
  - q: Por que a formatação some quando colo o HTML no editor?
    a: Copiar HTML coloca o código-fonte na área de transferência, e o editor o mostra como texto simples. No editor do WeChat, use Copiar texto formatado; ele copia o artigo formatado, do mesmo jeito que copiar de uma página da web.
  - q: Posso adicionar imagens do meu computador?
    a: Não. As imagens precisam ser endereços web http ou https, escritos como ![legenda](https://…). O formatador não envia arquivos. Uma imagem sozinha em um parágrafo fica centralizada, com o texto alternativo exibido como legenda abaixo dela.
  - q: Quais linguagens de programação são destacadas?
    a: Qualquer linguagem que o destacador Shiki conheça, de JavaScript e Python a SQL e Bash. Escreva a linguagem depois da cerca de abertura, por exemplo ```python. Código sem linguagem, ou com uma que o Shiki não reconhece, aparece como texto monoespaçado simples.
  - q: Meu rascunho fica salvo?
    a: Sim, quando o navegador permite que o site guarde dados. O conteúdo da caixa Markdown é salvo neste dispositivo pouco depois de você parar de digitar e restaurado quando você volta, então espere um instante antes de fechar a página. O rascunho nunca é enviado. Limpar os dados locais do site apaga o rascunho.
  - q: Posso escrever HTML dentro do Markdown?
    a: Não. As tags HTML aparecem como texto em vez de serem renderizadas, o que também mantém a prévia segura. Use Markdown para títulos, listas, links, imagens e tabelas.
---

## Como o formatador para WeChat funciona

O editor de contas oficiais do WeChat remove folhas de estilo e nomes de classe do conteúdo colado, então toda a formatação do artigo é escrita como estilos embutidos. O formatador lê seu Markdown com o [marked](https://marked.js.org/) e escreve cada título, parágrafo, lista, tabela, citação e bloco de código com os estilos tipográficos deste site: texto de 16 px, altura de linha de 1,75, uma paleta neutra e fontes do sistema, porque o editor não carrega fontes da web. Os blocos de código são destacados com o [Shiki](https://shiki.style/) usando as cores do GitHub Light.

## Opções e limites

- **Markdown:** CommonMark mais as tabelas, listas de tarefas e tachado do GitHub, até 200.000 caracteres. Os itens de listas de tarefas aparecem como ☑ ou ☐ porque o editor remove as caixas de seleção.
- **Cor de destaque:** neutro, azul, verde, laranja, vermelho, rosa, violeta ou amarelo. Ela colore a barra ao lado do título de nível 2, as bordas das citações, o código embutido, os links do WeChat e os números das referências; o texto do corpo fica quase preto.
- **Links:** links para mp.weixin.qq.com continuam clicáveis; os outros links http e https viram referências numeradas no final do artigo. Os demais links mantêm só o texto.
- **Imagens:** só endereços http e https; qualquer outro mantém só o texto alternativo.
- **Cópia:** os dois botões usam a área de transferência do navegador, que pede permissão em alguns navegadores; Copiar texto formatado também exige um navegador que consiga copiar HTML formatado. Se a cópia falhar, permita o acesso à área de transferência e tente novamente.
- **Não suportado:** HTML bruto (aparece como texto), fórmulas matemáticas e diagramas.

## Privacidade

Seu artigo é processado só no seu dispositivo. A página não o envia, não o armazena em um servidor e não usa cookies.
