---
review: reviewed
updated: 2026-10-29
title: "Converter MKV para MP4 – Vídeos Matroska grátis online"
description: "Converta MKV para MP4 grátis no seu navegador. Fluxos H.264 e AAC são copiados sem recodificar, então a maioria dos arquivos leva segundos. Sem envio e sem cadastro."
name: "MKV para MP4"
answer: "Escolha um arquivo .mkv e clique em Converter vídeo com MP4 selecionado. Se o vídeo for H.264 ou HEVC e o áudio for AAC, os fluxos são copiados para o MP4 sem alteração; faixas VP9, AV1, Opus ou FLAC são recodificadas para o arquivo rodar em celulares, TVs e editores."
steps:
  - "Escolha um arquivo MKV de até 500 MB."
  - "Deixe o formato de saída em MP4 e clique em Converter vídeo."
  - "Aguarde a barra de progresso: arquivos recodificados levam mais tempo do que os apenas copiados."
  - "Baixe o MP4."
faq:
  - q: "Por que meu MKV não reproduz na TV ou no celular?"
    a: "Matroska (MKV) é um contêiner flexível que muitos dispositivos e apps não abrem, mesmo quando conseguem reproduzir o vídeo dentro dele. Passar os mesmos fluxos para MP4 costuma resolver."
  - q: "O que acontece com legendas e áudios em outros idiomas?"
    a: "Só a faixa de vídeo principal e a faixa de áudio principal são mantidas. Legendas incorporadas e faixas de áudio adicionais são descartadas, porque o conversor gera um MP4 com uma faixa de vídeo e uma de áudio."
  - q: "Por que meu arquivo é recodificado em vez de copiado?"
    a: "Aqui o MP4 se limita a vídeo H.264 ou HEVC e áudio AAC, a combinação que roda em quase todos os dispositivos. Vídeo VP9 ou AV1 e áudio Opus, Vorbis ou FLAC são recodificados, o que leva mais tempo e não é perfeitamente sem perdas. O áudio é codificado em AAC, ou em Opus no Firefox, que não tem codificador AAC."
  - q: "Posso converter arquivos MKV maiores que 500 MB?"
    a: "Não com esta ferramenta. O arquivo convertido fica na memória até você baixá-lo, por isso a entrada é limitada a 500 MB para funcionar bem em notebooks e celulares."
table:
  caption: "O que acontece com cada fluxo de um arquivo MKV no MP4"
  columns:
    track: "Faixa"
    source: "Codec no MKV"
    result: "No MP4"
    output: "Codec de saída"
  terms:
    video: "Vídeo"
    audio: "Áudio"
    copied: "Copiado sem recodificar"
    reencoded: "Recodificado"
---

## Copiar ou recodificar: o que decide a velocidade

O MKV pode conter quase qualquer codec, então dois arquivos MKV do mesmo tamanho podem se comportar de forma muito diferente. Arquivos com vídeo H.264 e áudio AAC, a combinação mais comum em MKVs baixados e gravados, são apenas remultiplexados: os fluxos passam para um contêiner MP4 em segundos, sem mudança de qualidade. Arquivos com vídeo VP9 ou AV1, ou com áudio Opus, Vorbis ou FLAC, são decodificados e codificados de novo com o WebCodecs, o que pode levar tanto tempo quanto o próprio vídeo.

## O que fica para trás

A saída em MP4 mantém uma faixa de vídeo e uma de áudio: a principal de cada tipo. Faixas de legenda e áudios em outros idiomas não são levados, então, se você precisar de outro idioma, torne-o a faixa de áudio principal antes, em uma ferramenta de desktop.

## Privacidade

A conversão é feita no seu dispositivo, em uma thread em segundo plano. O MKV nunca é enviado, e a página não usa cookies.
