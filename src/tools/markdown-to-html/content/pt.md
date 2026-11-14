---
review: reviewed
updated: 2026-11-14
title: Markdown para HTML – Converta Markdown e veja o HTML online
description: Converta Markdown em HTML limpo com IDs de título, documento HTML completo opcional e realce de sintaxe. Grátis e privado — roda no seu navegador.
name: Markdown para HTML
answer: Digite ou cole Markdown e o HTML aparece enquanto você escreve — alterne entre a pré-visualização e o código HTML e clique em Copiar HTML para copiar o código.
action: Converter
fields:
  markdown:
    label: Markdown
    placeholder: "# Title\n\nWrite **Markdown** here…"
  headingIds:
    label: Adicionar IDs de título
  document:
    label: Documento HTML completo
  highlight:
    label: Realce de sintaxe
  theme:
    label: Tema do realce
    options:
      github-light: GitHub Light
      github-dark: GitHub Dark
      one-dark-pro: One Dark Pro
      vitesse-light: Vitesse Light
output:
  html:
    label: HTML
steps:
  - Digite ou cole seu Markdown na caixa Markdown. O HTML é atualizado enquanto você escreve.
  - Ative Documento HTML completo se precisar de uma página inteira em vez de um fragmento.
  - Ative Realce de sintaxe para colorir os blocos de código.
  - Escolha um Tema do realce.
  - Abra a aba HTML para ler o código, ou fique em Pré-visualização para ver como ficou.
  - Clique em Copiar HTML para copiar o código, ou em Copiar texto formatado para colar o resultado formatado em um editor como o Google Docs ou o Word.
faq:
  - q: O HTML dentro do meu Markdown é mantido?
    a: Sim. HTML bruto, como <details>, <kbd> ou um <img> com largura, vai para o resultado sem alterações, como a especificação CommonMark exige. A pré-visualização roda em um quadro isolado sem scripts, então um <script> no seu Markdown não é executado nesta página. Mesmo assim ele faz parte do resultado e pode ser executado onde você publicar o HTML, então converta só Markdown em que você confia.
  - q: Como os IDs de título são criados?
    a: Pelas regras que o GitHub usa para suas âncoras. O texto do título, sem tags Markdown ou HTML, vai para minúsculas; pontuação, símbolos e emoji são removidos, exceto hifens e pontuação de ligação como _; e os espaços viram hifens. Assim, "What's new in v2.0?" vira id="whats-new-in-v20". Letras de qualquer alfabeto são mantidas, então títulos em chinês ou cirílico conservam o texto. Um título repetido recebe -1, -2 e assim por diante, e um título que fica vazio, como um feito só de emoji, não recebe ID. Desative Adicionar IDs de título para não gerá-los.
  - q: Qual é a diferença entre um fragmento e um documento HTML completo?
    a: Um fragmento é só o conteúdo convertido, pronto para colar em uma página, um CMS ou um template que já tem seu próprio <head> e estilos. Um documento HTML completo adiciona <!doctype html>, um <head> com um título tirado do primeiro título 1 que tenha texto ("Document" quando não há nenhum) e uma pequena folha de estilos padrão, para você salvar como arquivo .html e abrir no navegador.
  - q: Como funciona o realce de sintaxe?
    a: Blocos de código que indicam uma linguagem depois da cerca de abertura, como ```python, são coloridos com o realçador Shiki. Cada cor é escrita como estilo inline, então o HTML não precisa de outra folha de estilos, embora editores que removem estilos inline também removam as cores. Código sem linguagem, ou com uma que o Shiki não reconhece, fica sem cor. O realce vem desativado; nesse caso, blocos que indicam uma linguagem recebem <pre><code class="language-…"> para o seu próprio realçador, e os outros um <pre><code> simples.
  - q: Meu Markdown é salvo?
    a: Sim, se o seu navegador permitir que o site armazene dados. A caixa Markdown é salva neste dispositivo pouco depois de você parar de digitar e restaurada quando você volta. Ela nunca é enviada. Limpar os dados locais do site apaga o rascunho.
---

## Como funciona o conversor de Markdown para HTML

O conversor lê seu Markdown com o [marked](https://marked.js.org/), seguindo o [CommonMark](https://commonmark.org/) mais as extensões do GitHub Flavored Markdown para tabelas, listas de tarefas, tachado e links automáticos. Ele gera o mesmo HTML que o marked, adicionando IDs de título no estilo do GitHub e, quando você ativa, código realçado com o [Shiki](https://shiki.style/). A conversão roda em uma thread em segundo plano do navegador, e não na própria página.

## Opções e limites

- **Markdown:** até 200.000 caracteres.
- **HTML bruto:** mantido sem alterações e sem sanitização. Scripts nunca rodam na pré-visualização, mas fazem parte do resultado.
- **IDs de título:** ativados por padrão, pelas regras de âncora do GitHub; títulos repetidos recebem -1, -2, e títulos que ficam vazios depois disso não recebem nenhum.
- **Documento HTML completo:** desativado por padrão; adiciona um doctype, um título tirado do primeiro título 1 e uma folha de estilos padrão.
- **Realce de sintaxe:** desativado por padrão; GitHub Light, GitHub Dark, One Dark Pro ou Vitesse Light, com cores inline. O tema e a gramática de cada linguagem são baixados na primeira vez que são necessários, o que pode levar um instante; se o download falhar, por exemplo sem internet, os blocos de código ficam sem realce.
- **Cópia:** os dois botões usam a área de transferência do navegador, que pede permissão em alguns navegadores; Copiar texto formatado também exige um navegador que copie HTML formatado.
- **Sem suporte:** notas de rodapé, fórmulas matemáticas e diagramas como Mermaid, que ficam como texto ou blocos de código. O front matter YAML não é removido e é convertido como o resto do Markdown.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia seu Markdown, não o armazena em um servidor e não usa cookies.
