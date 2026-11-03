---
review: draft
updated: 2026-11-03
title: Extrair áudio de vídeo – Converta MP4 em MP3 online grátis
description: Extraia de graça o som de um vídeo MP4, MOV, WebM ou MKV em MP3, M4A ou WAV. Privado e rápido, roda no seu navegador e seu vídeo nunca é enviado.
name: Extrair áudio
answer: Escolha um vídeo MP4, MOV, WebM ou MKV, selecione MP3, M4A, WAV ou a faixa original e clique em Extrair áudio. O som é salvo no seu dispositivo como um arquivo de áudio que você pode baixar, sem a imagem.
action: Extrair áudio
fields:
  file:
    label: Vídeo (MP4, MOV, WebM ou MKV)
  format:
    label: Formato de áudio
    options:
      mp3: MP3 (192 kbps)
      m4a: M4A (AAC, 192 kbps)
      wav: WAV (sem compressão)
      original: Faixa original (sem recodificar)
output:
  file:
    label: Áudio extraído
errors:
  invalid_video: Não foi possível ler este arquivo como vídeo. Ele pode estar danificado ou usar um formato que esta ferramenta não suporta. Exporte-o novamente como MP4 e tente de novo.
  no_audio: Este vídeo não tem faixa de áudio, então não há som para extrair.
  unsupported_codec: "Este navegador não consegue decodificar ou codificar o áudio deste vídeo. Tente Faixa original ou a versão mais recente do Chrome. Codec:"
  aac_unavailable: Este navegador não consegue codificar AAC; o Firefox, por exemplo, não tem codificador AAC. Escolha MP3, WAV ou Faixa original, ou use o Chrome ou o Safari.
steps:
  - Escolha um vídeo MP4, MOV, WebM ou MKV de até 500 MB.
  - Selecione o formato de áudio. MP3 toca em qualquer lugar, M4A (AAC) combina com iPhone e Mac, WAV não tem compressão e serve para edição, e Faixa original mantém o som exatamente como está no vídeo.
  - Clique em Extrair áudio. Uma barra de progresso mostra o andamento, e você pode cancelar a qualquer momento.
  - Baixe o arquivo de áudio.
faq:
  - q: Meu vídeo é enviado para um servidor?
    a: Não. O vídeo é lido e o som é codificado dentro do seu navegador, então o arquivo nunca sai do seu dispositivo.
  - q: Como converter um vídeo MP4 em MP3?
    a: Escolha o arquivo MP4, mantenha MP3 como formato de áudio e clique em Extrair áudio. O som é codificado como MP3 de 192 kbps e a imagem fica de fora. O mesmo vale para vídeos MOV, WebM e MKV.
  - q: Qual formato devo escolher?
    a: MP3 se você só quer um arquivo que toque em qualquer dispositivo. M4A (AAC) soa um pouco melhor com o mesmo tamanho e combina com iPhone e Mac. WAV não tem compressão e é bem maior, o que serve para editores de áudio. Faixa original é o mais rápido e não perde qualidade.
  - q: O que a opção Faixa original faz?
    a: Ela copia os dados de áudio do vídeo sem recodificar, então termina em segundos e o som não muda. O tipo de arquivo segue o áudio do vídeo; por exemplo, M4A para som AAC em um MP4 e OGG para som Opus em um WebM.
  - q: Extrair reduz a qualidade do som?
    a: Não com Faixa original, nem com WAV além dos 16 bits que ele armazena. MP3 e M4A recodificam o som a 192 kbps, o que é difícil de distinguir do original na maioria dos casos. Se o áudio do vídeo já for MP3 ou AAC, escolher o mesmo formato copia o áudio sem recodificar.
  - q: E se o vídeo tiver várias faixas de áudio?
    a: Só a faixa de áudio principal é extraída. As outras, como outros idiomas ou comentários, ficam de fora.
  - q: Posso ficar só com uma parte do som?
    a: Aqui não. Primeiro corte o vídeo na parte que você quer com [Cortar vídeo](/pt/trim-video) e depois extraia o áudio do trecho.
---

## Como a extração funciona

A ferramenta lê o vídeo com o Mediabunny, uma biblioteca de mídia de código aberto, e mantém só a faixa de áudio principal. Para WAV e M4A, ela decodifica e codifica o som com a API WebCodecs integrada ao seu navegador. Os navegadores não conseguem codificar MP3, então para MP3 a ferramenta carrega, na primeira vez que você precisa, um codificador criado a partir do LAME, um codificador de MP3 de código aberto. Com Faixa original nada é decodificado: os dados de áudio são copiados como estão. O trabalho roda em uma thread em segundo plano, então a página continua respondendo.

Para converter um arquivo de áudio em vez de um vídeo, use o [Conversor de áudio](/pt/audio-converter).

## Opções e limites

- **Entrada:** arquivos MP4, MOV, WebM e MKV de até 500 MB.
- **MP3:** 192 kbps, até 2 canais. Som surround é mixado em estéreo, e taxas de amostragem incomuns são convertidas para 48 kHz.
- **M4A:** AAC a 192 kbps. O Firefox não tem codificador AAC, então nele o M4A só funciona quando o som do vídeo já é AAC, que então é copiado. Quando codificado, o M4A tem até 2 canais, como o MP3.
- **WAV:** som sem compressão de 16 bits, cerca de 10 MB por minuto de áudio estéreo.
- **Faixa original:** AAC vai para M4A, MP3 para MP3, Opus e Vorbis para OGG, FLAC para FLAC e PCM para WAV. Outros codecs, como AC-3 ou DTS, vão para um arquivo MKA (áudio Matroska).
- **Faixas:** só a faixa de áudio principal é extraída. Se o vídeo não tiver som, a ferramenta avisa em vez de criar um arquivo vazio.
- **Memória:** o arquivo de áudio fica na memória até você baixá-lo. Um vídeo longo extraído como WAV pode ficar muito grande e falhar em celulares.

## Privacidade

Seu vídeo é processado apenas no seu dispositivo. A página não o envia, não o armazena e não usa cookies.
