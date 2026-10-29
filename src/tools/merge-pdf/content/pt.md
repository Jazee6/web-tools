---
review: reviewed
updated: 2026-10-29
title: Juntar PDF – Combine arquivos PDF online grátis
description: Combine vários arquivos PDF em um só, na ordem que você escolher. Grátis e privado — a junção acontece no seu navegador, e seus documentos nunca são enviados.
name: Juntar PDF
answer: Adicione dois ou mais arquivos PDF, coloque-os na ordem desejada e clique em Juntar PDF — as páginas são combinadas no seu dispositivo em um único PDF, pronto para baixar.
action: Juntar PDF
fields:
  files:
    label: Arquivos PDF
output:
  file:
    label: PDF combinado
errors:
  encrypted: "Este PDF está protegido por senha. Remova a senha e tente de novo:"
  invalid_pdf: "Não foi possível ler este arquivo como PDF. Ele pode estar danificado. Exporte-o novamente ou remova-o da lista e tente novamente:"
steps:
  - Escolha os arquivos PDF que deseja combinar — de 2 a 20 arquivos, com até 50 MB cada. Você pode adicioná-los em várias etapas.
  - Use as setas para cima e para baixo para ordenar os arquivos, ou remova um arquivo adicionado por engano.
  - Clique em Juntar PDF. Todas as páginas do primeiro arquivo vêm primeiro, seguidas pelas páginas do próximo, e assim por diante.
  - Baixe o PDF combinado.
faq:
  - q: Meus arquivos PDF são enviados para um servidor?
    a: Não. Os arquivos são lidos e combinados dentro do seu navegador com o PDFium compilado para WebAssembly, então nunca saem do seu dispositivo.
  - q: Posso mudar a ordem dos arquivos?
    a: Sim. A lista mostra os arquivos na ordem em que serão combinados. Mova um arquivo para cima ou para baixo com os botões de seta antes de clicar em Juntar PDF.
  - q: Posso juntar PDFs protegidos por senha?
    a: Não quando é preciso senha para abrir o arquivo. Abra-o em um leitor de PDF, salve uma cópia sem senha e adicione essa cópia.
  - q: Juntar PDFs reduz a qualidade?
    a: Não. As páginas são copiadas como estão — o texto continua selecionável e as imagens não são recomprimidas, então o arquivo combinado fica idêntico aos originais.
  - q: Os marcadores e campos de formulário são mantidos?
    a: As páginas chegam com texto e imagens inalterados, mas os marcadores dos arquivos originais não são adicionados ao PDF combinado. Campos de formulário preenchíveis mantêm o conteúdo, mas podem deixar de ser editáveis.
---

## Como a junção funciona

A ferramenta usa o PDFium — o mecanismo de PDF do Google Chrome — compilado para WebAssembly. Ele abre cada arquivo, copia todas as páginas para um novo documento na ordem da sua lista e salva o resultado. O trabalho acontece em uma thread em segundo plano, então a página continua respondendo enquanto arquivos grandes são combinados.

## Limites

- **Arquivos:** de 2 a 20 arquivos PDF por junção, com até 50 MB cada.
- **Somente arquivos inteiros:** todas as páginas de cada arquivo são incluídas. Para deixar páginas de fora, divida ou organize o PDF antes.
- **Senhas:** arquivos que precisam de senha para abrir não podem ser combinados.
- **Memória:** todos os arquivos ficam na memória durante a junção, então juntar arquivos muito grandes pode falhar em celulares.

## Privacidade

Seus documentos são processados apenas no seu dispositivo. A página não os envia, não os armazena e não usa cookies.
