---
review: reviewed
updated: 2026-10-29
title: Conversor de vídeo – Converta MP4, WebM, MOV e MKV online grátis
description: Converta vídeos entre MP4, WebM, MOV e MKV grátis. Privado e rápido — a conversão é processada no seu navegador com WebCodecs, então seu vídeo nunca é enviado.
name: Conversor de vídeo
answer: Escolha um vídeo MP4, MOV, WebM ou MKV, selecione o formato de saída e clique em Converter vídeo — o arquivo é convertido no seu dispositivo e você baixa o resultado. Quando só o contêiner muda, leva poucos segundos.
action: Converter vídeo
fields:
  file:
    label: Vídeo (MP4, MOV, WebM ou MKV)
  format:
    label: Formato de saída
    options:
      mp4: MP4 (H.264 + AAC)
      webm: WebM (VP9 + Opus)
      mov: MOV (QuickTime)
      mkv: MKV (Matroska)
output:
  file:
    label: Vídeo convertido
errors:
  invalid_video: Não foi possível ler este arquivo como vídeo. Ele pode estar danificado ou usar um formato que esta ferramenta não suporta. Exporte-o novamente como MP4 e tente de novo.
  no_video: Este arquivo não tem faixa de vídeo, só contém áudio. Escolha um arquivo de vídeo.
  unsupported_codec: "Este navegador não consegue decodificar ou codificar uma das faixas deste vídeo. Tente outro formato de saída ou a versão mais recente do Chrome. Codec:"
steps:
  - Escolha um vídeo MP4, MOV, WebM ou MKV de até 500 MB.
  - Selecione o formato de saída. MP4 roda em quase todo lugar, WebM é ideal para a web, MOV para os apps da Apple e MKV mantém as faixas originais intactas.
  - Clique em Converter vídeo. Uma barra de progresso mostra o andamento, e você pode cancelar a qualquer momento.
  - Baixe o vídeo convertido.
faq:
  - q: Meu vídeo é enviado para um servidor?
    a: Não. O vídeo é lido, decodificado e codificado dentro do seu navegador com a API WebCodecs, então ele nunca sai do seu dispositivo.
  - q: Por que às vezes a conversão é quase instantânea?
    a: Se o vídeo e o áudio já usam um codec que o novo formato aceita — por exemplo H.264 e AAC ao passar de MOV para MP4 — as faixas são copiadas como estão e só o contêiner é reescrito. Nada é recodificado, então é rápido e a qualidade não muda.
  - q: A conversão reduz a qualidade?
    a: Só quando o vídeo precisa ser recodificado, por exemplo de WebM para MP4. A ferramenta codifica com qualidade alta, então a diferença costuma ser difícil de notar, mas recodificar nunca é totalmente sem perdas.
  - q: Quais codecs o arquivo de saída usa?
    a: MP4 e MOV usam vídeo H.264 e áudio AAC quando seu navegador consegue codificá-los. Se não conseguir — o Firefox, por exemplo, não tem codificador AAC — a ferramenta usa outro codec que o formato aceite, como áudio Opus. WebM usa VP9 e Opus. MKV mantém os codecs originais.
  - q: Posso converter arquivos MKV?
    a: Sim. Arquivos MKV podem ser convertidos para MP4, WebM ou MOV. Converter MKV para MP4 costuma ser rápido, porque as faixas H.264 e AAC são copiadas sem recodificar.
---

## Como a conversão funciona

A ferramenta lê o vídeo com o Mediabunny, uma biblioteca de mídia de código aberto, e usa a API WebCodecs integrada ao seu navegador para decodificar e codificar as faixas, muitas vezes com aceleração por hardware. Faixas que o formato de destino já aceita são copiadas sem recodificar. O trabalho roda em uma thread em segundo plano, então a página continua respondendo.

## Limites

- **Entrada:** arquivos MP4, MOV, WebM e MKV de até 500 MB.
- **Faixas:** a faixa de vídeo principal e a faixa de áudio principal são convertidas; legendas e faixas de áudio extras são descartadas.
- **Codecs:** os codecs que podem ser decodificados e codificados dependem do seu navegador e dispositivo. O Firefox, por exemplo, não tem codificador AAC, então lá MP4 e MOV usam áudio Opus; a versão mais recente do Chrome suporta o maior número de codecs. Se uma faixa não puder ser convertida, a ferramenta para com uma mensagem em vez de criar um arquivo sem som ou sem imagem.
- **Memória:** o vídeo convertido fica na memória até você baixá-lo, então arquivos muito grandes podem falhar em celulares.

## Privacidade

Seu vídeo é processado apenas no seu dispositivo. A página não o envia, não o armazena e não usa cookies.
