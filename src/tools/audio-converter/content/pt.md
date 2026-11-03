---
review: draft
updated: 2026-11-03
title: Conversor de áudio – Converta WAV, M4A, OGG e FLAC em MP3 grátis
description: Converta áudio entre MP3, M4A, WAV e OGG de graça, a partir de MP3, M4A, AAC, WAV, OGG, Opus ou FLAC. Privado e rápido, roda no seu navegador e nada é enviado.
name: Conversor de áudio
answer: Escolha um arquivo de áudio, selecione MP3, M4A, WAV ou OGG e uma taxa de bits e clique em Converter áudio. O arquivo é convertido no seu dispositivo e você baixa o resultado. O padrão é MP3 a 192 kbps, que toca em qualquer lugar.
action: Converter áudio
fields:
  file:
    label: Áudio (MP3, M4A, AAC, WAV, OGG, Opus ou FLAC)
  format:
    label: Formato de saída
    options:
      mp3: MP3
      m4a: M4A (AAC)
      wav: WAV (sem compressão)
      ogg: OGG (Opus)
  bitrate:
    label: Taxa de bits
    options:
      "128": 128 kbps (menor)
      "192": 192 kbps (recomendado)
      "320": 320 kbps (máxima)
output:
  file:
    label: Áudio convertido
errors:
  invalid_audio: Não foi possível ler este arquivo como áudio. Ele pode estar danificado ou usar um formato que esta ferramenta não suporta. Exporte-o novamente como MP3 ou WAV e tente de novo.
  unsupported_codec: "Este navegador não consegue decodificar ou codificar este áudio. Tente outro formato de saída ou a versão mais recente do Chrome. Codec:"
  aac_unavailable: Este navegador não consegue codificar AAC; o Firefox, por exemplo, não tem codificador AAC. Escolha MP3, WAV ou OGG, ou use o Chrome ou o Safari.
steps:
  - Escolha um arquivo de áudio MP3, M4A, AAC, WAV, OGG, Opus, FLAC ou WebM de até 500 MB.
  - Selecione o formato de saída. MP3 toca em qualquer lugar, M4A (AAC) combina com iPhone e Mac, WAV não tem compressão e serve para edição, e OGG (Opus) tem o melhor som para o tamanho.
  - Selecione uma taxa de bits para MP3, M4A ou OGG. 192 kbps serve para a maioria das músicas, 128 kbps gera arquivos menores e 320 kbps é a máxima. O WAV a ignora.
  - Clique em Converter áudio. Uma barra de progresso mostra o andamento, e você pode cancelar a qualquer momento.
  - Baixe o arquivo convertido.
faq:
  - q: Meu áudio é enviado para um servidor?
    a: Não. O arquivo é decodificado e codificado dentro do seu navegador, então nunca sai do seu dispositivo.
  - q: Como converter WAV em MP3?
    a: Escolha o arquivo WAV, mantenha MP3 como formato de saída, selecione uma taxa de bits e clique em Converter áudio. Um minuto de WAV estéreo ocupa cerca de 10 MB, enquanto o mesmo minuto em MP3 a 192 kbps ocupa cerca de 1,4 MB.
  - q: Qual taxa de bits devo escolher?
    a: Com 192 kbps é difícil distinguir a maioria das músicas do original. 128 kbps basta para voz e podcasts e gera arquivos menores. 320 kbps é a configuração máxima do MP3, para quando o tamanho não importa.
  - q: Converter para uma taxa de bits maior melhora o som?
    a: Não. Converter um MP3 de 128 kbps para 320 kbps deixa o arquivo maior, mas o detalhe perdido na primeira codificação não volta. Passar de um formato com perdas para outro sempre perde um pouco de qualidade, então comece de WAV ou FLAC quando puder.
  - q: Posso mudar a taxa de bits de um MP3?
    a: Sim. Escolha o MP3, mantenha MP3 como formato de saída e selecione outra taxa de bits. O som é recodificado nessa taxa, um jeito simples de diminuir um MP3 grande.
  - q: Posso converter arquivos FLAC?
    a: Sim, no Chrome, no Edge e no Firefox. O Safari não consegue decodificar FLAC, então nele a ferramenta mostra uma mensagem. FLAC pode ser convertido em MP3, M4A, OGG ou WAV; esta ferramenta não gera FLAC.
  - q: O que acontece com o som surround?
    a: MP3, M4A e OGG são gravados com até 2 canais, então o som surround é mixado em estéreo. O WAV mantém todos os canais.
---

## Como a conversão funciona

A ferramenta lê o arquivo com o Mediabunny, uma biblioteca de mídia de código aberto, decodifica o som com a API WebCodecs integrada ao seu navegador e o codifica de novo no formato escolhido. Os navegadores não conseguem codificar MP3, então para MP3 a ferramenta usa um codificador criado a partir do LAME, um codificador de MP3 de código aberto. O trabalho roda em uma thread em segundo plano, então a página continua respondendo.

Para tirar o som de um vídeo, use [Extrair áudio](/pt/extract-audio).

## Opções e limites

- **Entrada:** arquivos de áudio MP3, M4A, AAC, WAV, OGG, Opus, FLAC e WebM de até 500 MB. Só a faixa de áudio principal é convertida.
- **MP3:** 128, 192 ou 320 kbps, até 2 canais. Taxas de amostragem incomuns são convertidas para 48 kHz.
- **M4A:** AAC na taxa de bits escolhida, até 2 canais, a 44,1 ou 48 kHz. O Firefox não tem codificador AAC, então nele o M4A não está disponível.
- **OGG:** Opus na taxa de bits escolhida, até 2 canais, sempre a 48 kHz. Som mono é codificado a no máximo 256 kbps.
- **WAV:** som sem compressão de 16 bits com os canais e a taxa de amostragem originais, cerca de 10 MB por minuto de áudio estéreo.
- **Recodificação:** MP3, M4A e OGG são sempre codificados na taxa de bits escolhida, mesmo quando a origem tem o mesmo formato. Um WAV que já é de 16 bits é copiado como está.
- **Navegadores:** o Safari não consegue decodificar FLAC nem Vorbis. Se um arquivo não puder ser decodificado ou codificado, a ferramenta para com uma mensagem.
- **Memória:** o arquivo convertido fica na memória até você baixá-lo, então gravações muito longas podem falhar em celulares.

## Privacidade

Seu áudio é processado apenas no seu dispositivo. A página não o envia, não o armazena e não usa cookies.
