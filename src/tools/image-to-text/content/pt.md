---
review: reviewed
updated: 2026-11-14
title: Imagem para texto – Extraia texto de fotos e capturas (OCR) online
description: "Copie o texto de fotos, capturas e digitalizações em português, inglês, chinês, japonês e outros idiomas de alfabeto latino. Grátis e privado: OCR no seu navegador."
name: Imagem para texto
answer: "Escolha uma imagem e clique em Extrair texto para que modelos de IA leiam o texto impresso no seu dispositivo, e copie o texto simples sem precisar escolher o idioma antes."
action: Extrair texto
fields:
  file:
    label: Imagem (HEIC, JPEG, PNG, WebP ou AVIF)
output:
  text:
    label: Texto extraído
errors:
  decode_failed: Não foi possível ler este arquivo como imagem. Ele pode estar corrompido, ou o seu navegador não consegue decodificar o formato. Exporte-o de novo como JPEG ou PNG e tente outra vez.
  too_large: "Esta imagem pode ter mais pixels do que o seu navegador consegue processar. Navegadores de celular aceitam menos que os de computador; tente uma imagem menor ou um computador."
  no_text: Nenhum texto foi encontrado nesta imagem. Verifique se o texto está nítido e grande o bastante, ou recorte a imagem na parte com texto e tente outra vez.
steps:
  - "Escolha uma imagem com texto impresso em Imagem (HEIC, JPEG, PNG, WebP ou AVIF), de até 50 MB."
  - "Clique em Extrair texto. Na primeira vez, os modelos de IA e o ONNX Runtime (cerca de 60 MB) são baixados e salvos no seu navegador quando há espaço."
  - "Copie o texto extraído. O texto encontrado é agrupado em linhas, e uma linha em branco marca um espaço maior, como um novo parágrafo."
faq:
  - q: Minhas imagens são enviadas para um servidor?
    a: "Não. A imagem é decodificada e lida dentro do seu navegador, então nunca sai do seu dispositivo. Só são baixados os modelos de IA e os arquivos que os executam."
  - q: Quais idiomas ele consegue ler?
    a: Chinês (simplificado e tradicional), japonês e idiomas escritos com o alfabeto latino, como português, inglês, espanhol, alemão e francês, incluindo letras acentuadas. Você não escolhe o idioma, e uma mesma imagem pode misturá-los. Ele não lê coreano nem as escritas cirílica, árabe, hebraica, tailandesa ou devanágari.
  - q: Funciona com fotos tiradas no celular?
    a: "Sim. O detector de texto encontra linhas em fotos, além de capturas de tela e digitalizações, inclusive linhas inclinadas. Para um resultado melhor, use uma foto nítida em que o texto seja grande e plano, e confira o resultado antes de usar."
  - q: Ele lê letra de mão?
    a: "Ela não foi feita para isso. A ferramenta é voltada para texto impresso, então a letra de mão pode ser lida errado; confira o resultado com atenção."
  - q: Ele mantém o layout, as tabelas ou a formatação?
    a: Não. Você recebe texto simples na ordem de leitura, de cima para baixo e da esquerda para a direita. Negrito, fontes e células de tabela não são mantidos, e numa página com várias colunas as linhas que estão na mesma altura são unidas entre as colunas.
  - q: Por que a primeira vez é mais lenta?
    a: "A ferramenta primeiro baixa dois modelos PP-OCRv6 e o ONNX Runtime, cerca de 60 MB no total, e os salva no seu navegador quando há espaço. Nas próximas vezes, pode usar a cópia salva enquanto o navegador a mantiver. Depois disso, o tempo depende da quantidade de texto, porque cada linha é lida separadamente."
---

## Como funciona a extração de texto

A ferramenta decodifica a imagem com o decodificador embutido do seu navegador, ou com uma versão WebAssembly do libheif para HEIC, e executa dois modelos de código aberto do PP-OCRv6, do PaddleOCR (licença Apache-2.0), com o ONNX Runtime numa thread em segundo plano. O modelo de detecção marca onde há texto; cada região vira uma caixa, que pode estar inclinada. Depois, o modelo de reconhecimento lê cada caixa, uma linha por vez: a caixa é recortada da imagem em resolução total e redimensionada para 48 pixels de altura (linhas muito longas são comprimidas para no máximo 3.200 pixels de largura), e as linhas são colocadas na ordem de leitura: de cima para baixo e, dentro de uma linha, da esquerda para a direita.

## Opções e limites

- **Entrada:** uma imagem HEIC, JPEG, PNG, WebP ou AVIF, de até 50 MB. Áreas transparentes são tratadas como brancas.
- **Saída:** texto simples, agrupado em linhas pela altura na imagem, com uma linha em branco onde o espaço entre duas linhas é maior que uma linha de texto.
- **Idiomas:** chinês (simplificado e tradicional), japonês, inglês e outros idiomas com alfabeto latino, sem precisar escolher o idioma. Coreano e as escritas cirílica, árabe, hebraica, tailandesa e devanágari não são suportados.
- **Orientação:** texto inclinado é endireitado, e uma linha cuja altura seja pelo menos 1,5 vez a largura é girada 90° no sentido anti-horário antes de ser lida; a escrita vertical pode ser lida errado. Texto de cabeça para baixo não é corrigido e pode ser lido errado.
- **Layout:** colunas, tabelas e formatação não são mantidas.
- **Tamanho:** para encontrar o texto, a imagem é reduzida até o lado maior ter no máximo 2.048 pixels; texto muito pequeno numa imagem grande pode passar despercebido, então recorte a imagem no texto antes. No máximo 1.000 áreas candidatas são examinadas, então, numa imagem muito cheia, parte do texto pode ficar de fora.
- **Navegadores:** JPEG, PNG, WebP e AVIF são decodificados pelo navegador, então funcionam onde ele os suporta; HEIC usa o libheif. Os modelos rodam na CPU, com várias threads quando o navegador permite.
- **Download:** cerca de 60 MB no primeiro uso (dois modelos de 10 MB e 21 MB, mais o ONNX Runtime, que as outras ferramentas de IA do site compartilham).

## Privacidade

Suas imagens são processadas só no seu dispositivo. A página não as envia, não as armazena e não usa cookies.
