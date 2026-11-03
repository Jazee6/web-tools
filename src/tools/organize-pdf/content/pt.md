---
review: draft
updated: 2026-11-03
title: Organizar PDF – Reordene, gire e exclua páginas de um PDF online
description: Reordene, gire e exclua as páginas de um PDF vendo uma prévia de cada uma. Grátis e privado — tudo acontece no seu navegador, e o documento nunca é enviado.
name: Organizar PDF
answer: Escolha um PDF, use os botões abaixo da prévia de cada página para movê-la, girá-la ou removê-la e clique em Organizar PDF. O novo PDF é criado no seu dispositivo e fica pronto para baixar na hora.
action: Organizar PDF
fields:
  file:
    label: Arquivo PDF
  pages:
    label: Páginas
    placeholder: 3, 1-2 r90, 5-
output:
  file:
    label: PDF
errors:
  encrypted: "Este PDF está protegido por senha. Remova a senha e tente de novo:"
  invalid_pdf: "Não foi possível ler este arquivo como PDF. Ele pode estar danificado. Exporte-o novamente e tente de novo:"
  invalid_pages: "Informe as páginas como números e intervalos separados por vírgulas, com r90, r180 ou r270 para girar, como 3, 1-2 r90, 5-. Não foi possível ler esta parte:"
  page_out_of_range: "Essa página não existe. Número de páginas deste PDF:"
steps:
  - Escolha um arquivo PDF de até 50 MB. Uma prévia de cada página aparece abaixo de Páginas.
  - Use as setas abaixo de uma página para movê-la para antes ou para depois, o botão de girar para virá-la 90° no sentido horário e o X para removê-la.
  - Confira a ordem no campo Páginas, que é atualizado conforme você edita. Você também pode digitar nele diretamente, como 3, 1-2 r90, 5-.
  - Clique em Organizar PDF e baixe o arquivo.
faq:
  - q: Meu PDF é enviado para um servidor?
    a: Não. As prévias e o novo PDF são criados dentro do seu navegador com o PDFium compilado para WebAssembly, então o documento nunca sai do seu dispositivo.
  - q: Girar uma página reduz a qualidade?
    a: Não. Girar só muda a configuração de rotação da página, então o texto continua selecionável e as imagens não são comprimidas de novo. Ao mover e excluir páginas, elas são copiadas como estão.
  - q: O que significam os números do campo Páginas?
    a: São as páginas do novo PDF, em ordem. 3, 1-2 r90, 5- significa a página 3, depois as páginas 1 e 2 giradas 90° no sentido horário e, em seguida, da página 5 até a última. As páginas que não aparecem ficam de fora. Deixe o campo vazio para manter todas as páginas como estão.
  - q: Posso colocar a mesma página duas vezes?
    a: Sim. Digite o número dela duas vezes no campo Páginas, como 1, 2, 1. Cada cópia pode ter a própria rotação.
  - q: Uma página já estava de lado. O que o botão de girar faz?
    a: Cada clique soma 90° no sentido horário à orientação em que a página aparece agora, então a prévia sempre corresponde ao resultado. Girar uma página quatro vezes a traz de volta à posição inicial.
  - q: Os marcadores e campos de formulário são mantidos?
    a: As páginas chegam com texto e imagens inalterados, mas os marcadores não são adicionados ao novo arquivo. Campos de formulário preenchíveis mantêm o conteúdo, mas podem deixar de ser editáveis.
---

## Como a organização funciona

A ferramenta usa o PDFium — o mecanismo de PDF do Google Chrome — compilado para WebAssembly. Quando você escolhe um arquivo, ele desenha uma pequena prévia de cada página em uma thread em segundo plano, algumas páginas por vez. Quando você clica em Organizar PDF, ele copia as páginas para um novo documento na ordem que você definiu, aplica a rotação de cada página e salva o resultado. A página continua respondendo o tempo todo.

## Opções e limites

- **Entrada:** um arquivo PDF de até 50 MB.
- **Páginas:** páginas avulsas e intervalos separados por vírgulas, cada um seguido opcionalmente de r90, r180 ou r270 para girar no sentido horário. Um intervalo deve ir de uma página menor para uma maior, e todas as páginas precisam existir no arquivo. Pelo menos uma página precisa ficar.
- **Saída:** um PDF com o nome do original terminado em -organized.
- **Senhas:** arquivos que exigem senha para abrir não podem ser organizados e não mostram prévia.
- **Memória:** o arquivo fica na memória enquanto você edita, então documentos muito grandes podem falhar no celular.

Para separar algumas páginas em arquivos próprios, use o [Dividir PDF](/pt/split-pdf). Para adicionar páginas de outros documentos, use o [Juntar PDF](/pt/merge-pdf).

## Privacidade

Seu documento é processado apenas no seu dispositivo. A página não o envia, não o armazena e não usa cookies.
