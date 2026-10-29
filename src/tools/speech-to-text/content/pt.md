---
review: reviewed
updated: 2026-10-29
title: Voz para texto – Transcreva áudio e vídeo online grátis
description: Transcreva áudio e vídeo em texto e legendas SRT de graça. Privado — o modelo de reconhecimento de fala Whisper é processado no seu navegador e o arquivo nunca é enviado.
name: Voz para texto
answer: Escolha um arquivo de áudio ou vídeo, deixe o idioma em Detectar automaticamente ou escolha o idioma falado e clique em Transcrever. O Whisper transforma a fala em texto no seu dispositivo, e você pode copiar a transcrição ou baixá-la como legendas SRT.
action: Transcrever
fields:
  file:
    label: Áudio ou vídeo (MP3, M4A, WAV, OGG, FLAC, MP4, MOV, WebM ou MKV)
  language:
    label: Idioma falado
    options:
      auto: Detectar automaticamente
output:
  text:
    label: Transcrição
  subtitles:
    label: Legendas (SRT)
errors:
  invalid_audio: Não foi possível ler este arquivo como áudio. Ele pode estar danificado ou usar um formato que esta ferramenta não suporta. Tente uma cópia da gravação em MP3 ou WAV.
  no_audio: Este arquivo não tem faixa de áudio, então não há nada para transcrever. Escolha um arquivo que contenha som.
  unsupported_codec: "Este navegador não consegue decodificar o áudio deste arquivo. Tente outro formato de arquivo ou a versão mais recente do Chrome. Codec:"
  too_long: A gravação tem mais de 60 minutos. Divida-a em partes menores e transcreva uma de cada vez.
  no_speech: Nenhuma fala foi encontrada nesta gravação. Verifique se a gravação está audível e contém fala clara, e tente novamente.
steps:
  - Escolha um arquivo de áudio ou vídeo de até 1 GB e 60 minutos.
  - Deixe Idioma falado em Detectar automaticamente ou escolha o idioma falado. Escolher o idioma ajuda em trechos curtos e com sotaque forte.
  - Clique em Transcrever. Na primeira vez, o modelo de reconhecimento de fala (cerca de 105–125 MB) é baixado e salvo no seu navegador; depois disso, começa na hora.
  - Copie a transcrição ou baixe o arquivo SRT para usar como legenda em um player ou editor de vídeo.
faq:
  - q: Minha gravação é enviada para um servidor?
    a: Não. O áudio é decodificado e transcrito dentro do seu navegador, então o arquivo nunca sai do seu dispositivo. Só o modelo de reconhecimento de fala é baixado, uma única vez.
  - q: Quais idiomas são suportados?
    a: Os 99 idiomas com que o Whisper foi treinado, incluindo português, inglês, espanhol, chinês, alemão, francês e japonês. A precisão é maior nos idiomas mais falados e em gravações nítidas.
  - q: Por que a primeira transcrição é mais lenta?
    a: A ferramenta primeiro baixa o modelo Whisper, de cerca de 105–125 MB dependendo do dispositivo, e o salva no navegador. As transcrições seguintes usam a cópia salva e começam na hora.
  - q: Qual é a precisão da transcrição?
    a: A ferramenta usa o Whisper base, um modelo compacto que roda bem no navegador. Ele reconhece bem a fala clara, mas pode errar palavras em gravações com ruído, várias vozes ao mesmo tempo ou nomes pouco comuns, então revise a transcrição antes de publicá-la.
  - q: O que é um arquivo SRT?
    a: SRT é o formato de legenda mais comum. Cada linha da transcrição tem um horário de início e de fim, então players como o VLC e editores como Premiere Pro ou CapCut podem exibi-la como legenda.
---

## Como a transcrição funciona

A ferramenta decodifica o áudio com o Mediabunny e a API WebCodecs, converte para 16 kHz mono e o entrega ao Whisper base, um modelo de reconhecimento de fala de código aberto da OpenAI. O modelo roda com o ONNX Runtime em uma thread em segundo plano. Se o seu dispositivo tiver uma GPU com capacidade suficiente, parte do modelo roda nela com WebGPU, o que é mais rápido; caso contrário, tudo roda na CPU com WebAssembly. Gravações longas são divididas em janelas de 30 segundos que se sobrepõem e depois são unidas de novo.

## Limites

- **Entrada:** áudio MP3, M4A, AAC, WAV, OGG, Opus, FLAC e WebM, ou a faixa de áudio de um vídeo MP4, MOV, WebM ou MKV, com até 1 GB e 60 minutos.
- **Velocidade:** o reconhecimento é mais rápido em navegadores que oferecem uma GPU real via WebGPU e nos que permitem várias threads; caso contrário, ele usa um caminho mais lento, de thread única.
- **Navegadores:** o áudio é decodificado com a API WebCodecs, então os arquivos que funcionam dependem dos codecs do seu navegador; a versão mais recente do Chrome é a que suporta mais.
- **Download:** o modelo tem cerca de 105–125 MB e é baixado no primeiro uso.
- **Precisão:** o Whisper base é um modelo pequeno. Ruído de fundo, música e várias pessoas falando ao mesmo tempo reduzem a qualidade.
- **Chinês:** o Whisper costuma escrever o chinês com caracteres tradicionais, mesmo o mandarim da China continental.

## Privacidade

Sua gravação é processada apenas no seu dispositivo. A página não a envia, não a armazena e não usa cookies.
